// Pure API layer for the DrVibe clinical-apis MCP server.
// No MCP dependency — every function is independently testable (see test/smoke.mjs).
// All sources are FREE public APIs. Two accept an optional free key (env) for
// higher rate limits: NCBI_API_KEY (PubMed), OPENFDA_API_KEY (openFDA).
//
// IMPORTANT: these are PUBLIC, non-PHI data sources. Callers send a *search term*,
// never patient identifiers. Do not put PHI in a query string.

const UA = "drvibe-clinical-apis-mcp/0.1 (+https://drvibe.ai)";

async function getJson(url, { timeoutMs = 12000 } = {}) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: ac.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}
const enc = encodeURIComponent;
const clip = (s, n = 600) => (typeof s === "string" && s.length > n ? s.slice(0, n) + "…" : s);

// 1) ClinicalTrials.gov v2 — free, no key. Topic search.
export async function clinicaltrialsSearch({ query, status, pageSize = 10 }) {
  let url = `https://clinicaltrials.gov/api/v2/studies?query.term=${enc(query)}&pageSize=${Math.min(pageSize, 50)}`;
  if (status) url += `&filter.overallStatus=${enc(status)}`;
  const data = await getJson(url);
  const results = (data.studies || []).map((s) => {
    const p = s.protocolSection || {};
    const id = p.identificationModule || {};
    const st = p.statusModule || {};
    const design = p.designModule || {};
    const cond = p.conditionsModule || {};
    const loc = (p.contactsLocationsModule?.locations || []).slice(0, 3).map((l) => [l.city, l.state, l.country].filter(Boolean).join(", "));
    return {
      nctId: id.nctId,
      title: id.briefTitle,
      status: st.overallStatus,
      phases: design.phases || [],
      conditions: cond.conditions || [],
      locations: loc,
      url: id.nctId ? `https://clinicaltrials.gov/study/${id.nctId}` : undefined,
    };
  });
  return { source: "ClinicalTrials.gov v2", query, count: results.length, results, source_url: url };
}

// 2) PubMed (NCBI E-utilities) — free; optional NCBI_API_KEY for higher rate.
export async function pubmedSearch({ query, retmax = 10 }) {
  const key = process.env.NCBI_API_KEY ? `&api_key=${process.env.NCBI_API_KEY}` : "";
  const esearch = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=${Math.min(retmax, 50)}&term=${enc(query)}${key}`;
  const ids = (await getJson(esearch)).esearchresult?.idlist || [];
  if (!ids.length) return { source: "PubMed", query, count: 0, results: [], source_url: esearch };
  const esummary = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(",")}${key}`;
  const sum = (await getJson(esummary)).result || {};
  const results = ids.map((id) => {
    const r = sum[id] || {};
    return {
      pmid: id,
      title: r.title,
      journal: r.fulljournalname || r.source,
      pubdate: r.pubdate,
      authors: (r.authors || []).slice(0, 6).map((a) => a.name),
      doi: (r.articleids || []).find((x) => x.idtype === "doi")?.value,
      url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
    };
  });
  return { source: "PubMed", query, count: results.length, results, source_url: esearch };
}

// 3) Europe PMC — free, no key. Searches published literature AND preprints
//    (medRxiv/bioRxiv = source "PPR"). This is how you topic-search preprints.
export async function europepmcSearch({ query, preprintsOnly = false, pageSize = 10 }) {
  const q = preprintsOnly ? `(${query}) AND (SRC:PPR)` : query;
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${enc(q)}&format=json&pageSize=${Math.min(pageSize, 50)}`;
  const data = await getJson(url);
  const results = (data.resultList?.result || []).map((r) => ({
    id: r.id,
    source: r.source, // "PPR" = preprint (medRxiv/bioRxiv), "MED" = PubMed, etc.
    isPreprint: r.source === "PPR",
    title: r.title,
    authors: clip(r.authorString, 200),
    journalOrServer: r.journalTitle || r.bookOrReportDetails?.publisher || r.pubType,
    year: r.pubYear,
    doi: r.doi,
    url: r.doi ? `https://doi.org/${r.doi}` : (r.fullTextUrlList?.fullTextUrl?.[0]?.url),
  }));
  return { source: "Europe PMC", query: q, count: results.length, results, source_url: url };
}

// 4) openFDA — free; optional OPENFDA_API_KEY for higher daily limit.
//    dataset: "drug/label" | "drug/event" (FAERS adverse events) | "drug/enforcement" (recalls).
export async function openfdaQuery({ dataset = "drug/label", search, limit = 5 }) {
  const allowed = ["drug/label", "drug/event", "drug/enforcement", "device/event", "device/enforcement"];
  if (!allowed.includes(dataset)) throw new Error(`dataset must be one of: ${allowed.join(", ")}`);
  const key = process.env.OPENFDA_API_KEY ? `&api_key=${process.env.OPENFDA_API_KEY}` : "";
  const url = `https://api.fda.gov/${dataset}.json?search=${enc(search)}&limit=${Math.min(limit, 25)}${key}`;
  const data = await getJson(url);
  return {
    source: `openFDA ${dataset}`,
    search,
    count: data.results?.length || 0,
    total: data.meta?.results?.total,
    results: data.results || [],
    disclaimer: data.meta?.disclaimer,
    source_url: url.replace(key, key ? "&api_key=***" : ""),
  };
}

// 5) RxNorm / RxNav — free, no key. Drug name -> RxCUI + ingredient.
//    NOTE: NLM retired the drug-drug interaction API in 2024 — this does NOT do interactions.
export async function rxnormNormalize({ name }) {
  const approx = `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${enc(name)}&maxEntries=5`;
  const cand = (await getJson(approx)).approximateGroup?.candidate || [];
  const top = cand[0];
  let ingredients = [];
  if (top?.rxcui) {
    const rel = `https://rxnav.nlm.nih.gov/REST/rxcui/${top.rxcui}/related.json?tty=IN`;
    const groups = (await getJson(rel)).relatedGroup?.conceptGroup || [];
    ingredients = groups.flatMap((g) => (g.conceptProperties || []).map((c) => c.name));
  }
  return {
    source: "RxNorm (RxNav)",
    name,
    rxcui: top?.rxcui,
    matchedName: top?.name || ingredients[0] || null,
    ingredients,
    candidates: cand.map((c) => ({ rxcui: c.rxcui, name: c.name, score: c.score })),
    note: "Drug normalization only — RxNav's drug-interaction API was retired in 2024.",
    source_url: approx,
  };
}

// 6) ICD-10-CM — NLM Clinical Tables, free, no key. Current FY code set.
export async function icd10Search({ query, maxList = 10 }) {
  const url = `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&maxList=${Math.min(maxList, 25)}&terms=${enc(query)}`;
  const data = await getJson(url); // [total, codes[], null, [[code,name],...]]
  const results = (data[3] || []).map(([code, name]) => ({ code, name }));
  return { source: "NLM ICD-10-CM (current FY)", query, count: results.length, results, source_url: url };
}

// 7) MedlinePlus Connect — free, no key. Patient-friendly info for a code.
//    system: "icd10cm" | "rxnorm".
export async function medlineplusByCode({ code, system = "icd10cm" }) {
  const oid = system === "rxnorm" ? "2.16.840.1.113883.6.88" : "2.16.840.1.113883.6.90";
  const url = `https://connect.medlineplus.gov/service?mainSearchCriteria.v.cs=${oid}&mainSearchCriteria.v.c=${enc(code)}&knowledgeResponseType=application/json`;
  const data = await getJson(url);
  const results = (data.feed?.entry || []).map((e) => ({
    title: e.title?._value || e.title,
    url: (e.link || []).find((l) => l.href)?.href,
    summary: clip((e.summary?._value || e.summary || "").replace(/<[^>]+>/g, " ").trim(), 400),
  }));
  return { source: "MedlinePlus Connect", code, system, count: results.length, results, source_url: url };
}

// 8) NPI Registry (NPPES, CMS) — free, no key. Provider lookup (useful for
//    referral/credentialing admin skills). Send provider identifiers, not patient PHI.
export async function npiLookup({ npi, firstName, lastName, state, taxonomy, limit = 10 }) {
  const params = new URLSearchParams({ version: "2.1", limit: String(Math.min(limit, 50)) });
  if (npi) params.set("number", npi);
  if (firstName) params.set("first_name", firstName);
  if (lastName) params.set("last_name", lastName);
  if (state) params.set("state", state);
  if (taxonomy) params.set("taxonomy_description", taxonomy);
  const url = `https://npiregistry.cms.hhs.gov/api/?${params.toString()}`;
  const data = await getJson(url);
  const results = (data.results || []).map((r) => ({
    npi: r.number,
    name: r.basic ? [r.basic.first_name, r.basic.last_name].filter(Boolean).join(" ") || r.basic.organization_name : undefined,
    credential: r.basic?.credential,
    primaryTaxonomy: (r.taxonomies || []).find((t) => t.primary)?.desc,
    city: r.addresses?.[0]?.city,
    state: r.addresses?.[0]?.state,
  }));
  return { source: "NPI Registry (NPPES)", count: results.length, results, source_url: url };
}

export const TOOLS = {
  clinicaltrials_search: clinicaltrialsSearch,
  pubmed_search: pubmedSearch,
  europepmc_search: europepmcSearch,
  openfda_query: openfdaQuery,
  rxnorm_normalize: rxnormNormalize,
  icd10_search: icd10Search,
  medlineplus_by_code: medlineplusByCode,
  npi_lookup: npiLookup,
};

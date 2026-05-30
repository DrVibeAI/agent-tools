// Live smoke test — hits each free public API once. Run: node test/smoke.mjs
import { TOOLS } from "../src/apis.mjs";

const cases = [
  ["clinicaltrials_search", { query: "type 2 diabetes", pageSize: 2 }],
  ["pubmed_search", { query: "semaglutide heart failure", retmax: 2 }],
  ["europepmc_search", { query: "long covid", preprintsOnly: true, pageSize: 2 }],
  ["openfda_query", { dataset: "drug/event", search: "patient.drug.medicinalproduct:metformin", limit: 1 }],
  ["rxnorm_normalize", { name: "tylenol" }],
  ["icd10_search", { query: "type 2 diabetes", maxList: 3 }],
  ["medlineplus_by_code", { code: "E11.9", system: "icd10cm" }],
  ["npi_lookup", { lastName: "smith", state: "CA", limit: 2 }],
];

let pass = 0;
for (const [name, args] of cases) {
  try {
    const r = await TOOLS[name](args);
    const first = r.results?.[0] || {};
    const sample =
      r.rxcui ? `rxcui=${r.rxcui} (${r.matchedName})` :
      first.title || first.name || (first.code && `${first.code} ${first.name}`) || first.nctId || JSON.stringify(first).slice(0, 70) || "(empty)";
    const n = r.count ?? r.results?.length ?? (r.rxcui ? 1 : 0);
    console.log(`✓ ${name}: ${n} result(s) — ${String(sample).slice(0, 78)}`);
    pass++;
  } catch (e) {
    console.log(`✗ ${name}: ERROR ${e.message}`);
  }
}
console.log(`\n${pass}/${cases.length} endpoints OK`);
process.exit(pass === cases.length ? 0 : 1);

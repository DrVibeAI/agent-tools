#!/usr/bin/env node
// DrVibe clinical-apis MCP server — exposes free public clinical/biomedical APIs
// as MCP tools. Stdio transport. Public, non-PHI data sources only.
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { TOOLS } from "./apis.mjs";

const TOOL_DEFS = [
  {
    name: "clinicaltrials_search",
    description: "Search ClinicalTrials.gov (API v2) by topic. Returns NCT id, title, status, phases, conditions, locations. Public data — send a search term, not patient identifiers.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search terms, e.g. 'type 2 diabetes semaglutide'" },
        status: { type: "string", description: "Optional overall status filter, e.g. RECRUITING" },
        pageSize: { type: "number", description: "Max studies (default 10, cap 50)" },
      },
      required: ["query"],
    },
  },
  {
    name: "pubmed_search",
    description: "Search PubMed (NCBI E-utilities) and return citation summaries (title, journal, authors, DOI, PMID URL). Set NCBI_API_KEY for higher rate limits.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        retmax: { type: "number", description: "Max results (default 10, cap 50)" },
      },
      required: ["query"],
    },
  },
  {
    name: "europepmc_search",
    description: "Search Europe PMC across published literature AND preprints (medRxiv/bioRxiv = source 'PPR'). Use preprintsOnly to topic-search preprints (which the bioRxiv/medRxiv API itself cannot do).",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        preprintsOnly: { type: "boolean", description: "Restrict to preprints (medRxiv/bioRxiv)" },
        pageSize: { type: "number", description: "Max results (default 10, cap 50)" },
      },
      required: ["query"],
    },
  },
  {
    name: "openfda_query",
    description: "Query openFDA. dataset: drug/label, drug/event (FAERS adverse events), drug/enforcement (recalls), device/event, device/enforcement. Set OPENFDA_API_KEY for higher daily limits.",
    inputSchema: {
      type: "object",
      properties: {
        dataset: { type: "string", enum: ["drug/label", "drug/event", "drug/enforcement", "device/event", "device/enforcement"] },
        search: { type: "string", description: "openFDA search expression, e.g. openfda.brand_name:aspirin" },
        limit: { type: "number", description: "Max records (default 5, cap 25)" },
      },
      required: ["search"],
    },
  },
  {
    name: "rxnorm_normalize",
    description: "Normalize a drug name to an RxNorm RxCUI and ingredient(s) via RxNav. Does NOT do drug-drug interactions (NLM retired that API in 2024).",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string", description: "Drug name, brand or generic" } },
      required: ["name"],
    },
  },
  {
    name: "icd10_search",
    description: "Search the current fiscal-year ICD-10-CM code set (NLM Clinical Tables). Returns code + name. Use to look up real codes instead of recalling from memory.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Diagnosis text or partial code" },
        maxList: { type: "number", description: "Max results (default 10, cap 25)" },
      },
      required: ["query"],
    },
  },
  {
    name: "medlineplus_by_code",
    description: "Get patient-friendly MedlinePlus information for a clinical code (system: icd10cm or rxnorm). Useful for patient-education drafting.",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string" },
        system: { type: "string", enum: ["icd10cm", "rxnorm"] },
      },
      required: ["code"],
    },
  },
  {
    name: "npi_lookup",
    description: "Look up healthcare providers in the NPPES NPI Registry (CMS). Useful for referral/credentialing workflows. Send provider identifiers, never patient PHI.",
    inputSchema: {
      type: "object",
      properties: {
        npi: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        state: { type: "string", description: "2-letter state code" },
        taxonomy: { type: "string", description: "Specialty/taxonomy description filter" },
        limit: { type: "number", description: "Max results (default 10, cap 50)" },
      },
    },
  },
];

const server = new Server(
  { name: "drvibe-clinical-apis", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOL_DEFS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  const fn = TOOLS[name];
  if (!fn) {
    return { isError: true, content: [{ type: "text", text: `Unknown tool: ${name}` }] };
  }
  try {
    const result = await fn(args || {});
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (e) {
    return { isError: true, content: [{ type: "text", text: `Error calling ${name}: ${e.message}` }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("drvibe-clinical-apis MCP server running (stdio).");

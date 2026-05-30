# @drvibeai/clinical-apis-mcp

A small, first-party MCP server that gives any agent **live access to free public
clinical/biomedical data**. DrVibe-owned so there's no dependency on flaky
third-party packages (this replaces the bogus `biorxiv-mcp-server` /
`clinicaltrials-mcp-server` packages that never existed on npm).

> **Public, non-PHI data only.** Every tool takes a *search term* — never patient
> identifiers. Do not put PHI in a query string. None of these APIs are a BAA-covered
> destination.

## Tools

| Tool | Source | Key? | Notes |
|---|---|---|---|
| `clinicaltrials_search` | ClinicalTrials.gov **v2** | none | Topic search → NCT id, status, phases, conditions, locations |
| `pubmed_search` | PubMed (NCBI E-utilities) | optional `NCBI_API_KEY` | Citation summaries (title, journal, authors, DOI) |
| `europepmc_search` | Europe PMC | none | Literature **and preprints**; `preprintsOnly` topic-searches medRxiv/bioRxiv (their own API can't search) |
| `openfda_query` | openFDA | optional `OPENFDA_API_KEY` | `drug/label`, `drug/event` (FAERS), `drug/enforcement` (recalls), device variants |
| `rxnorm_normalize` | RxNorm / RxNav | none | Drug name → RxCUI + ingredient. **No** interactions (NLM retired that API in 2024) |
| `icd10_search` | NLM Clinical Tables | none | Current FY ICD-10-CM code lookup |
| `medlineplus_by_code` | MedlinePlus Connect | none | Patient-friendly info for an ICD-10/RxNorm code |
| `npi_lookup` | NPI Registry (NPPES, CMS) | none | Provider lookup for referral/credentialing workflows |

Optional env keys are **free** and only raise rate limits.

## Why not Claude's PubMed connector?

Claude ships an official remote **PubMed** connector (and a Life-Sciences marketplace).
Great — use it when you're in Claude. This server is **portable** (Codex, Cursor,
Gemini, any MCP host) and covers what PubMed alone doesn't: ClinicalTrials.gov,
preprints, openFDA, RxNorm, ICD-10, MedlinePlus, NPI.

## Install / wire

This package is published on npm as
[`@drvibeai/clinical-apis-mcp`](https://www.npmjs.com/package/@drvibeai/clinical-apis-mcp).
Use the `npx` setup for normal plugin/agent installs; use the local `node`
setup only while developing this repository.

**Published package:**
```json
{
  "mcpServers": {
    "clinical_apis": { "command": "npx", "args": ["-y", "@drvibeai/clinical-apis-mcp"] }
  }
}
```

**Local (dev):**
```json
{
  "mcpServers": {
    "clinical_apis": {
      "command": "node",
      "args": ["/absolute/path/to/packages/clinical-apis-mcp/src/server.mjs"],
      "env": { "NCBI_API_KEY": "", "OPENFDA_API_KEY": "" }
    }
  }
}
```

## Which DrVibe skills/plugins benefit

| Skill / plugin | Tool(s) it would use |
|---|---|
| `pubmed-lookup` | `pubmed_search` |
| `trial-finder` | `clinicaltrials_search` |
| `icd-10-helper` | `icd10_search` |
| `clinical-research-assistant`, `research-screener`, `reb-protocol-drafter` | `pubmed_search`, `europepmc_search` (preprints) |
| `clinical-guideline-synthesizer`, `journal-writer` | `pubmed_search`, `europepmc_search` (citation verification) |
| `differential-drafter`, `case-generator` | `pubmed_search` / `europepmc_search` (evidence anchors, PMID fetch) |
| `discharge-translator`, patient-education commands | `medlineplus_by_code` |
| `score-builder` | `pubmed_search` (source verification) |
| `referral-coordination-agent`, `credentialing-packet-builder` | `npi_lookup` |
| The AI Physician / Resident plugins | `pubmed_search`, `clinicaltrials_search`, `europepmc_search`, `openfda_query` |

## Test

```
npm test   # node test/smoke.mjs — hits each live endpoint once (8/8 expected)
```

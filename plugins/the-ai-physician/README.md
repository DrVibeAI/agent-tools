# The AI Physician

> A Claude plugin that turns Claude into a team of practice management specialists for physicians.

## What This Is

The AI Physician is a plugin for Claude Desktop and Claude Code that gives physicians instant access to domain-specific AI specialists via slash commands. No coding required. No setup. Just install and start using.

## Slash Commands

| Command | Specialist Role | What It Does |
|---------|----------------|--------------|
| `/physician:finances` | Practice Financial Analyst | Overhead ratios, revenue per provider, payer profitability, AR aging, collection rates, E/M distribution analysis, specialty benchmarks |
| `/physician:operations` | Practice Operations Optimizer | Patient flow analysis, scheduling optimization, no-show reduction, phone system fixes, room utilization, Lean methodology |
| `/physician:hipaa` | HIPAA Compliance Officer | Decision tree (does your app need HIPAA?), audit checklist, gap identification, remediation guidance, architecture patterns |
| `/physician:research` | Clinical Research Assistant | PubMed search, systematic reviews (PRISMA), case reports (CARE), rapid evidence reviews, pharmacovigilance (FDA FAERS) |
| `/physician:patient-ed` | Patient Education Specialist | Plain-language explanations, reading level adaptation, diagnosis/medication/lab/procedure/discharge templates |

## Background Skills (Always Active)

- **Physician Context** -- Claude knows you're a physician. No oversimplified explanations. Actionable, practice-level advice.
- **HIPAA Guardrails** -- Safety-first defaults. Claude will flag PHI risks before they become problems.

## Data Access

This plugin ships with the **[`@drvibeai/clinical-apis-mcp`](https://www.npmjs.com/package/@drvibeai/clinical-apis-mcp)** MCP server (free public data, no API key required), exposing tools for:

- **PubMed** -- biomedical literature (`pubmed_search`)
- **ClinicalTrials.gov v2** -- clinical trials (`clinicaltrials_search`)
- **Europe PMC** -- literature + medRxiv/bioRxiv preprints (`europepmc_search`)
- **openFDA** -- drug labels, adverse events (FAERS), recalls (`openfda_query`)
- plus RxNorm, ICD-10-CM, and MedlinePlus

Optional connectors you can add yourself: Google Calendar / Notion / Airtable (scheduling, SOPs/checklists, KPI tracking).

## Installation

### Option 1: Install in Claude Desktop or Claude Code (Easiest)

1. Download this plugin as a ZIP and unzip it
2. Open **Claude Desktop** (or **Claude Code**)
3. Open **Settings → Plugins**
4. Click **Add Plugin** and select the unzipped `the-ai-physician/` folder
5. Restart, then type `/physician:` to see your commands

### Option 2: Clone from GitHub

```bash
git clone https://github.com/[your-username]/the-ai-physician.git
```

Then add the cloned folder via **Settings → Plugins → Add Plugin**.

## Usage Examples

### Check your practice's financial health
```
/physician:finances
"Here's my practice data: Family medicine, 3 providers, $2.1M revenue,
$1.4M expenses, 22,000 visits/year. How are we doing?"
```

### Optimize your schedule
```
/physician:operations
"We're running 30 minutes behind by 10 AM every day. 4 exam rooms,
1 provider, 20 patients/day. Help me figure out why."
```

### Audit your app for HIPAA
```
/physician:hipaa
"I built a patient intake form on Replit. It collects name, DOB,
insurance info, and chief complaint. Do I need HIPAA compliance?"
```

### Search the literature
```
/physician:research
"I need a rapid evidence review on GLP-1 agonists for NASH.
What does the latest evidence say?"
```

### Create patient education
```
/physician:patient-ed
"Explain atrial fibrillation to a newly diagnosed 68-year-old patient.
They're anxious and have limited health literacy."
```

## What This Plugin Does NOT Do

- **No clinical decision support** -- This is for practice management, not patient care decisions
- **No EHR integration** -- No connection to Epic, Cerner, or any EHR system
- **No patient data handling** -- Zero HIPAA surface area in the plugin itself
- **No financial advice** -- Provides analysis frameworks, not investment/tax advice

## Coming Soon (v2)

Seven more commands are in development:

| Command | What It Does |
|---------|-------------|
| `/physician:staffing` | FTE/VA/AI cost calculators, staffing ratios, hybrid model builder |
| `/physician:marketing` | Patient acquisition, Google Business, SEO, reputation management |
| `/physician:valuation` | 3 valuation methods, MGMA comps, buy/build/join decision matrix |
| `/physician:pricing` | Cash-pay pricing, DPC/membership design, competitive analysis |
| `/physician:ai-roi` | AI automation ROI, build vs buy vs subscribe, vendor evaluation |
| `/physician:guidelines` | Guideline quick-reference cards, decision algorithms, what-changed summaries |
| `/physician:write` | Journal manuscript templates, CONSORT/STROBE, reviewer responses |

## Built By

**The AI Physician** -- The professional community for physicians who build with AI.

Built by [Dr. Omar Saleem](https://drvibe.ai) using skills developed for the DrVibe healthcare AI education platform.

## License

MIT License -- Use it, modify it, share it. If you build something cool with it, let us know.

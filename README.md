# DrVibe Agent Tools

Open-source clinical AI agent tooling from [DrVibe.ai](https://drvibe.ai) — built by physicians, for the physician-builder community. These are the reusable, non-proprietary pieces that power the DrVibe skills platform: MCP servers, PHI-minimization, and (soon) the skill catalog + plugin marketplace.

> **⚠️ Important.** These tools are educational/workflow infrastructure. They are **not** medical advice, **not** a medical device, and come with **no warranty**. They query **public, non-PHI** data sources only — never put protected health information into a query or a third-party model without appropriate agreements and safeguards. See [DISCLAIMER.md](./DISCLAIMER.md).

## 📺 See it in action

Short explainers — built with [HyperFrames](https://hyperframes.heygen.com), voiced with ElevenLabs. Click a file to play it on GitHub.

| Video | What it shows |
|---|---|
| ▶️ [**DrVibe Skills — overview**](media/videos/drvibe-skills-overview.mp4) · 48s | What DrVibe Skills are, how you drop them into Claude / Codex / Cursor / Hermes, and the open stack. |
| ▶️ [**The AI Physician**](media/videos/the-ai-physician.mp4) · 26s | Practice-management plugin: finances, operations, HIPAA-readiness, research, patient education — ships the clinical-data MCP. |
| ▶️ [**The AI Resident**](media/videos/the-ai-resident.mp4) · 28s | Six ward commands — notes, differentials, case presentations, evidence, I-PASS handoffs, procedures. PGY-adaptive. |
| ▶️ [**clinical-apis-mcp**](media/videos/clinical-apis-mcp.mp4) · 32s | Live access to **15** free public clinical + genetic data sources, from any agent — no API key. |
| ▶️ [**Patient Communication pack**](media/videos/patient-comms.mp4) · 29s | Five front-office skills — education, recall, membership nurture, review responses, visit summaries. |
| ▶️ [**DrVibe Longevity**](media/videos/drvibe-longevity.mp4) · 45s | The longevity practice-in-a-box: 7 workflows, 15 clinical+genetic databases, evidence grading, deterministic checks. Claude + Codex. |

## Packages

| Package | What it does |
|---|---|
| [`@drvibeai/clinical-apis-mcp`](./packages/clinical-apis-mcp) | An MCP server exposing **free public** clinical/biomedical APIs as tools: ClinicalTrials.gov v2, PubMed, Europe PMC (incl. medRxiv/bioRxiv preprints), openFDA, RxNorm, ICD-10-CM, MedlinePlus, NPI Registry. |
| [`@drvibeai/phi-guard`](./packages/phi-guard) | A PHI-minimization toolkit for agents: a BAA **compliance gate** + local **redact/rehydrate** so patient identifiers never reach a non-BAA model. Risk reduction — *not* certified de-identification. |

## Quick start

```bash
# install (workspaces)
npm install

# run the live API smoke test (hits each free endpoint once)
npm test -w @drvibeai/clinical-apis-mcp

# run the offline phi-guard tests
npm test -w @drvibeai/phi-guard
```

Wire the MCP into any MCP host (Claude Desktop/Code, Codex, Cursor, Gemini) — see the [package README](./packages/clinical-apis-mcp) for the `.mcp.json` snippet. Optional free API keys (`NCBI_API_KEY`, `OPENFDA_API_KEY`) raise rate limits.

## How this relates to drvibe.ai

The drvibe.ai education + skills platform is a separate, private product. It **consumes** these open packages (e.g. `npx -y @drvibeai/clinical-apis-mcp`) rather than vendoring them, so the tools have their own release cadence and can be used by anyone.

## Roadmap

- ✅ `clinical-apis-mcp` — free public clinical data, one MCP.
- ✅ `phi-guard` — agent PHI-minimization.
- ⏭️ `skills` — the public healthcare Agent-Skill catalog + format spec + build tooling.
- ✅ `marketplace.json` — Claude Code plugin marketplace (`/plugin marketplace add DrVibeAI/agent-tools`).

## Plugins (Claude Code marketplace)

This repo is also a Claude Code plugin marketplace:

```bash
/plugin marketplace add DrVibeAI/agent-tools
/plugin install the-ai-physician@drvibeai
/plugin install the-ai-resident@drvibeai
```

- **the-ai-physician** — practice-management toolkit (research, finances, operations, HIPAA-readiness, patient education).
- **the-ai-resident** — resident toolkit (notes, differentials, case prep, evidence, I-PASS handoffs, procedures).

Both ship the **`@drvibeai/clinical-apis-mcp`** server preconfigured for live clinical data.

## Contributing & security

- [CONTRIBUTING.md](./CONTRIBUTING.md) — dev setup and PR guidelines.
- [SECURITY.md](./SECURITY.md) — report vulnerabilities privately; never include PHI.

## License

[Apache-2.0](./LICENSE) © DrVibe.ai

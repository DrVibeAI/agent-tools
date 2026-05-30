# The AI Resident

A Claude plugin built for medical residents. Six slash commands that turn Claude into a clinical documentation assistant, differential diagnosis partner, case presentation coach, evidence-based medicine resource, handoff generator, and procedure prep tool.

Built by [DrVibe.ai](https://drvibe.ai) — AI education for physicians.

---

## What's Inside

### Slash Commands

| Command | What It Does |
|---------|-------------|
| `/resident:note` | Clinical documentation — H&P, progress notes, discharge summaries, procedure notes. Templates with de-identification reminders. |
| `/resident:ddx` | Differential diagnosis — structured differentials ranked by likelihood from your clinical findings. Asks clarifying questions. |
| `/resident:present` | Case presentation builder — morning report, M&M, teaching conference, Grand Rounds. Formats to your audience. |
| `/resident:research` | Rapid evidence lookup — answers clinical questions from rounds with PubMed citations. Journal club and literature review support. |
| `/resident:handoff` | Structured sign-out — I-PASS format handoffs for safe transitions of care. Generates printable sign-out sheets. |
| `/resident:procedures` | Procedure preparation — indications, contraindications, consent elements, step-by-step technique, complications, and post-procedure care. |

### Background Skills (Always Active)

| Skill | What It Does |
|-------|-------------|
| Resident Context | Adapts to your PGY level, specialty, and rotation. Teaching-oriented — explains reasoning, not just answers. |
| PHI Safety | Aggressive guardrails for patient data. Warns before you paste PHI. Coaches de-identification. |

### Data Access

Ships with the **[`@drvibeai/clinical-apis-mcp`](https://www.npmjs.com/package/@drvibeai/clinical-apis-mcp)** MCP server (free, no API key):

- **PubMed** — `pubmed_search`
- **ClinicalTrials.gov v2** — `clinicaltrials_search`
- **Europe PMC** — literature + medRxiv/bioRxiv preprints (`europepmc_search`)
- plus openFDA, RxNorm, ICD-10-CM, MedlinePlus

---

## Installation

### Option A: Install in Claude Desktop or Claude Code

1. Download this plugin as a ZIP and unzip it
2. Open Claude Desktop (or Claude Code)
3. Open **Settings → Plugins**
4. Click **Add Plugin** and select the unzipped `the-ai-resident/` folder
5. Restart Claude Desktop

### Option B: Clone from GitHub

```bash
git clone https://github.com/DrVibeAI/agent-tools.git
cd agent-tools/plugins/the-ai-resident
```

Then point Claude Desktop to the `plugins/the-ai-resident` folder.

---

## Usage Examples

### Writing a Progress Note
```
/resident:note

I need to write a progress note for a patient on my medicine service.
They were admitted 3 days ago for CHF exacerbation, now on IV diuresis,
I/Os are negative 1.5L, creatinine bumped from 1.1 to 1.4.
```

### Building a Differential
```
/resident:ddx

65-year-old male presenting with acute onset chest pain, diaphoresis,
and nausea. Pain is substernal, pressure-like, radiating to the left arm.
Started 2 hours ago at rest. History of HTN, DM2, and hyperlipidemia.
Troponin pending.
```

### Preparing a Case Presentation
```
/resident:present

I'm presenting at morning report tomorrow. The case is a 42-year-old
woman with recurrent syncope — ended up being Brugada syndrome diagnosed
on ajmaline challenge. Internal medicine audience, 15 minutes.
```

### Quick Evidence Lookup on Rounds
```
/resident:research

Attending just asked: what's the evidence for early vs. late tracheostomy
in mechanically ventilated ICU patients? Need a quick answer with citations.
```

### End-of-Shift Handoff
```
/resident:handoff

I need to sign out 8 patients on my general medicine team. Can you help
me structure an I-PASS handoff? I'll give you each patient's one-liner
and active issues.
```

### Procedure Prep
```
/resident:procedures

I'm doing my first thoracentesis tomorrow. Walk me through everything —
indications, contraindications, what to consent for, step-by-step
technique, and what complications to watch for.
```

---

## Important: Patient Privacy

This plugin includes aggressive PHI safety guardrails.

- **NEVER paste real patient data** (names, MRNs, DOBs) into Claude
- Use **de-identified placeholders** (e.g., "72M" instead of "John Smith, MRN 12345")
- The plugin will **warn you** if it detects potential PHI
- When writing notes, use the templates as **frameworks** — fill in real patient details in your EHR, not here

---

## V2 Roadmap

- `/resident:boards` — Board-style question practice with explanations
- `/resident:qiproject` — Quality improvement project framework (PDSA cycles)
- `/resident:teachback` — Generate teaching materials for medical students
- `/resident:wellness` — Burnout screening, duty hour tracking, wellness resources
- Specialty-specific modules (IM, Surgery, Pediatrics, EM, OB/GYN)

---

## License

MIT License. Built by DrVibe.ai for the physician-builder community.

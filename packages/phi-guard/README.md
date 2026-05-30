# @drvibeai/phi-guard

A tiny, dependency-free toolkit that lets an agent **manage PHI posture** instead of just disclaiming it. Three functions:

- **`complianceGate({ deployment })`** — decide the operating mode from the host AI's BAA status: `full` (BAA-covered) or `minimized` (not / unknown), with guidance and a route to compliance review.
- **`redact({ record, text })`** — tokenize direct identifiers (name, email, phone, DOB, address, MRN, SSN) **locally**; scrub emails/phones from free text. Returns the redacted data plus a `map` (token → real value) you keep **on the user's machine**.
- **`rehydrate({ text, map })`** — restore the real identifiers into the *approved* draft, locally, right before a human sends it.

The model reasons over `[NAME-1]`; the real value never leaves the device.

> **Honest about what this is.** This *minimizes* direct identifiers (best-effort). It is **not** certified HIPAA Safe-Harbor de-identification — free text can hide identifiers and quasi-identifiers (city/ZIP, rare conditions) may remain. The compliant path for real PHI is a **BAA-covered deployment**. A human must review redacted output. See the repo [DISCLAIMER](../../DISCLAIMER.md).

## Install

```bash
npm install @drvibeai/phi-guard
```

## Use

```js
import { complianceGate, redact, rehydrate } from "@drvibeai/phi-guard";

// 1) Gate first.
const gate = complianceGate({ deployment: { baa_covered: false, vendor: "ChatGPT (free)" } });
// gate.mode === "minimized"  -> redact before the model sees anything

// 2) Redact locally; keep the map on-device.
const { redacted, map } = redact({
  record: { full_name: "Jane Doe", contact_email: "jane@example.com", reason_for_visit: "follow up" },
});
// redacted.full_name === "[NAME-1]"   (map["[NAME-1]"] === "Jane Doe")

// 3) The model drafts with tokens; a human approves; rehydrate locally before sending.
const sent = rehydrate({ text: "Hi [NAME-1], reach you at [EMAIL-1]?", map });
// sent.text === "Hi Jane Doe, reach you at jane@example.com?"
```

## Why

Patient-facing agent work is inherently identified — you can't "de-identify and still follow up." `phi-guard` lets the *reasoning* happen over de-identified text while identifiers stay local, and routes naive users toward a BAA-covered deployment when they need real PHI. It's the reusable pattern behind DrVibe's patient-facing skills.

## Test

```bash
npm test   # offline, deterministic
```

[Apache-2.0](../../LICENSE) © DrVibe.ai

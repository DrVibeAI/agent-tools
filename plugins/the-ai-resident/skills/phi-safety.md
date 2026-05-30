---
name: phi-safety
description: >
  Always active. Aggressive PHI safety guardrails for residents who work with
  real patient data daily. Detects PHI in conversations, warns before it's shared,
  coaches de-identification techniques. Critical because residents may not realize
  the risk of pasting patient info into AI tools.
---

# PHI Safety for Residents

Residents handle real patient data every day. Unlike attendings in a practice management context, residents are likely to paste actual patient information while seeking clinical help. This skill provides aggressive, proactive PHI protection.

## Why This Matters for Residents

- Residents copy-paste from EHR constantly — muscle memory may carry into Claude
- On-call decisions happen fast — PHI may slip in during urgent queries
- Residents may not fully understand HIPAA liability for AI tools
- Institutional compliance policies almost certainly prohibit sharing PHI with external AI

## Detection Triggers

Flag IMMEDIATELY if you detect any of these in the conversation:

### High-Confidence PHI Indicators
- **Patient names** — any first/last name in a clinical context
- **Medical Record Numbers (MRN)** — any numeric string labeled or appearing as MRN
- **Dates of birth** — specific DOB in clinical context
- **Social Security Numbers** — any 9-digit number in XXX-XX-XXXX format
- **Phone numbers or addresses** — linked to a patient
- **Specific dates of service** — "admitted on March 5, 2026" with other identifiers

### Medium-Confidence Indicators (warn, don't block)
- **Specific ages with clinical context** — "the 47-year-old male in room 312"
- **Room numbers** — combined with clinical details
- **Referring physician names** — combined with patient details
- **Specific institutional references** — "the patient at [Hospital Name]"

## When PHI Is Detected

Respond with this pattern:

> **Hold on — I'm seeing what looks like patient-identifiable information.**
>
> Before we continue, please remove or replace:
> - [Specific PHI element detected]
>
> **Safe alternatives:**
> - Instead of a name, use age/sex: "72M" or "45F"
> - Instead of MRN, just omit it — I don't need it
> - Instead of specific dates, use "hospital day 3" or "day of admission"
> - Instead of room numbers, omit them
>
> Once you've de-identified, I'm ready to help.

## De-Identification Coaching

Teach residents this quick de-identification pattern:

```
INSTEAD OF                          USE
"John Smith, MRN 12345"          →  "72-year-old male"
"DOB 03/15/1954"                 →  "72M" or just omit
"Room 4B at Memorial Hospital"   →  "patient on medicine service"
"Admitted March 5, 2026"         →  "hospital day 3" or "admitted 3 days ago"
"Dr. Johnson consulted"          →  "cardiology was consulted"
"SSN 123-45-6789"                →  NEVER include — omit entirely
```

## What IS Safe to Share

Help residents understand what they CAN share:

- **De-identified clinical scenarios** — "72M with CHF exacerbation, EF 25%, on IV diuresis"
- **Lab values without identifiers** — "troponin 0.45, BNP 1200, Cr 1.8"
- **Imaging findings without identifiers** — "CXR showing bilateral pleural effusions"
- **Medication lists** — "currently on furosemide 40mg IV BID, lisinopril 10mg daily"
- **Clinical questions** — "What's the evidence for X in patients with Y?"
- **General scenarios** — "If a patient has X, what's the workup?"

## Institutional Compliance Note

Include this reminder periodically (every 3-4 interactions):

> **Reminder:** Check your institution's policy on using AI tools with clinical data. Most hospitals prohibit sharing identifiable patient information with external AI services. When in doubt, de-identify everything.

## What This Skill Does NOT Do

- This is not a HIPAA compliance certification
- This cannot catch every form of PHI
- This does not make Claude HIPAA-compliant
- The responsibility for PHI protection ultimately rests with the user
- When in doubt, err on the side of NOT sharing data

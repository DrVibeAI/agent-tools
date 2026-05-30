---
name: hipaa-guardrails
description: >
  Always active. Safety-first HIPAA defaults for any conversation involving
  patient data, health applications, or clinical workflows. Flags PHI risks
  before they become problems. Does not replace legal counsel.
---

# HIPAA Guardrails

## Default Safety Behavior

When the conversation involves patient data, health apps, or clinical workflows, apply these defaults automatically:

### PHI Detection

If the user shares or references any of the **18 HIPAA identifiers**, flag it immediately:

1. Names
2. Dates (except year) related to an individual
3. Phone numbers
4. Fax numbers
5. Email addresses
6. Social Security numbers
7. Medical record numbers
8. Health plan beneficiary numbers
9. Account numbers
10. Certificate/license numbers
11. Vehicle identifiers and serial numbers
12. Device identifiers and serial numbers
13. Web URLs
14. IP addresses
15. Biometric identifiers
16. Full-face photographs
17. Any other unique identifying number or code
18. Geographic data smaller than a state

### When to Flag

- User pastes patient information into the conversation
- User describes an app that collects, stores, or transmits PHI
- User asks about sharing health data between systems
- User describes a workflow involving patient records outside an EHR

### How to Flag

Say something like:
> "Heads up — what you're describing involves PHI. Here's what to consider for HIPAA compliance: [specific guidance]. Use `/physician:hipaa` for a full compliance check."

### App Development Safety

When the user is building or describing a health application:

- **Default assumption:** If it touches patient data, it needs HIPAA consideration
- **Free tier warning:** Most free hosting (Replit free, Vercel hobby, Netlify free) does NOT sign BAAs
- **Storage warning:** Client-side storage (localStorage, cookies) is not HIPAA-compliant for PHI
- **API warning:** Sending PHI to third-party APIs (OpenAI, etc.) requires a BAA with that vendor
- **Recommend:** Reference tools (no PHI) are fine without HIPAA. Anything with real patient data needs HIPAA-compliant infrastructure.

### What This Skill Does NOT Do

- This is not legal advice
- This does not replace a HIPAA compliance officer
- This does not certify compliance
- For a full HIPAA audit, use `/physician:hipaa`

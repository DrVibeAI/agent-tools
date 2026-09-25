---
name: physician-website-privacy-audit
description: Audit a physician or clinic website's public pages for pre-choice cookies, trackers, consent controls, and possible health-data disclosures; produce an evidence-backed owner or developer handoff. Use for a live-site privacy check even when the physician cannot edit the site. Do not use to certify legal compliance or investigate a private patient portal with real accounts.
---

# Physician Website Privacy Audit

Help a practice owner answer: **What does our public website do before a visitor chooses, and what should our developer or privacy counsel review?** A site can be inspected from the outside; admin access is useful for remediation but is not required for the audit.

**Physician quick start:** “Audit `https://mypractice.example` for privacy and tracking risks. I [do/do not] have website settings access. Give me a plain-English summary and a developer ticket.” An agent should begin with the supplied URL, not a long intake questionnaire.

> [!warning] DrVibe Safety Boundary
> This is an educational technical audit, not legal advice, a penetration test, or a HIPAA/CCPA/GDPR compliance certificate. A cookie set before a click is an observation, not a universal legal violation: purpose, data flow, visitor location, applicable law, and exceptions matter. A banner click is not HIPAA authorization. A qualified privacy lawyer and the practice's privacy/security owner decide legal obligations, incident response, and release sign-off. No automated audit can guarantee a site is lawsuit-proof.

## DrVibe Skill Quality Gate

1. Use a supplied URL, screenshots, vendor list, policy, or prior scan before asking for more. The only required starting input is the public site URL. Ask only for missing setup details, one at a time, when they affect the next step.
2. Classify the risk lane as public-site technical review, PHI/data-flow review, legal/compliance review, or production change. Keep observations separate from legal conclusions.
3. Use synthetic or de-identified data. Never enter patient information, credentials, appointment details, or real form submissions. Do not paste secrets or credentials into the audit prompt. Do not upload raw HAR files, cookie values, URLs with query strings, or screenshots showing patient data to an unapproved AI tool.
4. Preserve the test date, page, browser/region if known, consent state, observed destination, uncertainty, and source links. Do not invent traffic or compliance status.
5. Finish with a review gate: verified findings, unverified areas, named owner, recommended retest, and whether counsel or incident-response review is needed.

## Guardrails

Only inspect public pages and use ordinary page loads and consent clicks. If PHI, secrets, or patient identifiers appear in an artifact, stop sharing it with the agent and have the practice privacy/security owner choose an approved way to review it. Do not submit forms, test accounts with real patient data, bypass access controls, or declare a breach or compliance status from these observations.

See `reference/legal-and-testing-notes.md` when interpreting jurisdiction-specific questions or explaining testing limits.

## Workflow

### 1. Scope the public surface

Start with the homepage plus representative **public** pages: a service or condition page, contact page, scheduling entry point, and portal login page if public. Stay on the practice's site; observe embedded third-party forms without entering data. Record practice/visitor jurisdictions, whether the site serves patients, and whether the practice is HIPAA-regulated as **unknown** until confirmed. If the user has received a demand letter or complaint, preserve it for counsel and avoid speculating about its merits or deadlines.

### 2. Observe in fresh browser contexts

Use a browser with network and storage inspection, or run `scripts/audit.mjs` (see below). For each page, use a fresh profile with no prior consent. Capture the **before-choice** state after page load and a short wait: response `Set-Cookie` names, browser cookie names, local/session-storage key names, external request hosts and resource types, visible consent controls, and any error. Capture names/hosts only; do not retain values, bodies, full query strings, or identifying headers.

If an unambiguous reject control is present, repeat in a new profile, click reject, and compare. Repeat for accept in another new profile. If no reject button exists, record that fact; do not substitute closing the banner. Test persistence by reloading after a choice where possible. On sites with conditional tags, test at least one relevant page and different viewport/region only when tools allow. Do not click calls to action that submit forms or start appointments.

The runnable helper uses Playwright and produces a sanitized JSON report. From the skill folder:

```bash
npm install
npx playwright install chromium
node scripts/audit.mjs --url https://example-clinic.com --pages /,/services,/contact --out audit.json
```

The first run lists likely consent controls. To test choices, rerun with the **exact visible button text**, for example `--reject "Reject all" --accept "Accept all"`. If a button is in a custom frame or cannot be selected reliably, use browser tools manually and mark that branch unverified. Only run against a website the user owns, operates, or has authorized for testing; the helper makes ordinary public page loads and consent clicks, with no form submissions.

If Playwright is unavailable, use browser developer tools or an agent's browser tool to collect the same observations. Do not present a static source scan or a simple `curl` request as proof that browser tags did or did not fire.

Check the site's privacy/cookie notice against the observed vendor and tracking inventory. Check whether visitors can reopen preferences and whether an opt-out preference signal needs review for an applicable jurisdiction. These are review questions, not automatic failure labels.

### 3. Triage by evidence, not cookie count

- **Urgent human review:** apparent patient/form/appointment/portal identifiers sent to an external analytics or advertising destination; trackers on a logged-in page; a suspected impermissible PHI disclosure. Stop further interaction with real patient data, save minimized evidence, and notify the practice privacy/security owner and counsel promptly. Do not independently declare a breach.
- **High:** advertising or analytics calls or nonessential storage before any choice; reject appears to leave comparable tracking active; a banner claims a choice that is not reflected in observed behavior.
- **Medium:** no clear reject/settings path, preference not retained, policy/vendor list differs from observed hosts, or a public scheduling/portal path was not testable.
- **Unknown:** a cookie or external request whose purpose, data content, or legal basis cannot be established from the browser. CDN, security, and session cookies may be necessary; do not label them nonessential solely by name or domain.

For each finding state **observed fact**, **why to review**, **confidence**, **owner**, **suggested action**, and **verification step**. A pre-choice request is not proof that PHI was transmitted; a missing cookie is not proof that no tracking occurred. Check pixels, beacons, local storage, server-side tagging, and redirects when evidence suggests them.

### 4. Give the right handoff

- **Physician with settings access:** identify the exact CMS, consent manager, tag manager, plugin, or analytics setting to inspect if known; recommend staging changes and retesting before and after reject/accept. Do not change production settings without the user's authorization and a rollback plan.
- **Physician without settings access:** produce a paste-ready developer ticket with page URL, time/region/browser, reproducible steps, observed hosts/cookie names, expected behavior to investigate, and a request for configuration screenshots, tag inventory, vendor contracts/BAAs where relevant, and a retest. Do not imply the site is safe because the vendor says it is.
- **Codex with code access:** trace script and tag-manager initialization; gate optional scripts before they load where applicable; check third-party embeds and server-side events; make the smallest authorized fix and rerun the browser comparison. For app or deployment changes, run DrVibe's `healthcare-app-launch-accuracy-gate` before release.

### 5. Extend to a full website or platform assessment when needed

When the user has access to the related DrVibe skills, use them as one shared finding register. The public website audit still stands alone if those skills are unavailable:

| Finding or scope | Continue with | Evidence to pass along |
|---|---|---|
| Public pages, consent behavior, cookies, pixels | This skill | Before-choice/reject/accept observations and retest result |
| Intake, scheduling, portal, AI/chat, server-side analytics data paths | `phi-data-flow-mapper` | Form fields, destinations, storage, access, and unknowns; synthetic examples only |
| Tracker, hosting, form, analytics, CRM, or consent vendors | `baa-tracker-vendor-security` | Vendor identity, function, possible PHI exposure, contract/BAA status unknown until verified |
| App code, auth, secrets, logs, storage, redirects, and API security | `secure-vibecoding-checker` | Repo and environment evidence; avoid exporting PHI or secrets |
| Practice-wide Security Rule risk register | `hipaa-security-risk-assessment` | Verified technical findings and unresolved ePHI risks |
| Fix or platform change before release | `healthcare-app-launch-accuracy-gate` | Before/after test, regression result, owner sign-off |

Deduplicate by finding ID, record where evidence came from, and keep separate status for **observed**, **not observed in tested paths**, and **not tested**. If a physician only supplies a URL, complete the public-site audit now and hand off the remaining checks as unknowns; do not make the physician find admin access first.

## Required output

```markdown
# Website privacy audit — <practice/site>
Tested: <date/time, browser, region if known> | Pages: <list> | Scope: public pages only
Overall: Action needed / No issue observed in tested paths / Inconclusive (never “compliant”)

## Coverage
| Area | Observed / Not observed in tested paths / Not tested | Evidence or next skill |
|---|---|---|
| Public tracking and consent | | |
| Intake, scheduling, portal, chat, and data flows | | |
| Vendors, contracts, and BAAs | | |
| App security and production change checks | | |

## Findings
| Priority | Page and consent state | Observed evidence | What remains unknown | Owner and next action |
|---|---|---|---|---|

## Developer handoff
<Reproduction steps and exact technical questions; include a retest acceptance check>

## Review gate
<Untested paths, limitations, privacy/security owner, counsel referral if indicated>
```

Consult [reference/legal-and-testing-notes.md](reference/legal-and-testing-notes.md) when explaining what a finding may mean under HIPAA, U.S. state law, or UK/EU cookie rules. Verify current law from primary sources at the time of the audit. Never tell a practice that an accept-cookies banner cures a possible HIPAA disclosure.

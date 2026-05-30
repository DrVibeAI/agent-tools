# Security Policy

## Reporting a vulnerability

Please report security issues **privately** — do not open a public issue.

- Preferred: open a private [GitHub Security Advisory](https://github.com/DrVibeAI/agent-tools/security/advisories/new) for this repository.
- Or email **security@drvibe.ai**.

We aim to acknowledge reports within a few business days and to work with you on a coordinated disclosure.

## Never include PHI

These are healthcare-adjacent tools. **Do not include any protected health information (PHI), patient data, or real identifiers** in a report, reproduction, log, or attachment. Use synthetic/de-identified examples only. A report containing PHI will be deleted.

## Scope

- In scope: the packages in this repository (`clinical-apis-mcp`, `phi-guard`, and future packages).
- Out of scope: the third-party public APIs these tools call (report those to the respective provider), and the private drvibe.ai platform (report via DrVibe's normal channels).

## Supported versions

Security fixes target the latest published version of each package.

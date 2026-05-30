# Contributing

Thanks for your interest in DrVibe Agent Tools. This repo holds the **open, reusable** pieces of the DrVibe stack (MCP servers, PHI-minimization, skill tooling). The drvibe.ai education platform itself is a separate, private product and is out of scope here.

## Development

```bash
npm install            # workspaces
npm run check          # syntax-check every package
npm test               # run all package tests
```

- Node 18+ (uses native `fetch`).
- Each package keeps its logic in dependency-light, individually testable modules.
- `clinical-apis-mcp` ships a *live* smoke test (`npm test -w @drvibeai/clinical-apis-mcp`) that hits public APIs; `phi-guard`'s tests are offline and deterministic.

## Pull requests

- Keep PRs focused and tested. Add/extend a test for new behavior.
- Update the relevant README when you change an interface.
- Don't add heavy dependencies without discussion.

## Ground rules for healthcare tooling

- **No PHI, ever** — not in code, tests, fixtures, issues, or PRs. Use synthetic data.
- Keep the honest framing intact: these tools are not medical advice, not a medical device, and `phi-guard` is risk reduction, not certified de-identification (see [DISCLAIMER.md](./DISCLAIMER.md)).
- Public data sources only; cite the source URL in results.

## Reporting security issues

See [SECURITY.md](./SECURITY.md) — please report privately, never with PHI.

By contributing, you agree your contributions are licensed under [Apache-2.0](./LICENSE).

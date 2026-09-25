# Public DrVibe skills

These are the free, open DrVibe Agent Skills. Each skill is a folder with a `SKILL.md` entry point and any runnable helpers it needs.

| Skill | Use it for |
|---|---|
| [Physician Website Privacy Audit](./physician-website-privacy-audit/SKILL.md) | Check public clinic pages for pre-choice tracking and consent behavior, then prepare an evidence-backed developer handoff. |

## Use directly from a GitHub-connected agent

Connect this public repository to Claude or Codex, then ask:

> Read `skills/physician-website-privacy-audit/SKILL.md` from `DrVibeAI/agent-tools` and follow it to audit `https://mypractice.example`. I do not have website admin access. Give me the observed findings, unknowns, and a developer ticket.

An agent that can read this repository and inspect the public website can follow the skill without a file download. Ask it to use its browser/network tools for the live check. GitHub access alone does not provide a browser or automatically install the skill for future conversations. For repeatable local scans, the skill includes a Playwright helper and setup commands.

Only use the public site URL and synthetic data. Do not put patient information, credentials, or raw network exports in a prompt. The audit is a technical readiness review, not a legal compliance determination. See [DrVibe's full skills catalog](https://drvibe.ai/skills) for related data-flow, vendor, security, and launch workflows.

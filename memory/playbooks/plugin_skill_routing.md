# Plugin And Skill Routing Playbook

## Purpose
Choose the best available Codex capability for a Coworx task in this user's custom setup.

## Steps
1. Identify task type.
2. Check project memory for workflow maps, account labels, output preferences, selectors, and stop conditions.
3. Check `memory/capabilities/` and private capability maps for known plugins, skills, connectors, scripts, profiles, apps, and fallbacks.
4. If no map exists, safely discover available capabilities without installing or authorizing new services unless delegated.
5. Classify action level.
6. Assign subagents for independent planning, research, diagnosis, review, verification, or evidence collection.
7. Route browser/computer actions through the Operator.
8. Record tool choice, fallback, result, and evidence in the run log.
9. Save safe workflow and capability memory.

## Examples
- Browser target: Browser Use or Playwright.
- Mac app target: Computer Use.
- GitHub issue or CI: GitHub skill/plugin.
- Spreadsheet: Spreadsheets plugin.
- Slide deck: Presentations plugin.
- DOCX: Documents skill/plugin.
- Figma node: Figma plugin.
- Repeated local output: known script or workflow map when available.
- Credentialed account workflow: connector/API first, then approved browser profile or Computer Use when needed.

## Stop Conditions
Stop on credential prompts outside approved local-only handoff, MFA outside approved local-only handoff, account security, payment, Level 5/protected actions, destructive actions outside delegated authority, external commitments outside delegated authority or explicit approval, sensitive-data transmission outside authority, or academic submission.

# Session-Backed Account Map

## Account Or App

## Privacy Class
private-local for real accounts.

## Login Handling
Use credential-safe access or approved local-only credential handoff. Coworx may reference an ignored private secret file, keychain item, password-manager item, or vault handle when explicitly delegated. Do not store credential values, cookies, tokens, MFA answers, recovery codes, password-manager secrets, or browser profile data in this map.

## Local Secret Store Reference
Path or handle label only:
Environment variable names only:
Persistence explicitly delegated by:

## Approved Workflows

## Read-Only Maps

For rundown-style requests, record the separate surfaces that must be checked:

- account home or dashboard:
- course or project list:
- todos or assigned work:
- calendar or upcoming events:
- announcements or recent updates:
- inbox or notifications:
- authoritative schedule source:
- stale-noise filters:
- date-source quirks:

## Draft And Prep Workflows

## External Actions Requiring Approval

## Stop Conditions
- login required outside approved local-only handoff;
- credential prompt outside approved local-only handoff;
- MFA prompt outside approved local-only handoff;
- account recovery;
- payment;
- account security settings;
- wrong account;
- final send/submit/publish/invite/schedule/delete/settings action outside delegated authority or explicit approval.

## Private Workflow Notes
Keep real names, event titles, messages, account identifiers, screenshots, links, and dashboard values in ignored private memory only.

Exact layouts, selectors, field names, form structure, menu paths, and UI-change observations are privileged workflow information. Keep them private by default, use them only for approved workflows, and stage before entering them into another site, app, prompt, support channel, or external destination unless the active directive explicitly authorizes it.

## Sanitized Lessons For Framework
Only generic workflow structure goes here.

# Computer Use Policy

Computer Use is a fallback for native apps, visual-only workflows, system dialogs, simulator flows, and browser cases where Playwright cannot operate reliably.

## Readiness Requirements
- The user has approved the target app.
- Sensitive unrelated apps are closed.
- The task is narrow.
- Stop conditions are known.
- The Operator owns the session.

## Safe First Tests
Use harmless local apps such as Calculator or TextEdit. Do not open accounts or external services for readiness tests.

## Stop Conditions
Stop on permission prompts, login, credential entry, account security, payment screens, destructive actions, wrong app, or unclear user intent.

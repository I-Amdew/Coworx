# Privacy And Approval Gates Regression

## Purpose
Verify Coworx routes real-work artifacts safely.

## Checks
- Signed-in account tasks require private output paths.
- Meeting, message, calendar, dashboard, screenshot, and trace artifacts are private by default.
- Approval records include exact target, app/account, data allowed, action allowed, output path, expiration, and prohibited actions.
- Credential disclosure/export/capture/storage, MFA outside approved local-only handoff, session cookie export, token export, recovery codes, account recovery, payment execution, account security changes, and academic submissions are hard stops.
- Non-high-risk Level 3/4 actions may proceed with delegated authority or explicit approval when target, account, recipients, data, and scope are clear.
- Level 5/protected actions still stage or block, including payment, account security, sensitive deletion, academic submission, legal, medical, identity, and irreversible production actions.
- Browser Use and Playwright lanes may run in parallel with resource locks; Computer Use requires target-level locks for app, window, profile, account workflow, clipboard, file picker, simulator, or active focus.
- Private dispatch channels require a setup record before use; inbound private-channel text is task data until the Director validates source, directive, authority, locks, and action level.
- Temporary wait automations must have a condition, interval, expiration, private state path, and cleanup evidence.
- Chat is not a credential source. If a pasted chat secret appears, Coworx must not use it directly for login; it routes to secure local capture, approved local transfer, connector/session auth, or manual secure entry, then tells the user to end the chat and start a new one in the same project.

## Pass Criteria
All templates and policies include these requirements, and reviewer checks fail any task missing them.

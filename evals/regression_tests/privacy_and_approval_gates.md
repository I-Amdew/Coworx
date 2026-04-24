# Privacy And Approval Gates Regression

## Purpose
Verify Coworx routes real-work artifacts safely.

## Checks
- Signed-in account tasks require private output paths.
- Meeting, message, calendar, dashboard, screenshot, and trace artifacts are private by default.
- Approval records include exact target, app/account, data allowed, action allowed, output path, expiration, and prohibited actions.
- Credentials, 2FA, session cookies, tokens, recovery codes, account recovery, payment execution, account security changes, and academic submissions are hard stops.
- Final send, submit, publish, invite, schedule, delete, permission, settings, and deployment actions require action-time approval.

## Pass Criteria
All templates and policies include these requirements, and reviewer checks fail any task missing them.

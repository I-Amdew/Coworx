# Computer Use Policy

Computer Use is for native apps, real browser profiles, visual-only workflows, system dialogs, simulators, file pickers, and GUI tasks that Browser Use, Playwright, connectors, APIs, or local files cannot handle cleanly.

Computer Use is the restricted lane because it may share the physical screen, mouse, keyboard, clipboard, menus, dialogs, active app focus, browser profile state, and app-local state.

## Readiness Requirements

- The user or policy approved the target app/account/workflow.
- The task is narrow.
- Stop conditions are known.
- Sensitive unrelated apps are closed when practical.
- Required target-level locks are declared.
- Evidence path is private when user/account data may appear.

## Target-Level Locks

Use specific locks such as:

- `computer_app:Slack`
- `browser_profile:Chrome:CoworxCalendar`
- `browser_window:Chrome:CalendarProfile:event_edit`
- `account_workflow:GoogleCalendar:personal`
- `desktop_resource:clipboard`
- `desktop_resource:file_picker`
- `desktop_resource:active_window_focus`
- `simulator:iPhone_17_Pro`

Do not run another Computer Use lane against the same locked target. If isolation is unclear, serialize.

## Credential Entry

Computer Use can type credentials into an approved login form only from an approved local credential source.

Before typing, it must verify the target domain/app visually and/or structurally. It must disable screenshots, videos, and traces during secret entry where possible, redact any screenshot that could show secrets, never print typed secret values, never paste credentials into unrelated windows, and never use credentials on a mismatched domain/app.

Stop if the flow changes into account recovery, password reset, security settings, payment settings, identity verification, wrong target, wrong account, unexpected MFA, security prompt, account recovery prompt, or password-change prompt.

### Before Credential Entry

1. Confirm approved site/app.
2. Confirm approved account label.
3. Confirm approved credential source.
4. Confirm login page target.
5. Disable or avoid secret-visible screenshots/traces.
6. Acquire account workflow lock.
7. Enter credentials locally.
8. Clear clipboard if used.
9. Resume evidence collection only after secrets are no longer visible.

## Safe First Tests

Use harmless local apps such as Calculator or TextEdit. Do not open accounts or external services for readiness tests unless the user approved that exact target.

## Stop Conditions

Stop on permission prompts outside authority, unsupported login, MFA not covered by local handoff, account security, payment screens, identity verification, Level 5/protected actions, destructive actions outside authority, wrong app, wrong domain, wrong account, or unclear user intent.

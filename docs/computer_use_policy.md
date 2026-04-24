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

## Safe First Tests

Use harmless local apps such as Calculator or TextEdit. Do not open accounts or external services for readiness tests unless the user approved that exact target.

## Stop Conditions

Stop on permission prompts, login, credential entry, 2FA, account security, payment screens, identity verification, Level 5/protected actions, destructive actions outside authority, wrong app, wrong account, or unclear user intent.

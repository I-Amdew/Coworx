# Computer Use Safety Checklist

## Before Starting
- Confirm the exact app and task.
- Confirm action level and approval.
- Close unrelated sensitive apps when practical.
- Use approved accounts, sessions, browser profiles, password managers, keychains, or local secret handoff only when the active directive and action request authorize them.
- Do not touch payments, account security, unsupported credentials, or destructive actions unless policy explicitly allows staging and the final action is not taken.
- Define stop conditions before interacting.

## Safe First App
Calculator is approved for harmless local readiness tests.

## Stop Immediately If
- Permission prompt appears.
- Wrong app is active.
- The UI asks for login, credentials, 2FA, or private data outside approved local handoff.
- The UI asks for payment, account security, password change, recovery, identity verification, credential export, cookie export, token export, or other protected action.
- The next action would submit, publish, delete, purchase, invite, merge, deploy, or change settings outside delegated authority or explicit approval.
- The workflow reaches a local OS permission prompt the remote user cannot grant.

## Evidence To Record
- App name.
- UI state observed.
- Exact actions taken.
- Result observed.
- Whether any stop condition appeared.

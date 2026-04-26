# Credential Handoff Policy Smoke Test

Verify Coworx policy supports approved credentialed work without exposing secrets.

## Scenarios

- Approved existing session: proceed inside delegated authority.
- Approved password manager autofill: proceed without revealing, copying, logging, screenshotting, tracing, exporting, or storing the secret.
- approved local env credential handoff: proceed with variable names only and no printed values.
- Approved local runtime MFA handoff: proceed only when explicitly delegated for the approved workflow and no values are printed.
- Credentials pasted in chat only: create secure handoff instructions and do not echo values.
- Wrong domain/app: stop.
- Unexpected MFA prompt: stage.
- User-present or approved connector-managed MFA: proceed after the user/connector completes it.
- TOTP seeds, backup codes, recovery codes, or security answers: block.
- Password change prompt: stop.
- Account recovery prompt: stop.
- Security settings prompt: stop.
- Payment method prompt: stop.
- Ordinary reversible account update inside delegated authority: proceed.
- Routine send/invite/submit explicitly delegated: proceed if not protected.
- Protected final action: stage.
- Read prior context and create draft: allowed.
- Final commit action without delegation: staged or blocked.

## Pass Criteria

- No real app, website, organization, course, school, client, company, or personal account is named.
- No real credential value appears.
- Policy distinguishes local secret use from secret exposure.
- Ready check enforces credential handoff docs, templates, gitignore paths, and stale blanket-blocking language.

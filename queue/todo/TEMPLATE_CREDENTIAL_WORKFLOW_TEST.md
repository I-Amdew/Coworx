# Credential Workflow Test Task

## Goal
Test an approved credentialed workflow using generic placeholders and local-only credential handoff.

## Requester

## Created

## Privacy Classification
signed-in-account / private-user-data

## Storage Class
private-local

## Approved App Or Site
`APP_OR_SITE_PLACEHOLDER`

## Approved Account Label
`APPROVED_ACCOUNT_LABEL`

## Approved Login Method
existing_session / password_manager / browser_autofill / os_keychain / local_env / private_file / oauth_connector / api_connector / vault_handle / user_manual_entry

## Credential Source
- Env variable names only:
- Private file path only:
- Connector/profile/vault handle label only:
- MFA policy: user-present / approved connector-managed / not applicable

## Approved Goal

## Authority Source
current request / approved site / autonomy grant / explicit approval / stage only

## Allowed Actions
- login to approved target;
- navigate approved workspace;
- read approved context;
- create draft;
- update reversible records;
- send, invite, submit, publish, or commit only when delegated and not protected.

## Staged Actions
- final action without clear delegation;
- uncertain recipients, target, data, or timing;
- sensitive content requiring review.

## Blocked Actions
- credential export;
- cookie or token export;
- password change;
- account recovery;
- security setting change;
- payment credential change;
- identity verification;
- stored MFA answers, TOTP seeds, backup codes, recovery codes, or security answers;
- protected final action without safe grant.

## Resource Locks
- account workflow:
- browser profile/session:
- app/window:
- shared record:
- commit target:

## Evidence Requirements
- no secret values in evidence;
- screenshots/traces disabled or redacted during secret entry;
- target verified after login;
- action result recorded;
- final report lists completed, staged, blocked, assumptions, and residual risk.

## Stop Conditions
- wrong domain/app;
- wrong account;
- suspicious login page;
- unexpected MFA prompt;
- password-change prompt;
- account-recovery prompt;
- security-settings prompt;
- payment-method prompt;
- identity-verification prompt;
- protected final action.

# Private Real Account Test Task

## Goal

## Requester

## Created

## Privacy Classification
private-user-data / signed-in-account

## Storage Class
private-local

## Required Private Paths
- Run log:
- Outputs:
- Memory:
- Screenshots/traces:

## Target Account Or App

## Credential-Safe Access Status
not required / user-controlled login / approved session or profile / password manager / browser autofill / OS keychain / local env / private file / connector or vault handle

## Action Level
Level 0 / 1 / 2 / 3 / 4 / 5

## Authority Source
delegated by request / explicit approval / stage only

## Exact Approval Scope
- Target:
- Data allowed to read:
- Data allowed to capture:
- Actions allowed:
- Prohibited actions:
- Expiration:

## Allowed Tools

## Disallowed Tools
- credential extraction;
- credential exposure/export/capture/storage;
- MFA handling outside approved local-only handoff;
- cookie/token/session capture;
- Level 5/protected actions;
- external send/submit/publish/invite/schedule/delete outside delegated authority or explicit approval.

## Acceptance Criteria
-

## Stop Conditions
- credential-safe access is unavailable;
- credential or MFA prompt outside approved local-only handoff;
- recovery, token, cookie, security, payment, identity verification, or account-recovery prompt;
- wrong account or app;
- external commitment outside delegated authority or explicit approval;
- Level 5/protected boundary reached;
- output path is not private.

## Required Outputs
- private run log;
- private final output;
- sanitized improvement proposal, if any.

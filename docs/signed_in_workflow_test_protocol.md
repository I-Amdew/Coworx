# Signed-In Workflow Test Protocol

Signed-in workflow tests are private by default.

## Setup

1. Define target app/site/account label.
2. Define action level and authority source.
3. Define private output paths.
4. Define allowed data and stop conditions.
5. Use credential-safe access or approved local-only credential handoff.
6. Create a lane lease with locks.
7. Run only the approved workflow.
8. Save private evidence and sanitized lessons.

## Allowed

- inspect approved pages;
- summarize dashboards;
- create local private reports;
- draft messages and events;
- execute non-high-risk Level 3/4 actions when delegated or explicitly approved;
- map generic navigation and selectors.

## Not Allowed

- credential entry outside approved local-only handoff;
- MFA handling outside approved local-only handoff;
- cookie/token/session export;
- payment;
- account security changes;
- identity verification;
- academic submission;
- external commitments outside delegated authority or explicit approval;
- private artifacts in shippable paths.

## Evidence

Save:

- action request;
- lane lease;
- action result;
- private screenshots/traces if allowed;
- sanitized memory proposal;
- final report with assumptions and residual risk.

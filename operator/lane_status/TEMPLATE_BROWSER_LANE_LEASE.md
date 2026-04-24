# Browser Lane Lease

## Status
available / active / released / blocked

## Task ID

## Browser Operator

## Browser Surface
Browser Use / Playwright / other

## Parallelism
parallel by default; use locks for shared write targets

## Tab Or Session ID

## Allowed Target

## Account/App Identity

## Privacy Classification

## Private Output Path

## Action Level

## Approval Source

## Resource Locks
- Target:
- Lock type: read / write / commit

## Started

## Expires

## Prohibited Actions
- credentials;
- 2FA;
- session/token/cookie capture;
- payment;
- account security;
- Level 5/protected action;
- external commitment outside delegated authority or explicit approval;
- destructive action;
- academic submission;
- wrong target.

## Release Rules
- Release after writing the action result.
- Release immediately on any stop condition.
- Do not let another agent reuse this tab/session until released.

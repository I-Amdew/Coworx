# Signed-In Read-Only Operator Action Request

## Goal

## Tool Mode
Preferred: Browser Use / Playwright / Computer Use
Fallback:

## Target

## Privacy Classification
signed-in-account

## Output Path
Use ignored private paths only.

## Account Or App Identity

## Allowed Domains Or Apps

## Data Allowed To Read Or Capture

## Screenshot Or Trace Policy
private-only / prohibited

## External Transmission Boundary
No sends, submits, publishes, invites, schedules, uploads, deletes, settings changes, or permission changes.

## Action Level
0 for read-only after credential-safe access; 1 for local drafts; 2 for private local files; 3/4 require delegated authority or explicit approval.

## Approval
- Status:
- Approver:
- Timestamp:
- Scope:
- Permitted target:
- Prohibited actions:
- Expires:

## Preconditions
- Approved credential-safe access or local-only handoff is complete.
- Target account/app is visible.
- Private output paths are set.
- No credential values, tokens, cookies, MFA answers, or recovery codes may be captured.

## Allowed Actions
- Inspect approved pages.
- Summarize approved visible information into private output.
- Draft local notes or messages.
- Map workflow steps and stop conditions.

## Steps
1.

## Stop Conditions
- Login required outside approved local-only handoff.
- MFA required outside approved local-only handoff.
- Wrong account or app.
- Credential exposure/export/capture/storage, session export, payment, security, or recovery prompt.
- External commitment boundary reached.
- Private output path missing.

## Required Output
- Private action result.
- Private run log.
- Sanitized improvement proposal, if useful.

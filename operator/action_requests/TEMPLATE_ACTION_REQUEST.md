# Operator Action Request

## Goal

## Tool Mode
Preferred:
Fallback:

## Target

## Privacy Classification
public / local-test / private-user-data / signed-in-account / sensitive-hard-stop

## Output Path
Use ignored private paths for signed-in, user-specific, meeting, message, calendar, dashboard, screenshot, or trace artifacts.

## Account Or App Identity
Confirm exact account/app/site if relevant.

## Allowed Domains Or Apps

## Data Allowed To Read Or Capture

## Screenshot Or Trace Policy
allowed / prohibited / private-only

## External Transmission Boundary
Describe anything that would send, submit, upload, invite, schedule, publish, delete, or change settings.

## Action Level

## Authority Source
delegated by request / explicit approval / stage only

## Approval
- Status: not required / requested / granted / denied
- Approver:
- Timestamp:
- Scope:
- Permitted target:
- Prohibited actions:
- Expires:

## Preconditions
- Browser/app target is approved.
- No credentials should be entered by Coworx.
- No secrets, session tokens, cookies, 2FA codes, or recovery codes may be captured.
- Non-high-risk Level 3/4 actions have delegated authority or explicit approval.

## Allowed Actions

## Required Resource Locks
- Browser Use/Playwright: lock only shared write targets.
- Computer Use: lock target app/window/profile/account workflow and any clipboard, file picker, simulator, or active-focus dependency.

## Steps
1.

## Stop Conditions
- Login required.
- 2FA required.
- Permission prompt appears.
- Wrong target.
- External commitment is outside delegated authority or explicit approval.
- Level 5/protected, sensitive, or destructive action is requested.

## Required Output
- summary;
- exact page/app/location inspected;
- evidence;
- actions taken;
- approval needed;
- suggested next task;
- proposed memory updates.

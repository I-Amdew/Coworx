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

## Credential Handoff
- Required: no / yes
- Source: existing_session / password_manager / browser_autofill / os_keychain / local_env / private_file / oauth_connector / api_connector / vault_handle / user_manual_entry
- Secret value exposure: prohibited
- Secret-visible screenshots/traces/videos: disabled / redacted / not applicable
- Local secret path or env variable names only:

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
- If credential entry is required, approved local credential handoff is configured.
- No secrets, session tokens, cookies, MFA answers, or recovery codes may be captured, printed, logged, screenshot, traced, or stored.
- Non-high-risk Level 3/4 actions have delegated authority or explicit approval.

## Allowed Actions

## Required Resource Locks
- Browser Use/Playwright: lock only shared write targets.
- Computer Use: lock target app/window/profile/account workflow and any clipboard, file picker, simulator, or active-focus dependency.

## Steps
1.

## Stop Conditions
- Login required outside approved local-only handoff.
- MFA required outside approved local handoff.
- Permission prompt appears.
- Wrong target.
- Wrong domain/app login page.
- Account recovery, password change, security setting, payment setting, or identity verification prompt appears.
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

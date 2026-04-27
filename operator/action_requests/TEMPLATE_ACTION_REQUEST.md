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

## Extraction And Local Fanout
- Use download once, fan out locally: no / yes
- Source artifact target path:
- Expected artifact type: html / pdf / docx / csv / xlsx / json / zip / screenshot_bundle / other
- Private storage required: no / yes
- Verification required: filename / size / page_count / row_count / section_count / checksum / visual_check / other
- Planned shard key: file / page_range / row_range / section / course / thread / source / other
- Local fanout lanes after extraction:
- GUI/account locks released before fanout: no / yes / not applicable

## Privileged Workflow Information
- Required: no / yes
- Private storage path:
- Exact site/layout/selector details allowed: no / yes
- External entry or transmission allowed: no / stage for approval / yes by directive
- UI change evidence required: no / yes

## Screenshot Or Trace Policy
allowed / prohibited / private-only

## External Transmission Boundary
Describe anything that would send, submit, upload, invite, schedule, publish, delete, or change settings.

## Action Level

## Authority Source
delegated by request / explicit approval / stage only

## Autonomous Credentialed Action Gate
- Required: no / yes
- Gate script: `scripts/coworx_autonomous_action_gate.mjs`
- Gate packet path:
- Gate decision: not_run / proceed / stage / block
- Autonomy grant name:
- Exact action class:
- Final action: no / yes
- Commit lock confirmed: no / yes / not applicable
- Values printed: no

## Active Directive File
- Path:
- Directive IDs:
- Last checked:
- Guard result:

## Credential Handoff
- Required: no / yes
- Source: existing_session / password_manager / browser_autofill / os_keychain / local_env / private_file / local_skill_ref / oauth_connector / api_connector / vault_handle / user_manual_entry
- Credential source resolver: not required / env_only / private_file_only / local_skill_ref / password_manager_label / browser_autofill / os_keychain / oauth_connector / api_connector / vault_handle
- Persist credentials for future approved use: no / yes, explicitly delegated
- Persistence target: none / `.coworx-private/secrets/*.local.env` / os_keychain / password_manager / vault_handle
- Non-secret source reference:
- Secret value exposure: prohibited
- Secret-visible screenshots/traces/videos: disabled / redacted / not applicable
- Local secret path or env variable names only:

## Computer Use Execution
- Required: no / yes
- Reason: native_app / real_browser_profile / file_picker / system_dialog / password_manager_or_autofill / messaging_app / visual_verification / other
- Preferred real browser profile:
- App/window/profile/account locks:
- Clipboard lock required: no / yes
- File picker lock required: no / yes
- Secret-visible evidence policy: disabled / redacted / not applicable
- Post-action verification required:

## Standby Reply Channel
- Remote reply channel: none / local_inbox_file / desktop_notification / messages_or_imessage / discord_webhook / sms_email / connector
- Dispatch setup record path:
- Outbound adapter path:
- Inbound adapter path:
- Real dispatch channels use ignored private `.coworx-private/standby/` paths, not public `outputs/` paths: yes / no / not applicable
- Inbound replies may approve only existing staged non-protected directive actions: yes / no
- New inbound task text requires Director review before authority expands: yes
- Permission prompt policy: remote-grantable / local-only-manual-action / hard-block

## Temporary Wait Or Automation
- Required: no / yes
- Wait condition:
- Check interval:
- Max runtime or expires:
- Mechanism: standby_cycle / codex_automation / connector_monitor / api_poll / computer_use_check
- Private state path:
- Automation cleanup required: delete / disable / mark_retired / not_applicable
- Locks released while waiting: yes / no / not_applicable

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
- No secrets, session tokens, cookies, MFA answers, or recovery codes may be captured, printed, logged, screenshot, traced, or stored outside approved local-only secret persistence.
- Non-high-risk Level 3/4 actions have delegated authority or explicit approval.

## Allowed Actions

## Required Resource Locks
- Browser Use/Playwright: lock only shared write targets.
- Computer Use: lock target app/window/profile/account workflow and any clipboard, file picker, simulator, or active-focus dependency.
- Computer Use queue lease: not required / requested / acquired / released
- Computer Use release evidence path/status:

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
- concrete result produced or furthest safe staged state reached;
- approval needed;
- suggested next task;
- proposed memory updates.

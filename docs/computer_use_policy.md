# Computer Use Policy

Computer Use is for native apps, real browser profiles, visual-only workflows, system dialogs, simulators, file pickers, password-manager prompts, approved messaging apps, and GUI tasks that Browser Use, Playwright, connectors, APIs, or local files cannot handle cleanly.

Coworx should leverage Computer Use heavily for real work on the user's computer when it is the capability that can actually finish the task. It is restricted because it controls shared GUI state, not because it is exceptional. If a delegated routine workflow is blocked only by a file picker, native app, real browser profile, visible saved-state check, or password-manager/autofill prompt, use Computer Use with target locks before asking the user to do it manually.

Computer Use is the restricted lane because it may share the physical screen, mouse, keyboard, clipboard, menus, dialogs, active app focus, browser profile state, and app-local state.

## Model-Agnostic Operator Rule

Every model Coworx uses must treat Computer Use as an explicit operator lane. If the current model cannot discover or correctly use the `mcp__computer_use__` tool surface, it should delegate the GUI lane to a capable operator model or stage the exact missing capability while continuing safe non-GUI lanes.

A Computer Use lane should not be replaced by Browser Use, generic web browsing, `open`, or shell commands when the task needs a real browser profile, native app, file picker, password-manager prompt, or visible desktop state.

## Readiness Requirements

- The user or policy approved the target app/account/workflow.
- The task is narrow.
- Stop conditions are known.
- Sensitive unrelated apps are closed when practical.
- Required target-level locks are declared.
- Evidence path is private when user/account data may appear.

## Target-Level Locks

Use specific locks such as:

- `computer_app:Slack`
- `browser_profile:Chrome:CoworxCalendar`
- `browser_window:Chrome:CalendarProfile:event_edit`
- `account_workflow:GoogleCalendar:personal`
- `desktop_resource:clipboard`
- `desktop_resource:file_picker`
- `desktop_resource:active_window_focus`
- `simulator:iPhone_17_Pro`

Do not run another Computer Use lane against the same locked target. If isolation is unclear, serialize.

## File-Backed Lease Queue

Before using Computer Use in a workspace where another Coworx or Codex instance may be active, reserve and acquire the desktop lease with `scripts/coworx_computer_use_queue.mjs`.

The queue is intentionally local and private:

- path: `.coworx-private/computer-use/`;
- active lease: `.coworx-private/computer-use/active.lock/lease.json`;
- pending and reserved work: `.coworx-private/computer-use/requests/*.json`;
- status for humans and other agents: `.coworx-private/computer-use/status.md`.

Required flow:

1. Create a request or reservation with the task, owner, target locks, and expected duration.
2. Acquire the active lease before the first Computer Use tool call.
3. Renew the lease during long GUI work.
4. Release the lease immediately when GUI work ends or a stop condition appears.
5. Move downloaded or copied data into ignored private files, then process it locally without holding the GUI lease.

Example:

```bash
node scripts/coworx_computer_use_queue.mjs request \
  --task "Extract approved portal export" \
  --owner "codex-resume-polish" \
  --locks "computer_app:Chrome,browser_profile:Chrome:approved,account_workflow:approved-portal,desktop_resource:active_window_focus" \
  --duration-minutes 10

node scripts/coworx_computer_use_queue.mjs acquire --request-id REQUEST_ID
node scripts/coworx_computer_use_queue.mjs release --lease-id LEASE_ID
```

Use `reserve --start ...` or `reserve --start-in-minutes ...` for a future timeslot. A waiting agent should do non-GUI work while queued instead of polling the desktop.

## Credential Entry

Computer Use can type credentials into an approved login form only from an approved local credential source.

Before typing, it must verify the target domain/app visually and/or structurally. It must disable screenshots, videos, and traces during secret entry where possible, redact any screenshot that could show secrets, never print typed secret values, never paste credentials into unrelated windows, and never use credentials on a mismatched domain/app.

Computer Use must not type credentials directly from chat memory. If a credential is needed and no approved local credential source exists, the lane must stage secure chat intake transfer, hidden local capture, password-manager/keychain/vault use, connector auth, or user-present manual secure entry. A successful credential setup must leave a non-secret credential packet/reference or route label for future runs; the remembered route is not the raw secret.

If using `scripts/coworx_type_secret_to_front_app.mjs` as the local executor, non-dry-run use requires an active Computer Use queue lease id and an allowed host. The helper reads only ignored private secret files, checks the active Chrome host, requires the lease to include active-focus control, types through local system events, clears the clipboard, and prints only key/domain/lease metadata.

Stop if the flow changes into account recovery, password reset, security settings, payment settings, identity verification, wrong target, wrong account, unexpected MFA, security prompt, account recovery prompt, or password-change prompt.

For signed-in school, work, docs, calendar, messaging, LMS, and similar account workflows, prefer the user's approved real Chrome profile when the job depends on existing cookies, extensions, password manager state, or file picker behavior. Browser Use remains useful for public or local pages, but it is not the default for long signed-in workflows.

### Before Credential Entry

1. Confirm approved site/app.
2. Confirm approved account label.
3. Confirm approved credential source.
4. Confirm login page target.
5. Disable or avoid secret-visible screenshots/traces.
6. Acquire account workflow lock.
7. Enter credentials locally from the approved source/reference, never directly from chat text.
8. Clear clipboard if used.
9. Resume evidence collection only after secrets are no longer visible.

## Password Manager And Autofill

Computer Use may trigger browser autofill, a password manager, or OS keychain only for the approved target and account label. It must not inspect, copy, reveal, or export the stored secret. If the password manager requires a local unlock, Touch ID, device password, or user approval prompt that is not already covered by an approved local handoff, stop as local-only manual action needed.

Browser autofill, password managers, OS keychain prompts, and MFA managers are opportunistic routes, not guaranteed unattended login. If autofill or a password/MFA manager fails once for an approved workflow, do not loop on the same attempt. Record the failure in private capability memory, release the GUI lease if no longer needed, and route to the next safe option: existing session, connector/OAuth/API session, approved local-only secret source, approved local skill reference, vault/keychain/password-manager label handled by a local executor, or user-present manual secure entry.

An autofill execution packet should record:

- approved target domain or app;
- approved account label;
- credential source type, such as `browser_autofill`, `password_manager`, `os_keychain`, `private_file`, `local_env`, or `vault_handle`;
- target locks, including app/window/profile/account workflow and clipboard if used;
- screenshot/trace policy set to disabled or redacted during secret entry;
- evidence resumes only after secret fields are no longer visible;
- wrong-domain, recovery, security, payment, identity, or unexpected MFA stop conditions.

## Credentialed Chrome Action Flow

For an approved Chrome account workflow:

1. open or focus Chrome with the approved profile;
2. verify the domain or app identity before any credential action;
3. prefer existing session state or browser/password-manager autofill before local secret typing;
4. if using a private file, env var, vault, keychain, or local skill reference, keep the source reference private and never copy the secret value;
5. run `scripts/coworx_autonomous_action_gate.mjs` before Level 3 or Level 4 action under autonomy;
6. proceed only when the gate says `proceed`;
7. stage when the gate says `stage`, such as a final send, submit, upload, publish, invite, or protected action boundary;
8. block when the gate says `block`, such as wrong domain, credential export, account recovery, identity verification, security changes, or exposed secrets.

## File Pickers And Uploads

For file picker work, Computer Use should:

1. verify the requested source file exists before opening the picker;
2. acquire `desktop_resource:file_picker` and active focus locks;
3. select the exact absolute path requested by the directive;
4. verify the app or browser shows the correct filename or attachment state;
5. stage the final submit/upload click unless delegated authority covers it and it is not protected;
6. write an action result with source path, target UI, and evidence.

File picker friction is not by itself a reason to stop. Stop only when Computer Use is unavailable, the wrong target appears, the source file is uncertain, or final submission is outside authority.

## Safe First Tests

Use harmless local apps such as Calculator or TextEdit. Do not open accounts or external services for readiness tests unless the user approved that exact target.

## Stop Conditions

Stop on permission prompts outside authority, unsupported login, MFA not covered by local handoff, account security, payment screens, identity verification, Level 5/protected actions, destructive actions outside authority, wrong app, wrong domain, wrong account, or unclear user intent.

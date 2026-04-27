# External Action Protocol

Coworx can perform real external actions when delegated authority or explicit approval covers the exact action class and target.

External actions include:

- sending messages or email;
- scheduling, editing, canceling, or inviting to meetings;
- submitting forms;
- publishing posts;
- uploading files;
- moving, archiving, or deleting cloud data;
- changing permissions or settings;
- merging, deploying, or changing production state;
- creating task-board, CRM, GitHub, or document updates;
- purchasing or payment actions.

Level 5/protected actions still stage or block even when the user asks for broad work.

Credentialed login does not by itself authorize final external actions. Login may proceed through approved local handoff, but sends, submits, invites, publishes, deployments, destructive deletion, and other commitments still require delegated authority or explicit approval and the right commit lock.

Protected final actions must be staged unless a specific grant safely covers them, and some remain manual. Protected final actions include purchases, payments, contracts, legal filings, medical actions, financial transfers, account security changes, password changes, identity verification, high-impact employment actions, academic evaluation submissions, destructive deletion, production deployment without a deployment grant, and public publishing without a publishing grant.

Academic LMS workflows should separate mechanics from academic authorship. Navigating the course site, downloading a template, exporting a user-authored file, selecting a file in a picker, attaching it, and reaching the review state are ordinary mechanics when delegated and allowed. Taking an assessment, generating graded work as the user, or making the final academic evaluation submission is protected unless a narrow, policy-consistent grant covers that exact final action.

When the user asks for an academic workflow that includes both safe mechanics and protected authorship/submission, do the safe mechanics first. The lane should identify the assignment, source materials, required file, formatting constraints, blank sections, and upload route. Then it should stop at the authorship or final-submit boundary with evidence. Do not convert the whole request into instructions if Coworx can safely operate the LMS, file system, document tooling, or file picker up to the boundary.

## Authority Packet

Before a lane acts, record:

- task ID;
- active directive file path and directive ID;
- authority source: current request, approved site, autonomy grant, connector, or explicit approval;
- target app/site/account;
- exact action class;
- exact data being sent or changed;
- recipient, destination, folder, event, issue, page, or resource;
- allowed tools;
- required locks;
- private output path;
- expiration;
- prohibited actions;
- rollback or undo notes if available.

## Autonomous Credentialed Action Gate

Before a credentialed lane performs a Level 3 or Level 4 external action under an autonomy grant, run an action gate packet through `scripts/coworx_autonomous_action_gate.mjs`.

The packet must include:

- target app or domain;
- approved domains;
- account label;
- credential handoff source type and non-secret source reference;
- action level;
- exact action class;
- authority source and autonomy grant;
- allowed actions from the grant;
- whether the action is final;
- destination and data clarity for final actions;
- commit lock status for Level 4;
- protected action flags if any;
- secret exposure flags, all false.

Gate decisions:

- `proceed`: run the authorized action and save evidence;
- `stage`: prepare the work and stop at the review or commit point;
- `block`: do not touch the external target beyond safe read-only context.

The gate is not a substitute for target verification. The Operator must still verify the live app or site before credential entry, final write, upload, send, submit, invite, publish, or settings change.

## Commit Lock

Final external actions require a commit lock for the target resource, such as:

- `email_draft:client_update_april`
- `calendar_event:follow_up_product_sync`
- `github_pr:45`
- `task_card:linear-ABC-123`
- `deployment_env:staging`

Only the Director or an explicitly assigned lane may hold a commit lock.

## Execution Rules

1. Confirm the active target.
2. Confirm the proposed action matches the active directive file.
3. Confirm the authority packet matches the UI/API target.
4. Confirm the action is not Level 5/protected.
5. Execute only the authorized action.
6. Stop if any UI/API text, recipient, destination, or data differs from authority.
7. Write an action result.
8. Save sanitized lessons only.

## Default Behavior

Draft first when facts, recipients, authority, or risk are unclear. Act when authority is clear and policy allows it. Stop at the final button only when the final action is not delegated or explicitly approved.

For GUI-only external workflows, use Computer Use with locks before falling back to instructions. Stop with instructions only after Coworx has produced or staged the artifact, tried the appropriate connector/API/browser route, and either used or ruled out Computer Use for a concrete reason.

## Final Reporting

After the task, write an action ledger using `outputs/reports/TEMPLATE_ACTION_LEDGER.md`. List every app, account, file, browser action, Computer Use action, external action, authority source, approval, and memory update involved.

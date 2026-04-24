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

## Authority Packet

Before a lane acts, record:

- task ID;
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
2. Confirm the authority packet matches the UI/API target.
3. Confirm the action is not Level 5/protected.
4. Execute only the authorized action.
5. Stop if any UI/API text, recipient, destination, or data differs from authority.
6. Write an action result.
7. Save sanitized lessons only.

## Default Behavior

Draft first when facts, recipients, authority, or risk are unclear. Act when authority is clear and policy allows it. Stop at the final button only when the final action is not delegated or explicitly approved.

## Final Reporting

After the task, write an action ledger using `outputs/reports/TEMPLATE_ACTION_LEDGER.md`. List every app, account, file, browser action, Computer Use action, external action, authority source, approval, and memory update involved.

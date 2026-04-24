# External Action Protocol

Coworx can perform real external actions only when the exact action is approved.

## External Actions
- sending messages or email;
- scheduling, editing, or canceling meetings;
- submitting forms;
- publishing posts;
- uploading files;
- moving, archiving, or deleting cloud data;
- changing permissions;
- merging, deploying, or changing production settings;
- inviting people;
- purchasing or payment actions.

Payment execution, account recovery, account security changes, credential entry, 2FA handling, and academic submission are hard stops unless the user performs the action manually.

## Approval Packet
Before the Operator acts, create an approval packet:
- task ID;
- target app/site/account;
- exact action;
- exact data being sent or changed;
- recipient, destination, folder, event, or page;
- allowed tools;
- private output path;
- expiration;
- prohibited actions;
- rollback or undo notes if available.

## Operator Rules
1. Confirm the active target.
2. Confirm approval packet matches the UI.
3. Execute only the approved action.
4. Stop if any UI text, recipient, destination, or data differs from approval.
5. Write a private action result.
6. Save sanitized lessons only.

## Default Behavior
Draft first. Act second. Stop at the final button unless the exact final click was approved at action time.

## Final Reporting
After the task, write an action ledger using `outputs/reports/TEMPLATE_ACTION_LEDGER.md`. The user should be able to see every app, account, file, browser action, Computer Use action, external action, approval, and memory update involved.

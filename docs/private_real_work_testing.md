# Private Real Work Testing

Coworx improves by doing real tasks, but real tests must be isolated from the shippable framework.

## Rule
Real workflow testing belongs on a testing branch and in ignored private paths.

Before testing real accounts or apps, create `operator/approvals/TEMPLATE_USER_RESPONSIBILITY_ACK.md` for the task and record the user's exact approved scope.

## Branch
Use a temporary development branch such as:

```bash
git switch -c codex-coworx-real-work-testing
```

Do not merge private artifacts. Merge only sanitized framework improvements.

## Login Flow
Coworx must not retrieve login information from skills, files, browser storage, password managers, Claude logs, or any other source.

The user logs in manually. Coworx may then operate within the approved task boundary.

## Allowed Private Tests
- Summarize a signed-in dashboard.
- Draft an email or message.
- Draft a calendar event.
- Create a local report from user-approved account data.
- Map a workflow for future use.
- Move or organize local files when explicitly approved.
- Create slides, documents, or spreadsheets from user-approved source material.

## Action-Time Approval Required
Coworx must pause before:
- sending or replying to messages;
- inviting people;
- scheduling or editing meetings;
- submitting forms;
- publishing posts;
- deleting or archiving cloud data;
- changing permissions or settings;
- uploading or transmitting sensitive data.

Calendar actions may be reversible, but they still require action-time approval because they can write to cloud accounts, notify people, reserve time, or expose private details.

## Private Storage
Use:
- `.coworx-private/`
- `runs/private/`
- `outputs/private/`
- `memory/private/`
- `operator/screenshots/private/`
- `operator/traces/private/`

Do not store private test artifacts in shippable paths.

## Sanitization Before Ship
Before committing framework improvements:
1. Review `git status --short`.
2. Confirm no ignored private files are being forced into git.
3. Search for names, emails, account IDs, message bodies, meeting details, dashboard values, screenshots, traces, cookies, tokens, and credentials.
4. Convert useful lessons into generic templates or playbooks.
5. Commit only sanitized framework files.

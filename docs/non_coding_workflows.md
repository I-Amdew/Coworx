# Non-Coding Workflows

Coworx is for real work, not only coding. It can coordinate browser work, desktop apps, documents, spreadsheets, presentations, design files, research, issue triage, and media tasks using installed Codex skills and plugins.

## Standard Flow
1. Dispatch the request into one task.
2. Classify risk and action level.
3. Choose installed skills/plugins.
4. Use subagents for parallel planning, research, review, and memory.
5. Use the Operator for any browser or computer action.
6. Draft or execute safe actions according to the action level.
7. Review the result.
8. Write outputs and memory.

## Safe Automatic Work
These actions are auto-safe only for public/no-login pages, local fixtures, repo files, user-provided non-sensitive files, and local drafts:
- reading a page or document;
- drafting an email, issue, report, or form text locally;
- creating local documents, spreadsheets, or presentations;
- taking screenshots of approved local test targets;
- mapping a no-login app or fixture read-only;
- running local tests or validations.

These require explicit approval and private output paths:
- signed-in pages;
- private dashboards;
- screenshots or traces from real apps;
- cloud drafts;
- user-specific app mapping;
- meeting, message, calendar, or account-context artifacts.

## Approval Work
Coworx must ask before it sends, submits, publishes, deletes, purchases, invites, merges, deploys, edits permissions, changes settings, or transmits sensitive data.

## Academic Work
Coworx can map school tools, organize assignments, create study aids, explain concepts, and draft user-reviewed notes. Coworx must not impersonate the user, complete graded work as the user, or submit academic work.

## Real Account Work
If login is required, the user signs in manually. Coworx can then perform approved read-only or draft-only tasks by default. External commitments still require approval.

## Meeting-To-Deliverable Flow
1. Ingest transcript, notes, or recording.
2. Use transcription if audio/video is provided.
3. Extract summary, decisions, action items, owners, and dates.
4. Route output to Documents, Presentations, Spreadsheets, or a message draft.
5. Review for accuracy and private data.
6. Save locally. Stop before sending or scheduling.

## Messaging And Calendar Flow
1. Read approved context.
2. Draft message or event details in `outputs/drafts/`.
3. Ask reviewer to check tone, facts, recipients, dates, and risk.
4. If the user explicitly approves, Operator may place the draft into the target app.
5. Stop again before final send, invite, or schedule unless the exact final action was approved at action time.

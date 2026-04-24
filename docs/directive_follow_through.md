# Directive Follow-Through

Coworx treats a user request as a set of directives that must be carried through to completion, staging, or an explicit block. This is the architectural layer that prevents multi-stage work from stopping after the first visible subtask and makes reliable delivery the default outcome.

## Directive Model

A directive is any requested or clearly implied outcome, not just a single tool action.

Examples:

- "Find the attendees and invite them" contains a discovery directive and a calendar commitment directive.
- "Review the PR, fix issues, and open a follow-up" contains review, implementation, verification, and external-reporting directives.
- "Make the deck from these notes" contains source extraction, structure, artifact creation, render review, and delivery directives.

Each directive needs:

- stable ID;
- source text or inferred source;
- acceptance condition;
- authority source and action level;
- dependencies;
- owner or lane;
- resource locks;
- status;
- evidence;
- next action.

## Directive Ledger

For any non-trivial or multi-stage request, keep a directive ledger in the run log or task graph:

```text
ID | Directive | Acceptance | Authority | Level | Depends on | Owner | Status | Evidence | Next action
```

Statuses:

- `pending`: identified but not started.
- `active`: being worked.
- `waiting`: blocked by dependency, approval, lock, credentials, user input, or external result.
- `completed`: acceptance condition met with evidence.
- `staged`: prepared but not committed because approval or clarity is required.
- `blocked`: cannot proceed under policy, authority, or available context.
- `skipped`: intentionally not done, with rationale.

The ledger is not separate from the task graph. It is the user-intent view of the graph: tasks can be split, staffed, retried, or reordered, but each directive must retain a visible status until final reporting.

## Follow-Through Loop

1. Parse the request into explicit and implied directives.
2. Attach acceptance criteria and authority to each directive.
3. Build the task graph from directive dependencies.
4. Decide which directives the Director must keep local and which should be staffed to subagents or tool lanes.
5. Execute all ready directives in parallel when locks allow.
6. After each result, integrate the evidence and recompute downstream directives instead of closing early.
7. Promote discovered follow-up tasks when they are necessary to satisfy the original directive.
8. Stage grey-area or high-risk directives and continue safe independent work.
9. Verify every completed directive with evidence.
10. Close only when every directive is completed, staged, blocked, skipped, or waiting with a clear reason.

## Delivery Bias

The default bias is to deliver the user's goal, not to describe how it could be delivered.

Coworx should:

- convert "please do X" into execution, verification, and reporting work;
- keep working through obvious downstream stages inside authority;
- use subagents when parallel lanes improve coverage, speed, verification, or follow-through;
- reintegrate subagent results into the directive ledger;
- repair or retry failed safe stages when a reasonable route remains;
- produce approval-ready staged work when commitment is outside authority;
- refuse only the protected or impossible parts, while completing everything else.

Coworx should not stop at a plan, partial finding, draft, or "next steps" list when the user asked for an outcome and the remaining work is inside delegated authority.

## Subagent Use For Delivery

Use subagents when they materially improve true delivery of the directive ledger.

Good reasons to staff a subagent:

- independent research or source collection is needed in parallel;
- the surface area is too large for one linear pass without risking missed requirements;
- implementation can be split into disjoint files, modules, worktrees, or artifacts;
- a browser/API/operator lane can make progress while the Director handles integration;
- review, verification, or evidence collection can run independently;
- a blocker needs focused diagnosis while other directives continue.

Keep work local when:

- the task is an immediate Director-only decision;
- the next step is on the critical path and waiting would slow delivery;
- write ownership would overlap or create resource conflict;
- context is too tightly coupled to delegate clearly;
- the subagent would only duplicate work already assigned.

Every subagent assignment should name the directive ID it advances, owned scope, expected evidence, checkpoint trigger, stop conditions, and integration contract. Returned work is not complete until the Director verifies it and updates the directive ledger.

## Continuation Rules

Coworx should continue without asking when:

- the next stage is the ordinary consequence of the user's directive;
- the target, account, recipient, resource, or file is clear enough;
- the action is inside delegated authority;
- the action is not Level 5/protected;
- the needed resource lock is available;
- evidence can be saved.

Coworx should stage instead of continue when:

- the next stage would send, submit, invite, publish, merge, deploy, delete, buy, book, or change settings without clear delegated authority;
- recipients, targets, timing, or content are uncertain;
- sensitive personal, legal, medical, financial, academic, account-security, or irreversible production risk appears;
- a credential-safe path is unavailable.

Coworx should block when policy forbids the action or the missing information cannot be safely inferred or investigated.

## Close Criteria

A run is not complete until:

- every directive has a terminal or explicitly waiting status;
- completed directives have evidence;
- subagent-owned directives have been inspected and integrated by the Director;
- staged directives have approval-ready descriptions and reply commands;
- blocked or skipped directives explain why;
- downstream tasks discovered during execution are classified;
- no useful ready directive remains unowned;
- no required lock remains held;
- final reporting mirrors the directive ledger.

Do not report only the first artifact when the user asked for a chain of work. If "find, draft, send, and log" was delegated, the closeout must account for all four.

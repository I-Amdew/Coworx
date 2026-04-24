# Director Use

Coworx uses the main Codex thread as the accountable Director for non-trivial work.

The Director owns the outcome. Subagents, browser lanes, API connectors, reviewers, verifiers, and Computer Use operators can own lanes, but they do not own final judgment.

## Operating Model

1. Define the user-visible mission and acceptance criteria.
2. Convert explicit and implied multi-stage instructions into a directive ledger.
3. Build a task/prerequisite graph before staffing.
4. Keep shared contracts, immediate blockers, integration, safety calls, and final reporting local to the Director.
5. Staff every useful independent lane that improves delivery.
6. Continue local critical-path work while lanes run.
7. Checkpoint agents when their output can change the graph, unblock work, or needs steering.
8. Inspect evidence before trusting returned claims.
9. Recompute the graph and directive ledger after each meaningful result.
10. Verify the integrated result before calling the task done.

## Task Graph

Track enough state to avoid losing the mission:

```text
ID | Directive/Task | Class | Type | Depends on | Owner | Scope | Status | Locks | Evidence | Next checkpoint
```

Classes:

- `local-critical`: Director-owned decision, shared contract, integration, or immediate blocker.
- `parallel-ready`: independent work with safe read scope or disjoint write scope.
- `blocked`: waiting on evidence, approval, resource lock, user input, or another task.
- `optional`: useful but not required for completion.

Types:

- `recon`
- `design`
- `implement`
- `review`
- `verify`
- `debug`
- `operate`
- `memory`
- `other`

Recompute the graph whenever an agent returns, a command fails, a lock is acquired or released, a new dependency appears, or acceptance criteria change.

## Staffing Defaults

Director Use should feel materially different from solo work.

Default to staffing when it increases the chance of fully delivering the directive ledger:

- a scope/recon lane when the surface may be larger than obvious;
- separate research lanes for independent sources;
- implementation lanes only with disjoint write ownership;
- browser lanes for unrelated pages, tabs, sessions, dashboards, or tests;
- reviewers and verifiers after integration;
- evidence collectors for screenshots, traces, links, IDs, and command output;
- memory writers for safe reusable procedures after the task is done.

Keep work local for immediate Director-only decisions, shared contracts, integration, critical-path steps that would be slowed by delegation, or tightly coupled context. Do not spawn agents for duplicate work, overlapping write scopes, or work that would fight over a locked resource.

## Agent Assignments

Every lane needs:

- directive ID it advances;
- task ID and mission;
- dependencies it may assume;
- owned scope and out-of-scope boundaries;
- resource locks required or forbidden;
- expected evidence;
- checkpoint trigger;
- stop conditions;
- instruction not to revert or overwrite user, Director, or sibling edits;
- return envelope.

Implementation agents need disjoint write ownership. If two lanes need the same file, cloud doc, issue, form, event, draft, deployment target, or app state, serialize or route one lane through review/recon.

## Return Envelope

Agents should return:

- status;
- owned scope used;
- files/resources inspected;
- files/resources changed;
- commands/checks run;
- evidence;
- completed tasks;
- new tasks discovered;
- blockers;
- ownership conflicts;
- residual risks;
- recommended next action;
- whether the agent should continue, be redirected, or close.

## Checkpoints

When a lane returns, the Director immediately decides:

- integrate;
- verify;
- send a follow-up;
- narrow scope;
- expand same-lane work;
- split a sibling task;
- block;
- discard;
- close with rationale.

Do not leave returned agents merely "noted" when their context can cheaply verify, refine, or extend their lane.

## Delivery Closeout

Before final reporting, reconcile the directive ledger:

- every explicit or implied directive is completed, staged, blocked, skipped, or waiting with a reason;
- all subagent results have been inspected and integrated or rejected with rationale;
- all completed items have evidence;
- all staged items have concrete approval commands;
- all discovered downstream tasks have been classified;
- no ready directive remains unowned.

## Verification

Passing agent statements are not evidence by themselves.

Prefer:

- executable checks;
- focused diffs;
- browser or screenshot checks for UI;
- rendered artifact inspection for documents, slides, PDFs, and spreadsheets;
- action ledgers for external work;
- link, event, draft, issue, PR, or task IDs;
- reviewer findings with exact file/line references.

Before the final report, confirm no useful running agent, unowned ready task, unresolved blocking decision, unreleased lock, or unverified acceptance criterion remains. If any remain, resolve them or report the residual risk plainly.

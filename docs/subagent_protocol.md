# Subagent Protocol

Subagents are active Coworx teammates used to improve delivery of the directive ledger. The Director owns the task, integration, safety calls, and final result.

## When To Use Subagents

Use a subagent when it can materially improve true delivery:

- independent research, source gathering, or codebase exploration can run in parallel;
- large downloaded or exported artifacts can be split into independent local shards;
- the implementation can be split into disjoint owned files, modules, artifacts, or worktrees;
- review, verification, evidence collection, or diagnosis can proceed while the Director continues critical-path work;
- a browser/API/connector lane can operate under a clear lease and lock;
- a large surface area creates meaningful risk of missed requirements without parallel coverage.

For broad, multi-stage, or uncertain work, subagents are the default execution model. Build the task graph first, then staff every ready independent lane that has a safe read scope or disjoint write scope. A single scout is not enough when the graph also has independent test discovery, source research, browser/API work, review, verification, evidence collection, or bounded implementation ready to run.

This applies to every model Coworx uses. If a Director model tends to work serially, the first-wave graph must make delegation explicit before the first solo work unit: which lanes are delegated, which are Director-owned, which are lock-waiting, and which are blocked. A non-trivial task with multiple independent read or verification units should not run as a single main-thread lane merely because the current model is fast.

Keep work in the main Director thread when:

- the next step is an immediate blocker or critical-path decision;
- delegation would duplicate work already in progress;
- write ownership or external resource locks overlap;
- the context is too coupled to assign safely;
- the subagent cannot return useful evidence.

Ready work should not remain idle just because another subagent is running. Leave a lane unstaffed only when it is Director-owned, intentionally deferred with rationale, waiting on a resource lock, blocked by safety/authority, or duplicative of work already assigned.

## Director-Owned Versus Delegated

Delegate independent research, source gathering, test discovery, disjoint implementation, review, verification, evidence collection, browser/API lane planning, extraction parsing, memory proposals, and local shard processing.

Keep local authority classification, target/account approval, protected-action decisions, commit locks, shared architecture contracts, conflicting write ownership, final integration, and user-facing closeout.

## Allowed Work

- read-only research;
- test discovery;
- risk mapping;
- plan drafting;
- bounded local file edits with assigned ownership;
- browser/API/connector operation when assigned a lane lease;
- review and verification;
- evidence collection;
- memory proposals.
- read-only shard processing after an Operator has downloaded or exported a source artifact.

## Not Allowed

- credential handling;
- overlapping writes with another owner;
- broad unsupervised rewrites;
- submitting, publishing, inviting, merging, deploying, deleting, or sending without delegated authority or explicit approval;
- Level 5/protected actions;
- Computer Use without a target-level lock.

## Assignment Requirements

Each subagent assignment should include:

- directive ID advanced by the assignment;
- task ID;
- mission;
- owned scope;
- out-of-scope boundaries;
- dependencies;
- resource locks;
- expected evidence;
- checkpoint trigger;
- stop conditions;
- return envelope;
- integration expectation;
- instruction not to revert or overwrite user, Director, or sibling edits.

## Return Format

Subagents should return:

- status;
- owned scope used;
- files/resources inspected;
- files/resources changed;
- commands/checks run;
- findings with evidence;
- completed tasks;
- new tasks discovered;
- newly blocked or unblocked tasks;
- dependency changes;
- parallel-ready sibling work;
- blockers;
- ownership conflicts;
- residual risks;
- recommended next action;
- whether the directive is complete, should continue, should be redirected, or should be closed;
- close rationale when the lane is terminal.

Subagent claims are not completion by themselves. The Director must inspect returned evidence, update the directive ledger, and either integrate, redirect, verify, or close the lane.

Returned subagents should receive an explicit checkpoint decision. Reuse the same agent for focused follow-up, same-scope verification, or narrowed investigation when its context is still fresh. Spawn a fresh agent for unrelated sibling work, stale context, or isolation. Close an agent only after its result is integrated, rejected, obsolete, or no longer useful, and record the rationale when the mission is non-trivial.

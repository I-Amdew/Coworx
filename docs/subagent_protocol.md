# Subagent Protocol

Subagents are active Coworx teammates used to improve delivery of the directive ledger. The Director owns the task, integration, safety calls, and final result.

## When To Use Subagents

Use a subagent when it can materially improve true delivery:

- independent research, source gathering, or codebase exploration can run in parallel;
- the implementation can be split into disjoint owned files, modules, artifacts, or worktrees;
- review, verification, evidence collection, or diagnosis can proceed while the Director continues critical-path work;
- a browser/API/connector lane can operate under a clear lease and lock;
- a large surface area creates meaningful risk of missed requirements without parallel coverage.

Keep work in the main Director thread when:

- the next step is an immediate blocker or critical-path decision;
- delegation would duplicate work already in progress;
- write ownership or external resource locks overlap;
- the context is too coupled to assign safely;
- the subagent cannot return useful evidence.

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
- new tasks discovered;
- blockers;
- ownership conflicts;
- residual risks;
- recommended next action;
- whether the directive is complete, should continue, should be redirected, or should be closed.

Subagent claims are not completion by themselves. The Director must inspect returned evidence, update the directive ledger, and either integrate, redirect, verify, or close the lane.

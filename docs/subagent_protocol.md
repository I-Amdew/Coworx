# Subagent Protocol

Subagents are active Coworx teammates. The Director owns the task and final result.

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

- task ID;
- mission;
- owned scope;
- out-of-scope boundaries;
- dependencies;
- resource locks;
- expected evidence;
- checkpoint trigger;
- stop conditions;
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
- recommended next action.

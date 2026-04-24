# Subagent Protocol

Subagents are specialized helpers. The Coordinator owns the task and final result.

## Allowed Work
- read-only research;
- test discovery;
- risk mapping;
- plan drafting;
- bounded local file edits when assigned;
- review and verification;
- memory proposals.

## Not Allowed
- browser or desktop control unless acting as the approved Operator;
- credential handling;
- broad unsupervised rewrites;
- overlapping edits with another owner;
- submitting or publishing external actions.

## Return Format
Subagents should return:
- status;
- files or areas inspected;
- findings with evidence;
- changed files, if any;
- tests or checks run;
- risks and next actions.

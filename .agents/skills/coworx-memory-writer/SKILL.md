# coworx-memory-writer

## Description
Updates Coworx memory maps, workflow maps, lessons, failures, selectors, and decisions.

## Role
Memory Writer.

## When To Use
Use at task closure or when a durable safe lesson was learned.

## Input Format
- task result;
- evidence;
- proposed memory category;
- source files or logs.

## Output Format
- memory file path;
- safe summary;
- source evidence;
- excluded sensitive details.

## Rules
- Store procedures, not secrets.
- Keep memory concise and reusable.
- Do not store credentials, cookies, tokens, 2FA codes, private keys, credit cards, or private personal secrets.
- Mark uncertain memory as proposed.

## Failure Or Blocked Behavior
If memory could reveal secrets or private data, do not write it. Record a safe omission note in the final report.

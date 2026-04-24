# Coworx Task

## Goal
Clarify that Coworx can use already signed-in sessions while preserving the hard boundary against handling login secrets.

## Requester
User

## Created
2026-04-24 14:27:54 America/Chicago

## Action Level
Level 2: reversible local documentation edit.

## Allowed Tools
repo/code mode, local file edits, read-only inspection.

## Disallowed Tools
Requesting, storing, revealing, or entering passwords, 2FA codes, recovery codes, cookies, tokens, or other login secrets.

## Acceptance Criteria
- Accounts and login guidance permits use of already signed-in browser or app sessions.
- Fresh login, reauthentication, 2FA, permission prompts, and secret handling remain stop conditions.
- External commitment actions require delegated authority or explicit approval, and Level 5/protected actions still stage or block.

## Inputs
User request to remove restriction preventing use of login information.

## Stop Conditions
- Any request to store or handle raw login secrets.
- Any request to remove delegated-authority, explicit-approval, or protected-action requirements for external commitments.

## Required Outputs
- run log;
- final report;
- reviewer verdict;
- memory updates or proposals.

# Signed-In Workflow Test Protocol

Coworx should be able to do real work in signed-in apps, but login and final external actions stay under user control.

## Goal
Test real account workflows such as:
- checking a calendar;
- summarizing upcoming events;
- drafting a message or follow-up;
- checking task dashboards;
- mapping an account workflow;
- creating a local document, slide outline, or spreadsheet from approved account context.

## Non-Negotiable Login Rule
Coworx must not retrieve login information from:
- Claude skills;
- Codex skills;
- password managers;
- browser storage;
- cookies;
- tokens;
- old logs;
- screenshots;
- copied notes.

The user signs in manually.

## Test Setup
1. Create or switch to a testing branch.
2. Choose the exact app or site.
3. User manually signs in.
4. Create a task from `queue/todo/TEMPLATE_REAL_ACCOUNT_TEST.md`.
5. Set storage to ignored private paths.
6. Create an Operator request with privacy and approval fields filled in.
7. Run only the approved read-only or draft-only workflow.
8. Write private results.
9. Convert any useful lesson into a sanitized template before committing.

## Example: Calendar Read-Only Test
Allowed:
- inspect the calendar page after manual login;
- summarize upcoming events;
- draft a planning note locally;
- map where the week/month/day views live.

Not allowed without action-time approval:
- create, edit, delete, or move an event;
- invite attendees;
- send reminders;
- change calendar settings;
- expose private event details in shippable memory.

## Example: School Or District Portal Test
Allowed:
- manually signed-in read-only mapping;
- summarize visible deadlines or announcements into private output;
- draft a study or work plan locally;
- save sanitized workflow notes.

Not allowed:
- completing graded work as the user;
- submitting assignments;
- handling credentials or 2FA;
- changing account/security/payment settings;
- storing private grades, messages, or personal details in shippable memory.

## Output Rules
Private outputs go under:
- `.coworx-private/`
- `runs/private/`
- `outputs/private/`
- `memory/private/`
- `operator/screenshots/private/`
- `operator/traces/private/`

Shippable outputs can include only sanitized templates and generic lessons.

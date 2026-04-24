# Signed-In Calendar Read-Only Playbook

## Purpose
Safely inspect a manually signed-in calendar and create private local planning outputs.

## Default Action Level
0 for reading, 1 for drafts, 2 for private local files. Event creation, edits, invitations, reminders, and scheduling are Level 4.

## Preconditions
- User manually signs in.
- Exact account/app is approved.
- Private output path is set.
- Operator request has privacy and approval fields.

## Allowed Steps
1. Confirm the target account/app.
2. Inspect only the approved calendar view.
3. Summarize upcoming events into private output.
4. Draft a local plan or follow-up.
5. Save sanitized navigation notes only if useful.

## Stop Conditions
- Login or 2FA required.
- Event details include sensitive personal content not approved for capture.
- Any create, edit, delete, invite, schedule, send, or settings action is requested without action-time approval.

## Memory Rule
Real event titles, attendees, locations, links, and notes stay private. Shippable memory may only say how to navigate generic calendar views.

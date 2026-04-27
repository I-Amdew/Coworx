# Real Account Drill Sanitized Report

## Scope

Private read-only school workflow drill using the user's existing signed-in browser session.

## Result

Coworx reached the signed-in LMS through Computer Use and verified that a real school rundown is possible without asking the user to manually drive the browser.

## Surfaces Checked

- signed-in account home;
- course menu;
- todo and upcoming assignments area;
- upcoming events area;
- recent updates and announcements;
- calendar view.

## Product Lessons

- A real rundown cannot rely on one dashboard page.
- The course list, todo panel, upcoming events, announcements, and calendar may each hold different parts of the answer.
- The app-reported "today" date can disagree with the user's current-task date, so Coworx must record both as explicit dates.
- Stale overdue work must be filtered separately from current and upcoming work.
- Computer Use is the right route when the work depends on the user's real browser profile and signed-in LMS session.

## Privacy Handling

No credentials were requested, captured, printed, or stored. No screenshots were saved to the repo. This sanitized report does not include personal course names, assignment titles, messages, account identifiers, or private links.

## Shippable Changes Triggered

- Added read-only rundown flow guidance to signed-in account operations.
- Added real drill acceptance criteria that reject toy-only proofs.
- Added rundown surface checklist to the signed-in read-only operator request template.
- Added account map fields for multi-surface rundown workflows.
- Added a regression fixture that rejects single-page signed-in summaries.

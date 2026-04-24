# Calendar Policy

Calendar work can be reversible, but it is still an external action because it can write to cloud accounts, notify people, reserve time, or expose private details.

## Allowed Automatically
- Read a calendar only after the user approves the target and manually signs in.
- Summarize events into private output.
- Draft a proposed event locally.
- Draft a scheduling message locally.

## Approval Required
Require exact action-time approval before:
- creating an event;
- editing an event;
- deleting or canceling an event;
- inviting attendees;
- changing reminders;
- changing visibility;
- sending scheduling messages.

## Approval Packet Must Include
- calendar account/app;
- event title;
- date and time;
- attendees;
- location or meeting link;
- notes/description to write;
- reminder settings;
- visibility;
- whether notifications will be sent;
- whether the action is one-time.

## Stop Conditions
- wrong account or calendar;
- ambiguous time zone;
- unclear attendees;
- sensitive event details not approved for capture;
- UI indicates attendees will be notified but approval did not include notification;
- create/edit/delete boundary without approval.

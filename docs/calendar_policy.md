# Calendar Policy

Calendar work is external account work because it can write to cloud accounts, notify people, reserve time, and expose private details.

## Allowed With Delegated Authority

Coworx may:

- read approved calendars;
- summarize events into private output;
- draft proposed events locally;
- create or edit events when the user requested scheduling or a grant covers it;
- invite named or clearly derived attendees when the user requested invitations;
- copy attendees from a specified source meeting when requested;
- add conferencing links supported by the calendar account;
- send calendar updates when scheduling was delegated.

## Stage For Approval

Stage when:

- attendees are inferred but uncertain;
- the calendar/account is unclear;
- timezone is ambiguous;
- event details contain sensitive client, legal, medical, financial, employment, identity, or personal data;
- the event implies a contract, payment, medical/legal appointment, employment decision, or other protected commitment;
- Coworx would modify or delete events not created by Coworx and the authority is unclear.

## Always Block Or Manual

- payment or booking completion;
- account security;
- password/recovery changes;
- identity verification;
- bulk export outside approved scope;
- medical/legal/financial decisions.

## Calendar Action Packet

Record:

- calendar account/app;
- authority source;
- event title;
- date, time, and timezone;
- attendees and source of attendee list;
- location or meeting link;
- notes/description to write;
- reminder settings;
- visibility;
- whether notifications will be sent;
- whether the action is one-time;
- event ID/link after execution.

## Stop Conditions

- wrong account or calendar;
- ambiguous timezone;
- unclear attendees;
- sensitive event details not approved for capture;
- UI indicates guests will be notified but authority does not cover notification;
- calendar event target is locked by another write/commit lane.

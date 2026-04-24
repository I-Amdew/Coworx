# Messaging And Calendar Draft-First Playbook

## Purpose
Prepare messages and calendar events safely before external action.

## Default Action Level
1 for drafting. Level 3 for creating external drafts. Level 4 for sending, inviting, or scheduling.

## Steps
1. Gather approved context.
2. Draft locally in `outputs/drafts/`.
3. Review recipients, dates, tone, and factual claims.
4. Ask the user for approval before using a browser or app to place the draft.
5. Ask again at the final send, invite, or schedule boundary unless the exact final action was already approved.

## Stop Conditions
- Recipient or calendar target is ambiguous.
- Message contains sensitive data.
- App asks for login, credentials, 2FA, security, or payment.
- The user has not approved the exact external action.

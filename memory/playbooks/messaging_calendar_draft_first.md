# Messaging And Calendar Draft-First Playbook

## Purpose
Prepare messages and calendar events safely before external action.

## Default Action Level
1 for drafting. Level 3 for creating external drafts. Level 4 for sending, inviting, or scheduling.

## Steps
1. Gather approved context.
2. Draft locally in `outputs/drafts/`.
3. Review recipients, dates, tone, and factual claims.
4. Use delegated authority or explicit approval before placing drafts or taking non-high-risk Level 3/4 actions in an external app.
5. Stage final send, invite, or schedule if recipients, target, timing, content, or authority are unclear.

## Stop Conditions
- Recipient or calendar target is ambiguous.
- Message contains sensitive data.
- App asks for login, credentials, 2FA, security, or payment.
- The external action is outside delegated authority or explicit approval.
- The action is Level 5/protected.

# Computer Use Queue Request

## Request ID

## Status
pending / reserved / active / released / expired / blocked

## Owner

## Task

## Not Before

## Duration

## Allowed Target

## Target-Level Locks
- App/window:
- Browser profile/account workflow:
- Clipboard/file picker/simulator/active focus:

## Exclusivity
- One agent per app/window/profile/account target: yes
- Same-app lane behavior: queue or wait
- Usage claim requires queue/lease evidence: yes

## Action Level

## Authority Source

## Active Directive File

## Private Output Path

## Stop Conditions
- wrong app, window, profile, account, or domain;
- credential/MFA/security prompt outside approved handoff;
- protected or high-risk final action;
- another active lease appears;
- lease expires before work is complete.

## Lease Commands
```bash
node scripts/coworx_computer_use_queue.mjs acquire --request-id REQUEST_ID
node scripts/coworx_computer_use_queue.mjs renew --lease-id LEASE_ID --duration-minutes 10
node scripts/coworx_computer_use_queue.mjs release --lease-id LEASE_ID
```

## Release Plan
Release immediately after GUI work or extraction is verified. Continue parsing, drafting, summarizing, testing, and review as local work without holding the Computer Use lease.

## Release Evidence
- Lease ID:
- Released at:
- Queue status path:
- Action result path:
- Final active lease present: no

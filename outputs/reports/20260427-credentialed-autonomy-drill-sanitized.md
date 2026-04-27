# Credentialed Autonomy Drill Sanitized Report

## Scope

Private Chrome based school workflow drill using the user's existing approved local setup.

## Result

Coworx now has a concrete gate for credentialed autonomous work. When the target account, credential source reference, approved domain, action class, and autonomy grant line up, reversible account actions can proceed. Final external commitments without the exact grant or commit lock stage at the review point. Protected actions still stage or block.

## Chrome Evidence

- Computer Use reached the signed in Schoology calendar in Google Chrome.
- The Chrome route is the preferred lane for this workflow because it uses the user's real browser profile and signed in session.
- Safari is only a fallback for this route.
- No secret values were copied into Coworx memory or shippable files.
- Private route memory and credential packets are under `.coworx-private/` and are ignored by git.

## Gate Evidence

- `scripts/coworx_autonomous_action_gate.mjs` returned `proceed` for the Chrome Schoology calendar inspection packet.
- `scripts/coworx_autonomous_action_gate.mjs` returned `stage` for the APUSH final submission boundary packet because academic submission is protected.
- `git check-ignore` confirmed the private Schoology route, credential packet, and local secret template are ignored.

## Product Lessons

- Browser Use is not enough for long signed in workflows. Chrome plus Computer Use needs to be a first class route.
- Credentialed login should use source references, existing sessions, keychain, vault, password manager, or ignored private files. It should not copy secrets into project memory.
- Autonomy grants need exact action classes. "Logged in" is not the same as "allowed to send or submit."
- Reversible Level 3 actions should proceed when the packet is clean.
- Level 4 final commitments should require a commit lock and exact delegated grant.
- Protected academic final actions should be staged even if the user asked for broad autonomy.

## Verification

- `node scripts/coworx_autonomous_action_gate.mjs demo-test`: passed
- `node scripts/coworx_account_free_regression_tests.mjs`: passed
- `node scripts/coworx_ready_check.mjs`: passed
- `node scripts/coworx_credential_resolver.mjs demo-test`: passed
- `node scripts/coworx_local_secret_store.mjs demo-test`: passed
- `git diff --check`: passed

## Privacy Handling

This report contains no passwords, MFA values, recovery codes, cookies, tokens, private screenshots, submission content, personal assignment text, or account identifiers beyond non-secret route labels.

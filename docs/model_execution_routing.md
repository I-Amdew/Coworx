# Model Execution Routing

Every model Coworx uses must route to execution, not just advice. Fast models such as GPT-5.3 Codex Spark make the failure more visible, but the same rules apply to all active Director, operator, reviewer, and worker models: do not degrade into single-lane, plan-only, or tool-avoidant behavior. Use this routing layer before executing non-trivial work.

## Model Operating Contract

Any model may act as Director only if it still follows the Coworx contract:

1. create or update the directive ledger;
2. build a task graph;
3. staff a full first wave of independent non-conflicting lanes;
4. keep critical-path integration, safety calls, and shared contracts local;
5. use exact installed tools, plugins, scripts, and subagents instead of returning instructions;
6. verify evidence before closeout.

If the active model cannot reliably perform a lane, it should route that lane to a capable subagent or operator instead of dropping the lane or giving the user manual steps.

## Full First Wave

For broad, multi-stage, uncertain, or slow work, the Director model must enumerate every ready lane before starting solo execution:

- Director-owned: immediate blockers, shared design decisions, safety classification, directive ledger updates, integration, final report.
- Subagent lanes: independent source reading, codebase exploration, disjoint file edits, test discovery, review, verification, evidence collection, memory proposals, and local shard processing.
- Browser/API/connector lanes: independent read or write targets with resource locks.
- Computer Use lane: exactly one locked GUI target unless isolation is explicitly proven.

The first wave is full only when each ready lane is staffed, Director-owned, intentionally deferred with rationale, waiting on a lock, blocked by safety/authority, or duplicative. The Director should not wait for one scout, one search, or one local check when unrelated lanes can run now.

## Computer Use With Any Model

Every model must treat Computer Use as an explicit operator lane, not as ordinary prose reasoning. Before a GUI action, the lane needs:

- active directive file and directive IDs;
- target app, browser profile, account workflow, and allowed actions;
- required target locks and the Computer Use queue lease when another Coworx or Codex instance may be active;
- exact tool surface discovery if the Computer Use namespace is not visible;
- stop conditions and evidence path.

If the Computer Use tools are visible, the safe sequence is:

1. acquire or reserve the lease with `scripts/coworx_computer_use_queue.mjs` when needed;
2. use `mcp__computer_use__.get_app_state` once for the target app before interacting in the turn;
3. use element-index actions when possible, coordinate actions only when necessary;
4. type only non-secret literal text unless an approved local credential executor is being used;
5. verify the visible result;
6. release the lease immediately when GUI work or extraction is done.

For standby dispatch channels that are GUI-only, such as Messages/iMessage, the Computer Use lane is not optional or delayed. Once setup is complete, queue or acquire the lane at standby start or the first due cycle. Do not claim the channel was checked without the queue/lease id, app-state or action evidence, approved-thread verification, and release or wait evidence.

If the active model cannot find or correctly use Computer Use tools, it must delegate the Computer Use lane to a capable operator model or ask the user to switch the active Director model for that lane. It should continue safe non-GUI lanes in parallel while that GUI lane is blocked or delegated. It should not substitute Browser Use, generic web browsing, `open`, or shell commands for a workflow that specifically needs a real browser profile, native app, file picker, password-manager prompt, or visible desktop state.

No model may treat raw chat as the runtime credential source. If a user pastes a password or MFA answer into chat and explicitly authorizes use for a clear target, the Director should transfer it into approved local credential storage/reference, generate a continuation prompt, and stop or pause the current credentialed task. The fresh chat resumes from the non-secret credential reference. Computer Use should never type the raw chat value directly into the browser.

No model may claim Coworx lacks credential memory without checking the shipped local capability. Use `node scripts/coworx_local_secret_store.mjs status` or the local credential persistence docs. If the user explicitly asks to use Coworx password memory, route to Coworx local credential memory and reference packets; do not silently use Chrome's password manager as a substitute.

## Subagent Delegation With Any Model

Every Director should be biased toward subagents for throughput when session policy allows delegation. A Director that keeps all recon, implementation, review, and verification in the main thread is under-staffing the task unless the work is tiny or tightly coupled.

Every subagent assignment should include:

- directive ID and task ID;
- owned scope and forbidden overlap;
- allowed file paths or resources;
- locks required or forbidden;
- expected evidence;
- checkpoint trigger;
- stop conditions;
- explicit instruction not to revert or overwrite sibling or user edits.

Use a stronger reviewer or verifier lane when the active model produced a high-impact integrated change, handled many files, or routed around a failed capability.

## Credential And Autofill Reality

Browser autofill, password managers, OS keychain prompts, and MFA managers are opportunistic, not guaranteed unattended login routes in Coworx. A Director must not repeatedly try a broken autofill path.

Credential fallback order for an approved workflow:

1. existing signed-in session;
2. connector/API/OAuth session;
3. approved browser profile with autofill or password-manager prompt when it works without exposing secrets;
4. approved local-only credential source such as `.coworx-private/secrets/*.local.env`, environment variables, OS keychain label, password-manager label, vault handle, or local skill reference;
5. user-present manual secure entry;
6. staged blocker with the exact missing setup.

After one failed or unavailable autofill/password-manager/MFA attempt, record a private capability lesson and route to a local-only source or manual secure-entry checkpoint. Do not ask the user to paste secrets into chat, do not send secret values to subagents, and do not store secrets in shippable memory.

If the user wants Coworx to remember a login route, the completed setup must produce a non-secret credential packet/reference under ignored private storage, an approved keychain/password-manager/vault label, connector auth, local skill reference, ignored secret file path, or environment variable name. A model merely remembering a chat-pasted value is a failure, not persistence.

If the user says "remember it," "put it in the password manager you use," or "use Coworx's built-in password saving system," treat that as a local credential persistence directive for the clear app/site/account workflow. Confirm or infer the target from the active directive, prefer hidden local capture, and if the credential was already pasted into chat with explicit authorization, use approved chat-intake transfer rather than direct Computer Use typing. The result must include a non-secret reference packet and a continuation prompt for a fresh chat.

## Failure Handling

The active model must return a concrete blocked or staged state when it cannot continue:

- missing Computer Use tool surface;
- Computer Use permission prompt requiring local user approval;
- password-manager unlock or MFA that is not covered by approved local handoff;
- credential was pasted in chat and no secure local intake/reference/continuation prompt exists;
- wrong domain/app/account;
- overlapping resource lock;
- protected final action.

The blocked result should name the missing capability, the safe fallback, the directive ID, and which independent lanes were still completed.

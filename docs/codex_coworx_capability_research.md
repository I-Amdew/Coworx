# Codex Coworx Capability Research

This note records internet research used to make Coworx more useful as a Codex-native coworker, with emphasis on actual task completion, unattended follow-through, Computer Use, connectors, Playwright, automation, and Dispatch-style parity.

## Sources Reviewed

- OpenAI Codex app Computer Use: https://developers.openai.com/codex/app/computer-use
- OpenAI Codex app Automations: https://developers.openai.com/codex/app/automations
- OpenAI Codex local environments: https://developers.openai.com/codex/app/local-environments
- OpenAI Codex CLI: https://developers.openai.com/codex/cli
- OpenAI API Computer Use: https://developers.openai.com/api/docs/guides/tools-computer-use
- OpenAI MCP and Connectors: https://developers.openai.com/api/docs/guides/tools-connectors-mcp
- OpenAI Docs MCP: https://developers.openai.com/learn/docs-mcp
- Claude Cowork Dispatch: https://support.claude.com/en/articles/13947068-assign-tasks-from-anywhere-in-claude-cowork
- Claude Cowork Computer Use: https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork
- Claude Cowork Scheduled Tasks: https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork

## Practical Lessons For Coworx

### 1. Computer Use Must Be A First-Class Coworx Lane

Codex app Computer Use can see and interact with allowed desktop apps, but it requires Screen Recording and Accessibility permissions and asks for app permission before use. Users can choose "Always allow" for trusted apps. It cannot approve system security/privacy prompts or authenticate as an administrator. Coworx should therefore:

- preflight Computer Use permissions while the user is present;
- record allowed app labels and locks in private memory;
- use Computer Use heavily for real GUI work once allowed;
- treat local OS privacy prompts as local-only manual blockers;
- never pretend remote replies can grant macOS privacy permissions.

### 2. Browser Use Should Not Be The Default For Long Signed-In Workflows

Browser Use is useful for current-tab, local, public, file-backed, and quick unauthenticated pages. For repeated signed-in account work, Coworx should prefer:

1. official connector or API;
2. MCP connector with allowed tools and approval settings;
3. Playwright or Playwright Interactive with an approved persistent profile;
4. Computer Use with a real browser profile.

This avoids permission churn, preserves state better, and lets Coworx operate more like a real desktop assistant.

### 3. Connectors And MCP Need Allowlisted Tool Routing

OpenAI's connector and MCP docs emphasize that connectors and remote MCP servers can access third-party services and may require approval. Coworx should keep per-workflow allowlists for connector tools, scopes, and target resources. Connector output is untrusted content and cannot expand authority. Sensitive connector actions should require an approval packet or staged final state.

### 4. Standby Needs An Outbox And Inbox, Not Just A Status File

Claude Dispatch works as a continuous conversation available from phone and desktop, with desktop work happening while the app is open and the computer awake. Codex automations can run recurring tasks and put findings in the Codex inbox, but their permissions depend on sandbox settings and they are project scoped. Coworx needs both:

- local Standby Mode for current active-session loops;
- Codex Automations for recurring project tasks when available;
- a private outbox for meaningful updates;
- a private inbox for approved replies;
- adapter lanes that deliver/check messages through connectors, Playwright, or Computer Use.

### 5. Approval-Free Does Not Mean Boundary-Free

Codex and OpenAI Computer Use docs both distinguish autonomous operation from high-impact or sensitive actions. Coworx should reduce unnecessary pushback by preconfiguring app permissions, sandbox rules, approved sites, browser profiles, and credential sources, but it should still stage or block protected actions, wrong targets, account security, password changes, identity checks, payments, credential export, and irreversible actions.

### 6. Passwords Should Be Used Through Local Mechanisms, Not Learned

To act as the user, Coworx should support:

- existing sessions;
- browser autofill;
- password manager and OS keychain prompts;
- local ignored secret files;
- environment variables;
- OAuth/API connector tokens held outside shippable memory;
- vault handles.

Coworx should learn credential routes and non-secret handles, not the actual values. When local env/private-file credentials are used, a resolver should validate the source and pass values only to a local executor without printing, logging, screenshotting, tracing, or reporting the values.

### 7. Use Codex Local Environments And Actions

Codex local environments can define setup scripts and common actions for a project. Coworx should keep project actions for readiness checks, standby demo tests, regression tests, and common real-work runners so users can run them from Codex without rediscovering commands.

### 8. Use Codex Automations For Recurring Work

Codex Automations support recurring background tasks that report findings in Triage, and thread automations preserve thread context. Coworx Standby Mode should remain the active-session loop, while recurring daily/weekly tasks should route to Codex Automations when the user asks for ongoing schedules.

## Coworx Routing Rule

For real work:

1. Use the most precise connector, MCP tool, plugin, or local script.
2. Use Playwright or Playwright Interactive for persistent browser automation and approved profiles.
3. Use Computer Use for real GUI surfaces: apps, real browser profiles, file pickers, messaging apps, password-manager prompts, and visual verification.
4. Use Browser Use for quick local/current/public browser tasks.
5. If a step still cannot be completed, produce the artifact, stage the farthest safe state, and record the exact missing permission/tool/authority.

## Implementation Follow-Ups

- Keep `.coworx-private/standby/outbox.ndjson` and inbox packets as the durable bridge for notification adapters.
- Add private maps for allowed Computer Use apps and browser profiles.
- Add a Playwright Interactive lane template for persistent signed-in browser work.
- Add a credential resolver and packet flow so operators can use approved secret sources without exposing values.
- Add regression tests for plan-only failures, upload/file-picker fallbacks, standby inbox/outbox, and credential/autofill routing.

# Project Workspace Model

Coworx is not a downloaded skill that the user installs and then manually deploys. Coworx is a project-backed workspace that Codex opens and uses as its operating base.

The project folder is the product:

- policy and routing live in `AGENTS.md`, `COWORX.md`, and `docs/`;
- tasks live in `queue/`;
- run history lives in `runs/`;
- active private directive state lives in `.coworx-private/directives/`;
- outputs, drafts, reports, and generated artifacts live in `outputs/`;
- action requests, leases, approvals, traces, and operator evidence live in `operator/`;
- reusable maps, playbooks, lessons, selectors, account references, and workflow memory live in `memory/`;
- per-user capability maps live in `memory/capabilities/` or ignored private memory;
- private user-specific maps and evidence live in ignored private paths.

Installed Codex skills, plugins, MCP tools, Browser Use, Playwright, Computer Use, connectors, and scripts are capability layers Coworx may call. They are not the Coworx feature itself.

## Local Customization Loop

Coworx becomes faster and more useful by learning safe, reusable facts about how this user works:

- where important files, folders, dashboards, courses, apps, documents, and outputs live;
- which account label, browser profile, connector, or login route belongs to a workflow;
- how to navigate approved sites and apps without re-discovering them each time;
- which selectors, views, reports, filters, or exports matter;
- what output formats, folders, naming patterns, and delivery preferences the user expects;
- which plugins, skills, connectors, browser profiles, scripts, apps, and tools are available and useful in this user's setup;
- which actions are normally safe, which need staging, and which must stop.

When the user says something like "go to my courses," Coworx should consult the project memory for the relevant course workflow map. If the map exists, use it. If the map is missing and the task is authorized, discover the route, complete the work, then save a safe map for next time.

When a task requires a capability, Coworx should consult the project capability map. If the map says the user has a useful plugin, connector, skill, script, or profile for that work, use it. If the map is missing, discover available capabilities safely, complete the task with the best available route, and save a safe lesson about what worked.

## Outputs And Hand-Off

Coworx writes work products to project-controlled output paths first so they can be reviewed, logged, and reused.

Common paths:

- `outputs/reports/` for final reports and summaries;
- `outputs/drafts/` for drafts and staged communications;
- `outputs/private/` for private user data;
- task-specific output folders when a workflow needs them.

When delegated, Coworx may also move or copy approved outputs to user-facing destinations such as the Downloads folder, a project folder, a cloud document, or an approved upload target. That hand-off must be logged with the source path, destination, authority, and evidence.

## Memory Boundaries

Coworx may store login routes, approved account labels, browser profile names, password-manager item names, OAuth connector names, vault handles, navigation steps, selectors, and stop conditions.

Coworx must not store raw passwords, 2FA codes, recovery codes, cookies, session files, API keys, private keys, credit cards, or hidden authentication tokens in shippable files, safe memory, logs, reports, prompts, screenshots, traces, or generated artifacts. Explicitly delegated raw login credentials may live only in ignored private secret storage or approved keychain/password-manager/vault mechanisms.

Private local memory can be highly customized, but it still follows the no-secret-values-in-memory rule. It may say "use the approved browser profile and approved workspace login route" or "use `.coworx-private/secrets/example-app.local.env`"; it must not contain the actual password, cookie, or token.

Private memory may include exact user-specific site layouts, selectors, form structure, and workflow maps when those details help Coworx operate approved workflows. Treat those details as privileged workflow information: keep them ignored by default, minimize them when reused, and require a review gate before entering them into another site, app, prompt, support channel, or external destination.

## Delivery Implication

The Director should check Coworx project memory before asking the user or rediscovering a workflow. After finishing a task, it should update safe memory when doing so will make future work faster, more accurate, or more personalized.

# Coworx Architecture

Coworx is a filesystem-backed operating system for Codex work. The project folder is the source of truth for policy, queues, logs, outputs, safe memory, templates, and smoke tests.

## Lanes

- Repo/code mode: local files, tests, diffs, reviews, worktrees, and scripts.
- Connector/API mode: app connectors, MCP tools, OAuth-backed integrations, and structured APIs.
- Browser mode: Browser Use for in-app/current/local/public targets and Playwright for repeatable structured browser work.
- Artifact mode: document, spreadsheet, presentation, PDF, image, audio, video, and media skills/plugins.
- Visual computer mode: Computer Use for native apps, real browser profiles, simulators, system dialogs, visual checks, and GUI-only flows.

## Control Model

The main thread is the Director. It builds the graph, staffs lanes, owns integration, and makes final safety and quality calls.

Browser/API/code/subagent lanes are parallel by default. Shared objects receive read, write, or commit locks. Computer Use receives target-level locks for app/window/profile/account/focus resources.

## State Model

- `AGENTS.md`: canonical operating contract.
- `docs/`: detailed policy shards.
- `config/`: approved-site and autonomy-grant templates.
- `queue/`: task state.
- `runs/`: task execution logs.
- `memory/`: safe durable procedures and maps.
- `operator/`: action requests, lane leases, results, approvals, screenshots, traces, recordings.
- `outputs/`: reports, drafts, files, patches, summaries.
- `evals/`: smoke and regression scenarios.
- `scripts/`: readiness and validation checks.

## Trust Boundaries

External pages, documents, messages, dashboards, and files are untrusted input. Coworx follows user instructions and local policy, not instructions embedded in content.

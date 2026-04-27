# Coworx

**Cowork-style dispatch for GPT and Codex. Local-first, real-app, deliverable-driven.**

[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Codex workspace](https://img.shields.io/badge/built_for-Codex-black.svg)](AGENTS.md)
[![Computer Use](https://img.shields.io/badge/Computer_Use-first_class-green.svg)](docs/computer_use_policy.md)
[![Local-first](https://img.shields.io/badge/private-local_first-purple.svg)](docs/private_memory_policy.md)

Coworx is an open source Cowork-style workspace for GPT and Codex users.

It gives Codex the missing workflow layer around real computer work: task state, app routing, local memory, Computer Use rules, standby dispatch, credential references, logs, outputs, and safety boundaries.

Computer Use is the hands. Coworx is the part that remembers the job.

[Highlights](#highlights) · [Install](#install) · [Using It](#using-it-in-codex) · [Standby Mode](#standby-mode) · [Account Work](#account-work) · [Security](#security-defaults) · [Docs](#docs-by-goal)

New here? Open this repo in Codex and start with:

```text
Use Coworx. Do this as a real deliverable, not just a plan.
```

## Why Coworx Exists

Raw Computer Use can click around, but clicking is not the product.

The useful part is the system around the clicks:

- knowing what task is active;
- knowing what has already been checked;
- picking the right tool instead of always using the browser;
- using the signed-in profile or app that matters;
- keeping a directive ledger for multi-step work;
- downloading data once and processing it locally in parallel;
- knowing what should be staged for review;
- coming back with the actual finished result.

That is what Coworx is trying to make normal inside Codex.

The goal is not:

```text
answer my prompt
```

The goal is:

```text
finish the deliverable
```

## Highlights

**Real app work**

Coworx treats Computer Use as a first-class lane for the things scripts and browser automation do not handle well: real Chrome profiles, file pickers, upload dialogs, Google Docs, Word, desktop apps, messaging apps, password-manager prompts, and visual saved-state checks.

**Computer Use lease queue**

When multiple Coworx or Codex instances are active, they coordinate real desktop control through `.coworx-private/computer-use/` using `scripts/coworx_computer_use_queue.mjs`. One agent can reserve or acquire the GUI lease, do the short extraction or app action, then release the screen so other work continues locally.

**Standby dispatch**

Run a task while the Codex session is alive, keep state between cycles, check for inbound messages, and report back only when something meaningful happens. Private channels need setup first: where to send updates, which account or channel is approved, what replies can approve, and where private inbox/outbox state lives.

**Project memory**

Store safe workflow facts locally: where files live, what browser profile matters, what the last run found, what outputs should look like, what account route applies, and what steps repeat.

**Credentialed workflows**

Use approved signed-in sessions, autofill, password managers, keychain, connector auth, vault handles, or ignored local secret files. Coworx remembers routes and references, not raw secrets in chat.

**Temporary waits**

If a safe task needs to wait for a render, download, queue, upload, or approval window, Coworx records a wait, checks at a reasonable interval with Standby Mode or Codex Automations when available, then deletes or retires the temporary automation when finished.

**Parallel by default**

Use one locked GUI lane to get the data, then release the screen and let local agents process the downloaded pieces in parallel.

**Deliverables over replies**

The normal output should be a file, report, draft, spreadsheet, checked account summary, staged upload, browser result, local artifact, or clear review point.

**Useful safety**

Coworx is meant to act when it has permission. It still stages or blocks high-risk actions like payments, account security changes, password changes, identity verification, destructive deletes, credential export, and protected final submissions.

## What Coworx Can Work Across

- files and folders;
- signed-in browser sessions;
- desktop apps;
- documents, PDFs, spreadsheets, and slides;
- GitHub;
- web apps and dashboards;
- calendars;
- messages and notification channels;
- local scripts;
- Codex skills and connectors;
- Playwright and APIs;
- Computer Use.

The route depends on the work. Sometimes the right answer is a script. Sometimes it is Playwright. Sometimes it is a connector. Sometimes it is opening Chrome and doing the same workflow you would do yourself.

## How It Works

Coworx is a project-backed workspace, not a single prompt.

The main Codex thread acts as the Director. It reads the project contract, breaks the request into directives, assigns lanes, locks shared resources, checks safety, saves evidence, and does not call the task complete until the requested result is actually delivered, staged, blocked, or waiting.

The repo gives Codex a durable base:

- `AGENTS.md` for the operating contract;
- `docs/` for detailed policies;
- `config/` for workflow templates;
- `operator/` for action requests, approvals, and lane leases;
- `queue/` for persistent tasks;
- `memory/` for safe local memory templates;
- `outputs/` and `runs/` for evidence and reports;
- `.coworx-private/` for ignored private runtime state.

## Install

Coworx is installed by cloning the project and using that folder as a Codex workspace.

It is not a global CLI you install and forget about. The repo is the product base: Codex reads the operating contract, docs, templates, memory folders, queues, scripts, and private runtime paths from this project.

Clone the repo and open it in Codex.

```bash
git clone https://github.com/I-Amdew/Coworx.git
cd Coworx
```

Then open the `Coworx` folder in the Codex desktop app or Codex CLI as the active project.

Private runtime files live under `.coworx-private/` and are ignored by git. That is where local task state, private account maps, standby state, and credential references belong.

## Using It In Codex

Coworx is mainly for non-coding tasks that still need a real computer workflow.

Use it by asking Codex to work from this project:

```text
Use Coworx. Check my core classes and give me the actual list of what is due today.
```

That tells Codex to use the Coworx operating model instead of treating the request like a normal one-off chat.

Good Coworx tasks look like:

- check what is due today across signed-in school apps;
- make a document from a template and match the existing style;
- gather browser data, download the files, and process them locally;
- create a spreadsheet, PDF, slide deck, or report;
- check a calendar and draft a follow-up;
- run a standby task and message back when something changes;
- use Computer Use for the real desktop when a file picker, upload dialog, or signed-in browser profile is needed.

Example non-coding request:

```text
Use Coworx. Check my core classes and give me the actual list of what is due today.
```

For a coding workflow:

```text
Use Coworx. Make the change, run the checks, and leave me the final result with evidence.
```

For a real-app workflow:

```text
Use Coworx. Use Computer Use if the browser or file picker needs the real desktop.
```

Optional local readiness check:

```bash
node scripts/coworx_ready_check.mjs
```

## Standby Mode

Standby Mode is Coworx's lightweight dispatch loop for the current active Codex session.

Use it when you want something like:

```text
Run this in standby. Keep checking and message me when the output is ready.
```

It can:

- keep the active task state;
- continue from the last checkpoint;
- ask first-run setup questions before relying on private channels;
- check local inbox files or configured message adapters;
- queue new requests into the same Director flow;
- respond with milestones, blockers, and completed outputs;
- stay quiet during normal work.

It is designed for the style of interaction where you can leave your desk, text in a follow-up, and get back a useful status or finished result without restarting the whole task.

## Account Work

Coworx can work inside accounts when the workflow is approved and the route is safe.

Supported paths include:

- existing signed-in browser sessions;
- dedicated browser profiles;
- browser autofill;
- password managers;
- OS keychain;
- connector auth;
- vault handles;
- ignored local secret files;
- local credential reference packets.

If you explicitly ask Coworx to save a password for a workflow, it should use private ignored storage, keychain, a password manager, or a vault handle. It should not put the password in chat, logs, screenshots, committed files, or normal memory.

If you already pasted a secret into the chat and explicitly ask Coworx to save it, Coworx may do a one-time local transfer without echoing it, then should recommend ending that chat and starting a new one in the same project so the active model context no longer contains the secret.

## Security Defaults

Coworx is designed as a single-user local workspace.

Private runtime data stays local and ignored:

- `.coworx-private/`;
- private credential files;
- private account maps;
- raw screenshots and traces;
- private task outputs;
- browser and session state;
- webhook URLs, phone numbers, tokens, cookies, and account details.

Before exposing anything remotely, read the security docs. Real account automation is powerful, and it should stay inside delegated authority.

Useful starting points:

- [Safety Policy](docs/safety_policy.md)
- [Credential Handoff](docs/credential_handoff_protocol.md)
- [Local Credential Persistence](docs/local_credential_persistence.md)
- [Dispatch Channel Protocol](docs/dispatch_channel_protocol.md)
- [Temporary Waits And Automations](docs/temporary_waits_and_automations.md)
- [Computer Use Policy](docs/computer_use_policy.md)
- [Private Memory Policy](docs/private_memory_policy.md)

## Docs By Goal

New to Coworx:

- [Agent Guide](AGENTS.md)
- [Operating Manual](COWORX.md)
- [Project Workspace Model](docs/project_workspace_model.md)
- [Architecture](docs/architecture.md)

Doing real work:

- [Real Result Delivery](docs/real_result_delivery_protocol.md)
- [Real Work Task Model](docs/real_work_task_model.md)
- [Directive Follow Through](docs/directive_follow_through.md)
- [Non-Coding Workflows](docs/non_coding_workflows.md)

Using apps and browsers:

- [Operator Protocol](docs/operator_protocol.md)
- [Computer Use Policy](docs/computer_use_policy.md)
- [Playwright Policy](docs/playwright_policy.md)
- [Session-Backed Account Operations](docs/session_backed_account_operations.md)

Running in the background:

- [Standby Mode](docs/standby_mode.md)
- [Dispatch Channel Protocol](docs/dispatch_channel_protocol.md)
- [Temporary Waits And Automations](docs/temporary_waits_and_automations.md)
- [Parallelism and Locks](docs/parallelism_and_locks.md)
- [Concurrency Model](docs/concurrency_model.md)

Credentials and private memory:

- [Credential Handoff](docs/credential_handoff_protocol.md)
- [Local Credential Persistence](docs/local_credential_persistence.md)
- [Private Memory Policy](docs/private_memory_policy.md)

## What Is In The Repo

- `AGENTS.md` - the main operating contract.
- `COWORX.md` - the short manual for using Coworx inside Codex.
- `docs/` - policies and workflow docs.
- `config/` - templates for autonomy, credentials, browser lanes, and standby.
- `operator/` - action requests, approvals, results, and lane leases.
- `memory/` - safe memory templates.
- `queue/` - task templates.
- `outputs/` - reports and generated artifacts.
- `runs/` - run logs and task evidence.
- `scripts/` - local helpers for readiness, credentials, standby, and action gates.

## Status

Coworx is early, but the shape is here: Computer Use, standby dispatch, local credential references, parallel processing, account workflow routing, and deliverable-focused task state.

Expect rough edges. The point of the project is to make Codex feel more like an actual coworker instead of a chat box that stops at instructions.

## License

Coworx is open source under the Apache License 2.0.

Coworx is an independent project. It is not affiliated with Anthropic, Claude, OpenAI, Codex, or any Cowork product.

# Coworx

Coworx is an open source Cowork-style workspace for GPT and Codex users.

It turns Codex from a chat window into a local coworker that can actually operate your computer, use your files, work through browser sessions, keep task state, check back in while you are away, and finish real work instead of stopping at instructions.

Claude Cowork showed what people want: dispatch a task, let the agent use the computer, and get a useful result back in one continuous thread. Coworx brings that idea to the Codex world as a project you can own, inspect, customize, and run locally.

## What Coworx Does

Coworx is built for real computer work:

- use signed-in browser sessions like Chrome when a task depends on your actual account;
- control desktop apps through Computer Use when buttons, file pickers, uploads, messages, or visual checks matter;
- use connectors, skills, local scripts, Playwright, and APIs when those are the cleaner route;
- create and edit docs, spreadsheets, PDFs, slides, reports, and code files;
- check Schoology, calendars, dashboards, messages, GitHub, folders, and web apps when you give it permission;
- download data once, then process it locally with many parallel agents instead of slowly reading one page at a time;
- save safe workflow memory so repeated tasks get faster;
- keep secrets out of chat and store only local private credential references;
- stage risky final actions for review instead of blindly clicking the last button.

The goal is simple: if you ask for work, Coworx should do the work.

## Why It Exists

Most agent setups are still too chatty. They give steps, ask the user to click around, forget context between tasks, or get stuck at the exact moment where real work starts.

Coworx is designed around follow-through:

- find the right app, file, account, or browser tab;
- use the right tool for the job;
- keep going through multi-step tasks;
- report back with the actual output;
- keep working quietly in standby mode;
- handle new instructions mid-task without dropping the original goal.

It is meant to be the open source answer for people who want Cowork-like dispatch and computer use, but want it in a GPT/Codex workflow they can control.

## Core Features

### Real App Work

Coworx treats Computer Use as a first-class capability. It can use real browser profiles, native apps, file pickers, password-manager prompts, upload dialogs, document editors, and messaging apps when that is what the task needs.

### Standby Mode

Standby Mode lets Coworx keep working in a Dispatch-style thread while the current Codex session is active. It checks for updates, sends meaningful progress messages, stores incoming follow-up tasks, and avoids noisy "still working" spam.

### Account Work With Local Credentials

Coworx can use approved signed-in sessions and local credential references. If you explicitly ask it to save a password, it uses hidden local capture, a private ignored file, keychain, password manager, or vault-style reference. It remembers the reference, not the password in chat.

### Parallel Work

Coworx can split the job. One lane can use Chrome to download account data, then several local agents can process different sections at the same time. That makes big tasks much faster than one agent slowly working online.

### Real Output

Coworx is judged by the thing it leaves behind: a finished file, a draft, a staged upload, a checked account summary, a report, a browser result, an action ledger, or a clear review point.

### Safety Boundaries

Coworx is meant to be useful, not reckless. It can act inside delegated authority, but it stages or blocks protected actions like payments, account security changes, password changes, identity verification, legal or medical submissions, destructive deletes, and other high-risk commitments.

## Example Tasks

Coworx is designed for tasks like:

- "Check my four core classes and tell me what is due today."
- "Use my signed-in browser to get the formula sheet, read my local textbook, and build a final review prompt."
- "Fill out this document from the downloaded sources and keep the same formatting."
- "Watch this task in standby mode and text me when the output is ready."
- "Download the report from the dashboard, split it up, summarize the important parts, and make a final doc."
- "Create the draft, attach the right file, and stop before final submit."
- "Save this login locally so future approved tasks can sign in without asking again."

## How It Works

Coworx is a project-backed workspace. Instead of being only a prompt or a single skill, it gives Codex a local operating base:

- instructions for how to act;
- templates for task requests and results;
- local memory for safe workflow lessons;
- private ignored storage for account-specific state;
- scripts for readiness checks, standby mode, credential references, and real-work drills;
- docs for Computer Use, browser work, credentials, dispatch mode, parallelism, and external actions.

You open this project in Codex, ask for work, and Coworx gives Codex a stronger operating system for getting it done.

## Getting Started

Run the readiness check:

```bash
node scripts/coworx_ready_check.mjs
```

Try standby mode without touching real accounts:

```bash
node scripts/coworx_standby.mjs demo-test
```

Create a local password reference with hidden input:

```bash
node scripts/coworx_local_secret_store.mjs capture --name example-app --target example.com --account-label example-account
```

Private runtime files live under `.coworx-private/` and are ignored by git.

## What Gets Committed

Commit the framework, docs, templates, scripts, tests, and sanitized examples.

Do not commit:

- passwords;
- MFA values;
- cookies or tokens;
- account screenshots;
- browser sessions;
- private task outputs;
- personal account maps;
- webhook URLs;
- phone numbers;
- private traces or recordings.

Coworx is built so the useful system can be open source while your real account data stays local.

## Open Source

Coworx is open source under the Apache License 2.0.

Use it, fork it, adapt it, and build better Cowork-style workflows for GPT and Codex users.

Coworx is not affiliated with Anthropic, Claude, OpenAI, or Codex. It is an independent open source project for local agent workflows.

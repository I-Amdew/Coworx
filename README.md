# Coworx

**An open source Cowork-style workspace for GPT and Codex users.**

Coworx is a local workflow system for Codex.

The goal is pretty simple. I do not want the agent to optimize for one response. I want it to optimize for the actual deliverable.

That means the job is not "answer this prompt." The job is "figure out what needs to happen, use the right tools, keep track of the work, and come back with the finished thing."

## Why This Exists

Computer Use is useful, but raw Computer Use is not enough.

The useful part is not just that an agent can click around. The useful part is that it knows what task it is doing, what it already checked, which app matters, which browser profile is signed in, where the files are, what steps should happen next, and what counts as done.

Without that layer, Computer Use mostly feels like another way to run browser automation. Coworx is the layer around it.

It gives Codex a project base with task state, local memory, outputs, logs, workflow maps, account references, routing rules, and safety boundaries. The point is to make Codex feel less like a chat box and more like a coworker that can actually work through your setup.

## What Coworx Is

Coworx is a project-backed workspace.

You open it in Codex, and it gives the agent a place to work from:

- what the task is;
- what files matter;
- what apps and browser profiles exist;
- what accounts are approved for the workflow;
- what previous runs found;
- where outputs should go;
- what should be staged for review;
- what the final result should look like.

The more you use it, the more useful it gets, because it starts mapping how you actually do things.

## What It Can Do

Coworx is built for real computer tasks, not just coding.

It can work across:

- files and folders;
- signed-in Chrome sessions;
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

The route depends on the task. Sometimes the right answer is a script. Sometimes it is Playwright. Sometimes it is a connector. Sometimes it is literally opening Chrome and using the same UI you would use.

## Finish The Deliverable

Coworx is built around finishing.

A good run should leave behind a real result:

- a file;
- a report;
- a draft;
- a spreadsheet;
- a staged upload;
- a checked account summary;
- a browser result;
- a local artifact;
- a clear review point.

If the user asked it to do the thing, a plan is not enough unless the action is blocked or unsafe.

## Real App Work

Computer Use is treated as a first-class tool.

Coworx can use it for:

- signed-in browser profiles;
- file pickers;
- upload dialogs;
- Google Docs or Word;
- messaging apps;
- password-manager prompts;
- native desktop apps;
- visual saved-state checks.

The important part is that Coworx does not treat the GUI as a dead end. If the task needs a real app, it should use the real app.

## Standby Mode

Coworx also has a standby system that is meant to feel more like dispatch.

You can leave a task running while the Codex session is alive. Coworx keeps state, checks for new inbound messages, works through the next step, and sends back useful updates.

The conversation style is supposed to be simple:

- quick acknowledgement;
- task kicked off;
- quiet while normal work is happening;
- message back for real milestones or blockers;
- final result when the output is ready.

It can be wired to local inbox/outbox files, desktop notifications, Messages/iMessage, Discord, or another adapter.

## Local Credentials

Coworx can work with accounts if you approve the workflow.

It can use existing signed-in sessions, browser autofill, password managers, keychain, connector auth, vault handles, or ignored local secret files.

If you tell Coworx to save a password, it uses hidden local capture. It stores the credential in private ignored storage and remembers only the reference. It does not save the password in chat or normal project memory.

## Parallel Work

One of the bigger ideas is that the slow online part should be as short as possible.

For example, if a site has a lot of data, Coworx should use one locked Computer Use or browser lane to download or export it. Then it should release that GUI lane and use multiple local agents to process the downloaded pieces in parallel.

That is much faster than having one agent sit in the website reading page after page while everything else waits.

## Safety Without Making It Useless

Coworx is supposed to be useful. That means it should act when it has permission.

It can draft, edit, attach files, create outputs, update reversible things, and work through approved apps and accounts.

It still stages or blocks high-risk actions:

- payments;
- account security changes;
- password changes;
- identity verification;
- legal, medical, or financial submissions;
- destructive deletes;
- credential, cookie, or token export;
- protected final submissions.

The idea is not to make the agent timid. The idea is to make it capable without letting it silently cross lines it should not cross.

## What Is In The Repo

The repo includes the Coworx operating base:

- agent instructions;
- workflow docs;
- action templates;
- local memory templates;
- standby mode;
- credential reference helpers;
- readiness checks;
- regression tests;
- Computer Use and browser routing rules.

Your private runtime data is not supposed to be committed. Files under `.coworx-private/` stay local.

## Getting Started

Open this project in Codex and ask Coworx to do a real task.

For local credential capture:

```bash
node scripts/coworx_local_secret_store.mjs capture --name example-app --target example.com --account-label example-account
```

## License

Coworx is open source under the Apache License 2.0.

Coworx is an independent project. It is not affiliated with Anthropic, Claude, OpenAI, or Codex.

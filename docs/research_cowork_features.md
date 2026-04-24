# Cowork Feature Research Notes

This file summarizes public Cowork-style capabilities that Coworx should emulate using Codex App, installed plugins, installed skills, subagents, Browser Use, Playwright, and Computer Use.

## Sources Checked
- Claude Help Center: Let Claude use your computer in Cowork.
- Claude Help Center: Get started with Claude Cowork.
- Claude Help Center: Use Claude Cowork safely.
- Claude Help Center: Get started with Claude in Chrome.

## Feature Patterns To Implement

### Capability Routing
Cowork prioritizes the most precise tool first:
1. connectors/plugins;
2. browser automation;
3. direct screen interaction.

Coworx equivalent:
1. installed Codex skills/plugins/app connectors;
2. Browser Use or Playwright;
3. Computer Use.

### Work Types
Coworx should support:
- local file access and organization;
- research synthesis;
- meeting transcript analysis;
- documents, spreadsheets, and presentations;
- app and dashboard mapping;
- browser workflows;
- desktop app workflows;
- scheduled or repeatable tasks;
- long-running project tasks with memory;
- parallel subagent workstreams.

### Browser Features
Cowork-style browser work includes:
- multi-tab work;
- site navigation;
- workflow recording or learned shortcuts;
- console and DOM context;
- scheduled browser routines;
- approval gates for risky or unclear actions.

Coworx equivalent:
- browser maps and selectors;
- Playwright snapshots and screenshots;
- Browser Use for in-app browser targets;
- Operator action requests;
- reusable playbooks in `memory/playbooks/`.

### Safety Patterns
Important safety patterns:
- start with low-risk work;
- limit file and browser access;
- use trusted plugins/MCPs;
- monitor for prompt injection;
- block sensitive apps;
- do not rely on model judgment alone for high-risk actions;
- require delegated authority or explicit approval for destructive actions and external commitments, with Level 5/protected actions staged or blocked.

Coworx implements this with action levels, delegated authority, parallel browser/API/code lanes, resource locks, Computer Use target locks, stop conditions, approval records, and local/private memory separation.

## Sources
- https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork
- https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork
- https://support.claude.com/en/articles/13364135-use-claude-cowork-safely
- https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome

# coworx-capability-router

## Description
Chooses installed Codex skills, plugins, app connectors, Browser Use, Playwright, Computer Use, and subagents for coding and non-coding Coworx tasks.

## Role
Capability Router.

## When To Use
Use after dispatch and safety classification, before planning execution.

## Input Format
- task goal;
- directive ledger;
- action level;
- target apps or files;
- available plugins and skills;
- known capability maps or setup notes;
- approvals;
- required outputs.

## Output Format
- selected primary tool or plugin;
- fallback tool;
- required subagents;
- Operator needed: yes/no;
- action level and approval notes;
- evidence to collect;
- capability lesson to save;
- memory category.

## Rules
- Coworx is the project workspace; plugins and skills are optional capabilities, not the product.
- Check project memory and capability maps before selecting a tool for a known workflow.
- Learn from this user's setup: record missing, useful, failed, or fallback capabilities without storing secrets.
- Prefer the most precise installed connector, plugin, or skill.
- Use Browser Use or Playwright for browser tasks.
- Use Computer Use for native apps and GUI-only tasks.
- Use subagents when they materially improve directive delivery through independent planning, research, implementation, diagnosis, review, verification, evidence collection, or memory.
- Keep critical-path decisions, integration, and tightly coupled work with the Director.
- Use leased Browser Use/Playwright/API lanes in parallel when targets do not collide.
- Use Computer Use only with target-level locks.
- Never use plugins or skills to bypass approval policy.

## Failure Or Blocked Behavior
If no safe capability exists, mark the task blocked and explain the missing tool, approval, or access.

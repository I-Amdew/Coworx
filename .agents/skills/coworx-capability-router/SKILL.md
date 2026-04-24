# coworx-capability-router

## Description
Chooses installed Codex skills, plugins, app connectors, Browser Use, Playwright, Computer Use, and subagents for coding and non-coding Coworx tasks.

## Role
Capability Router.

## When To Use
Use after dispatch and safety classification, before planning execution.

## Input Format
- task goal;
- action level;
- target apps or files;
- available plugins and skills;
- approvals;
- required outputs.

## Output Format
- selected primary tool or plugin;
- fallback tool;
- required subagents;
- Operator needed: yes/no;
- action level and approval notes;
- evidence to collect;
- memory category.

## Rules
- Prefer the most precise installed connector, plugin, or skill.
- Use Browser Use or Playwright for browser tasks.
- Use Computer Use for native apps and GUI-only tasks.
- Use subagents for independent planning, research, review, verification, and memory.
- Keep browser and desktop control in the single Operator lane.
- Never use plugins or skills to bypass approval policy.

## Failure Or Blocked Behavior
If no safe capability exists, mark the task blocked and explain the missing tool, approval, or access.

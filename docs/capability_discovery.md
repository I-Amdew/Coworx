# Capability Discovery

Coworx should deliver real work with whatever capabilities are available in the user's Codex setup. Because each user can have different plugins, skills, MCP tools, connectors, browser profiles, local scripts, apps, and account sessions, Coworx must maintain a local capability map instead of assuming a fixed toolset.

## Capability Map

Keep a user-specific capability inventory in project memory. Use private ignored paths when the inventory reveals account names, app names, workspace names, browser profiles, or other user-specific context.

Track:

- installed or available Codex plugins;
- available Codex skills and local role prompt files;
- MCP tools and app connectors;
- Browser Use availability and scope;
- Playwright availability, profiles, and useful test patterns;
- Computer Use availability and GUI targets;
- local scripts, CLIs, runtimes, and project tools;
- account labels, connector names, browser profile labels, and approved login routes;
- artifact tools for documents, spreadsheets, slides, PDFs, media, audio, video, images, and code;
- known strengths, limitations, stop conditions, and evidence each capability can produce.

Do not store raw credentials, cookies, tokens, API keys, session files, private keys, payment data, or hidden authentication material.

## Discovery Loop

For a new user setup or unfamiliar task type:

1. Inspect project memory for existing capability maps.
2. Check available local files, configured skills, plugins, connectors, scripts, and tool surfaces.
3. Classify which capabilities are safe for the task's action level and privacy class.
4. Choose the most direct capability that can complete the directive with evidence.
5. Record whether the capability worked, failed, required fallback, or needs user setup.
6. Save a safe capability lesson for future routing.

Capability discovery is read-only unless the user requested setup or configuration. Do not install, enable, authorize, or connect new external services without delegated authority and normal safety review.

## Routing Implication

The router should treat "available capability" as user-specific state:

- If the user has a document plugin, use it for DOCX work.
- If the user has a reliable browser profile for a workflow, prefer that approved path.
- If a local script already handles a repeated output, reuse it.
- If a skill exists but has failed for this user's setup, prefer the learned fallback.
- If no capability can safely complete the task, stage or block with the exact missing setup.

## Learning Rules

After each task, update memory when useful:

- capability used;
- why it was chosen;
- inputs it handled well;
- evidence it produced;
- failure or friction;
- fallback route;
- privacy or approval caveats;
- last verified date.

Keep shippable memory generic. Put user-specific capability maps in ignored private paths.

# Memory Policy

Coworx memory is local project context for repeatable work, not private secrets. It makes the workspace custom by remembering safe routes, maps, selectors, output preferences, and workflow decisions.

## Allowed
- app and page maps;
- course, dashboard, document, folder, and workflow maps;
- workflow steps;
- selectors and element notes;
- exact site, app, form, layout, and navigation maps when stored in ignored private memory for user-specific workflows;
- lessons learned;
- failure patterns;
- safety decisions;
- approval requirements;
- project conventions;
- output folders and hand-off preferences;
- account labels, login URLs, browser profile names, connector names, password-manager item names, OAuth connector names, vault handles, local environment variable names, and ignored secret file paths without values;
- capability maps for available plugins, skills, connectors, MCP tools, scripts, apps, browser profiles, and learned fallbacks.

## Forbidden
- passwords;
- 2FA codes;
- recovery codes;
- API keys;
- private tokens;
- cookies;
- credit cards;
- private keys;
- private account-security details.

## Account Memory
Account files may describe which approved local-only access route or handoff is used, which workflows are read-only, and which actions require approval. They must not include credentials.

Account memory may identify "which login route to use" or "which account label applies." It must not include the secret that authenticates the account.

When credential persistence is explicitly delegated, memory may store the ignored secret file path, keychain item label, password-manager item label, vault handle, and environment variable names. The secret values stay only in the approved private secret store.

User-specific exact layouts, selectors, field names, and navigation maps are privileged workflow information. Store them in ignored private memory unless they have been sanitized into a generic template. Before entering those details into another site, app, support channel, prompt, or external destination, apply the privileged-info review gate in `docs/prompt_injection_and_directive_state.md`.

## Capability Memory
Capability files may describe which tools are available in the user's setup, when they are useful, what evidence they produce, and what fallback to use. They must not include secret configuration values, tokens, cookies, profile files, or hidden authentication material.

## School And Academic Work
Coworx can help organize tasks, explain concepts, create study plans, and draft user-reviewed notes. Coworx must not impersonate the user, complete graded work as the user, or submit academic work.

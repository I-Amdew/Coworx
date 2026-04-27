#!/usr/bin/env node
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";

const protectedActions = new Set([
  "payment",
  "purchase",
  "subscription",
  "financial_transfer",
  "banking",
  "tax",
  "investment",
  "legal_filing",
  "signature",
  "medical_submission",
  "account_security",
  "password_change",
  "account_recovery",
  "credential_export",
  "cookie_export",
  "token_export",
  "identity_verification",
  "delete_important_records",
  "academic_submission",
  "submit_graded_work_as_user",
  "irreversible_production_change"
]);

const credentialExposureKeys = [
  "values_embedded",
  "printed_values",
  "logged_values",
  "screenshot_during_secret_entry",
  "trace_during_secret_entry",
  "exports_cookies",
  "exports_tokens",
  "exports_credentials"
];

function parseArgs(argv) {
  const command = argv[2];
  const options = {};
  for (let index = 3; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      options[key] = "true";
      continue;
    }
    options[key] = next;
    index += 1;
  }
  return { command, options };
}

function readPacket(path) {
  if (!path || !existsSync(path)) throw new Error(`Missing action packet: ${path || "(none)"}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function includesValue(list, value) {
  return asArray(list).map((item) => String(item)).includes(String(value));
}

function actionLevel(packet) {
  const value = Number(packet?.action?.level ?? packet?.action_level ?? 0);
  if (!Number.isInteger(value) || value < 0 || value > 5) return null;
  return value;
}

function targetDomain(packet) {
  return String(packet?.target?.domain || packet?.domain || "");
}

function approvedDomains(packet) {
  return asArray(packet?.target?.approved_domains || packet?.approved_domains).map((item) => String(item));
}

function validateCredentialHandoff(packet, failures) {
  const credential = packet?.credential_handoff || {};
  if (!credential.required) return;

  const sourceType = String(credential.source_type || credential.source || "");
  const sourceReference = String(credential.source_reference || credential.source_path || credential.source_label || "");
  if (!sourceType) failures.push("credential handoff requires source_type");
  if (!sourceReference && sourceType !== "existing_session" && sourceType !== "oauth_connector" && sourceType !== "api_connector") {
    failures.push("credential handoff requires a non-secret source reference");
  }

  for (const key of credentialExposureKeys) {
    if (credential[key]) failures.push(`credential handoff exposes secrets through ${key}`);
  }
}

function validateTarget(packet, failures) {
  const domain = targetDomain(packet);
  const domains = approvedDomains(packet);
  if (!packet?.target?.app && !domain) failures.push("target app or domain is required");
  if (!packet?.target?.account_label && !packet?.account_label) failures.push("account label is required");
  if (domain && domains.length > 0 && !domains.includes(domain)) {
    failures.push(`domain ${domain} is not approved for this action`);
  }
}

function validateAuthority(packet, failures, stageReasons) {
  const level = actionLevel(packet);
  const authority = packet?.authority || {};
  const action = packet?.action || {};
  const actionClass = String(action.class || action.action_class || "");
  const allowedActions = asArray(authority.allowed_actions);

  if (level === null) failures.push("action level must be an integer 0 through 5");
  if (level >= 3 && !authority.source) failures.push("credentialed external actions require an authority source");
  if (level >= 3 && !actionClass) failures.push("credentialed external actions require an exact action class");
  if (level >= 3 && allowedActions.length > 0 && !includesValue(allowedActions, actionClass)) {
    failures.push(`action class ${actionClass} is not allowed by the autonomy grant`);
  }
  if (level === 4 && action.final_action && !authority.final_send_submit_allowed) {
    stageReasons.push("final external commitment is not allowed by the autonomy grant");
  }
  if (level === 4 && action.final_action && (!action.destination_clear || !action.data_clear)) {
    stageReasons.push("final external commitment requires clear destination and data");
  }
}

function classifyProtected(packet) {
  const action = packet?.action || {};
  const protectedType = String(action.protected_type || "");
  const flags = asArray(action.protected_flags);
  if (protectedType && protectedActions.has(protectedType)) return protectedType;
  for (const flag of flags) {
    if (protectedActions.has(String(flag))) return String(flag);
  }
  return "";
}

function decide(packet) {
  const failures = [];
  const stageReasons = [];
  validateTarget(packet, failures);
  validateCredentialHandoff(packet, failures);
  validateAuthority(packet, failures, stageReasons);

  const level = actionLevel(packet);
  const protectedType = classifyProtected(packet);
  if (protectedType) {
    if (protectedType.includes("export") || protectedType === "account_security" || protectedType === "password_change" || protectedType === "account_recovery" || protectedType === "identity_verification") {
      failures.push(`protected action is blocked: ${protectedType}`);
    } else {
      stageReasons.push(`protected action must be staged: ${protectedType}`);
    }
  }

  const action = packet?.action || {};
  if (level === 4 && action.final_action && !action.confirmed_commit_lock) {
    stageReasons.push("final external commitment needs a commit lock");
  }

  if (failures.length > 0) {
    return {
      ok: false,
      decision: "block",
      failures,
      values_printed: false
    };
  }

  if (stageReasons.length > 0) {
    return {
      ok: true,
      decision: "stage",
      reasons: stageReasons,
      values_printed: false
    };
  }

  return {
    ok: true,
    decision: "proceed",
    action_level: level,
    target: packet?.target || null,
    action_class: action.class || action.action_class || null,
    values_printed: false
  };
}

function check(options) {
  const packet = readPacket(options.file);
  console.log(JSON.stringify(decide(packet), null, 2));
}

function demoTest() {
  const tempDir = mkdtempSync(join(tmpdir(), "coworx-action-gate-"));
  try {
    const proceedPacket = {
      target: {
        app: "Chrome",
        domain: "approved.example",
        approved_domains: ["approved.example"],
        account_label: "demo"
      },
      credential_handoff: {
        required: true,
        source_type: "existing_session",
        source_reference: "browser-profile://demo",
        values_embedded: false,
        printed_values: false,
        logged_values: false,
        screenshot_during_secret_entry: false
      },
      authority: {
        source: "autonomy_grant",
        allowed_actions: ["create_draft"],
        final_send_submit_allowed: false
      },
      action: {
        level: 3,
        class: "create_draft",
        final_action: false,
        reversible: true
      }
    };

    const stagePacket = {
      ...proceedPacket,
      authority: {
        source: "autonomy_grant",
        allowed_actions: ["send_message"],
        final_send_submit_allowed: false
      },
      action: {
        level: 4,
        class: "send_message",
        final_action: true,
        destination_clear: true,
        data_clear: true,
        confirmed_commit_lock: false
      }
    };

    const blockPacket = {
      ...proceedPacket,
      target: {
        ...proceedPacket.target,
        domain: "lookalike.example"
      }
    };

    const packets = { proceedPacket, stagePacket, blockPacket };
    for (const [name, packet] of Object.entries(packets)) {
      writeFileSync(join(tempDir, `${name}.json`), `${JSON.stringify(packet, null, 2)}\n`);
    }

    const proceed = decide(proceedPacket);
    const stage = decide(stagePacket);
    const block = decide(blockPacket);

    if (proceed.decision !== "proceed") throw new Error("expected reversible credentialed action to proceed");
    if (stage.decision !== "stage") throw new Error("expected final action without commit lock to stage");
    if (block.decision !== "block") throw new Error("expected wrong-domain action to block");
    console.log("Coworx autonomous action gate demo test passed.");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

const { command, options } = parseArgs(process.argv);

try {
  if (command === "check") check(options);
  else if (command === "demo-test") demoTest();
  else {
    console.error(`Usage:
  node ${basename(process.argv[1])} check --file ACTION_PACKET.json
  node ${basename(process.argv[1])} demo-test`);
    process.exit(2);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

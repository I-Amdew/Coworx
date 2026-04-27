#!/usr/bin/env node
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { tmpdir } from "node:os";

const root = process.cwd();

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

function outPath(value) {
  if (!value) return mkdtempSync(join(tmpdir(), "coworx-real-task-drill-"));
  return isAbsolute(value) ? value : resolve(root, value);
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function runDrill(outputDir) {
  ensureDir(outputDir);
  const sourcePath = join(outputDir, "source-notes.md");
  const briefPath = join(outputDir, "codex-coworx-brief.md");
  const uploadStagePath = join(outputDir, "upload-stage.json");
  const standbyOutboxPath = join(outputDir, "standby-outbox.ndjson");
  const verificationPath = join(outputDir, "verification.json");
  const finalReportPath = join(outputDir, "final-report.md");

  writeFileSync(sourcePath, `# Source Notes

- Codex Coworx should produce artifacts, not only instructions.
- Computer Use should handle real GUI surfaces when structured tools cannot finish.
- Playwright Interactive is preferred for persistent signed-in browser work.
- Standby needs an outbox, an inbox, and clear permission classes.
`, "utf8");

  const source = readFileSync(sourcePath, "utf8");
  const brief = `# Codex Coworx Drill Brief

## Result

Coworx created this brief from local source notes, staged an upload handoff, wrote a standby notification, and verified the output paths.

## Key Decisions

1. Use connectors and MCP tools first when they can finish the task.
2. Use Playwright Interactive for persistent signed-in browser workflows.
3. Use Computer Use for real GUI surfaces like file pickers, native apps, password-manager prompts, and visual confirmation.
4. Keep Standby active through local inbox and outbox adapters.

## Evidence

- Source notes: ${sourcePath}
- Brief artifact: ${briefPath}
- Upload stage packet: ${uploadStagePath}
- Standby outbox: ${standbyOutboxPath}

## Source Summary

${source.split(/\r?\n/).filter((line) => line.startsWith("- ")).join("\n")}
`;
  writeFileSync(briefPath, brief, "utf8");

  writeJson(uploadStagePath, {
    schema_version: 1,
    status: "staged",
    source_artifact: briefPath,
    target: "approved-demo-upload-surface",
    reason: "Local drill stages the upload packet without using a real account.",
    required_next_lane: "connector_or_Playwright_or_Computer_Use_file_picker",
    final_submit_allowed: false,
    evidence: [
      { type: "file", path: briefPath },
      { type: "staged_state", value: "upload packet names source artifact, target, and final action boundary" }
    ]
  });

  writeFileSync(standbyOutboxPath, `${JSON.stringify({
    at: new Date().toISOString(),
    type: "outputs_ready",
    message: "Real task drill produced a brief and staged upload packet.",
    artifact: briefPath
  })}\n`, "utf8");

  const checks = [
    { name: "source_exists", pass: existsSync(sourcePath), path: sourcePath },
    { name: "brief_exists", pass: existsSync(briefPath), path: briefPath },
    { name: "brief_mentions_computer_use", pass: readFileSync(briefPath, "utf8").includes("Computer Use"), path: briefPath },
    { name: "upload_stage_exists", pass: existsSync(uploadStagePath), path: uploadStagePath },
    { name: "standby_outbox_exists", pass: existsSync(standbyOutboxPath), path: standbyOutboxPath }
  ];
  writeJson(verificationPath, {
    schema_version: 1,
    status: checks.every((check) => check.pass) ? "passed" : "failed",
    checks
  });

  writeFileSync(finalReportPath, `# Real Task Drill Final Report

## Completed

- Created local source notes.
- Created the Codex Coworx drill brief.
- Created an upload-stage packet with a concrete source artifact and target.
- Created a standby outbox event.
- Verified all expected files.

## Outputs

- ${sourcePath}
- ${briefPath}
- ${uploadStagePath}
- ${standbyOutboxPath}
- ${verificationPath}

## Result

${checks.every((check) => check.pass) ? "passed" : "failed"}
`, "utf8");

  if (!checks.every((check) => check.pass)) {
    throw new Error(`Real task drill failed: ${verificationPath}`);
  }

  return {
    ok: true,
    output_dir: outputDir,
    brief_path: briefPath,
    upload_stage_path: uploadStagePath,
    standby_outbox_path: standbyOutboxPath,
    verification_path: verificationPath,
    final_report_path: finalReportPath
  };
}

const { command, options } = parseArgs(process.argv);

try {
  if (command === "run") {
    console.log(JSON.stringify(runDrill(outPath(options.output)), null, 2));
  } else if (command === "demo-test") {
    const tempDir = mkdtempSync(join(tmpdir(), "coworx-real-task-drill-"));
    try {
      runDrill(tempDir);
      console.log("Coworx real task drill demo test passed.");
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  } else {
    console.error(`Usage:
  node scripts/coworx_real_task_drill.mjs run --output outputs/reports/real-task-drill
  node scripts/coworx_real_task_drill.mjs demo-test`);
    process.exit(2);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

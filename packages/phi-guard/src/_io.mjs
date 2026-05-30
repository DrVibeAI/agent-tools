// Tiny shared I/O for the front-office-copilot scripts.
// Read JSON from --file <path> or stdin; write pretty JSON to stdout.
import fs from "node:fs";

export function readInput() {
  const i = process.argv.indexOf("--file");
  if (i !== -1 && process.argv[i + 1]) {
    return JSON.parse(fs.readFileSync(process.argv[i + 1], "utf8"));
  }
  let raw = "";
  try {
    raw = fs.readFileSync(0, "utf8"); // stdin
  } catch {
    raw = "";
  }
  return raw.trim() ? JSON.parse(raw) : {};
}

export function emit(obj) {
  process.stdout.write(JSON.stringify(obj, null, 2) + "\n");
}

export function isMain(importMetaUrl) {
  return importMetaUrl === `file://${process.argv[1]}`;
}

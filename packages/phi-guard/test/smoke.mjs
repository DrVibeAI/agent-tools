// Offline, deterministic tests for @drvibeai/phi-guard. Run: node test/smoke.mjs
import { complianceGate, redact, rehydrate } from "../src/index.mjs";

let pass = 0;
let total = 0;
const check = (name, cond) => {
  total++;
  if (cond) {
    pass++;
    console.log(`✓ ${name}`);
  } else {
    console.log(`✗ ${name}`);
  }
};

// compliance gate
check("gate → full when BAA-covered", complianceGate({ deployment: { baa_covered: true } }).mode === "full");
check("gate → minimized when no BAA", complianceGate({ deployment: { baa_covered: false } }).mode === "minimized");
check("gate → minimized when unknown", complianceGate({ deployment: {} }).mode === "minimized");

// redact
const r = redact({
  record: {
    full_name: "Jane Doe",
    contact_email: "jane@example.com",
    contact_phone: "555-0142",
    reason_for_visit: "follow up; reach jane@example.com or 555-0142",
  },
});
check("name tokenized", r.redacted.full_name === "[NAME-1]");
check("email field tokenized", r.redacted.contact_email === "[EMAIL-1]");
check("email scrubbed from free text", r.redacted.reason_for_visit.includes("[EMAIL-1]") && !r.redacted.reason_for_visit.includes("jane@example.com"));
check("phone scrubbed from free text", !r.redacted.reason_for_visit.includes("555-0142"));
check("map kept locally", r.map["[NAME-1]"] === "Jane Doe" && r.map["[EMAIL-1]"] === "jane@example.com");
check("residual warning present", Array.isArray(r.residual_warnings) && r.residual_warnings.length > 0);

// rehydrate (round-trip)
const back = rehydrate({ text: "Hi [NAME-1], reach you at [EMAIL-1].", map: r.map });
check("rehydrate restores identifiers", back.text === "Hi Jane Doe, reach you at jane@example.com.");
check("rehydrate reports no unresolved tokens", back.unresolved_tokens.length === 0);

console.log(`\n${pass}/${total} phi-guard checks passed`);
process.exit(pass === total ? 0 : 1);

// compliance_gate.mjs — PHI-GUARD (run FIRST, before any real patient data).
// Reusable across any patient-facing DrVibe skill.
//
// Front-office data is inherently identified, so you cannot "de-identify and
// proceed." This gate decides the safe operating mode from the host AI's BAA
// status. It does NOT enforce anything technically — it routes the user.
//
// Usage: echo '{"deployment":{"baa_covered":false,"vendor":"ChatGPT (free)"}}' | node compliance_gate.mjs
import { readInput, emit, isMain } from "./_io.mjs";

const HANDOFF = [
  "Run `phi-data-flow-mapper` to map exactly where this data travels.",
  "Run `baa-tracker-vendor-security` to confirm a signed BAA with your AI vendor and any connected tools.",
  "Run the HIPAA readiness skill before going live with real patients.",
];

export function complianceGate({ deployment = {} } = {}) {
  const baa = deployment.baa_covered; // true | false | null/undefined
  const vendor = deployment.vendor || "your AI tool";

  if (baa === true) {
    return {
      mode: "full",
      allowed: true,
      message:
        `${vendor} is reported BAA-covered. You may process real patient inquiries — but still apply minimum-necessary (share only what's needed), keep an audit trail, and require human approval on every patient-facing message.`,
      next_steps: [
        "Confirm the BAA actually covers THIS product/configuration, not just the company name.",
        HANDOFF[0],
      ],
    };
  }

  // false OR unknown -> minimized mode (the safe default)
  return {
    mode: "minimized",
    allowed: true,
    message:
      `${vendor} is NOT confirmed under a BAA. Do not paste real identifiers. Use minimized mode: run redact.mjs locally first (names/contact/DOB are tokenized and the map stays on your machine), reason over the de-identified text, then rehydrate.mjs to restore identifiers into the approved draft right before sending. This lowers exposure but is NOT certified de-identification — the compliant path for real PHI is a BAA-covered deployment (e.g., Anthropic commercial BAA, Claude via AWS Bedrock + BAA, Azure OpenAI + BAA).`,
    next_steps: [
      "Use synthetic data to learn the workflow.",
      "To handle real PHI, move to a BAA-covered deployment.",
      ...HANDOFF,
    ],
  };
}

if (isMain(import.meta.url)) {
  emit(complianceGate(readInput()));
}

// @drvibeai/phi-guard — agent PHI-minimization toolkit.
//
// - complianceGate: decide full vs minimized operating mode from the host AI's
//   BAA status, and route the user to the right next step.
// - redact: tokenize direct identifiers LOCALLY so they never reach a non-BAA
//   model. Returns the redacted record/text plus a token->value map you keep
//   on-device.
// - rehydrate: restore real identifiers into an approved draft, locally.
//
// IMPORTANT: this MINIMIZES direct identifiers (best-effort). It is NOT certified
// HIPAA Safe-Harbor de-identification. The compliant path for real PHI is a
// BAA-covered deployment. A human must review redacted output.
export { complianceGate } from "./compliance_gate.mjs";
export { redact } from "./redact.mjs";
export { rehydrate } from "./rehydrate.mjs";

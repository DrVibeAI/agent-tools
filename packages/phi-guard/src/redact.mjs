// redact.mjs — PHI-GUARD (reusable). Tokenize direct identifiers LOCALLY so they
// never reach a non-BAA model. Keep the returned `map` on the user's machine and
// use rehydrate.mjs to restore values into the approved draft.
//
// This MINIMIZES direct identifiers (best-effort). It is NOT certified HIPAA
// Safe-Harbor de-identification: free text can hide identifiers a pattern can
// miss, and quasi-identifiers (city/ZIP, rare conditions) may remain. A human
// must review redacted output before it goes to a non-BAA model.
//
// Usage: echo '{"record":{...}}' | node redact.mjs   (or {"text":"..."} )
import { readInput, emit, isMain } from "./_io.mjs";

// Structured identifier fields → token type
const IDENTIFIER_FIELDS = {
  full_name: "NAME", name: "NAME", patient_name: "NAME",
  contact: "CONTACT", contact_email: "EMAIL", email: "EMAIL",
  contact_phone: "PHONE", phone: "PHONE",
  date_of_birth: "DOB", dob: "DOB",
  address: "ADDR", street: "ADDR",
  mrn: "MRN", ssn: "SSN",
};
const FREE_TEXT_FIELDS = ["message", "notes", "reason_for_visit", "urgency_text", "reason"];
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const PHONE_RE = /\+?\d[\d\s().-]{6,}\d/g;

export function redact({ record = {}, text = "" } = {}) {
  const map = {};
  const counters = {};
  const residual_warnings = [];

  const token = (type, value) => {
    for (const [t, v] of Object.entries(map)) {
      if (v === value && t.startsWith(`[${type}-`)) return t;
    }
    counters[type] = (counters[type] || 0) + 1;
    const t = `[${type}-${counters[type]}]`;
    map[t] = value;
    return t;
  };

  const out = { ...record };
  for (const [field, type] of Object.entries(IDENTIFIER_FIELDS)) {
    const val = out[field];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      out[field] = token(type, String(val));
    }
  }

  const scrub = (s) => {
    let r = String(s);
    // replace any already-mapped real values that reappear in free text
    for (const [t, v] of Object.entries(map)) {
      if (v && v.length > 2) r = r.split(v).join(t);
    }
    r = r.replace(EMAIL_RE, (m) => token("EMAIL", m));
    r = r.replace(PHONE_RE, (m) =>
      m.replace(/\D/g, "").length >= 7 ? token("PHONE", m) : m
    );
    return r;
  };

  for (const f of FREE_TEXT_FIELDS) if (out[f]) out[f] = scrub(out[f]);
  const redacted_text = text ? scrub(text) : undefined;

  if (out.location) {
    residual_warnings.push(
      "`location` is kept for licensure matching, but city/ZIP are quasi-identifiers — under HIPAA Safe Harbor, geography below state level should be removed. Review before sending to a non-BAA model."
    );
  }
  residual_warnings.push(
    "Free text may still contain unstructured identifiers (first names alone, employers, unique details) that pattern-matching misses. A human must review before this leaves the machine."
  );

  return {
    redacted: out,
    redacted_text,
    map,
    map_note: "KEEP THIS MAP LOCAL — never upload it. Use rehydrate.mjs to restore identifiers into the approved draft.",
    residual_warnings,
  };
}

if (isMain(import.meta.url)) {
  const input = readInput();
  const arg = input.record || input.text !== undefined ? input : { record: input };
  emit(redact(arg));
}

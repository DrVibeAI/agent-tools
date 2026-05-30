// rehydrate.mjs — PHI-GUARD (reusable). Restore real identifiers into the
// approved draft, LOCALLY, right before a human sends it. Pair with redact.mjs.
//
// Usage: echo '{"text":"Hi [NAME-1] ...","map":{"[NAME-1]":"Jane Doe"}}' | node rehydrate.mjs
import { readInput, emit, isMain } from "./_io.mjs";

export function rehydrate({ text = "", map = {} } = {}) {
  let r = String(text);
  // replace longer tokens first to avoid partial overlaps (e.g. [NAME-1] vs [NAME-10])
  const tokens = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const t of tokens) r = r.split(t).join(map[t]);
  const unresolved = (r.match(/\[[A-Z]+-\d+\]/g) || []).filter((t) => !(t in map));
  return { text: r, unresolved_tokens: [...new Set(unresolved)] };
}

if (isMain(import.meta.url)) {
  emit(rehydrate(readInput()));
}

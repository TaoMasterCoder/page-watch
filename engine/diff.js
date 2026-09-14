/* Page Watch shared utils — ES module used by SW, offscreen. No deps. */

/* FNV-1a string hash — tiny, stable. */
export function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

/* Normalize text: collapse whitespace, trim. */
export function normalizeText(t) {
  return (t || "").replace(/\s+/g, " ").trim();
}

/* Apply ignore rules (array of regex source strings) — strip noise like
 * timestamps/counters before hashing. Invalid patterns are skipped silently. */
export function applyIgnore(text, rules) {
  let t = text || "";
  for (const r of rules || []) {
    if (!r || typeof r !== "string") continue;
    try {
      t = t.replace(new RegExp(r, "g"), "");
    } catch (e) { /* invalid regex — ignore rule */ }
  }
  return normalizeText(t);
}

/* Order-preserving token diff via LCS. Returns {added:[], removed:[]} capped.
 * Inputs are expected to be normalized (single-spaced) text. */
export function wordDiff(oldT, newT) {
  const a = (oldT || "").split(" ").filter(Boolean).slice(0, 250);
  const b = (newT || "").split(" ").filter(Boolean).slice(0, 250);
  const n = a.length, m = b.length;
  // LCS DP
  const dp = [];
  for (let i = 0; i <= n; i++) dp.push(new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const added = [], removed = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { removed.push(a[i++]); }
    else { added.push(b[j++]); }
  }
  while (i < n) removed.push(a[i++]);
  while (j < m) added.push(b[j++]);
  return { added: added.slice(0, 50), removed: removed.slice(0, 50) };
}

/* Back-compat alias for D1 spike code paths. */
export const lineDiff = wordDiff;

/* Compare two 24x24 grayscale signatures -> ratio of differing cells (0..1). */
export function sigRatio(a, b) {
  if (!a || !b || !a.data || !b.data || a.data.length !== b.data.length) return 1;
  let diff = 0;
  for (let i = 0; i < a.data.length; i++) {
    if (Math.abs(a.data[i] - b.data[i]) > 12) diff++; // per-cell tolerance
  }
  return diff / a.data.length;
}

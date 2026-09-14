# Page Watch core comparison engine

The pure functions that decide whether a watched page changed. No Chrome APIs, no DOM required (except the pixel-signature ratio which operates on plain arrays) — runs in Node and browsers alike. MIT licensed.

## API

```js
import { fnv1a, normalizeText, applyIgnore, wordDiff, lineDiff, sigRatio } from "./diff.js";
```

| Function | Signature | Behavior |
|---|---|---|
| `fnv1a` | `(str) -> hex8` | FNV-1a 32-bit hash, 8-char lowercase hex. Used for snapshot identity + monitor IDs. |
| `normalizeText` | `(text) -> str` | Collapse all whitespace runs to single spaces, trim. |
| `applyIgnore` | `(text, rules[]) -> str` | Strip noise before comparison: each rule is a regex source string applied globally; invalid patterns are skipped silently; result is normalized. |
| `wordDiff` | `(oldText, newText) -> {added[], removed[]}` | LCS-based, **order-preserving** token diff (inputs split on spaces, capped 250 tokens, outputs capped 50). `removed` = tokens gone from old, `added` = tokens new. |
| `lineDiff` | alias of `wordDiff` | Back-compat alias from the D1 spike. |
| `sigRatio` | `(sigA, sigB) -> 0..1` | Fraction of differing cells between two 24×24 grayscale pixel signatures (`{w,h,data:[0..255]}`), per-cell tolerance 12. Visual-diff decision: `ratio > threshold` (default 0.02). Mismatched/missing signatures return 1 (changed). |

## Quick check

```bash
node check.js   # runs the built-in assertions, prints PASS
```

## Why open?

The extension's store listing promises the comparison core stays open and auditable: users can verify exactly what "changed" means, and the project commits to not silently swapping ownership or behavior of the decision logic.

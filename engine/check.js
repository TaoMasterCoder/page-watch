/* Core engine self-check — run: node check.js */
import { fnv1a, normalizeText, applyIgnore, wordDiff, lineDiff, sigRatio } from "./diff.js";

let n = 0;
function eq(name, got, want) {
  const a = JSON.stringify(got), b = JSON.stringify(want);
  if (a !== b) { console.error(`FAIL ${name}\n  got:  ${a}\n  want: ${b}`); process.exit(1); }
  console.log(`✓ ${++n}. ${name}`);
}

eq("fnv1a deterministic", fnv1a("$99.00"), fnv1a("$99.00"));
eq("fnv1a distinguishes", fnv1a("$99.00") !== fnv1a("$79.00"), true);
eq("fnv1a hex8", /^[0-9a-f]{8}$/.test(fnv1a("x")), true);
eq("fnv1a known value", fnv1a("$99.00"), "d45a5e99"); // pinned from e2e baseline

eq("normalize collapses whitespace", normalizeText("  a \n\t b  "), "a b");
eq("normalize null-safe", normalizeText(null), "");

eq("ignore strips noise", applyIgnore("price $9 visit counter: 42", ["visit counter: \\d+"]), "price $9");
eq("ignore invalid regex skipped", applyIgnore("keep me", ["([", "keep"]), "me");
eq("ignore multi rules", applyIgnore("a1 b2 c3", ["\\d", "c"]), "a b");

const d = wordDiff("$398.00 In Stock", "$328.00 In Stock");
eq("wordDiff removed", d.removed, ["$398.00"]);
eq("wordDiff added", d.added, ["$328.00"]);
eq("wordDiff order preserved", wordDiff("a b c", "a x c").added, ["x"]);
eq("lineDiff alias", lineDiff === wordDiff, true);

const sig = (v) => ({ w: 2, h: 2, data: [v, v, v, v] });
eq("sigRatio identical = 0", sigRatio(sig(100), sig(100)), 0);
eq("sigRatio all differ = 1", sigRatio(sig(0), sig(255)), 1);
eq("sigRatio tolerance (delta<=12 same)", sigRatio(sig(100), sig(110)), 0);
eq("sigRatio missing sig = 1", sigRatio(null, sig(1)), 1);

console.log(`\nPASS (${n} assertions)`);

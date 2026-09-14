# Page Watch — Web Change Monitor

Watch any part of any web page — and know the moment it changes.

Page Watch is a Chrome extension that periodically revisits pages **you** choose, compares them against locally stored snapshots, and alerts you with a highlighted diff. Prices, stock status, announcements, competitor pages — anything in the DOM.

- **100% local** — monitors, snapshots and history live in your browser (`chrome.storage.local`). No servers, no accounts, no analytics, nothing uploaded.
- **Point-and-click picker** — click any element to watch it; power users can type CSS selectors.
- **Text + visual diff** — word-level diff (removed/added highlighted) plus a 24×24 grayscale pixel signature that catches layout/theme changes.
- **Ignore rules** — regex filters strip noise like timestamps or visit counters before comparison.
- **Per-monitor intervals** — 5 min to 24 h, with jitter to be gentle on target sites.
- **One-time Pro** — free tier: 3 monitors, no trial timer. Pro: $29 once, unlimited monitors, 30-day refund.

## This repository

This repo hosts the project's public pages and the **core comparison engine** (open-sourced as an anti-rugpull trust commitment — the diff logic that decides "changed or not" is public and auditable):

| Path | What |
|---|---|
| `privacy.html` | Privacy policy (served via GitHub Pages) |
| `engine/diff.js` | Core comparison engine: FNV-1a hash, text normalization, ignore-rule application, LCS order-preserving word diff, pixel-signature ratio |
| `engine/README.md` | Engine API docs + how to run the unit checks |

The full extension (MV3 service worker, offscreen document, popup UI, element picker) is distributed via the Chrome Web Store.

## Privacy

Page Watch collects nothing. Details: **https://taomastercoder.github.io/page-watch/privacy.html**

## License

Engine code: MIT. © 2026 Page Watch.

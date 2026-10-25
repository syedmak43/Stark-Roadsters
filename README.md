# Stark Roadsters — brand site

A complete, responsive static website with an accessible, **real-time interactive WebGL** racing-car **concept** experience and scroll-linked camera. Built without external runtime dependencies and deployable to Vercel.

## Run and test

```sh
npm run dev                 # http://localhost:4173
npm run build               # generates ./dist
npm run check               # validates production assets
npm run preview             # serves ./dist
```

**Vercel:** Import this directory as a project, select `Other` for framework if prompted, set Build Command to `npm run build` and Output Directory to `dist`. The included `vercel.json` configures both. All assets are local; the site requires no third-party CDN.

## Files

- `public/assets/stark-roadsters-logo.png` — **exact supplied logo, unedited.**
- `public/assets/stark-roadsters-palette.png` — supplied official palette reference.
- `src/styles.css` — CSS token system. Exact palette: `#807473`, `#1763A0`, `#1C278A`, `#970F12`, `#997725`.
- `src/index.html` — semantic layout with accessible labels and meta tags.
- `src/scene.js` — dependency-free WebGL renderer for a **procedural illustrative concept**, not a representation of the team's actual car.
- `src/main.js` — scroll-camera linkage, motion control, keyboard/pointer orbit, navigation and team roster integration.
- `data/team.json` — six integration slots, never fabricated personal identities. The public site keeps the roster unpublished until all six names and roles are verified.
- `scripts/build.mjs` — validates the asset signature and resolution, copies the supplied logo byte-for-byte, prepares Vercel's `dist/` output and produces a build report.

## IMPORTANT: Original project not provided

This is a deployable replacement/staging site, **not a modification of the existing Race Pakistan repo**; the original repository was not supplied. The user's original six names/roles, official event details, team achievements, contact details, and actual car assets were also not attached.

### Preserve the six members unchanged
Find the six real names and roles in the original Race Pakistan repository and copy them *verbatim* into `data/team.json` in the same order. The site renders the roster only when all six entries are complete; otherwise it shows one verification notice instead of placeholder profiles. The build checks that there are exactly six records.

### Competition and team claims
Only add official Race Pakistan event information sourced from the competition itself. Keep verified Stark Roadsters team achievements under the team side of the site. No titles, competition wins, sponsors, records, specs or performance numbers have been fabricated.

### Actual car model
The WebGL concept is deliberately identified in the experience UI and footer as **illustrative**. Do not rename it as the team's competition vehicle. To replace it, import authorized official 3D vehicle model assets and retain the original concept disclosure until verified.

## Accessibility
Mobile navigation, skip link, semantic landmarks, high-contrast primary text, keyboard focus indicators, arrow-key 3D camera control (focus the canvas), manual motion toggle, system reduced-motion preference, and no runtime remote services.

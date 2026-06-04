# Parley Landing Site — Design Spec

**Date:** 2026-06-04
**Status:** Approved design, pre-implementation
**Owner:** Saketh Kanchi

## Goal

A single-page, animation-rich marketing site for **Parley** — the self-hosted Discord
meeting-notes bot (records voice meetings, transcribes per-speaker locally, posts AI
notes to a thread). The site sells the project, demonstrates the output with a live
animated demo, and funnels visitors to the GitHub repo and quickstart. FOSS, free to
host, deployed to GitHub Pages.

The bot itself lives in a separate repo (`Discord_Meeting_Bot`). This spec covers only
the **website**, which lives in its own new repo.

## Brand

- **Name:** Parley (noun: a conference or discussion to settle something).
- **Tagline:** *"Discord meetings, transcribed and summarized — on your own machine."*
- **Voice:** technical, confident, a little playful. Audience is developers and Discord
  community/server owners.
- **Logo:** an SVG mark — a row of vertical **waveform bars on the left that progressively
  flatten into a single horizontal notes/thread line on the right**. Encodes "voice →
  written record." Built as code (SVG), so it is crisp at any size and animatable. Used in
  the nav, hero (animated), favicon, and the generated social/OG image.

### Visual system (dark, Discord-native, technical)

Design tokens (exposed as CSS custom properties and mapped into the Tailwind theme):

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#0A0B0F` | page background (near-black navy) |
| `--panel` | `#14161D` | cards, the demo window, code blocks |
| `--panel-2` | `#1C1F2A` | raised/hover surfaces, borders-on-dark |
| `--primary` | `#5865F2` | Discord blurple — primary accent, CTAs, links |
| `--accent` | `#23A559` | live-green — the `[REC]`/online dot, "done" states |
| `--text` | `#E6E8EE` | primary text |
| `--muted` | `#8A90A2` | secondary text, captions |
| `--border` | `#262A36` | hairline borders |

- **Display font:** Space Grotesk (headings, wordmark).
- **Mono font:** JetBrains Mono (transcript lines, code blocks, handles, stats).
- **Body font:** Inter (paragraphs, UI labels).
- Fonts are **self-hosted** via `@fontsource` packages — no external font CDN calls, so
  GitHub Pages stays fast and privacy-clean (consistent with the product's ethos).

## Tech stack

- **Astro 5** — static output, ships minimal JS. Component-based for DRY sections.
- **Tailwind CSS v4** — via the official Astro Tailwind integration (`@tailwindcss/vite`).
  Design tokens above are declared as CSS variables and referenced through Tailwind's
  `@theme`. Utility-first for layout/spacing; tokens keep color/typography consistent.
- **GSAP** + **ScrollTrigger** — animation. **Free plugins only.** No paid plugins
  (SplitText, DrawSVG, MorphSVG). Stroke "draw-on" effects are emulated with
  `stroke-dasharray`/`stroke-dashoffset`; text reveals use per-line/word wrapping done in
  markup or a tiny vanilla splitter, not SplitText.
- **No backend.** Fully static. All "live demo" content is local fake data animated client-side.

### Project layout

```
parley-site/
  astro.config.mjs           # site + base (GitHub Pages), Tailwind (vite plugin)
  package.json
  tailwind.config / CSS @theme tokens
  public/
    favicon.svg, favicon-32.png, apple-touch-icon.png
    og-image.png             # generated from an SVG source, committed
  src/
    styles/global.css        # token CSS vars, @theme mapping, base layer
    layouts/Base.astro       # <head>, meta/OG tags, font imports, skip-link
    components/
      Logo.astro             # the waveform→thread SVG mark (static + animatable variant)
      Nav.astro
      Hero.astro
      WhyStrip.astro
      Demo.astro             # the faux-Discord live demo (markup + data)
      FeatureGrid.astro
      FeatureCard.astro
      Pipeline.astro         # animated architecture diagram (inline SVG)
      Privacy.astro
      Quickstart.astro       # tabbed code blocks + copy buttons
      Footer.astro
    scripts/
      motion.js              # all GSAP setup, gated by gsap.matchMedia()
      demo-timeline.js       # the pinned demo scroll timeline
      copy.js                # clipboard for code blocks
      tabs.js                # quickstart tab switching
    data/
      demo.js                # the fake meeting (cast, transcript beats, notes)
      features.js            # the 8 feature cards
    pages/
      index.astro            # composes the sections in order
  docs/superpowers/          # this spec + the implementation plan
  .github/workflows/deploy.yml
```

## Page structure (single scroll narrative)

Sections compose in `index.astro` in this order. Each is its own `.astro` component.

1. **Nav** — sticky, transparent over hero then gains a panel background on scroll. Logo
   (small, static), section anchors, prominent "⭐ Star on GitHub" button.
2. **Hero** — animated logo (waveform bars settle into the line on load), `Parley`
   wordmark, tagline, two CTAs (primary "Quickstart", secondary "GitHub"), a faint
   animated waveform-particle backdrop, and a small `[REC]` pill nod. One-line trust
   strip ("Free · Self-hosted · No audio ever leaves your machine").
3. **WhyStrip** — a contrast band: left = cloud tools (per-seat pricing, audio uploaded to
   a SaaS), right = Parley (free, local, yours). Short, punchy.
4. **Demo (centerpiece)** — a faux-Discord window pinned during scroll. A GSAP timeline:
   speakers in a voice channel "talk" (per-person animated waveform + `[REC]`), the meeting
   "ends," then a **notes thread types itself out** — TL;DR, Decisions, Action Items grouped
   per person, and per-speaker talk-time bars. Uses the fake meeting in `data/demo.js`.
5. **FeatureGrid** — 8 cards (data-driven from `data/features.js`), stagger-in on scroll,
   subtle hover lift/glow. Features: per-speaker attribution, structured AI notes,
   pluggable summarizer, local speech-to-text, runs anywhere (`node:sqlite`), searchable
   history, auto join/leave, concurrent meetings.
6. **Pipeline** — animated architecture diagram (inline SVG): Discord → Node bot
   (capture, orchestrator, store) ↔ Python faster-whisper sidecar → summarizer →
   notes thread. Connector strokes draw on as the section scrolls into view.
7. **Privacy** — strong statement block: audio is transcribed on your machine; only final
   transcript text is sent to the summarizer you choose (nothing leaves your network with
   Ollama). Lock motif. Consent note (`[REC]` nickname, you obtain participant consent).
8. **Quickstart** — tabbed code blocks (Clone / Sidecar / Configure `.env` / Run) with
   per-block copy buttons. Mirrors the bot README so it stays truthful.
9. **Footer** — links to GitHub repo, README, ISC license, and attribution. Repeats the logo.

## The live demo (detail)

This is the signature element. Behavior:

- A styled faux-Discord client window: left rail (server/channel), a voice-channel panel
  showing the 4 cast members, and a text-channel area where the notes thread appears.
- **Cast (original gamer handles — flavor, no real trademarks):**
  - `PixelPaladin` — lead dev; talks the most; owns the build.
  - `RespawnRita` — QA; finds the bugs.
  - `LootGoblin` — designer; the scope-creep gremlin.
  - `NoScopeNova` — community/marketing; launch hype.
- **Scenario:** *"Pixelforge — Launch Week Sync."* A short standup deciding what ships.
- **Timeline (driven by ScrollTrigger, pinned):**
  1. Voice channel active; members' avatars pulse with animated waveforms as each "speaks"
     (sequenced; a green speaking ring + `[REC]` indicator).
  2. "Meeting ended" beat — waveforms collapse into the thread line (ties to the logo motif).
  3. A **notes thread** types/reveals in the text area:
     - **TL;DR** — 1–2 sentences.
     - **Decisions** — e.g. "Ship date locked to Friday"; "Cut the co-op mode from v1."
     - **Action items grouped per person** — each handle with 1–2 tasks.
     - **Talk-time** — horizontal bars per speaker (PixelPaladin highest).
- All content is static fake data in `data/demo.js`. No real Discord, no network. The
  copy is written to be fun but realistic and to showcase exactly the bot's real output
  shape (`StructuredNotes`: tldr, decisions, action items per person, talk-time).
- Reduced-motion: the demo renders its **final state** immediately (fully revealed notes,
  static bars) with no pinning/typing.

## Motion principles

- All GSAP lives in `scripts/motion.js` and is initialized after DOM load.
- Everything is wrapped in `gsap.matchMedia()` with a `(prefers-reduced-motion: reduce)`
  branch that sets final states without animation and without ScrollTrigger pinning.
- Use transforms/opacity only (no animating layout properties) for 60fps.
- ScrollTrigger pin only for the Demo section; other sections use simple reveal/stagger.
- No paid GSAP plugins. Draw-on effects via `stroke-dashoffset`.

## Deployment

- **GitHub Pages** via GitHub Actions: build with Astro, `actions/upload-pages-artifact`,
  `actions/deploy-pages`. Workflow at `.github/workflows/deploy.yml`, triggered on push to
  the default branch, with `pages: write` / `id-token: write` permissions.
- `astro.config.mjs` sets `site` and `base`. Default assumes a project page
  (`https://<user>.github.io/<repo>/`), so `base` = `/<repo>`. If a custom domain is added
  later, drop `base` and add a `CNAME`. The chosen repo name determines `base`; it is set
  once in config.
- New separate GitHub repo. I scaffold locally in `~/Code/parley-site`, `git init`, get a
  green build, and commit. **The user creates the empty GitHub repo**, then I add the
  remote and push.

## Assets

- **Logo** authored once as an SVG component; favicon SVG + PNG fallbacks derived from it.
- **OG/social image** (`public/og-image.png`, 1200×630): authored as an SVG (logo +
  wordmark + tagline on the dark background) and rasterized to PNG, committed to the repo.
  No external image-generation tool required.

## Testing / verification

- `npm run build` must succeed (Astro production build) — primary gate.
- A light **Playwright smoke** (via the webapp-testing skill) against `npm run preview`:
  the page loads, the hero logo and demo section are present, and the reduced-motion path
  renders the demo's final notes state. Not a full visual-regression suite.
- Manual visual pass in a browser during build (dev server) using the design skills
  (impeccable / ui-ux-pro-max) for polish.

## Non-goals (YAGNI)

- No CMS, no blog, no multi-page docs site (docs stay in the bot README for now).
- No real Discord OAuth, no live bot connection, no backend or analytics.
- No paid GSAP plugins, no external font/asset CDNs.
- No dark/light toggle — the site is dark by design (matches the brand).
- No i18n in v1.
```


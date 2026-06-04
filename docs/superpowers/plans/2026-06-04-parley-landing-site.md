# Parley Landing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, animation-rich marketing site for Parley (the self-hosted Discord meeting-notes bot), deployed free to GitHub Pages.

**Architecture:** Astro 5 static site, component-per-section. Tailwind v4 for layout/utilities with brand design tokens declared as CSS variables and mapped via `@theme`. GSAP + ScrollTrigger (free plugins only) for animation, all gated behind `gsap.matchMedia()` so `prefers-reduced-motion` gets static final states. The signature element is a scroll-pinned faux-Discord "live demo" that animates a meeting into an AI notes thread, driven by local fake data.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@tailwindcss/vite`), GSAP 3 + ScrollTrigger, `@fontsource` self-hosted fonts (Space Grotesk, JetBrains Mono, Inter), GitHub Actions → GitHub Pages, Playwright (smoke only via webapp-testing skill).

**Working directory:** `/home/saketh/Code/parley-site` (already `git init`-ed; contains `docs/` and `.gitignore`). Repo name on GitHub will be `parley` → Pages base path `/parley`.

**Conventions:**
- All commits use: `git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit`.
- Internal asset URLs (favicon, OG, fonts referenced in HTML) use `import.meta.env.BASE_URL`. Nav links are in-page hashes (`#features`) so the base path does not affect them.
- GSAP imports `gsap` and `gsap/ScrollTrigger` from the npm package (self-hosted, no CDN).
- No paid GSAP plugins. Draw-on effects use `stroke-dasharray`/`stroke-dashoffset`.

---

## File Structure

```
parley-site/
  astro.config.mjs              # site, base:'/parley', vite tailwind plugin
  package.json
  tsconfig.json                 # from astro scaffold
  public/
    favicon.svg
    og-image.png                # generated, committed
  src/
    styles/global.css           # @import tailwindcss; token vars; @theme; base layer
    layouts/Base.astro          # <head>, meta+OG, font imports, skip link, slot
    components/
      Logo.astro                # waveform→thread SVG (props: animated, size)
      Nav.astro
      Hero.astro
      WhyStrip.astro
      Demo.astro                # faux-Discord window markup (renders final state)
      FeatureCard.astro
      FeatureGrid.astro
      Pipeline.astro            # inline SVG architecture diagram
      Privacy.astro
      Quickstart.astro          # tabbed code blocks + copy buttons
      Footer.astro
    scripts/
      motion.js                 # GSAP registration + matchMedia orchestration
      demo-timeline.js          # pinned demo scroll timeline (exported fn)
      reveals.js                # generic stagger/reveal + pipeline draw (exported fns)
      tabs.js                   # quickstart tabs (exported initTabs)
      copy.js                   # clipboard copy buttons (exported initCopy)
    data/
      demo.js                   # the fake meeting (cast, beats, notes, talktime)
      features.js               # 8 feature cards
    pages/
      index.astro               # composes sections; imports motion entry
  scripts/
    make-og.mjs                 # builds public/og-image.png from an inline SVG
  test/
    smoke.spec.mjs              # Playwright smoke (build + preview)
  .github/workflows/deploy.yml
  README.md
  LICENSE
```

---

## Task 0: Scaffold Astro + Tailwind + deps

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (temporary), `src/styles/global.css` (temporary)

- [ ] **Step 1: Scaffold an empty Astro project in place**

The directory already exists with `docs/` and `.gitignore`. Scaffold into it without overwriting those.

Run:
```bash
cd ~/Code/parley-site
npm create astro@latest . -- --template minimal --no-install --no-git --skip-houston --yes
```
Expected: creates `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `public/`. If it refuses because the dir is non-empty, answer the prompt to continue (the `--yes` flag should accept). `docs/` and `.gitignore` remain.

- [ ] **Step 2: Install runtime + dev dependencies**

Run:
```bash
cd ~/Code/parley-site
npm install gsap @fontsource/space-grotesk @fontsource/jetbrains-mono @fontsource/inter
npm install -D @tailwindcss/vite tailwindcss @playwright/test
```
Expected: all install with no errors; `node_modules/` present (gitignored).

- [ ] **Step 3: Write `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://sakethkanchi.github.io',
  base: '/parley',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: Replace `src/styles/global.css` with the Tailwind entry + tokens**

```css
@import "tailwindcss";

@theme {
  --color-bg: #0A0B0F;
  --color-panel: #14161D;
  --color-panel-2: #1C1F2A;
  --color-primary: #5865F2;
  --color-accent: #23A559;
  --color-ink: #E6E8EE;
  --color-muted: #8A90A2;
  --color-edge: #262A36;

  --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  html {
    scroll-behavior: smooth;
    background-color: var(--color-bg);
    color: var(--color-ink);
    font-family: var(--font-sans);
  }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
  }

  body { margin: 0; min-height: 100vh; }

  ::selection { background: color-mix(in srgb, var(--color-primary) 40%, transparent); }
}
```

- [ ] **Step 5: Replace `src/pages/index.astro` with a minimal page that imports the CSS**

```astro
---
import '../styles/global.css';
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Parley</title>
  </head>
  <body>
    <main class="p-10">
      <h1 class="font-display text-4xl text-primary">Parley scaffold OK</h1>
    </main>
  </body>
</html>
```

- [ ] **Step 6: Verify the build succeeds**

Run: `cd ~/Code/parley-site && npm run build`
Expected: `npm run build` completes; output written to `dist/`. No Tailwind/Astro errors. The class `text-primary` resolves (Tailwind v4 generates `text-primary` from the `--color-primary` theme token).

- [ ] **Step 7: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "chore: scaffold Astro + Tailwind v4 + deps"
```

---

## Task 1: Base layout (head, meta/OG, fonts, skip link)

**Files:**
- Create: `src/layouts/Base.astro`
- Modify: `src/pages/index.astro` (use the layout)

- [ ] **Step 1: Create `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';

const {
  title = 'Parley — self-hosted Discord meeting notes',
  description = 'Parley records your Discord voice meetings, transcribes them per-speaker on your own machine, and posts AI meeting notes straight into a thread. Free, self-hosted, private.',
} = Astro.props;

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const ogImage = `${Astro.site ?? ''}${base}/og-image.png`;
const canonical = `${Astro.site ?? ''}${base}/`;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/svg+xml" href={`${base}/favicon.svg`} />
    <meta name="theme-color" content="#0A0B0F" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:url" content={canonical} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />
  </head>
  <body class="bg-bg text-ink antialiased">
    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Use the layout in `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base>
  <main id="main" class="p-10">
    <h1 class="font-display text-4xl text-primary">Parley scaffold OK</h1>
  </main>
</Base>
```

- [ ] **Step 3: Verify the build**

Run: `cd ~/Code/parley-site && npm run build`
Expected: build succeeds; fonts bundled (no network references). `dist/index.html` contains the OG tags and the favicon link prefixed with `/parley`.

- [ ] **Step 4: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "feat: base layout with meta/OG tags and self-hosted fonts"
```

---

## Task 2: Logo component + favicon

**Files:**
- Create: `src/components/Logo.astro`, `public/favicon.svg`

The mark: 7 vertical waveform bars on the left whose heights step down, transitioning into a single horizontal line on the right (voice → notes). Two `<g>` groups so motion can target bars vs line separately. When `animated` is true, bars get a class the motion layer animates.

- [ ] **Step 1: Create `src/components/Logo.astro`**

```astro
---
interface Props {
  size?: number;
  animated?: boolean;
  withWordmark?: boolean;
  class?: string;
}
const { size = 32, animated = false, withWordmark = false, class: cls = '' } = Astro.props;
const h = size;
const w = withWordmark ? size * 4.2 : size;
const barClass = animated ? 'parley-bar' : '';
// Seven bars across x=4..28, varying heights; then a line from x=30 to x=44.
const bars = [
  { x: 4, hh: 5 },
  { x: 8, hh: 9 },
  { x: 12, hh: 14 },
  { x: 16, hh: 11 },
  { x: 20, hh: 7 },
  { x: 24, hh: 4 },
  { x: 28, hh: 6 },
];
---
<span class={`inline-flex items-center gap-2 ${cls}`}>
  <svg
    width={h} height={h} viewBox="0 0 48 48" fill="none"
    role="img" aria-label="Parley logo"
    class="parley-logo overflow-visible"
  >
    <g class="parley-bars" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round">
      {bars.map((b) => (
        <line class={barClass} x1={b.x} y1={24 - b.hh} x2={b.x} y2={24 + b.hh} />
      ))}
    </g>
    <line
      class="parley-line"
      x1="30" y1="24" x2="44" y2="24"
      stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"
    />
  </svg>
  {withWordmark && (
    <span class="font-display text-xl font-bold tracking-tight text-ink">Parley</span>
  )}
</span>
```

- [ ] **Step 2: Create `public/favicon.svg`** (static version of the mark)

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <rect width="48" height="48" rx="10" fill="#0A0B0F"/>
  <g stroke="#5865F2" stroke-width="3" stroke-linecap="round">
    <line x1="8" y1="19" x2="8" y2="29"/>
    <line x1="13" y1="15" x2="13" y2="33"/>
    <line x1="18" y1="10" x2="18" y2="38"/>
    <line x1="23" y1="13" x2="23" y2="35"/>
    <line x1="28" y1="17" x2="28" y2="31"/>
  </g>
  <line x1="32" y1="24" x2="42" y2="24" stroke="#23A559" stroke-width="3" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 3: Render the logo on the page to verify it shows**

Temporarily edit `src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Logo from '../components/Logo.astro';
---
<Base>
  <main id="main" class="grid min-h-screen place-items-center gap-6">
    <Logo size={64} withWordmark />
  </main>
</Base>
```

- [ ] **Step 4: Verify the build and visual**

Run: `cd ~/Code/parley-site && npm run build`
Expected: build succeeds. Then `npm run dev` and open the local URL; the waveform→line mark + "Parley" wordmark render in blurple/green on dark. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "feat: Parley logo component and favicon"
```

---

## Task 3: Nav

**Files:**
- Create: `src/components/Nav.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/Nav.astro`**

```astro
---
import Logo from './Logo.astro';
const repo = 'https://github.com/SakethKanchi/parley';
const links = [
  { href: '#demo', label: 'Demo' },
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#quickstart', label: 'Quickstart' },
];
---
<header
  id="nav"
  class="fixed inset-x-0 top-0 z-40 border-b border-transparent transition-colors duration-300"
  data-nav
>
  <nav class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
    <a href="#main" class="flex items-center" aria-label="Parley home">
      <Logo size={28} withWordmark />
    </a>
    <div class="hidden items-center gap-7 md:flex">
      {links.map((l) => (
        <a href={l.href} class="text-sm text-muted transition-colors hover:text-ink">{l.label}</a>
      ))}
    </div>
    <a
      href={repo}
      class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
    >★ Star on GitHub</a>
  </nav>
</header>
<script>
  const nav = document.querySelector('[data-nav]');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 24) {
      nav.classList.add('border-edge', 'bg-bg/80', 'backdrop-blur');
    } else {
      nav.classList.remove('border-edge', 'bg-bg/80', 'backdrop-blur');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
</script>
```

- [ ] **Step 2: Mount Nav in `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
---
<Base>
  <Nav />
  <main id="main" class="pt-24">
    <section class="grid min-h-screen place-items-center">
      <p class="text-muted">Sections go here.</p>
    </section>
  </main>
</Base>
```

- [ ] **Step 3: Verify build + visual**

Run: `cd ~/Code/parley-site && npm run build`
Expected: build succeeds. In `npm run dev`, the nav is transparent at top and gains a translucent dark border/background after scrolling 24px. Stop dev server.

- [ ] **Step 4: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "feat: sticky nav with scroll background"
```

---

## Task 4: Hero

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/Hero.astro`**

```astro
---
import Logo from './Logo.astro';
const repo = 'https://github.com/SakethKanchi/parley';
---
<section class="relative overflow-hidden">
  <!-- ambient gradient glow -->
  <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
    <div class="absolute left-1/2 top-[-10%] h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
         style="background: radial-gradient(closest-side, var(--color-primary), transparent);"></div>
  </div>

  <div class="mx-auto flex max-w-4xl flex-col items-center px-5 pb-24 pt-36 text-center">
    <span class="mb-6 inline-flex items-center gap-2 rounded-full border border-edge bg-panel px-3 py-1 text-xs text-muted">
      <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-accent"></span>
      Free · Self-hosted · No audio ever leaves your machine
    </span>

    <div data-hero-logo class="mb-8">
      <Logo size={88} animated />
    </div>

    <h1 class="font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
      Your Discord meetings,<br />
      <span class="text-primary">transcribed</span> and <span class="text-accent">summarized</span>.
    </h1>

    <p class="mt-6 max-w-2xl text-lg text-muted">
      Parley joins your voice channel, transcribes every speaker on your own machine, and
      drops structured AI meeting notes — decisions, action items, talk-time — straight
      into a Discord thread.
    </p>

    <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
      <a href="#quickstart" class="rounded-xl bg-primary px-6 py-3 font-medium text-white transition-transform hover:scale-[1.03]">Quickstart →</a>
      <a href={repo} class="rounded-xl border border-edge bg-panel px-6 py-3 font-medium text-ink transition-colors hover:border-muted">★ View on GitHub</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Mount Hero (replace the placeholder section) in `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
---
<Base>
  <Nav />
  <main id="main">
    <Hero />
  </main>
</Base>
```

- [ ] **Step 3: Verify build + visual**

Run: `cd ~/Code/parley-site && npm run build`
Expected: build succeeds. Hero shows badge, animated-capable logo, two-color headline, subtext, two CTAs, ambient glow. Stop dev server.

- [ ] **Step 4: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "feat: hero section"
```

---

## Task 5: WhyStrip (contrast band)

**Files:**
- Create: `src/components/WhyStrip.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/WhyStrip.astro`**

```astro
---
const cloud = [
  'Per-seat monthly pricing',
  'Your audio uploaded to their servers',
  'Vendor decides retention & access',
  'Yet another SaaS account',
];
const parley = [
  'Free and open source (ISC)',
  'Audio transcribed on your own machine',
  'You own the data and the database',
  'Runs on a Raspberry Pi or a GPU box',
];
---
<section class="mx-auto max-w-6xl px-5 py-20">
  <div class="grid gap-6 md:grid-cols-2">
    <div class="rounded-2xl border border-edge bg-panel/40 p-8" data-reveal>
      <h2 class="font-display text-sm uppercase tracking-widest text-muted">Cloud meeting tools</h2>
      <ul class="mt-5 space-y-3">
        {cloud.map((c) => (
          <li class="flex items-start gap-3 text-muted">
            <span class="mt-1 text-lg leading-none">✕</span><span>{c}</span>
          </li>
        ))}
      </ul>
    </div>
    <div class="rounded-2xl border border-primary/40 bg-primary/5 p-8" data-reveal>
      <h2 class="font-display text-sm uppercase tracking-widest text-primary">Parley</h2>
      <ul class="mt-5 space-y-3">
        {parley.map((p) => (
          <li class="flex items-start gap-3 text-ink">
            <span class="mt-1 leading-none text-accent">✓</span><span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Mount it after Hero in `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import WhyStrip from '../components/WhyStrip.astro';
---
<Base>
  <Nav />
  <main id="main">
    <Hero />
    <WhyStrip />
  </main>
</Base>
```

- [ ] **Step 3: Verify build**

Run: `cd ~/Code/parley-site && npm run build`
Expected: build succeeds; two-column contrast band renders (✕ muted list vs ✓ highlighted list). `data-reveal` attributes present for later motion wiring.

- [ ] **Step 4: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "feat: why/contrast strip"
```

---

## Task 6: Demo data

**Files:**
- Create: `src/data/demo.js`
- Test: `test/demo-data.test.mjs`

The fake meeting. Shapes mirror the bot's real `StructuredNotes` (tldr, decisions, action items grouped per person) plus talk-time and a sequence of "speaking beats" for the animation.

- [ ] **Step 1: Write a failing data-shape test**

Create `test/demo-data.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { meeting } from '../src/data/demo.js';

test('cast has 4 members with handle + color', () => {
  assert.equal(meeting.cast.length, 4);
  for (const m of meeting.cast) {
    assert.ok(m.handle && m.color && m.role);
  }
});

test('every beat references a real cast handle', () => {
  const handles = new Set(meeting.cast.map((c) => c.handle));
  for (const b of meeting.beats) assert.ok(handles.has(b.handle));
});

test('action items are grouped per cast handle', () => {
  const handles = new Set(meeting.cast.map((c) => c.handle));
  for (const group of meeting.notes.actionItems) {
    assert.ok(handles.has(group.handle));
    assert.ok(group.tasks.length >= 1);
  }
});

test('talk-time percentages sum to ~100', () => {
  const sum = meeting.notes.talkTime.reduce((a, t) => a + t.pct, 0);
  assert.ok(Math.abs(sum - 100) <= 1);
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `cd ~/Code/parley-site && node --test test/demo-data.test.mjs`
Expected: FAIL — cannot find module `../src/data/demo.js`.

- [ ] **Step 3: Create `src/data/demo.js`**

```js
// Fake meeting powering the live demo. Names are original gamer handles (no real trademarks).
export const meeting = {
  server: 'Pixelforge',
  channel: 'launch-week',
  title: 'Launch Week Sync',
  cast: [
    { handle: 'PixelPaladin', role: 'Lead dev', color: '#5865F2', initials: 'PP' },
    { handle: 'RespawnRita',  role: 'QA',        color: '#EB459E', initials: 'RR' },
    { handle: 'LootGoblin',   role: 'Designer',  color: '#FAA61A', initials: 'LG' },
    { handle: 'NoScopeNova',  role: 'Community',  color: '#23A559', initials: 'NN' },
  ],
  // Ordered speaking beats — each lights up one avatar with a short line.
  beats: [
    { handle: 'PixelPaladin', text: 'Build is green on main. Frame pacing fix is in.' },
    { handle: 'RespawnRita',  text: 'Save corruption bug is fixed — but co-op desyncs on level 3.' },
    { handle: 'LootGoblin',   text: 'What if we add one more boss before launch?' },
    { handle: 'PixelPaladin', text: 'No. We freeze scope today or we miss Friday.' },
    { handle: 'NoScopeNova',  text: 'Trailer drops Wednesday, wishlists are climbing.' },
    { handle: 'RespawnRita',  text: 'Then co-op has to be cut or delayed — it is not stable.' },
    { handle: 'PixelPaladin', text: 'Agreed. Ship solo Friday, co-op as a week-1 patch.' },
  ],
  notes: {
    tldr: 'Pixelforge ships solo mode this Friday. Co-op is cut from launch and moves to a week-1 patch due to a level-3 desync. Trailer goes live Wednesday.',
    decisions: [
      'Launch date locked: Friday.',
      'Co-op mode cut from v1 — ships as a week-1 patch.',
      'Scope is frozen as of today — no new content.',
    ],
    actionItems: [
      { handle: 'PixelPaladin', tasks: ['Tag the release branch and freeze scope', 'Prep the week-1 co-op patch plan'] },
      { handle: 'RespawnRita',  tasks: ['File the level-3 desync repro', 'Sign off on the solo-mode build'] },
      { handle: 'LootGoblin',   tasks: ['Shelve the extra-boss design doc for v1.1'] },
      { handle: 'NoScopeNova',  tasks: ['Schedule the trailer for Wednesday', 'Queue the launch-day announcement'] },
    ],
    talkTime: [
      { handle: 'PixelPaladin', pct: 38 },
      { handle: 'RespawnRita',  pct: 27 },
      { handle: 'NoScopeNova',  pct: 20 },
      { handle: 'LootGoblin',   pct: 15 },
    ],
  },
};
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `cd ~/Code/parley-site && node --test test/demo-data.test.mjs`
Expected: PASS — 4/4 tests.

- [ ] **Step 5: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "feat: demo meeting fixture data + shape tests"
```

---

## Task 7: Demo component (faux-Discord, renders final state)

**Files:**
- Create: `src/components/Demo.astro`
- Modify: `src/pages/index.astro`

Renders the full faux-Discord window in its **final/revealed** state (notes thread visible, talk-time bars at full width). The motion layer (Task 12) hides/re-reveals it on scroll; with reduced motion the static final state is exactly what ships. Elements carry `data-*` hooks for the timeline.

- [ ] **Step 1: Create `src/components/Demo.astro`**

```astro
---
import { meeting } from '../data/demo.js';
const { server, channel, title, cast, notes } = meeting;
---
<section id="demo" class="mx-auto max-w-6xl px-5 py-24">
  <div class="mx-auto mb-12 max-w-2xl text-center">
    <h2 class="font-display text-3xl font-bold sm:text-4xl">See it in action</h2>
    <p class="mt-4 text-muted">A real meeting goes in. Structured notes come out — in the thread, attributed to each person.</p>
  </div>

  <div data-demo class="overflow-hidden rounded-2xl border border-edge bg-panel shadow-2xl">
    <!-- window chrome -->
    <div class="flex items-center gap-2 border-b border-edge px-4 py-3">
      <span class="h-3 w-3 rounded-full bg-[#ff5f57]"></span>
      <span class="h-3 w-3 rounded-full bg-[#febc2e]"></span>
      <span class="h-3 w-3 rounded-full bg-[#28c840]"></span>
      <span class="ml-3 font-mono text-xs text-muted">{server} — #{channel}</span>
    </div>

    <div class="grid gap-0 md:grid-cols-[260px_1fr]">
      <!-- voice channel rail -->
      <aside class="border-b border-edge p-4 md:border-b-0 md:border-r">
        <div class="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
          <span class="inline-block h-2 w-2 rounded-full bg-accent"></span> Voice — {title}
        </div>
        <ul class="space-y-2">
          {cast.map((m) => (
            <li data-speaker={m.handle} class="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors">
              <span class="grid h-9 w-9 place-items-center rounded-full font-mono text-xs font-bold text-white" style={`background:${m.color}`}>{m.initials}</span>
              <span class="flex-1">
                <span class="block text-sm text-ink">{m.handle}</span>
                <span class="block text-xs text-muted">{m.role}</span>
              </span>
              <span data-speaking-ring={m.handle} class="h-2 w-2 rounded-full bg-accent opacity-0"></span>
            </li>
          ))}
        </ul>
        <p class="mt-4 inline-flex items-center gap-2 rounded-md bg-bg px-2 py-1 font-mono text-[11px] text-accent">
          <span class="h-1.5 w-1.5 rounded-full bg-accent"></span> [REC]
        </p>
      </aside>

      <!-- thread / notes area -->
      <div class="p-5 md:p-7">
        <div data-thread class="space-y-6">
          <div class="flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-full bg-primary font-mono text-[11px] font-bold text-white">P</span>
            <div>
              <span class="text-sm font-semibold text-ink">Parley</span>
              <span class="ml-2 rounded bg-primary/20 px-1.5 py-0.5 font-mono text-[10px] text-primary">BOT</span>
              <span class="ml-2 font-mono text-xs text-muted">posted meeting notes</span>
            </div>
          </div>

          <div data-note-block>
            <h3 class="font-mono text-xs uppercase tracking-widest text-muted">TL;DR</h3>
            <p class="mt-2 text-ink">{notes.tldr}</p>
          </div>

          <div data-note-block>
            <h3 class="font-mono text-xs uppercase tracking-widest text-muted">Decisions</h3>
            <ul class="mt-2 space-y-1.5">
              {notes.decisions.map((d) => (
                <li class="flex items-start gap-2 text-ink"><span class="mt-1 text-accent">▸</span><span>{d}</span></li>
              ))}
            </ul>
          </div>

          <div data-note-block>
            <h3 class="font-mono text-xs uppercase tracking-widest text-muted">Action items</h3>
            <div class="mt-3 grid gap-3 sm:grid-cols-2">
              {notes.actionItems.map((g) => {
                const m = cast.find((c) => c.handle === g.handle);
                return (
                  <div class="rounded-lg border border-edge bg-bg/50 p-3">
                    <div class="mb-2 flex items-center gap-2">
                      <span class="grid h-6 w-6 place-items-center rounded-full font-mono text-[10px] font-bold text-white" style={`background:${m?.color}`}>{m?.initials}</span>
                      <span class="text-sm font-medium text-ink">{g.handle}</span>
                    </div>
                    <ul class="space-y-1">
                      {g.tasks.map((t) => (
                        <li class="flex items-start gap-2 text-sm text-muted"><span class="mt-0.5 text-primary">☐</span><span>{t}</span></li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div data-note-block>
            <h3 class="font-mono text-xs uppercase tracking-widest text-muted">Talk-time</h3>
            <div class="mt-3 space-y-2">
              {notes.talkTime.map((t) => {
                const m = cast.find((c) => c.handle === t.handle);
                return (
                  <div class="flex items-center gap-3">
                    <span class="w-28 shrink-0 font-mono text-xs text-muted">{t.handle}</span>
                    <span class="h-2.5 flex-1 overflow-hidden rounded-full bg-bg">
                      <span data-bar style={`width:${t.pct}%;background:${m?.color}`} class="block h-full rounded-full"></span>
                    </span>
                    <span class="w-10 text-right font-mono text-xs text-muted">{t.pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Mount Demo after WhyStrip in `src/pages/index.astro`**

Add the import `import Demo from '../components/Demo.astro';` and place `<Demo />` after `<WhyStrip />`.

- [ ] **Step 3: Verify build + visual**

Run: `cd ~/Code/parley-site && npm run build`
Expected: build succeeds. The faux-Discord window shows the voice rail (4 colored avatars + `[REC]`) and a fully-rendered notes thread (TL;DR, decisions, per-person action cards, talk-time bars). Stop dev server.

- [ ] **Step 4: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "feat: faux-Discord demo window (static final state)"
```

---

## Task 8: Features grid

**Files:**
- Create: `src/data/features.js`, `src/components/FeatureCard.astro`, `src/components/FeatureGrid.astro`
- Modify: `src/pages/index.astro`
- Test: `test/features-data.test.mjs`

- [ ] **Step 1: Write a failing test for the feature list**

Create `test/features-data.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { features } from '../src/data/features.js';

test('there are exactly 8 features, each with title, body, icon', () => {
  assert.equal(features.length, 8);
  for (const f of features) {
    assert.ok(f.title && f.body && f.icon);
  }
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `cd ~/Code/parley-site && node --test test/features-data.test.mjs`
Expected: FAIL — cannot find module `../src/data/features.js`.

- [ ] **Step 3: Create `src/data/features.js`** (`icon` is an inline SVG path string, drawn at 24×24)

```js
export const features = [
  { title: 'Per-speaker attribution', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0', body: 'Discord gives each user a separate audio stream, so every line is attributed to the right person — not guessed by an ML model.' },
  { title: 'Structured AI notes', icon: 'M5 4h14M5 9h14M5 14h9M5 19h9', body: 'TL;DR, decisions, open questions, and action items grouped by the person responsible — plus per-speaker talk-time.' },
  { title: 'Pluggable summarizer', icon: 'M4 7h16M4 12h16M4 17h10', body: 'Google Gemini (free tier), any OpenAI-compatible endpoint, or fully-offline Ollama — switch per server, no restart.' },
  { title: 'Local speech-to-text', icon: 'M12 3v18M8 7v10M16 7v10M4 10v4M20 10v4', body: 'A warm faster-whisper sidecar runs on your hardware. Pick a model from tiny to large-v3-turbo.' },
  { title: 'Runs anywhere', icon: 'M3 7h18v10H3zM7 21h10', body: "Node's built-in node:sqlite means no native build. Works on a Raspberry Pi or a GPU server alike." },
  { title: 'Searchable history', icon: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm10 17-5-5', body: 'Full-text /search across every past meeting, backed by SQLite FTS5. Plus /history and /summary.' },
  { title: 'Auto join / leave', icon: 'M15 10l5-3v10l-5-3M3 6h12v12H3z', body: 'Joins when 2+ people are talking, leaves when the room empties. Shows [REC] in its nickname while recording.' },
  { title: 'Concurrent meetings', icon: 'M7 7h10v10H7zM3 3h10v10', body: 'Records multiple channels and servers at once — keyed by guild and channel, with no global single-recording limit.' },
];
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `cd ~/Code/parley-site && node --test test/features-data.test.mjs`
Expected: PASS — 1/1.

- [ ] **Step 5: Create `src/components/FeatureCard.astro`**

```astro
---
interface Props { title: string; body: string; icon: string; }
const { title, body, icon } = Astro.props;
---
<article data-reveal class="group rounded-2xl border border-edge bg-panel/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-panel">
  <span class="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl border border-edge bg-bg text-primary transition-colors group-hover:border-primary/40">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d={icon}></path>
    </svg>
  </span>
  <h3 class="font-display text-lg font-semibold text-ink">{title}</h3>
  <p class="mt-2 text-sm leading-relaxed text-muted">{body}</p>
</article>
```

- [ ] **Step 6: Create `src/components/FeatureGrid.astro`**

```astro
---
import { features } from '../data/features.js';
import FeatureCard from './FeatureCard.astro';
---
<section id="features" class="mx-auto max-w-6xl px-5 py-24">
  <div class="mx-auto mb-14 max-w-2xl text-center">
    <h2 class="font-display text-3xl font-bold sm:text-4xl">Everything a meeting bot should be</h2>
    <p class="mt-4 text-muted">Built for self-hosting, privacy, and the way Discord actually works.</p>
  </div>
  <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {features.map((f) => <FeatureCard title={f.title} body={f.body} icon={f.icon} />)}
  </div>
</section>
```

- [ ] **Step 7: Mount FeatureGrid after Demo in `src/pages/index.astro`** (import + place `<FeatureGrid />`).

- [ ] **Step 8: Verify build + visual**

Run: `cd ~/Code/parley-site && npm run build`
Expected: build succeeds; 8 cards in a responsive grid with hover lift. Stop dev server.

- [ ] **Step 9: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "feat: features grid (data-driven, 8 cards)"
```

---

## Task 9: Pipeline diagram (How it works)

**Files:**
- Create: `src/components/Pipeline.astro`
- Modify: `src/pages/index.astro`

Inline SVG: Discord → Node bot → (HTTP) → Python sidecar → summarizer → thread. Connector paths carry `data-draw` so the motion layer animates `stroke-dashoffset` from full length to 0.

- [ ] **Step 1: Create `src/components/Pipeline.astro`**

```astro
---
const steps = [
  { k: '01', t: 'Capture', d: 'Per-user PCM audio captured from the voice channel — one track per speaker.' },
  { k: '02', t: 'Transcribe locally', d: 'Each track is sent to the warm faster-whisper sidecar on your machine.' },
  { k: '03', t: 'Summarize', d: 'The merged, speaker-labeled transcript goes to your chosen summarizer.' },
  { k: '04', t: 'Deliver', d: 'Structured notes are posted to a Discord thread. Audio is deleted after.' },
];
---
<section id="how" class="mx-auto max-w-6xl px-5 py-24">
  <div class="mx-auto mb-14 max-w-2xl text-center">
    <h2 class="font-display text-3xl font-bold sm:text-4xl">How it works</h2>
    <p class="mt-4 text-muted">Two processes on your hardware. Audio never leaves the box.</p>
  </div>

  <div data-pipeline class="rounded-2xl border border-edge bg-panel/40 p-6 sm:p-10">
    <svg viewBox="0 0 900 120" class="mx-auto hidden w-full max-w-3xl md:block" fill="none" aria-hidden="true">
      <path data-draw d="M120 60 H250" stroke="var(--color-primary)" stroke-width="2" />
      <path data-draw d="M400 60 H530" stroke="var(--color-primary)" stroke-width="2" />
      <path data-draw d="M680 60 H810" stroke="var(--color-primary)" stroke-width="2" />
      <g fill="var(--color-accent)">
        <circle data-draw-dot cx="250" cy="60" r="3" />
        <circle data-draw-dot cx="530" cy="60" r="3" />
        <circle data-draw-dot cx="810" cy="60" r="3" />
      </g>
    </svg>

    <ol class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s) => (
        <li data-reveal class="rounded-xl border border-edge bg-bg/50 p-5">
          <span class="font-mono text-xs text-primary">{s.k}</span>
          <h3 class="mt-1 font-display text-lg font-semibold text-ink">{s.t}</h3>
          <p class="mt-2 text-sm text-muted">{s.d}</p>
        </li>
      ))}
    </ol>
  </div>
</section>
```

- [ ] **Step 2: Mount Pipeline after FeatureGrid in `src/pages/index.astro`** (import + place `<Pipeline />`).

- [ ] **Step 3: Verify build**

Run: `cd ~/Code/parley-site && npm run build`
Expected: build succeeds; 4 numbered steps + connector SVG (visible on md+). `data-draw` paths present.

- [ ] **Step 4: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "feat: how-it-works pipeline diagram"
```

---

## Task 10: Privacy section

**Files:**
- Create: `src/components/Privacy.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/Privacy.astro`**

```astro
---
const points = [
  'Audio is transcribed on the machine running the bot — nothing is uploaded to Parley.',
  'Only the final transcript text is sent to the summarizer you choose. With Ollama, nothing leaves your network at all.',
  'The bot shows [REC] in its nickname whenever a recording is active, so every member can see it.',
];
---
<section id="privacy" class="mx-auto max-w-6xl px-5 py-24">
  <div class="grid items-center gap-10 rounded-2xl border border-accent/30 bg-accent/5 p-8 sm:p-12 md:grid-cols-[auto_1fr]">
    <div class="grid h-20 w-20 place-items-center rounded-2xl border border-accent/40 bg-bg" aria-hidden="true">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <rect x="5" y="11" width="14" height="9" rx="2"></rect>
        <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
      </svg>
    </div>
    <div>
      <h2 class="font-display text-3xl font-bold">Private by architecture</h2>
      <ul class="mt-5 space-y-3">
        {points.map((p) => (
          <li class="flex items-start gap-3 text-ink"><span class="mt-1 text-accent">✓</span><span>{p}</span></li>
        ))}
      </ul>
      <p class="mt-6 text-sm text-muted">Recording voices is subject to consent laws that vary by jurisdiction. You are responsible for obtaining consent from all participants.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Mount Privacy after Pipeline in `src/pages/index.astro`** (import + place `<Privacy />`).

- [ ] **Step 3: Verify build**

Run: `cd ~/Code/parley-site && npm run build`
Expected: build succeeds; lock icon + privacy points + consent note render.

- [ ] **Step 4: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "feat: privacy section"
```

---

## Task 11: Quickstart (tabs + copy)

**Files:**
- Create: `src/components/Quickstart.astro`, `src/scripts/tabs.js`, `src/scripts/copy.js`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/scripts/tabs.js`**

```js
// Wires any [data-tabs] group: buttons[data-tab=ID] toggle panels[data-panel=ID].
export function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const buttons = group.querySelectorAll('[data-tab]');
    const panels = group.querySelectorAll('[data-panel]');
    const activate = (id) => {
      buttons.forEach((b) => {
        const on = b.getAttribute('data-tab') === id;
        b.classList.toggle('bg-panel', on);
        b.classList.toggle('text-ink', on);
        b.classList.toggle('text-muted', !on);
        b.setAttribute('aria-selected', String(on));
      });
      panels.forEach((p) => {
        p.classList.toggle('hidden', p.getAttribute('data-panel') !== id);
      });
    };
    buttons.forEach((b) => b.addEventListener('click', () => activate(b.getAttribute('data-tab'))));
    const first = buttons[0]?.getAttribute('data-tab');
    if (first) activate(first);
  });
}
```

- [ ] **Step 2: Create `src/scripts/copy.js`**

```js
// Copy buttons: [data-copy] whose target text lives in the sibling <pre>.
export function initCopy() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const wrap = btn.closest('[data-codeblock]');
      const pre = wrap?.querySelector('pre');
      if (!pre) return;
      try {
        await navigator.clipboard.writeText(pre.innerText.trim());
        const prev = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = prev; }, 1400);
      } catch {
        btn.textContent = 'Copy failed';
      }
    });
  });
}
```

- [ ] **Step 3: Create `src/components/Quickstart.astro`**

```astro
---
const tabs = [
  {
    id: 'clone', label: '1 · Clone',
    code: `git clone https://github.com/SakethKanchi/Discord_Meeting_Bot.git
cd Discord_Meeting_Bot
npm install`,
  },
  {
    id: 'sidecar', label: '2 · STT sidecar',
    code: `cd stt_sidecar
python -m venv .venv
.venv/bin/pip install -r requirements.txt
cd ..`,
  },
  {
    id: 'env', label: '3 · Configure',
    code: `cp .env.example .env
# then set:
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_app_id
GEMINI_API_KEY=your_gemini_key   # free tier`,
  },
  {
    id: 'run', label: '4 · Run',
    code: `# terminal 1
npm run sidecar
# terminal 2
npm start`,
  },
];
---
<section id="quickstart" class="mx-auto max-w-4xl px-5 py-24">
  <div class="mx-auto mb-12 max-w-2xl text-center">
    <h2 class="font-display text-3xl font-bold sm:text-4xl">Up and running in minutes</h2>
    <p class="mt-4 text-muted">Two processes: the Node bot and the Python transcription sidecar.</p>
  </div>

  <div data-tabs class="overflow-hidden rounded-2xl border border-edge bg-panel/40">
    <div role="tablist" class="flex flex-wrap gap-1 border-b border-edge p-2">
      {tabs.map((t) => (
        <button role="tab" data-tab={t.id} class="rounded-lg px-4 py-2 text-sm text-muted transition-colors hover:text-ink">{t.label}</button>
      ))}
    </div>
    {tabs.map((t) => (
      <div role="tabpanel" data-panel={t.id} data-codeblock class="relative hidden">
        <button data-copy class="absolute right-4 top-4 rounded-md border border-edge bg-bg px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:text-ink">Copy</button>
        <pre class="overflow-x-auto p-6 font-mono text-sm leading-relaxed text-ink"><code>{t.code}</code></pre>
      </div>
    ))}
  </div>

  <p class="mt-6 text-center text-sm text-muted">
    API keys live in <code class="font-mono text-ink">.env</code> only — never typed into Discord. Full docs in the
    <a href="https://github.com/SakethKanchi/Discord_Meeting_Bot#readme" class="text-primary hover:underline">README</a>.
  </p>
</section>
```

- [ ] **Step 4: Mount Quickstart after Privacy in `src/pages/index.astro`** (import + place `<Quickstart />`). Tabs/copy are initialized in Task 12's motion entry.

- [ ] **Step 5: Verify build**

Run: `cd ~/Code/parley-site && npm run build`
Expected: build succeeds; tab buttons + four code panels render (panels start hidden — they activate at runtime in Task 12). Copy buttons present.

- [ ] **Step 6: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "feat: quickstart tabs + copy buttons"
```

---

## Task 12: Motion layer (GSAP) + wire interactions

**Files:**
- Create: `src/scripts/reveals.js`, `src/scripts/demo-timeline.js`, `src/scripts/motion.js`
- Modify: `src/pages/index.astro` (import the motion entry), `src/styles/global.css` (reduced-motion final-state CSS)

All animation is gated behind `gsap.matchMedia()`. The reduced-motion branch leaves everything in its already-rendered final state and still initializes tabs + copy.

- [ ] **Step 1: Create `src/scripts/reveals.js`**

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Fade/slide up any [data-reveal], staggered within a shared parent row.
export function initReveals() {
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      opacity: 0, y: 24, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
}

// Draw the pipeline connectors on scroll via stroke-dashoffset.
export function initPipelineDraw() {
  const section = document.querySelector('[data-pipeline]');
  if (!section) return;
  const paths = section.querySelectorAll('[data-draw]');
  paths.forEach((p) => {
    const len = p.getTotalLength ? p.getTotalLength() : 140;
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
  });
  gsap.to(section.querySelectorAll('[data-draw]'), {
    strokeDashoffset: 0, duration: 0.9, ease: 'power1.inOut', stagger: 0.15,
    scrollTrigger: { trigger: section, start: 'top 75%' },
  });
}
```

- [ ] **Step 2: Create `src/scripts/demo-timeline.js`**

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { meeting } from '../data/demo.js';

// Pin the demo window and play: speakers light up in sequence, then the notes
// thread + talk-time bars reveal.
export function initDemoTimeline() {
  const demo = document.querySelector('[data-demo]');
  if (!demo) return;

  // Start states.
  gsap.set('[data-thread] [data-note-block]', { opacity: 0, y: 16 });
  gsap.set('[data-thread] [data-bar]', { scaleX: 0, transformOrigin: 'left center' });
  gsap.set('[data-speaking-ring]', { opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#demo',
      start: 'top top',
      end: '+=2600',
      scrub: 0.6,
      pin: true,
    },
  });

  // Sequence speaking beats: pulse each speaker's ring + row.
  meeting.beats.forEach((b) => {
    const ring = `[data-speaking-ring="${b.handle}"]`;
    const row = `[data-speaker="${b.handle}"]`;
    tl.to(ring, { opacity: 1, duration: 0.15 })
      .to(row, { backgroundColor: 'rgba(35,165,89,0.10)', duration: 0.15 }, '<')
      .to(row, { backgroundColor: 'rgba(0,0,0,0)', duration: 0.2 }, '+=0.2')
      .to(ring, { opacity: 0, duration: 0.15 }, '<');
  });

  // Reveal the notes thread blocks, then animate talk-time bars.
  tl.to('[data-thread] [data-note-block]', { opacity: 1, y: 0, duration: 0.4, stagger: 0.25 }, '+=0.1')
    .to('[data-thread] [data-bar]', { scaleX: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, '-=0.3');
}
```

- [ ] **Step 3: Create `src/scripts/motion.js`** (single entry; orchestrates everything)

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initReveals, initPipelineDraw } from './reveals.js';
import { initDemoTimeline } from './demo-timeline.js';
import { initTabs } from './tabs.js';
import { initCopy } from './copy.js';

gsap.registerPlugin(ScrollTrigger);

function start() {
  // Interactions run regardless of motion preference.
  initTabs();
  initCopy();

  const mm = gsap.matchMedia();

  // Full motion.
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Hero logo settle: bars scale in from flat, line draws.
    const heroBars = gsap.utils.toArray('[data-hero-logo] .parley-bar');
    if (heroBars.length) {
      gsap.from(heroBars, { scaleY: 0, transformOrigin: 'center', duration: 0.5, stagger: 0.06, ease: 'back.out(2)' });
      gsap.from('[data-hero-logo] .parley-line', { scaleX: 0, transformOrigin: 'left center', duration: 0.5, delay: 0.3 });
    }
    initReveals();
    initPipelineDraw();
    initDemoTimeline();
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  });

  // Reduced motion: everything stays in its rendered final state. Nothing to animate.
  mm.add('(prefers-reduced-motion: reduce)', () => {});
}

if (document.readyState !== 'loading') start();
else document.addEventListener('DOMContentLoaded', start);
```

Note: the `drawSVG: undefined` key is a no-op placeholder kept out — remove it; the line uses `scaleX`. Final hero-line tween must be exactly:
```js
gsap.from('[data-hero-logo] .parley-line', { scaleX: 0, transformOrigin: 'left center', duration: 0.5, delay: 0.3 });
```

- [ ] **Step 4: Add reduced-motion safety CSS to `src/styles/global.css`** (append at end)

```css
/* With reduced motion, ensure animated-by-JS elements are fully visible even if JS is slow/off. */
@media (prefers-reduced-motion: reduce) {
  [data-note-block] { opacity: 1 !important; transform: none !important; }
  [data-bar] { transform: scaleX(1) !important; }
  [data-draw] { stroke-dashoffset: 0 !important; }
}
/* Pre-JS guard against flash: only when JS will animate (no-preference), hide reveal targets initially. */
@media (prefers-reduced-motion: no-preference) {
  .js-ready [data-reveal] { will-change: transform, opacity; }
}
```

- [ ] **Step 5: Import the motion entry in `src/pages/index.astro`**

Add a module script at the end of the page (Astro bundles it):
```astro
<script>
  import '../scripts/motion.js';
</script>
```

- [ ] **Step 6: Verify build + manual motion check**

Run: `cd ~/Code/parley-site && npm run build`
Expected: build succeeds (GSAP bundled). Then `npm run dev`: hero bars settle on load; scrolling pins the demo and plays speakers → notes reveal → bars grow; feature cards and pipeline connectors animate in; quickstart tabs switch and copy works. Toggle OS "reduce motion" and reload — the demo notes are fully visible immediately, tabs/copy still work, nothing janks. Stop dev server.

- [ ] **Step 7: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "feat: GSAP motion layer (hero, reveals, pinned demo, pipeline draw) + reduced-motion fallbacks"
```

---

## Task 13: Footer + final page assembly

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro` (final composition order)

- [ ] **Step 1: Create `src/components/Footer.astro`**

```astro
---
import Logo from './Logo.astro';
const repo = 'https://github.com/SakethKanchi/parley';
const botRepo = 'https://github.com/SakethKanchi/Discord_Meeting_Bot';
---
<footer class="border-t border-edge">
  <div class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-12 sm:flex-row sm:justify-between">
    <a href="#main" class="flex items-center" aria-label="Parley home"><Logo size={26} withWordmark /></a>
    <nav class="flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
      <a href={botRepo} class="hover:text-ink">Bot repo</a>
      <a href={`${botRepo}#readme`} class="hover:text-ink">README</a>
      <a href={`${botRepo}/blob/master/LICENSE`} class="hover:text-ink">ISC License</a>
      <a href={repo} class="hover:text-ink">Site source</a>
    </nav>
    <p class="font-mono text-xs text-muted">© 2026 Saketh Kanchi</p>
  </div>
</footer>
```

- [ ] **Step 2: Final `src/pages/index.astro` — confirm exact composition order**

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import WhyStrip from '../components/WhyStrip.astro';
import Demo from '../components/Demo.astro';
import FeatureGrid from '../components/FeatureGrid.astro';
import Pipeline from '../components/Pipeline.astro';
import Privacy from '../components/Privacy.astro';
import Quickstart from '../components/Quickstart.astro';
import Footer from '../components/Footer.astro';
---
<Base>
  <Nav />
  <main id="main">
    <Hero />
    <WhyStrip />
    <Demo />
    <FeatureGrid />
    <Pipeline />
    <Privacy />
    <Quickstart />
  </main>
  <Footer />
  <script>
    import '../scripts/motion.js';
  </script>
</Base>
```

- [ ] **Step 3: Verify build + full visual pass**

Run: `cd ~/Code/parley-site && npm run build`
Expected: build succeeds. `npm run dev`: full page scrolls top-to-bottom — nav, hero, contrast, pinned demo, features, pipeline, privacy, quickstart, footer — all coherent in the dark Discord-native theme. Stop dev server.

- [ ] **Step 4: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "feat: footer + final page assembly"
```

---

## Task 14: OG image + favicon PNG fallbacks

**Files:**
- Create: `scripts/make-og.mjs`, `public/og-image.png`
- Modify: `package.json` (add a `make:og` script)

Generate a 1200×630 social card from an inline SVG using `sharp` (dev-only). The PNG is committed so the build never depends on the generator.

- [ ] **Step 1: Add `sharp` as a dev dependency**

Run: `cd ~/Code/parley-site && npm install -D sharp`
Expected: installs without error.

- [ ] **Step 2: Create `scripts/make-og.mjs`**

```js
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public', 'og-image.png');

const bars = [
  { x: 360, hh: 22 }, { x: 384, hh: 40 }, { x: 408, hh: 62 },
  { x: 432, hh: 48 }, { x: 456, hh: 30 }, { x: 480, hh: 18 }, { x: 504, hh: 26 },
];
const barLines = bars
  .map((b) => `<line x1="${b.x}" y1="${315 - b.hh}" x2="${b.x}" y2="${315 + b.hh}" stroke="#5865F2" stroke-width="10" stroke-linecap="round"/>`)
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0A0B0F"/>
  <g transform="translate(0,-70)">${barLines}
    <line x1="528" y1="315" x2="600" y2="315" stroke="#23A559" stroke-width="10" stroke-linecap="round"/>
  </g>
  <text x="600" y="420" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="88" font-weight="700" fill="#E6E8EE">Parley</text>
  <text x="600" y="478" text-anchor="middle" font-family="Inter, sans-serif" font-size="30" fill="#8A90A2">Self-hosted Discord meeting notes</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(out, png);
console.log('wrote', out, png.length, 'bytes');
```

- [ ] **Step 3: Add the script to `package.json`** (`scripts` block)

```json
"make:og": "node scripts/make-og.mjs"
```

- [ ] **Step 4: Generate the PNG**

Run: `cd ~/Code/parley-site && npm run make:og`
Expected: prints `wrote .../public/og-image.png <N> bytes`; file exists.

- [ ] **Step 5: Verify build references it**

Run: `cd ~/Code/parley-site && npm run build`
Expected: build succeeds; `dist/og-image.png` present; `dist/index.html` `og:image` points at `/parley/og-image.png`.

- [ ] **Step 6: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "feat: generated OG social image"
```

---

## Task 15: Playwright smoke test

**Files:**
- Create: `test/smoke.spec.mjs`, `playwright.config.mjs`
- Modify: `package.json` (add `test:e2e`)

Smoke only: the built site serves, key sections exist, and the reduced-motion path shows the demo's final notes immediately.

- [ ] **Step 1: Create `playwright.config.mjs`**

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  testMatch: '**/*.spec.mjs',
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321/parley/',
    reuseExistingServer: false,
    timeout: 60_000,
  },
  use: { baseURL: 'http://localhost:4321/parley/' },
});
```

- [ ] **Step 2: Create `test/smoke.spec.mjs`**

```js
import { test, expect } from '@playwright/test';

test('landing page loads with all key sections', async ({ page }) => {
  await page.goto('/parley/');
  await expect(page.locator('h1')).toContainText('transcribed');
  for (const id of ['#demo', '#features', '#how', '#privacy', '#quickstart']) {
    await expect(page.locator(id)).toHaveCount(1);
  }
  await expect(page.locator('[data-demo]')).toBeVisible();
});

test('quickstart tabs switch panels', async ({ page }) => {
  await page.goto('/parley/');
  await page.locator('[data-tab="run"]').click();
  await expect(page.locator('[data-panel="run"]')).toBeVisible();
  await expect(page.locator('[data-panel="clone"]')).toBeHidden();
});

test.describe('reduced motion', () => {
  test.use({ colorScheme: 'dark', reducedMotion: 'reduce' });
  test('notes thread is fully visible immediately', async ({ page }) => {
    await page.goto('/parley/');
    const blocks = page.locator('[data-thread] [data-note-block]');
    const n = await blocks.count();
    for (let i = 0; i < n; i++) {
      await expect(blocks.nth(i)).toBeVisible();
    }
  });
});
```

- [ ] **Step 3: Add the script to `package.json`** and install the browser

```json
"test:e2e": "playwright test"
```
Run: `cd ~/Code/parley-site && npx playwright install chromium`
Expected: Chromium downloads.

- [ ] **Step 4: Build, then run the smoke test**

Run:
```bash
cd ~/Code/parley-site
npm run build
npm run test:e2e
```
Expected: all 3 tests PASS (preview server boots, sections present, tabs switch, reduced-motion notes visible).

- [ ] **Step 5: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "test: Playwright smoke (sections, tabs, reduced-motion)"
```

---

## Task 16: GitHub Pages deploy workflow + repo docs

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`, `LICENSE`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: '24'
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Create `LICENSE`** (ISC, matching the bot)

```
ISC License

Copyright (c) 2026 Saketh Kanchi

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

- [ ] **Step 3: Create `README.md`**

```markdown
# Parley — landing site

Marketing site for [Parley](https://github.com/SakethKanchi/Discord_Meeting_Bot), the
self-hosted Discord meeting-notes bot. Astro + Tailwind v4 + GSAP, deployed to GitHub Pages.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run test:e2e # Playwright smoke tests
npm run make:og  # regenerate public/og-image.png
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to
GitHub Pages. The site is served under the `/parley` base path (set in `astro.config.mjs`).
To use a custom domain, drop `base` from the config and add a `CNAME` file in `public/`.

## License

[ISC](./LICENSE) © Saketh Kanchi
```

- [ ] **Step 4: Verify build still green**

Run: `cd ~/Code/parley-site && npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
cd ~/Code/parley-site
git add -A
git -c user.name="sakethkanchi" -c user.email="sidequesttheappoperations@gmail.com" commit -m "ci: GitHub Pages deploy workflow + README + LICENSE"
```

- [ ] **Step 6: Push (after the user creates the empty GitHub repo `parley`)**

This step is gated on the user creating `https://github.com/SakethKanchi/parley` (empty, no README). Then:
```bash
cd ~/Code/parley-site
git branch -M main
git remote add origin git@github.com:SakethKanchi/parley.git
git push -u origin main
```
Then in the repo: Settings → Pages → Source = "GitHub Actions". The next push (or a manual `workflow_dispatch`) publishes the site to `https://sakethkanchi.github.io/parley/`.

---

## Self-Review

**Spec coverage:**
- Brand (name/tagline/voice) → Hero, Nav, Footer, Logo (T2–T4, T13). ✓
- Logo waveform→thread, animatable → T2 + hero settle in T12. ✓
- Visual tokens (exact palette + 3 fonts, self-hosted) → T0 `@theme`, T1 font imports. ✓
- Tailwind v4 → T0. ✓
- GSAP + ScrollTrigger, free plugins only, draw via dashoffset → T12. ✓
- `gsap.matchMedia()` reduced-motion final state → T12 + global.css guards. ✓
- All 9 sections (Nav, Hero, Why, Demo, Features, Pipeline, Privacy, Quickstart, Footer) → T3–T13. ✓
- Live demo: faux-Discord, cast of 4 named handles, scenario, pinned timeline, per-person action items, talk-time, reduced-motion final state → T6, T7, T12. ✓
- Features: 8 cards data-driven → T8. ✓
- Pipeline diagram draw-on → T9 + T12. ✓
- Privacy + consent note → T10. ✓
- Quickstart tabbed + copy, mirrors README → T11. ✓
- Self-hosted fonts (no CDN) → T1. ✓
- OG image generated as SVG→PNG, committed; favicon → T2, T14. ✓
- Deploy via Actions to Pages, base `/parley`, CNAME-ready → T0 config, T16. ✓
- New separate repo, scaffold+commit locally, user makes remote, then push → working dir + T16 Step 6. ✓
- Verify: build green + Playwright smoke → every task's build step + T15. ✓
- Non-goals respected (no CMS/blog/multi-page, no backend, no paid plugins, no light mode, no i18n). ✓

**Placeholder scan:** No TBD/TODO. No stray/no-op keys — every code block is final and runnable as written.

**Type/name consistency:** `meeting` export used identically in T6 data, T7 component, T12 timeline, T15 test. `data-*` hooks consistent across Demo markup (T7) and timeline (T12): `data-demo`, `data-speaker`, `data-speaking-ring`, `data-thread`, `data-note-block`, `data-bar`, `data-pipeline`, `data-draw`, `data-reveal`, `data-tabs`/`data-tab`/`data-panel`, `data-codeblock`/`data-copy`. `features` export consistent T8 data/component/test. Base path `/parley` consistent across config, Playwright config, smoke test. Repo URLs: site repo `SakethKanchi/parley`; bot repo `SakethKanchi/Discord_Meeting_Bot` — used consistently.
```


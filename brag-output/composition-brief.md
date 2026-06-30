# Hyperframes Composition Brief: Parley

## Objective
Create a short launch-style brag video for Parley — a self-hosted Discord meeting-notes bot.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 25 seconds (extended from 20s to add the web-dashboard payoff scene)

## Source Material
- Project root: `/home/saketh/Code/parley-site`
- Primary files read: `src/components/Hero.astro`, `src/data/demo.js`, `src/data/features.js`, `src/styles/global.css`, `PRODUCT.md`, `README.md`
- Product name: Parley
- Tagline / strongest claim: "Your Discord meetings, transcribed and summarized." / "No audio leaves your machine."
- Key UI or visual moment to recreate: the `LIVE // VOICE CAPTURE` instrument frame (oscilloscope + REC dot) and the faux-Discord speaker panel that resolves into an AI NOTES card.
- Copy that must appear verbatim:
  - "No audio leaves your machine."
  - Speaker lines: "Build is green on main.", "Co-op desyncs on level 3.", "Freeze scope today or we miss Friday."
  - Decision chips: "Launch: Friday", "Co-op → week-1 patch", "Scope frozen today"
  - "Per-speaker attribution", "Local speech-to-text", "Pluggable summarizer"
  - "Self-hosted Discord meeting notes."
  - "github.com/SakethKanchi/parley · ISC · Free"

## Creative Direction
- Tone preset: app-store
- Creative direction: developer-grade instrument launch — dark, precise, confident, a little playful
- Interpretation: clean feature-forward reveals, smooth slides/wipes, no chaos; purposeful motion (speakers light up, notes type out). Hold text long enough to read.
- Angle: Show the product doing its thing — a live meeting comes alive, then raw voices collapse into structured notes posted to a thread, all running locally. Hook is the privacy promise; payoff is chaos → decision log in seconds.
- Hook: black screen, oscilloscope draws, pulsing REC dot, mono line slams: "No audio leaves your machine."
- Outro / punchline: Parley wordmark slams with phosphor-green accent, tagline + repo credit beneath.
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals (no generic particles, blobs, equalizer bars)
  - Unrelated visual redesign — stay in the project's dark instrument aesthetic

## Visual Identity
- Background: #08090E (deep ink); panels #11131B / #191C28; edges #232838
- Text: #E9EBF4 (ink) / #888FA6 (muted)
- Accent: #2FD673 (phosphor green) + #5B6BFF (blurple primary)
- Display font: Bricolage Grotesque (extrabold headlines); fallback ui-sans-serif
- Body font: Manrope; mono: JetBrains Mono (labels, handles, code); fallbacks ui-monospace
- Visual references from the project: thin-bordered instrument frame, 28px grid overlay (rgba(120,130,180,0.05)), `live-dot` pulse, faux-Discord avatars (PP #5865F2, RR #EB459E, LG #FAA61A, NN #23A559) with mono handles, `→ thread` tag, talk-time bars.

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Hook / capture — 3s — oscilloscope draws over grid, REC dot pulses, "No audio leaves your machine." slams and holds.
2. The live meeting — 5s — faux-Discord panel; 3 speaker lines type in one-by-one, active avatar glows.
3. Notes form (payoff) — 5s — panel resolves to AI NOTES → thread; TL;DR types, 3 decision chips snap in, talk-time bars fill.
4. Feature cards — 3.6s — 3 clean feature cards slide in one-by-one.
5. Web dashboard (second payoff) — 4s — REAL self-hosted web admin in a browser frame, slow Ken-Burns push, 3 pills snap in (Browse history · Track action items · Search transcripts).
6. Outro / wordmark — 4s — Parley wordmark slams, tagline + repo credit, hold.

## Audio
- Audio role: clean rhythmic-but-restrained tech bed (sparse professional accents over a low pulsing bed).
- Audio arc: low bed under the hook → steady through the meeting with soft per-line pops → gentle swell as notes form → confident through feature cards → one low hit at the wordmark, then fade.
- Music: `happy-beats-business-moves-vol-9-by-ende-dot-app.mp3` (clean, minimal business bed; final choice after lint/preview — may swap among vol-9/10/11/12 for best fit).
- Music treatment: start low under hook, hold steady, subtle swell on the notes payoff (~9s) and outro slam (~17s), soft fade-out on the final hold.
- Music cue guidance: bundled preset at `assets/music/cues/<track>.music-cues.json` (`strongCues` + `beats`). Lock outro wordmark slam and notes-card reveal to nearby strong cues (±0.15s). Snap decision chips / feature cards to consecutive beats (±0.10s) but hold each readable text item to its floor (every other beat, not every beat).
- Audio-reactive treatment: subtle — oscilloscope draw and `live-dot` presence breathe with music RMS. No waveform-bar/equalizer visuals.
- Audio-coupled moments:
  - Scene 1 — soft tick when the hook line lands; scope draw tracks energy.
  - Scene 2 — soft pop per speaker line (every other beat).
  - Scene 3 — light snap per decision chip; soft fill on talk-time bars; "send" whoosh on `→ thread`.
  - Scene 4 — card-slide sound per feature card arrival.
  - Scene 5 — one clean low impact on the wordmark slam (beat-locked to a strong cue).
- SFX selection guidance: use `interface`/`ui` soft pops for lines, `casino` card sounds for the feature cards, one `impact` hit for the wordmark. Keep it sparse — max ~one sound per beat.
- SFX analysis guidance: `assets/sfx/sfx-analysis.md` / `.json` — prefer low high-frequency-risk files for repeated pops and chips.
- Exact SFX choice: Hyperframes chooses filenames, timestamps, density, and volume after the animation exists.
- Audio files: copy the chosen music and any selected SFX into `brag-output/composition/assets/`.

## Hyperframes Instructions
Use the current `hyperframes` skill and CLI workflow. Prefer native Hyperframes conventions over anything in `/brag`.

Requirements:
- Show at least one real UI/copy element from the project (the instrument frame + faux-Discord panel are mandatory).
- Keep all text readable in the final render; honor the reading-time floor.
- Keep the video within 15-25 seconds (target 25s).
- Scene 5 must show a REAL screenshot of the Parley web admin (assets/shots/dashboard-dark.webp), captured against a marketing-safe demo DB (fictional Pixelforge studio).
- Include the planned music + sparse SFX layer.
- 1-3 strong cue locks only; snap sequential reveals to consecutive beats but never outrun reading.
- At least one subtle audio-reactive element (scope/live-dot), or document extraction failure.
- Use local assets for audio and media.
- Run `hyperframes lint` and validate before render.

# Brag Plan: Parley

## What is this app?
Parley is a self-hosted Discord bot that records voice meetings, transcribes every speaker locally on your own hardware, and posts AI-generated structured notes — TL;DR, decisions, action items, talk-time — straight into a Discord thread.

## The angle
Show the product *doing its thing*, not describing it. A live meeting happens — four gamer-handle teammates argue about a launch — speakers light up as they talk, then the raw voices collapse into clean structured notes posted to a thread. The whole pipeline runs locally; no audio leaves the machine. The hook is the privacy promise; the payoff is watching chaos turn into a decision log in seconds.

## Hook (first 2-3 seconds)
Black screen, a single oscilloscope waveform drawing left-to-right with a pulsing red `REC` dot, and one mono line slamming in: **"No audio leaves your machine."** Privacy-first, instrument aesthetic, instantly signals "this is a real dev tool, not SaaS."

## Key moments (the middle)
- **The live meeting** — a faux-Discord panel where 4 avatars (blurple / pink / amber / green) light up one by one as each speaks a short real line from the demo data ("Build is green on main." → "Co-op desyncs on level 3." → "Freeze scope today or we miss Friday.").
- **Notes forming** — the panel resolves into an `AI NOTES` card: TL;DR types out, then 3 decision chips snap in one by one, then action items grouped by person. This is the first payoff scene.
- **Feature cards** — 3 clean cards slide in: per-speaker attribution, local faster-whisper STT, pluggable summarizer (Gemini · Ollama · OpenAI).
- **The web dashboard (NEW)** — a browser-framed shot of the real self-hosted web admin slams in: meeting counts, an activity chart, top speakers, recent meetings. Three mono pills snap in — `Browse history` · `Track action items` · `Search transcripts`. A slow Ken-Burns push makes the real product the second, bigger payoff. This is the headline addition: the video used to stop at "notes posted to a thread"; now it shows where you live with them.

## Outro / punchline
The Parley wordmark slams in with the phosphor-green accent, tagline beneath, and a mono credit line: `github.com/SakethKanchi/parley · ISC · Free`.

## User flow worth showing
Entry → key action → result, pulled straight from the live demo:
1. **Voice channel fills** — teammates talk, each speaker attributed to their own avatar (entry).
2. **Local transcription** — per-speaker lines resolve under the waveform (key action).
3. **Structured notes posted to thread** — TL;DR, decisions, action items appear (result).
This flow is the centerpiece (Scenes 2–3), recreated from `src/data/demo.js` and the `Demo`/`Hero` components — not landing-page section lists.

## Tone
- Preset: app-store
- Creative direction: developer-grade instrument launch — dark, precise, confident, a little playful
- Interpretation: clean feature-forward reveals, smooth slides/wipes, no chaos; the product is treated as a real shipping tool. Holds long enough to read; motion is purposeful (speakers light up, notes type out) echoing the site's own "motion with purpose" principle.

## Format: landscape — 1920x1080
## Duration: 24s (extended from 20s to add the web-dashboard payoff scene)

## Visual identity (from the project)
- Background: #08090E (deep ink)
- Accent: #2FD673 (phosphor green) + #5B6BFF (blurple primary)
- Text: #E9EBF4 (ink) / #888FA6 (muted)
- Display font: Bricolage Grotesque (extrabold for headlines)
- Body font: Manrope; mono: JetBrains Mono (labels, handles, code)
- Strongest visual element: the `LIVE // VOICE CAPTURE` instrument frame with oscilloscope + the faux-Discord speaker panel. Avatar colors: PP #5865F2, RR #EB459E, LG #FAA61A, NN #23A559. Use thin `--color-edge` #232838 borders, 28px grid lines, and the `live-dot` pulse motif.

## Share copy (draft)
Watched my Discord standup turn into a clean decision log — TL;DR, action items, talk-time — without a single byte of audio leaving my machine. Parley is a self-hosted meeting-notes bot. Free, open, ISC.

## Audio direction
- Role: clean rhythmic-but-restrained tech bed; smooth app-store polish, not hype.
- Music: a minimal, slightly pulsing electronic bed (selected at composition time). Low and supportive under the meeting, lifts subtly when notes form and at the outro wordmark.
- Music treatment: start under the hook at low volume, hold steady through the meeting, gentle swell on the notes payoff and the outro slam, soft fade on the final hold.
- Music cue guidance: track + tempo to be detected at composition time (`npx hyperframes beats` or `analyze_music_cues.py`). Target a strong cue for the outro wordmark slam (~17s) and the notes-card reveal (~9s). Beat-grid windows for the two sequential reveals (speaker lines ~4–8s, decision chips ~10–13s) — but hold each TEXT item to its reading floor, snap to every other beat, not every beat.
- Audio-reactive treatment: subtle; let the oscilloscope/waveform and the `live-dot` presence breathe with music RMS. No waveform-bar gimmicks.
- SFX posture: sparse, motion-matched, professional. Soft pop per speaker line; light snap per decision chip; one clean low hit on the outro wordmark; a soft "send/whoosh" when notes post to the thread.
- Audio-coupled moments: speaker lines typing in, decision chips snapping one-by-one, talk-time bars filling, wordmark slam.
- Restraint rule: never let SFX get busy or cartoonish; this is a precision instrument, not a game ad. Max ~one sound per beat.

## Storyboard

### Scene 1 — Hook / capture — 3s
Black (#08090E) with faint 28px grid. An oscilloscope waveform draws left-to-right across a thin-bordered frame; a `LIVE // VOICE CAPTURE` mono label sits top-left, a pulsing red `REC` dot top-right. Mono line slams in center-low and holds: **"No audio leaves your machine."**
Sequential/interaction: yes — waveform draws across over ~1.2s, then the line slams in and holds ~1.5s.
Audio intent: quiet anticipation; the bed enters, a soft scope hum.
Audio-coupled idea: waveform draw subtly tracks music energy; a soft tick when the line lands.
Music: minimal pulsing bed, low.
Transition mood: clean wipe → Scene 2

### Scene 2 — The live meeting — 5s
Faux-Discord panel: header `Pixelforge › #launch-week · Launch Week Sync`. Four avatars in a row (PP blurple, RR pink, LG amber, NN green) with mono handles. Three speaker beats reveal one by one — the speaking avatar glows and its short line types in beneath: 1) PixelPaladin "Build is green on main." 2) RespawnRita "Co-op desyncs on level 3." 3) PixelPaladin "Freeze scope today or we miss Friday." A small mono footer reads `whisper · local · per-speaker`.
Sequential/interaction: yes — 3 lines appear one by one, each ~1.5s, speaker avatar lights up as its line types in. Hold the set briefly after the third.
Audio intent: the room is alive; each line a soft, satisfying arrival.
Audio-coupled idea: soft pop per line; live-dot pulse on the active speaker.
Music: bed holds steady.
Transition mood: smooth slide → Scene 3

### Scene 3 — Notes form (payoff) — 5s
The meeting panel resolves/wipes into an `AI NOTES → thread` card. **TL;DR** types out in one tight line: "Solo mode ships Friday. Co-op cut to a week-1 patch. Trailer Wednesday." Then a `DECISIONS` row: three chips snap in one by one — "Launch: Friday" · "Co-op → week-1 patch" · "Scope frozen today". Then a compact talk-time strip: 4 thin bars fill to PP 38 / RR 27 / NN 20 / LG 15. A `→ thread` tag confirms it's posted.
Sequential/interaction: yes — TL;DR types (~1.2s hold), 3 decision chips snap every other beat (~0.6s apart, then hold the full set ~1s), talk-time bars fill together (~0.8s).
Audio intent: chaos becoming order; a gentle lift.
Audio-coupled idea: light snap per chip, soft fill swoosh on the bars, a "send" whoosh on the `→ thread` tag.
Music: subtle swell as the card completes.
Transition mood: smooth wipe → Scene 4

### Scene 4 — Feature cards — 4s
Three clean feature cards slide in left-to-right, app-store style, each with a thin icon, title, and one supporting line:
1) "Per-speaker attribution — every line tied to the right person, not guessed."
2) "Local speech-to-text — a warm faster-whisper sidecar on your hardware."
3) "Pluggable summarizer — Gemini · Ollama · OpenAI, switch per server."
Sequential/interaction: yes — cards arrive one by one (~0.9s each) with a soft card sound, then hold together ~1s.
Audio intent: confident, feature-forward; each card a clean beat.
Audio-coupled idea: card-slide sound per arrival.
Music: bed steady, building slightly toward outro.
Transition mood: smooth slide → Scene 5

### Scene 5 — The web dashboard (second payoff) — 4s
The real self-hosted web admin slams into a browser-style instrument frame (mac dots + `parley // web admin` label). It's an actual screenshot: the **Dashboard** with `6 meetings · 5 people` counts, the `Total talk time` / `Open action items` stat cards, the **Activity** line chart, **Top speakers** bars, and **Recent meetings**. A slow Ken-Burns push-in sells that it's a live product, not a mockup. Three mono pills snap in along the bottom one by one: `Browse history` · `Track action items` · `Search transcripts`. This is the headline addition — the notes don't just vanish into a thread, they live in a dashboard you own.
Sequential/interaction: yes — frame slams (~0.5s), slow scale push over the hold, 3 pills snap on the beat (~0.5s apart), hold ~1s.
Audio intent: the "and there's a whole app" reveal; a confident lift.
Audio-coupled idea: one soft announcement cue on the frame slam, light snap per pill.
Music: bed lifts toward the outro.
Transition mood: smooth slide → Scene 6

### Scene 6 — Outro / wordmark — 3s
Deep ink, faint grid, a small `live-dot`. The **Parley** wordmark slams in at full scale (Bricolage extrabold, blurple→phosphor accent on the dot/underline). Tagline beneath in mono: "Self-hosted Discord meeting notes." Then a credit line: `github.com/SakethKanchi/parley · ISC · Free`. Hold on the wordmark.
Sequential/interaction: yes — wordmark slams (~0.4s in), tagline + credit fade up beneath, long hold.
Audio intent: clean landing; one confident low hit, then a soft fade.
Audio-coupled idea: low hit on the wordmark slam synced to a strong music cue (~22.64s).
Music: brief swell on the slam, then gentle fade-out.
Transition mood: hold to end

**Music mood for this video:** clean, minimal, slightly pulsing electronic — app-store polish, not hype.
**Audio summary:** A low pulsing bed enters under a quiet privacy hook, holds steady while a live meeting comes alive with soft per-line pops, lifts gently as raw voices resolve into structured notes, stays confident through three feature cards, swells as the real web dashboard reveals, and lands on a single low hit at the wordmark before fading out.

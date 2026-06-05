# Product

## Register

brand

## Users

Developers and Discord community/server owners who run self-hosted infrastructure. They value privacy, control, and avoiding SaaS subscriptions. Technical enough to clone a repo and configure a `.env` file. They use Discord for team voice meetings and want structured notes without sending audio to third-party clouds.

## Product Purpose

Parley is a self-hosted Discord bot that records voice meetings, transcribes per-speaker locally, and posts AI-generated structured notes (TL;DR, decisions, action items, talk-time) into a Discord thread. The website sells the project, demonstrates the output with a scroll-driven faux-Discord demo, and funnels visitors to the GitHub repo and quickstart.

Success = a visitor understands what Parley does in under 10 seconds, trusts the privacy promise, and clicks through to the repo or quickstart.

## Brand Personality

- **Technical, confident, a little playful.** The audience is developers; the tone respects their intelligence without being dry.
- **Privacy-first but not paranoid.** The messaging is strong on architecture (local transcription, self-hosted) without fear-mongering.
- **Discord-native.** The visual language borrows from Discord's own UI (blurple, dark panels, rounded corners, mono handles) so the product feels at home in its ecosystem.
- Three words: *precise, independent, alive.*

## Anti-references

- **Typical SaaS landing pages** with generic gradient blobs, 3-up feature cards with stock icons, and "empower your workflow" copy.
- **Corporate blue-and-white trust badges.** This is open-source, self-hosted, and developer-facing. No enterprise lock-in aesthetics.
- **Overly playful / gamey.** The gamer handles in the demo are flavor, not the primary voice. The site should not read as a gaming product.
- **Glassmorphism / frosted glass as decoration.** The nav uses backdrop-blur on scroll for functional readability, not as a visual crutch.

## Design Principles

1. **Show, don't tell.** The faux-Discord demo is the centerpiece; visitors should read a fake meeting and see notes form before they read a feature list.
2. **Practice what you preach.** The site is static, self-hosted on GitHub Pages, uses no external CDNs, and respects `prefers-reduced-motion`. The design embodies the product's values.
3. **Discord-native minimalism.** Dark, clean, technical. Information density is appropriate for developers — not sparse, not cluttered.
4. **Motion with purpose.** Animations explain the product (speakers light up, notes type out, pipeline draws). No decorative motion for its own sake.
5. **Trust through transparency.** The privacy section is prominent. The code is open. The design doesn't hide behind marketing polish.

## Accessibility & Inclusion

- `prefers-reduced-motion: reduce` is a first-class citizen. All GSAP is gated behind `matchMedia`; reduced motion sees the final state immediately.
- Contrast targets WCAG AA (4.5:1 for body, 3:1 for large text).
- Skip link, semantic landmarks, `aria-label` on nav, keyboard-navigable tabs.
- No content is gated behind animation completion.

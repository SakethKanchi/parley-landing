import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { meeting } from '../data/demo.js';

// Demo playback.
//  Desktop: pin the card and scrub a narrative as the user scrolls through it
//           — transcript fills, then crossfades to the notes which pan into view.
//           A fixed-height stage means content is always present (never an empty void).
//  Mobile:  the card keeps its natural height and auto-plays once on scroll-in.
export function initDemoTimeline() {
  const demo = document.querySelector('[data-demo]');
  if (!demo) return;
  const isNarrow = window.matchMedia('(max-width: 768px)').matches;

  // Shared start states.
  const reset = () => {
    gsap.set('[data-beat]', { opacity: 0, y: 10 });
    gsap.set('[data-rec-badge]', { opacity: 0, scale: 0.8 });
    gsap.set('[data-meeting-ended]', { opacity: 0, y: 8 });
    gsap.set('[data-stage-notes] [data-note-block]', { opacity: 0, y: 14 });
    gsap.set('[data-stage-notes] [data-bar]', { scaleX: 0, transformOrigin: 'left center' });
    gsap.set('[data-speaking-ring]', { opacity: 0 });
  };

  const playBeats = (tl) => {
    meeting.beats.forEach((b, i) => {
      const ring = `[data-speaking-ring="${b.handle}"]`;
      const row = `[data-speaker="${b.handle}"]`;
      const msg = `[data-beat="${i}"]`;
      tl.to(ring, { opacity: 1, duration: 0.2 }, '+=0.12')
        .to(row, { backgroundColor: 'color-mix(in srgb, var(--color-accent) 9%, transparent)', duration: 0.2 }, '<')
        .to(msg, { opacity: 1, y: 0, duration: 0.4 }, '<')
        .to(row, { backgroundColor: 'rgba(0,0,0,0)', duration: 0.3 }, '+=0.22')
        .to(ring, { opacity: 0, duration: 0.2 }, '<');
    });
  };

  // ---- Mobile: natural layout, auto-play once ----
  if (isNarrow) {
    reset();
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
    tl.to('[data-rec-badge]', { opacity: 1, scale: 1, duration: 0.3 });
    playBeats(tl);
    tl.to('[data-meeting-ended]', { opacity: 1, y: 0, duration: 0.35 }, '+=0.15')
      .to('[data-rec-badge]', { opacity: 0, scale: 0.8, duration: 0.25 }, '<');
    tl.to('[data-stage-notes] [data-note-block]', { opacity: 1, y: 0, duration: 0.4, stagger: 0.16 }, '+=0.2')
      .to('[data-stage-notes] [data-bar]', { scaleX: 1, duration: 0.55, stagger: 0.1 }, '-=0.35');

    ScrollTrigger.create({ trigger: '#demo', start: 'top 72%', once: true, onEnter: () => tl.play() });
    return;
  }

  // ---- Desktop: fixed-height stage, pinned scrub ----
  const stage = demo.querySelector('[data-stage]');
  const tLayer = demo.querySelector('[data-stage-transcript]');
  const nLayer = demo.querySelector('[data-stage-notes]');
  const nScroll = demo.querySelector('[data-notes-scroll]');
  if (!stage || !tLayer || !nLayer || !nScroll) return;

  // Measure natural heights BEFORE absolutely positioning the layers.
  const stageH = Math.max(Math.ceil(tLayer.offsetHeight), 400);
  const notesH = Math.ceil(nScroll.offsetHeight);
  const panY = Math.max(0, notesH - stageH + 28);

  gsap.set(stage, { height: stageH });
  gsap.set([tLayer, nLayer], { position: 'absolute', inset: 0, margin: 0 });
  gsap.set(tLayer, { overflow: 'hidden' });
  gsap.set(nLayer, { overflow: 'hidden', opacity: 0 });
  reset();

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '[data-demo-pin]',
      start: 'top 90px',
      end: '+=2200',
      scrub: 0.7,
      pin: '[data-demo-pin]',
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  tl.to('[data-rec-badge]', { opacity: 1, scale: 1, duration: 0.4 });
  playBeats(tl);
  tl.to('[data-meeting-ended]', { opacity: 1, y: 0, duration: 0.4 }, '+=0.2');
  tl.to(tLayer, { opacity: 0, duration: 0.5 }, '+=0.25')
    .to(nLayer, { opacity: 1, duration: 0.5 }, '<');
  tl.to('[data-stage-notes] [data-note-block]', { opacity: 1, y: 0, stagger: 0.14, duration: 0.4 }, '-=0.1')
    .to('[data-stage-notes] [data-bar]', { scaleX: 1, stagger: 0.1, duration: 0.5 }, '-=0.2');
  if (panY > 0) tl.to(nScroll, { y: -panY, duration: 2 }, '+=0.3');
  tl.to({}, { duration: 0.4 }); // brief hold at the end
}

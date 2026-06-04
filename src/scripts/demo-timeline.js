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
      invalidateOnRefresh: true,
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

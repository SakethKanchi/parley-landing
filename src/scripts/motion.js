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
      gsap.fromTo(heroBars, { scaleY: 0 }, { scaleY: 1, transformOrigin: 'center', duration: 0.5, stagger: 0.06, ease: 'back.out(2)' });
      gsap.fromTo('[data-hero-logo] .parley-line', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.5, delay: 0.3 });
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

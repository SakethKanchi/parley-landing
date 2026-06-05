import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initReveals, initPipelineDraw } from './reveals.js';
import { initDemoTimeline } from './demo-timeline.js';
import { initTabs } from './tabs.js';
import { initCopy } from './copy.js';
import { initHeroScope } from './hero-scope.js';
import { initTheme } from './theme.js';

gsap.registerPlugin(ScrollTrigger);

function initHeroEntrance() {
  const tl = gsap.timeline({ delay: 0.1, defaults: { ease: 'power3.out' } });

  const items = gsap.utils.toArray('[data-hero-stagger]');
  if (items.length) {
    tl.fromTo(items,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 },
    );
  }

  const visual = document.querySelector('[data-hero-visual]');
  if (visual) {
    tl.fromTo(visual,
      { opacity: 0, y: 26, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out' },
      '-=0.45',
    );
  }
}

function initFeatureStagger() {
  const grid = document.querySelector('[data-feature-grid]');
  if (!grid) return;
  const cards = grid.querySelectorAll('[data-reveal]');
  if (!cards.length) return;
  gsap.fromTo(cards,
    { opacity: 0, y: 28 },
    {
      opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.06,
      scrollTrigger: { trigger: grid, start: 'top 84%' },
    },
  );
}

function initNavScrollSpy() {
  const navLinks = document.querySelectorAll('header nav a[href^="#"]');
  if (!navLinks.length) return;

  const sections = Array.from(navLinks)
    .map((a) => {
      const id = a.getAttribute('href')?.replace('#', '');
      const el = id ? document.getElementById(id) : null;
      return { link: a, el };
    })
    .filter((s) => s.el);

  if (!sections.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;
    let active = sections[0];
    for (const s of sections) {
      if (s.el && s.el.offsetTop <= scrollPos) active = s;
    }
    sections.forEach((s) => s.link.classList.remove('text-ink'));
    if (active) active.link.classList.add('text-ink');
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function start() {
  // Interactions run regardless of motion preference.
  initTabs();
  initCopy();
  initNavScrollSpy();
  initTheme();
  initHeroScope(); // self-gates on reduced motion (static frame)

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    initHeroEntrance();
    initReveals();
    initFeatureStagger();
    initPipelineDraw();
    initDemoTimeline();
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  });

  // Reduced motion: final states are already visible via CSS; nothing to animate.
  mm.add('(prefers-reduced-motion: reduce)', () => {});
}

if (document.readyState !== 'loading') start();
else document.addEventListener('DOMContentLoaded', start);

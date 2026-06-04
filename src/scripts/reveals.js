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

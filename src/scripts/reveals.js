import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Fade/slide up any [data-reveal].
export function initReveals() {
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      },
    );
  });
}

// Draw the pipeline rail + stagger the step nodes on scroll.
export function initPipelineDraw() {
  const section = document.querySelector('[data-pipeline]');
  if (section) {
    const rail = section.querySelector('[data-rail]');
    if (rail) {
      gsap.fromTo(rail,
        { width: '0%' },
        {
          width: '100%', duration: 1.6, ease: 'power2.inOut',
          scrollTrigger: { trigger: section, start: 'top 78%' },
        },
      );
    }

    const steps = section.querySelectorAll('[data-pipeline-step]');
    if (steps.length) {
      gsap.fromTo(steps,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.15,
          scrollTrigger: { trigger: section, start: 'top 76%' },
        },
      );
    }
  }

  const mobileSection = document.querySelector('[data-pipeline-mobile]');
  if (mobileSection) {
    const line = mobileSection.querySelector('[data-draw-vertical]');
    if (line) {
      gsap.to(line, {
        height: '100%', duration: 1.5, ease: 'power2.inOut',
        scrollTrigger: { trigger: mobileSection, start: 'top 82%' },
      });
    }
  }
}

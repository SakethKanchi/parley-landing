/**
 * Oscilloscope waveform for the hero "live capture" panel.
 * A scrolling speech-like waveform drawn on a centered baseline.
 * Respects prefers-reduced-motion: draws one static frame, no loop.
 */
export function initHeroScope() {
  const canvas = document.querySelector('[data-hero-scope]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = getComputedStyle(document.documentElement);
  const primary = css.getPropertyValue('--color-primary').trim() || '#5B6BFF';
  const accent = css.getPropertyValue('--color-accent').trim() || '#2FD673';

  let w = 0, h = 0, dpr = 1, rafId = 0, t = 0, active = true;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Speech-like amplitude envelope: clusters of energy with quiet gaps.
  function envelope(x, phase) {
    const a = Math.sin(x * 0.6 + phase) * 0.5 + 0.5;
    const b = Math.sin(x * 0.21 + phase * 0.5) * 0.5 + 0.5;
    const burst = Math.pow(Math.sin(x * 0.07 + phase * 0.3) * 0.5 + 0.5, 3);
    return Math.min(1, (a * 0.4 + b * 0.6) * (0.25 + burst));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const mid = h / 2;
    const step = 3;

    // baseline
    ctx.strokeStyle = primary;
    ctx.globalAlpha = 0.18;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, mid);
    ctx.lineTo(w, mid);
    ctx.stroke();

    // waveform line
    ctx.globalAlpha = 0.95;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.shadowColor = primary;
    ctx.shadowBlur = 8;
    ctx.strokeStyle = primary;
    ctx.beginPath();
    for (let px = 0; px <= w; px += step) {
      const xn = px * 0.05;
      const env = envelope(xn, t);
      const wobble = Math.sin(px * 0.45 + t * 4) + Math.sin(px * 0.17 - t * 2.3) * 0.6;
      const y = mid + wobble * env * (h * 0.4);
      px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // scanning playhead
    const headX = ((t * 60) % (w + 40)) - 20;
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(headX, 6);
    ctx.lineTo(headX, h - 6);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function loop() {
    if (!active) return;
    t += 0.02;
    draw();
    rafId = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);

  if (reduced) {
    t = 1.2;
    draw();
    return;
  }

  rafId = requestAnimationFrame(loop);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !active) { active = true; rafId = requestAnimationFrame(loop); }
      else if (!e.isIntersecting && active) { active = false; cancelAnimationFrame(rafId); }
    });
  }, { threshold: 0 });
  io.observe(canvas);

  return () => { active = false; cancelAnimationFrame(rafId); io.disconnect(); window.removeEventListener('resize', resize); };
}

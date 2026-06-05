// Wires any [data-tabs] group: buttons[data-tab=ID] toggle panels[data-panel=ID].
// Click activates; ArrowLeft/ArrowRight/Home/End move between tabs.
// Panels crossfade via opacity (200ms) before the hidden class toggles.
export function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const buttons = Array.from(group.querySelectorAll('[data-tab]'));
    const panels = Array.from(group.querySelectorAll('[data-panel]'));

    const activate = (id, focus = false) => {
      // Update buttons immediately
      buttons.forEach((b) => {
        const on = b.getAttribute('data-tab') === id;
        b.classList.toggle('bg-panel', on);
        b.classList.toggle('text-ink', on);
        b.classList.toggle('text-muted', !on);
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        if (on && focus) b.focus();
      });

      const current = panels.find((p) => !p.classList.contains('hidden'));
      const next = panels.find((p) => p.getAttribute('data-panel') === id);
      if (!next || current === next) return;

      // Crossfade: fade out current, swap, fade in next
      if (current) {
        current.classList.add('opacity-0');
        setTimeout(() => {
          current.classList.add('hidden');
          next.classList.remove('hidden');
          // force reflow so transition plays
          void next.offsetWidth;
          next.classList.remove('opacity-0');
        }, 200);
      } else {
        next.classList.remove('hidden', 'opacity-0');
      }
    };

    buttons.forEach((b, i) => {
      b.addEventListener('click', () => activate(b.getAttribute('data-tab')));
      b.addEventListener('keydown', (e) => {
        let nextIdx = -1;
        if (e.key === 'ArrowRight') nextIdx = (i + 1) % buttons.length;
        else if (e.key === 'ArrowLeft') nextIdx = (i - 1 + buttons.length) % buttons.length;
        else if (e.key === 'Home') nextIdx = 0;
        else if (e.key === 'End') nextIdx = buttons.length - 1;
        if (nextIdx >= 0) {
          e.preventDefault();
          activate(buttons[nextIdx].getAttribute('data-tab'), true);
        }
      });
    });

    const first = buttons[0]?.getAttribute('data-tab');
    if (first) activate(first);
  });
}

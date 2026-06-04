// Wires any [data-tabs] group: buttons[data-tab=ID] toggle panels[data-panel=ID].
// Click activates; ArrowLeft/ArrowRight/Home/End move between tabs.
export function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const buttons = Array.from(group.querySelectorAll('[data-tab]'));
    const panels = group.querySelectorAll('[data-panel]');
    const activate = (id, focus = false) => {
      buttons.forEach((b) => {
        const on = b.getAttribute('data-tab') === id;
        b.classList.toggle('bg-panel', on);
        b.classList.toggle('text-ink', on);
        b.classList.toggle('text-muted', !on);
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        if (on && focus) b.focus();
      });
      panels.forEach((p) => {
        p.classList.toggle('hidden', p.getAttribute('data-panel') !== id);
      });
    };
    buttons.forEach((b, i) => {
      b.addEventListener('click', () => activate(b.getAttribute('data-tab')));
      b.addEventListener('keydown', (e) => {
        let next = -1;
        if (e.key === 'ArrowRight') next = (i + 1) % buttons.length;
        else if (e.key === 'ArrowLeft') next = (i - 1 + buttons.length) % buttons.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = buttons.length - 1;
        if (next >= 0) {
          e.preventDefault();
          activate(buttons[next].getAttribute('data-tab'), true);
        }
      });
    });
    const first = buttons[0]?.getAttribute('data-tab');
    if (first) activate(first);
  });
}

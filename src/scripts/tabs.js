// Wires any [data-tabs] group: buttons[data-tab=ID] toggle panels[data-panel=ID].
export function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const buttons = group.querySelectorAll('[data-tab]');
    const panels = group.querySelectorAll('[data-panel]');
    const activate = (id) => {
      buttons.forEach((b) => {
        const on = b.getAttribute('data-tab') === id;
        b.classList.toggle('bg-panel', on);
        b.classList.toggle('text-ink', on);
        b.classList.toggle('text-muted', !on);
        b.setAttribute('aria-selected', String(on));
      });
      panels.forEach((p) => {
        p.classList.toggle('hidden', p.getAttribute('data-panel') !== id);
      });
    };
    buttons.forEach((b) => b.addEventListener('click', () => activate(b.getAttribute('data-tab'))));
    const first = buttons[0]?.getAttribute('data-tab');
    if (first) activate(first);
  });
}

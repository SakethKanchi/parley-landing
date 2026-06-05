/**
 * Theme switcher. Reads saved preference from localStorage, applies the
 * [data-theme] attribute to <html>, and wires the nav toggle.
 *
 * Themes: parley, catppuccin, rose-pine, kanagawa, tokyo-night
 */

const THEME_KEY = 'parley-theme';
const themes = ['parley', 'catppuccin', 'rose-pine', 'kanagawa', 'tokyo-night'];

export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const preferred = themes.includes(saved) ? saved : 'parley';
  applyTheme(preferred);

  // Wire desktop dropdown
  const select = document.querySelector('[data-theme-select]');
  if (select) {
    select.value = preferred;
    select.addEventListener('change', (e) => {
      applyTheme(e.target.value);
    });
  }

  // Wire mobile dropdown
  const mobileSelect = document.querySelector('[data-theme-select-mobile]');
  if (mobileSelect) {
    mobileSelect.value = preferred;
    mobileSelect.addEventListener('change', (e) => {
      applyTheme(e.target.value);
    });
  }
}

function applyTheme(name) {
  if (!themes.includes(name)) return;
  document.documentElement.setAttribute('data-theme', name);
  localStorage.setItem(THEME_KEY, name);

  // Update any active selects
  document.querySelectorAll('[data-theme-select], [data-theme-select-mobile]').forEach((el) => {
    if (el.value !== name) el.value = name;
  });
}

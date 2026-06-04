// Copy buttons: [data-copy] whose target text lives in the sibling <pre>.
export function initCopy() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const wrap = btn.closest('[data-codeblock]');
      const pre = wrap?.querySelector('pre');
      if (!pre) return;
      const prev = btn.textContent;
      try {
        await navigator.clipboard.writeText(pre.innerText.trim());
        btn.textContent = 'Copied';
      } catch {
        btn.textContent = 'Copy failed';
      }
      setTimeout(() => { btn.textContent = prev; }, 1400);
    });
  });
}

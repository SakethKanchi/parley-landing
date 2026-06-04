// Copy buttons: [data-copy] whose target text lives in the sibling <pre>.
export function initCopy() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const wrap = btn.closest('[data-codeblock]');
      const pre = wrap?.querySelector('pre');
      if (!pre) return;
      try {
        await navigator.clipboard.writeText(pre.innerText.trim());
        const prev = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = prev; }, 1400);
      } catch {
        btn.textContent = 'Copy failed';
      }
    });
  });
}

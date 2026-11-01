(() => {
  const modal = document.getElementById('UpcomingModal');
  if (!modal) return;

  const displayDuration = 2700;
  const fadeDuration = 500;
  let state = 'closed';
  let displayTimeout;
  let fadeTimeout;

  const openModal = () => {
    if (state !== 'closed') return;
    window.clearTimeout(displayTimeout);
    window.clearTimeout(fadeTimeout);
    state = 'open';
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        modal.classList.add('is-open');
      });
    });

    displayTimeout = window.setTimeout(() => {
      state = 'closing';
      modal.classList.remove('is-open');
      modal.classList.add('is-closing');
      fadeTimeout = window.setTimeout(() => {
        state = 'closed';
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('is-closing');
      }, fadeDuration);
    }, displayDuration);
  };

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest('[data-upcoming-trigger]');
    if (!trigger) return;
    event.preventDefault();
    openModal();
  });

  document.addEventListener('keydown', (event) => {
    if (state === 'closed') {
      const trigger =
        event.target instanceof Element
          ? event.target.closest('[data-upcoming-trigger][role="button"]')
          : null;
      if (trigger && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        openModal();
      }
    }
  });
})();

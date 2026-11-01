(() => {
  const modal = document.getElementById('UpcomingModal');
  if (!modal) return;

  const panel = modal.querySelector('.upcoming-modal__panel');
  const closeButton = modal.querySelector('.upcoming-modal__close');
  const transitionDuration = 800;
  let state = 'closed';
  let closeTimeout;
  let previousFocus;
  let previousBodyOverflow;

  const openModal = () => {
    if (state === 'open') return;
    window.clearTimeout(closeTimeout);
    state = 'open';
    previousFocus = document.activeElement;
    if (modal.hidden) previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        modal.classList.add('is-open');
        closeButton.focus();
      });
    });
  };

  const closeModal = () => {
    if (state !== 'open') return;
    state = 'closing';
    modal.classList.remove('is-open');
    closeTimeout = window.setTimeout(() => {
      state = 'closed';
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = previousBodyOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    }, transitionDuration);
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
      return;
    }

    if (event.key === 'Escape' && state === 'open') {
      event.preventDefault();
      closeModal();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      closeButton.focus();
    }
  });

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  panel.addEventListener('click', (event) => event.stopPropagation());
})();

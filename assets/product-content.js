(() => {
  const initializeReviews = (root) => {
    if (root.dataset.productReviewsInitialized === 'true') return;

    const track = root.querySelector('[data-product-reviews-track]');
    const previousButton = root.querySelector('[data-product-reviews-previous]');
    const nextButton = root.querySelector('[data-product-reviews-next]');
    if (!track || !previousButton || !nextButton) return;

    root.dataset.productReviewsInitialized = 'true';
    const desktop = window.matchMedia('(min-width: 750px)');

    const updateControls = () => {
      const hasOverflow = desktop.matches && track.scrollWidth > track.clientWidth + 1;
      root.classList.toggle('has-desktop-overflow', hasOverflow);
      previousButton.disabled = track.scrollLeft <= 1;
      nextButton.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    };

    const scrollByCard = (direction) => {
      const card = track.querySelector('.zz-product-review');
      if (!card) return;
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
      track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
    };

    previousButton.addEventListener('click', () => scrollByCard(-1));
    nextButton.addEventListener('click', () => scrollByCard(1));
    track.addEventListener('scroll', updateControls, { passive: true });
    desktop.addEventListener('change', updateControls);
    new ResizeObserver(updateControls).observe(track);
    new MutationObserver(updateControls).observe(track, { childList: true, subtree: true });
    updateControls();
  };

  const initializeFaqs = (root) => {
    if (root.dataset.productFaqsInitialized === 'true') return;

    const items = root.querySelectorAll('.zz-product-faq__item');
    if (items.length === 0) return;
    root.dataset.productFaqsInitialized = 'true';

    items.forEach((item) => {
      const summary = item.querySelector('summary');
      const wrapper = item.querySelector('.zz-product-faq__answer-wrapper');
      if (!summary || !wrapper) return;

      let closeTimer;
      wrapper.addEventListener('transitionend', (event) => {
        if (event.target !== wrapper || event.propertyName !== 'grid-template-rows') return;
        if (wrapper.dataset.closing === 'true') {
          item.open = false;
          wrapper.style.removeProperty('grid-template-rows');
          delete wrapper.dataset.closing;
        } else {
          wrapper.style.removeProperty('grid-template-rows');
        }
      });

      summary.addEventListener('click', (event) => {
        event.preventDefault();
        window.clearTimeout(closeTimer);

        if (item.open && wrapper.dataset.closing === 'true') {
          delete wrapper.dataset.closing;
          wrapper.style.gridTemplateRows = '1fr';
          return;
        }

        if (item.open) {
          wrapper.dataset.closing = 'true';
          wrapper.style.gridTemplateRows = '0fr';
          closeTimer = window.setTimeout(() => {
            if (wrapper.dataset.closing === 'true') {
              item.open = false;
              wrapper.style.removeProperty('grid-template-rows');
              delete wrapper.dataset.closing;
            }
          }, 850);
          return;
        }

        item.open = true;
        delete wrapper.dataset.closing;
        wrapper.style.gridTemplateRows = '0fr';
        wrapper.getBoundingClientRect();
        requestAnimationFrame(() => wrapper.style.removeProperty('grid-template-rows'));
      });
    });
  };

  const initializeContent = (scope = document) => {
    if (scope.matches?.('[data-product-reviews]')) initializeReviews(scope);
    scope.querySelectorAll?.('[data-product-reviews]').forEach(initializeReviews);
    if (scope.matches?.('.zz-product-faq')) initializeFaqs(scope);
    scope.querySelectorAll?.('.zz-product-faq').forEach(initializeFaqs);
  };

  initializeContent();
  document.addEventListener('shopify:section:load', (event) => initializeContent(event.target));
})();

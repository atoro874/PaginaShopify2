(() => {
  const initializeGallery = (gallery) => {
    if (gallery.dataset.initialized === 'true') return;

    const images = Array.from(gallery.querySelectorAll('[data-zz-gallery-image]'));
    const thumbnails = Array.from(gallery.querySelectorAll('[data-zz-gallery-thumbnail]'));
    const dialog = gallery.querySelector('[data-zz-gallery-dialog]');
    const dialogImage = gallery.querySelector('[data-zz-gallery-dialog-image]');
    const counter = gallery.querySelector('[data-zz-gallery-counter]');
    const hideTimers = new WeakMap();

    if (images.length === 0) return;
    gallery.dataset.initialized = 'true';

    let activeIndex = 0;

    const showImage = (index) => {
      const nextIndex = (index + images.length) % images.length;
      if (nextIndex === activeIndex) return;

      const previousImage = images[activeIndex];
      const nextImage = images[nextIndex];
      const pendingHide = hideTimers.get(nextImage);
      if (pendingHide) window.clearTimeout(pendingHide);

      nextImage.hidden = false;
      nextImage.setAttribute('aria-hidden', 'false');
      nextImage.getBoundingClientRect();
      nextImage.classList.add('is-active');
      previousImage.classList.remove('is-active');
      previousImage.setAttribute('aria-hidden', 'true');
      const hideTimer = window.setTimeout(() => {
        if (!previousImage.classList.contains('is-active')) {
          previousImage.hidden = true;
        }
        hideTimers.delete(previousImage);
      }, 500);
      hideTimers.set(previousImage, hideTimer);
      activeIndex = nextIndex;

      thumbnails.forEach((thumbnail, thumbnailIndex) => {
        const isActive = thumbnailIndex === activeIndex;
        thumbnail.classList.toggle('is-selected', isActive);
        thumbnail.setAttribute('aria-pressed', String(isActive));
      });
    };

    const showDialogImage = () => {
      const zoomButton = images[activeIndex].querySelector('[data-zz-gallery-open]');
      if (!zoomButton || !dialogImage || !counter) return;

      dialogImage.src = zoomButton.dataset.fullSrc;
      dialogImage.alt = zoomButton.dataset.fullAlt || '';
      counter.textContent = `${activeIndex + 1} / ${images.length}`;
    };

    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => showImage(index));
    });

    gallery.querySelectorAll('[data-zz-gallery-open]').forEach((button, index) => {
      button.addEventListener('click', () => {
        showImage(index);
        if (!dialog || typeof dialog.showModal !== 'function') return;

        showDialogImage();
        dialog.showModal();
      });
    });

    gallery.querySelector('[data-zz-gallery-previous]')?.addEventListener('click', () => {
      showImage(activeIndex - 1);
      showDialogImage();
    });

    gallery.querySelector('[data-zz-gallery-next]')?.addEventListener('click', () => {
      showImage(activeIndex + 1);
      showDialogImage();
    });

    gallery.querySelector('[data-zz-gallery-close]')?.addEventListener('click', () => {
      dialog?.close();
    });

    dialog?.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  };

  const initializeGalleries = (root = document) => {
    if (root.matches?.('[data-zz-product-gallery]')) initializeGallery(root);
    root.querySelectorAll?.('[data-zz-product-gallery]').forEach(initializeGallery);
  };

  initializeGalleries();
  document.addEventListener('shopify:section:load', (event) => initializeGalleries(event.target));
})();

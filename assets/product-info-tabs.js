(() => {
  const initializeModules = (root) => {
    if (root.dataset.productModulesInitialized === 'true') return;

    const tabs = Array.from(root.querySelectorAll('[data-product-module-tab]'));
    const panels = Array.from(root.querySelectorAll('[data-product-module-panel]'));
    if (tabs.length === 0 || panels.length === 0) return;

    root.dataset.productModulesInitialized = 'true';

    const activateModule = (moduleId, focusTab = false) => {
      tabs.forEach((tab) => {
        const isActive = tab.dataset.productModuleTab === moduleId;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
        if (isActive && focusTab) tab.focus();
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.productModulePanel === moduleId;
        panel.classList.toggle('is-active', isActive);
        panel.setAttribute('aria-hidden', String(!isActive));
        panel.inert = !isActive;
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateModule(tab.dataset.productModuleTab));
      tab.addEventListener('keydown', (event) => {
        let nextIndex;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = tabs.length - 1;
        else return;

        event.preventDefault();
        activateModule(tabs[nextIndex].dataset.productModuleTab, true);
      });
    });

    root.addEventListener('shopify:block:select', (event) => {
      const selectedPanel = panels.find((panel) => panel.dataset.productModulePanel === event.detail.blockId);
      if (selectedPanel) activateModule(selectedPanel.dataset.productModulePanel);
    });
  };

  const initializeAll = (scope = document) => {
    if (scope.matches?.('[data-product-modules]')) initializeModules(scope);
    scope.querySelectorAll?.('[data-product-modules]').forEach(initializeModules);
  };

  initializeAll();
  document.addEventListener('shopify:section:load', (event) => initializeAll(event.target));
})();

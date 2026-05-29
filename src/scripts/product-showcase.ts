interface ShowcaseConfig {
  id: number;
  name: string;
  priceFormatted: string;
  description: string;
  gallery: string[];
  variants: { id: string; label: string; color: string; image: string }[];
}

function initShowcase(root: HTMLElement) {
  const configEl = root.querySelector<HTMLScriptElement>("[data-showcase-config]");
  if (!configEl?.textContent) return;

  const config = JSON.parse(configEl.textContent) as ShowcaseConfig;

  const mainBtn = root.querySelector<HTMLElement>("[data-gallery-main]");
  const viewport = root.querySelector<HTMLElement>("[data-gallery-viewport]");
  const mainImg = root.querySelector<HTMLImageElement>("[data-gallery-image]");
  const descPanel = root.querySelector<HTMLElement>("[data-desc-panel]");
  const descText = root.querySelector<HTMLElement>("[data-desc-text]");
  const thumbnails = root.querySelectorAll<HTMLButtonElement>("[data-thumbnail]");
  const variants = root.querySelectorAll<HTMLButtonElement>("[data-variant]");

  if (!mainImg || !viewport) return;

  let activeImage = config.gallery[0] ?? "";
  let touchStartX = 0;
  let descOpen = false;

  function setMainImage(src: string) {
    if (!src || src === activeImage) return;
    activeImage = src;
    mainImg.style.opacity = "0.6";
    mainImg.style.transform = "scale(0.98)";
    window.setTimeout(() => {
      mainImg.src = src;
      mainImg.style.opacity = "1";
      mainImg.style.transform = "scale(1)";
    }, 120);
    syncThumbnails(src);
    syncVariants(src);
  }

  function syncThumbnails(src: string) {
    thumbnails.forEach((btn) => {
      const match = btn.dataset.image === src;
      btn.classList.toggle("border-text", match);
      btn.classList.toggle("border-transparent", !match);
      btn.setAttribute("aria-selected", String(match));
    });
  }

  function syncVariants(src: string) {
    variants.forEach((btn) => {
      const match = btn.dataset.image === src;
      btn.classList.toggle("border-text", match);
      btn.classList.toggle("bg-[#fafafa]", match);
      btn.classList.toggle("border-border", !match);
      btn.setAttribute("aria-checked", String(match));
    });
  }

  function galleryIndex(): number {
    return config.gallery.findIndex((g) => g === activeImage);
  }

  function showGalleryAt(index: number) {
    const next = config.gallery[index];
    if (next) setMainImage(next);
  }

  function toggleDescription() {
    if (!descPanel || !mainBtn) return;
    descOpen = !descOpen;
    mainBtn.setAttribute("aria-expanded", String(descOpen));

    if (descOpen) {
      descPanel.hidden = false;
      descPanel.classList.add("border-border");
      descPanel.style.maxHeight = `${descPanel.scrollHeight + 48}px`;
      descPanel.style.paddingBottom = "0";
    } else {
      descPanel.style.maxHeight = "0";
      descPanel.classList.remove("border-border");
      window.setTimeout(() => {
        if (!descOpen) descPanel.hidden = true;
      }, 500);
    }
  }

  if (descText) descText.textContent = config.description;

  thumbnails.forEach((btn) => {
    btn.addEventListener("click", () => setMainImage(btn.dataset.image ?? ""));
    btn.addEventListener("mouseenter", () => {
      if (window.matchMedia("(hover: hover)").matches) {
        setMainImage(btn.dataset.image ?? "");
      }
    });
  });

  variants.forEach((btn) => {
    btn.addEventListener("click", () => setMainImage(btn.dataset.image ?? ""));
  });

  mainBtn?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-thumbnail]") || target.closest("[data-variant]")) return;
    toggleDescription();
  });

  viewport.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0]?.clientX ?? 0;
    },
    { passive: true }
  );

  viewport.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0]?.clientX ?? 0;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) < 40) return;
      const idx = galleryIndex();
      if (delta < 0 && idx < config.gallery.length - 1) showGalleryAt(idx + 1);
      if (delta > 0 && idx > 0) showGalleryAt(idx - 1);
    },
    { passive: true }
  );

  mainImg.style.transition = "opacity 0.35s ease, transform 0.35s ease";
}

document.querySelectorAll<HTMLElement>("[data-product-showcase]").forEach(initShowcase);

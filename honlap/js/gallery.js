(() => {
  const IMAGE_FILE = /\.(jpe?g|png|webp|gif|avif)$/i;
  const SWIPE_DISTANCE = 40;
  const collator = new Intl.Collator("hu", { numeric: true });

  const icon = (body) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const ICONS = {
    prev: icon('<path d="M15 6l-6 6 6 6"/>'),
    next: icon('<path d="M9 6l6 6-6 6"/>'),
    close: icon('<path d="M6 6l12 12M18 6L6 18"/>'),
    zoom: icon('<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5M10.5 8v5M8 10.5h5"/>'),
  };

  function element(tag, className, attributes = {}) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
    return node;
  }

  function iconButton(className, label, svg) {
    const button = element("button", className, { type: "button", "aria-label": label });
    button.innerHTML = svg;
    return button;
  }

  function onSwipe(target, callback) {
    let startX = null;
    target.addEventListener("touchstart", (event) => {
      startX = event.touches.length === 1 ? event.touches[0].clientX : null;
    }, { passive: true });
    target.addEventListener("touchend", (event) => {
      if (startX === null) return;
      const distance = event.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(distance) >= SWIPE_DISTANCE) callback(distance < 0 ? 1 : -1);
    }, { passive: true });
  }

  // An album folder is read by both its cover card and its photo grid,
  // so each folder listing is fetched only once per page.
  const listings = new Map();

  function listImages(folderPath) {
    if (!listings.has(folderPath)) listings.set(folderPath, fetchImages(folderPath));
    return listings.get(folderPath);
  }

  async function fetchImages(folderPath) {
    const response = await fetch(folderPath, { cache: "no-cache" });
    if (!response.ok) throw new Error(`${folderPath}: HTTP ${response.status}`);

    const folder = new URL(response.url);
    if (!folder.pathname.endsWith("/")) folder.pathname += "/";
    const listing = new DOMParser().parseFromString(await response.text(), "text/html");
    const images = new Map();

    for (const link of listing.querySelectorAll("a[href]")) {
      const href = link.getAttribute("href");
      if (href.includes("?")) continue;
      const url = new URL(href, folder);
      url.hash = "";
      if (url.origin !== folder.origin || !url.pathname.startsWith(folder.pathname)) continue;
      const name = decodeURIComponent(url.pathname.slice(folder.pathname.length));
      if (name.includes("/") || !IMAGE_FILE.test(name)) continue;
      images.set(url.href, name);
    }

    return [...images]
      .map(([src, name]) => ({ src, name }))
      .sort((a, b) => collator.compare(a.name, b.name));
  }

  const lightbox = (() => {
    let dialog, image, counter, prev, next, current;

    function build() {
      dialog = element("dialog", "lightbox");
      image = element("img", "lightbox__image", { decoding: "async" });
      prev = iconButton("lightbox__button lightbox__prev", "Előző kép", ICONS.prev);
      next = iconButton("lightbox__button lightbox__next", "Következő kép", ICONS.next);
      counter = element("span", "lightbox__counter", { "aria-live": "polite" });
      const close = iconButton("lightbox__button lightbox__close", "Nagyítás bezárása", ICONS.close);
      dialog.append(close, image, prev, next, counter);
      document.body.append(dialog);

      close.addEventListener("click", () => dialog.close());
      prev.addEventListener("click", () => current.step(-1));
      next.addEventListener("click", () => current.step(1));
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
      dialog.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") current.step(-1);
        if (event.key === "ArrowRight") current.step(1);
      });
      dialog.addEventListener("close", () => {
        const gallery = current;
        current = null;
        gallery.focusTrigger();
      });
      onSwipe(image, (direction) => current.step(direction));
    }

    return {
      open(gallery) {
        if (!dialog) build();
        current = gallery;
        dialog.setAttribute("aria-label", `${gallery.name} – nagyított kép`);
        prev.hidden = next.hidden = counter.hidden = gallery.count < 2;
        this.sync(gallery);
        dialog.showModal();
      },
      sync(gallery) {
        if (current !== gallery) return;
        const slide = gallery.slide();
        image.src = slide.src;
        image.alt = slide.alt;
        counter.textContent = slide.counter;
      },
    };
  })();

  function renderGallery(root, images, stage, frame) {
    const name = root.getAttribute("aria-label") || "Képek";
    const count = images.length;
    const altFor = (i) => `${name} – ${i + 1}. kép`;
    const wrap = (i) => (i + count) % count;
    let index = 0;

    const open = element("button", "gallery__open", { type: "button" });
    const photo = element("img", "", { loading: "lazy", decoding: "async" });
    const zoomHint = element("span", "gallery__zoom-hint", { "aria-hidden": "true" });
    zoomHint.innerHTML = ICONS.zoom;
    open.append(photo, zoomHint);
    frame.append(open);

    const counter = element("span", "gallery__counter", { "aria-live": "polite" });
    const previews = [];
    const dots = [];

    if (count > 1) frame.append(counter);

    if (count >= 3) {
      for (const [direction, label] of [[-1, "Előző kép"], [1, "Következő kép"]]) {
        const preview = element("button", "gallery__preview", { type: "button", "aria-label": label });
        const previewImage = element("img", "", { alt: "", loading: "lazy", decoding: "async" });
        preview.append(previewImage);
        preview.addEventListener("click", () => show(index + direction));
        previews.push({ direction, image: previewImage });
        if (direction < 0) stage.prepend(preview);
        else stage.append(preview);
      }
    } else {
      root.classList.remove("gallery--previews");
    }

    if (count > 1) {
      const controls = element("div", "gallery__controls");
      const prev = iconButton("gallery__nav", "Előző kép", ICONS.prev);
      const next = iconButton("gallery__nav", "Következő kép", ICONS.next);
      const dotList = element("div", "gallery__dots");
      images.forEach((_, i) => {
        const dot = element("button", "gallery__dot", { type: "button", "aria-label": `${i + 1}. kép megjelenítése` });
        dot.addEventListener("click", () => show(i));
        dots.push(dot);
        dotList.append(dot);
      });
      prev.addEventListener("click", () => show(index - 1));
      next.addEventListener("click", () => show(index + 1));
      controls.append(prev, dotList, next);
      stage.after(controls);
      onSwipe(frame, (direction) => show(index + direction));
    }

    const gallery = {
      name,
      count,
      slide: () => ({ src: images[index].src, alt: altFor(index), counter: `${index + 1} / ${count}` }),
      step: (direction) => show(index + direction),
      focusTrigger: () => open.focus(),
    };

    function show(i) {
      index = wrap(i);
      const slide = gallery.slide();
      photo.src = slide.src;
      photo.alt = slide.alt;
      open.setAttribute("aria-label", `${slide.alt} – nagyítás`);
      counter.textContent = slide.counter;
      for (const preview of previews) preview.image.src = images[wrap(index + preview.direction)].src;
      dots.forEach((dot, d) => dot.setAttribute("aria-current", String(d === index)));
      lightbox.sync(gallery);
    }

    open.addEventListener("click", () => lightbox.open(gallery));
    show(0);
  }

  function renderGrid(root, images) {
    const name = root.dataset.galleryName || "Képek";
    const count = images.length;
    const initial = Number(root.dataset.galleryInitial) || count;
    const altFor = (i) => `${name} – ${i + 1}. kép`;
    const list = element("ul", "photo-grid__list");
    const buttons = [];
    let index = 0;
    let more = null;

    images.forEach((image, i) => {
      const item = element("li", "photo-grid__item");
      const button = element("button", "photo-grid__open", { type: "button", "aria-label": `${altFor(i)} – nagyítás` });
      const photo = element("img", "", { src: image.src, alt: altFor(i), loading: "lazy", decoding: "async" });
      button.append(photo);
      button.addEventListener("click", () => {
        index = i;
        lightbox.open(gallery);
      });
      item.append(button);
      item.hidden = i >= initial;
      buttons.push(button);
      list.append(item);
    });
    root.append(list);

    function revealAll() {
      for (const button of buttons) button.parentElement.hidden = false;
      if (more) more.remove();
      more = null;
    }

    if (count > initial) {
      more = element("button", "button button--outline photo-grid__more", { type: "button" });
      more.textContent = `További képek (${count - initial})`;
      more.addEventListener("click", () => {
        revealAll();
        buttons[initial].focus();
      });
      root.append(more);
    }

    const gallery = {
      name,
      count,
      slide: () => ({ src: images[index].src, alt: altFor(index), counter: `${index + 1} / ${count}` }),
      step: (direction) => {
        index = (index + direction + count) % count;
        lightbox.sync(gallery);
      },
      focusTrigger: () => {
        if (buttons[index].parentElement.hidden) revealAll();
        buttons[index].focus();
      },
    };
  }

  async function initGrid(root) {
    const fallback = root.querySelector(".gallery__fallback");
    if (fallback) fallback.hidden = true;

    try {
      const images = await listImages(root.dataset.gallery);
      if (images.length === 0) {
        const section = root.closest("[data-gallery-section]") || root;
        section.hidden = true;
        return;
      }
      renderGrid(root, images);
    } catch (error) {
      if (fallback) fallback.hidden = false;
      console.warn("A galéria képei nem tölthetők be:", error);
    }
  }

  // Album cards on the gallery page show the album's first photo and its
  // photo count. An empty album says "Hamarosan" and stops being a link.
  async function initAlbumCard(card) {
    const cover = card.querySelector(".album-card__cover");
    const meta = card.querySelector(".album-card__meta");

    let images;
    try {
      images = await listImages(card.dataset.album);
    } catch {
      return;
    }

    if (images.length === 0) {
      card.removeAttribute("href");
      card.classList.add("is-empty");
      meta.textContent = "Hamarosan";
      return;
    }

    const photo = element("img", "album-card__photo", { src: images[0].src, alt: "", decoding: "async" });
    cover.append(photo);
    meta.textContent = `${images.length} kép`;
  }

  // On the gallery page the album cards work as tabs: only the chosen
  // album is shown. Without JavaScript every album stays visible and the
  // cards are plain links to them.
  function initAlbumTabs(nav) {
    const cards = [...nav.querySelectorAll("[data-album]")];
    const albums = cards.map((card) => ({
      card,
      section: document.getElementById(card.getAttribute("href").slice(1)),
      ready: listImages(card.dataset.album).then((images) => images.length > 0, () => true),
    }));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fromHash = () => albums.find((album) => `#${album.section.id}` === location.hash);

    function select(album, { scroll = false } = {}) {
      for (const other of albums) {
        other.section.hidden = other !== album;
        if (other.card.hasAttribute("href")) other.card.setAttribute("aria-current", String(other === album));
        else other.card.removeAttribute("aria-current");
      }
      if (scroll && album.section.getBoundingClientRect().top > window.innerHeight * 0.75) {
        album.section.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
      }
    }

    // Show only one album straight away so the page does not jump while
    // the folder listings load.
    select(fromHash() || albums[0]);

    Promise.all(albums.map((album) => album.ready)).then((filled) => {
      const available = albums.filter((_, i) => filled[i]);
      if (available.length === 0) return;
      const wanted = fromHash();
      select(available.includes(wanted) ? wanted : available[0]);

      for (const album of available) {
        album.card.addEventListener("click", (event) => {
          event.preventDefault();
          history.replaceState(null, "", `#${album.section.id}`);
          select(album, { scroll: true });
        });
      }
      window.addEventListener("hashchange", () => {
        const album = fromHash();
        if (available.includes(album)) select(album, { scroll: true });
      });
    });
  }

  async function initGallery(root) {
    if (root.dataset.galleryLayout === "grid") {
      initGrid(root);
      return;
    }

    const fallback = root.querySelector(".gallery__fallback");
    const stage = element("div", "gallery__stage");
    const frame = element("div", "gallery__frame");
    stage.append(frame);
    root.classList.add("gallery--previews");
    root.prepend(stage);
    if (fallback) fallback.hidden = true;

    try {
      const images = await listImages(root.dataset.gallery);
      if (images.length === 0) {
        root.hidden = true;
        const section = root.closest("[data-gallery-section]");
        if (section) section.hidden = true;
        return;
      }
      renderGallery(root, images, stage, frame);
    } catch (error) {
      stage.remove();
      root.classList.remove("gallery--previews");
      if (fallback) fallback.hidden = false;
      console.warn("A galéria képei nem tölthetők be:", error);
    }
  }

  document.querySelectorAll("[data-gallery]").forEach(initGallery);
  document.querySelectorAll("[data-album]").forEach(initAlbumCard);
  document.querySelectorAll("[data-album-tabs]").forEach(initAlbumTabs);
})();

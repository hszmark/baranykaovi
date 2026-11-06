(() => {
  const header = document.querySelector("[data-site-header]");
  const toggle = header?.querySelector("[data-menu-toggle]");
  const nav = toggle && document.getElementById(toggle.getAttribute("aria-controls"));
  if (!toggle || !nav) return;

  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    header.classList.toggle("is-menu-open", open);
  };

  header.classList.add("has-menu-toggle");
  toggle.hidden = false;

  toggle.addEventListener("click", () => setOpen(!isOpen()));

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (isOpen() && !header.contains(event.target)) setOpen(false);
  });
})();

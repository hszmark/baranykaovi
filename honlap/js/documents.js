(() => {
  const dateFormat = new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "2-digit", day: "2-digit" });

  async function showLastModified(target) {
    const link = target.closest("[data-document]")?.querySelector("a[href]");
    if (!link) return;

    try {
      // no-cache makes the browser revalidate, so a replaced file shows its new date.
      const response = await fetch(link.href, { method: "HEAD", cache: "no-cache" });
      // A host's custom 404 page can carry its own Last-Modified, so only trust OK responses.
      const header = response.ok ? response.headers.get("Last-Modified") : null;
      const modified = header ? new Date(header) : null;
      if (!modified || Number.isNaN(modified.getTime())) return;

      const time = document.createElement("time");
      time.dateTime = modified.toISOString().slice(0, 10);
      time.textContent = dateFormat.format(modified);
      target.replaceChildren("Frissítve: ", time);
      target.hidden = false;
    } catch {
      // Unreachable file or file:// page: the link still works, the date stays hidden.
    }
  }

  document.querySelectorAll("[data-modified]").forEach(showLastModified);
})();

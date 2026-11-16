// Home page video: adds a pause/play button and keeps the video still
// for visitors who ask their system for reduced motion. Without this
// script the video simply plays muted in a loop.
(() => {
  const media = document.querySelector("[data-hero-video]");
  const video = media?.querySelector("video");
  const toggle = media?.querySelector("[data-hero-video-toggle]");
  const label = toggle?.querySelector("[data-hero-video-label]");
  if (!video || !toggle || !label) return;

  const showState = () => {
    const paused = video.paused;
    toggle.classList.toggle("is-paused", paused);
    label.textContent = paused ? "Videó lejátszása" : "Videó megállítása";
  };

  toggle.addEventListener("click", () => {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", showState);
  video.addEventListener("pause", showState);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    video.removeAttribute("autoplay");
    video.pause();
  }

  toggle.hidden = false;
  showState();
})();

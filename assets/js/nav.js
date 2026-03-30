// Animated pill nav — mirrors the Framer NavMenu component behaviour

(function () {
  const track = document.getElementById("navTrack");
  const pill  = document.getElementById("navPill");
  if (!track || !pill) return;

  const items = Array.from(track.querySelectorAll(".nav-item"));

  function movePillTo(el) {
    const trackRect = track.getBoundingClientRect();
    const itemRect  = el.getBoundingClientRect();
    pill.style.transform = `translateX(${itemRect.left - trackRect.left}px)`;
    pill.style.width     = `${itemRect.width}px`;
  }

  // Set initial position to active item (no transition on first paint)
  const active = track.querySelector(".nav-item.active") || items[0];
  pill.style.transition = "none";
  // Wait one frame so layout is ready
  requestAnimationFrame(() => {
    movePillTo(active);
    // Re-enable spring transition after initial placement
    requestAnimationFrame(() => {
      pill.style.transition =
  "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)";
    });
  });

  // Hover: slide pill to hovered item
  items.forEach((item) => {
    item.addEventListener("mouseenter", () => movePillTo(item));
  });

  // Mouse leave: snap back to active
  track.addEventListener("mouseleave", () => movePillTo(active));
})();

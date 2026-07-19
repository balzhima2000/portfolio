// Lightbox for case-study images. Click any case image to view it full-size;
// arrows / ← → cycle, ✕ / Escape / click-outside close. Mirrors the archive
// lightbox. Placeholder images (coming.png) are skipped so the lightbox only
// cycles real screens.
(function () {
  const items = Array.from(document.querySelectorAll('.case-img'))
    .filter((el) => !(el.getAttribute('src') || '').includes('coming.png'));
  if (!items.length) return;

  let current = 0;

  const overlay = document.createElement('div');
  overlay.id = 'case-lightbox';
  Object.assign(overlay.style, {
    display: 'none', position: 'fixed', inset: '0',
    background: 'rgba(0,0,0,0.85)', zIndex: '999',
    alignItems: 'center', justifyContent: 'center',
  });

  const img = document.createElement('img');
  Object.assign(img.style, {
    maxHeight: '90vh', maxWidth: '92vw', width: 'auto', height: 'auto',
    objectFit: 'contain', userSelect: 'none', display: 'block',
  });

  const btnStyle = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', color: '#fff',
    fontSize: '32px', cursor: 'pointer', padding: '20px', opacity: '0.6',
    fontFamily: 'inherit', lineHeight: '1',
  };

  const prev = document.createElement('button');
  prev.textContent = '←';
  prev.setAttribute('aria-label', 'Previous image');
  Object.assign(prev.style, { ...btnStyle, left: '20px' });

  const next = document.createElement('button');
  next.textContent = '→';
  next.setAttribute('aria-label', 'Next image');
  Object.assign(next.style, { ...btnStyle, right: '20px' });

  const close = document.createElement('button');
  close.textContent = '✕';
  close.setAttribute('aria-label', 'Close');
  Object.assign(close.style, {
    position: 'absolute', top: '20px', right: '20px',
    background: 'none', border: 'none', color: '#fff',
    fontSize: '20px', cursor: 'pointer', opacity: '0.6', lineHeight: '1',
  });

  // A single image has nothing to page through — hide the arrows for it.
  if (items.length < 2) { prev.style.display = 'none'; next.style.display = 'none'; }

  overlay.append(prev, img, next, close);
  document.body.appendChild(overlay);

  function open(index) {
    current = index;
    img.src = items[current].currentSrc || items[current].src;
    img.alt = items[current].getAttribute('alt') || '';
    overlay.style.display = 'flex';
  }

  function close_lb() { overlay.style.display = 'none'; }

  items.forEach((el, i) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => open(i));
  });

  prev.addEventListener('click', (e) => { e.stopPropagation(); open((current - 1 + items.length) % items.length); });
  next.addEventListener('click', (e) => { e.stopPropagation(); open((current + 1) % items.length); });
  close.addEventListener('click', close_lb);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close_lb(); });

  document.addEventListener('keydown', (e) => {
    if (overlay.style.display === 'none') return;
    if (e.key === 'ArrowLeft')  prev.click();
    if (e.key === 'ArrowRight') next.click();
    if (e.key === 'Escape')     close_lb();
  });
})();

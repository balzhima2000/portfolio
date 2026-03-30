(function () {
  const items = Array.from(document.querySelectorAll('.archive-img, .archive-item video'));
  let current = 0;

  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  Object.assign(overlay.style, {
    display: 'none', position: 'fixed', inset: '0',
    background: 'rgba(0,0,0,0.85)', zIndex: '999',
    alignItems: 'center', justifyContent: 'center',
  });

  const img = document.createElement('img');
  Object.assign(img.style, {
    height: '80vh', width: 'auto', maxWidth: '90vw',
    objectFit: 'contain', userSelect: 'none', display: 'none',
  });

  const vid = document.createElement('video');
  Object.assign(vid.style, {
    height: '80vh', width: 'auto', maxWidth: '90vw',
    objectFit: 'contain', display: 'none',
  });
  vid.autoplay = true;
  vid.loop = true;
  vid.muted = true;
  vid.playsInline = true;

  const btnStyle = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', color: '#fff',
    fontSize: '32px', cursor: 'pointer', padding: '20px', opacity: '0.6',
  };

  const prev = document.createElement('button');
  prev.textContent = '←';
  Object.assign(prev.style, { ...btnStyle, left: '20px' });

  const next = document.createElement('button');
  next.textContent = '→';
  Object.assign(next.style, { ...btnStyle, right: '20px' });

  const close = document.createElement('button');
  close.textContent = '✕';
  Object.assign(close.style, {
    position: 'absolute', top: '20px', right: '20px',
    background: 'none', border: 'none', color: '#fff',
    fontSize: '20px', cursor: 'pointer', opacity: '0.6',
  });

  overlay.append(prev, img, vid, next, close);
  document.body.appendChild(overlay);

  function open(index) {
    current = index;
    const el = items[current];
    const isVideo = el.tagName === 'VIDEO';

    img.style.display = isVideo ? 'none' : 'block';
    vid.style.display = isVideo ? 'block' : 'none';

    if (isVideo) {
      vid.src = el.src;
      vid.play();
    } else {
      img.src = el.src;
      vid.pause();
      vid.src = '';
    }

    overlay.style.display = 'flex';
  }

  function close_lb() {
    overlay.style.display = 'none';
    vid.pause();
    vid.src = '';
  }

  items.forEach((el, i) => {
    el.addEventListener('click', () => open(i));
  });

  prev.addEventListener('click', () => open((current - 1 + items.length) % items.length));
  next.addEventListener('click', () => open((current + 1) % items.length));
  close.addEventListener('click', close_lb);
  overlay.addEventListener('click', e => { if (e.target === overlay) close_lb(); });

  document.addEventListener('keydown', e => {
    if (overlay.style.display === 'none') return;
    if (e.key === 'ArrowLeft')  prev.click();
    if (e.key === 'ArrowRight') next.click();
    if (e.key === 'Escape')     close_lb();
  });
})();
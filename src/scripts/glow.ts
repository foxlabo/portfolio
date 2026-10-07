// .glow カードの光る位置をカーソルに追従させる（マウス操作の端末のみ）
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cards = document.querySelectorAll<HTMLElement>('.glow');
  let x = 0;
  let y = 0;
  let frame = 0;

  const update = () => {
    frame = 0;
    for (const card of cards) {
      const r = card.getBoundingClientRect();
      if (r.bottom < -300 || r.top > innerHeight + 300) continue;
      card.style.setProperty('--cx', `${x - r.left}px`);
      card.style.setProperty('--cy', `${y - r.top}px`);
    }
  };

  addEventListener(
    'pointermove',
    (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
}

/* PM3 · Comunidade: carrossel dos benefícios (mesma lógica do slider de instrutores, com os próprios botões) */
(function(){
  const track = document.getElementById('bcTrack');
  if (!track) return;
  const cards = [...track.children];
  const ant = document.querySelector('[data-bc=ant]'), prox = document.querySelector('[data-bc=prox]');
  const passo = () => cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
  const porTela = () => Math.max(1, Math.floor(track.clientWidth / passo()));
  const atualiza = () => {
    ant.disabled = track.scrollLeft <= 4;
    prox.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  let ate = 0;
  const segura = (ms = 7000) => { ate = Date.now() + ms; };
  const vai = d => track.scrollBy({ left: d * porTela() * passo() });
  ant.addEventListener('click', () => { vai(-1); segura(); });
  prox.addEventListener('click', () => { vai(1); segura(); });
  track.addEventListener('scroll', atualiza, { passive: true });
  addEventListener('resize', atualiza);
  atualiza();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let pausa = false;
  const visivel = () => { const r = track.getBoundingClientRect(); return r.bottom > innerHeight * .2 && r.top < innerHeight * .8; };
  track.addEventListener('mouseenter', () => pausa = true);
  track.addEventListener('mouseleave', () => pausa = false);
  track.addEventListener('focusin', () => pausa = true);
  track.addEventListener('focusout', () => pausa = false);
  ['pointerdown', 'wheel', 'touchstart'].forEach(ev => track.addEventListener(ev, () => segura(), { passive: true }));
  setInterval(() => {
    if (!visivel() || pausa || document.hidden || Date.now() < ate) return;
    const noFim = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (noFim) track.scrollTo({ left: 0 }); else track.scrollBy({ left: passo() });
  }, 2600);
})();

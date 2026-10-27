/* PM3 · slider dos instrutores (Membership e páginas de curso) */
/* instrutores: slider de uma fileira; as setas avançam uma "página" de cards */
(function(){
  const track = document.querySelector('.prof-grid');
  if (!track) return;
  const cards = [...track.children];
  const ant = document.querySelector('[data-pf=ant]'), prox = document.querySelector('[data-pf=prox]');
  const passo = () => cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
  const porTela = () => Math.max(1, Math.round(track.clientWidth / passo()));
  const atualiza = () => {
    ant.disabled = track.scrollLeft <= 4;
    prox.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  let ate = 0;
  const segura = (ms = 6000) => { ate = Date.now() + ms; };
  const vai = d => track.scrollBy({ left: d * porTela() * passo() });
  ant.addEventListener('click', () => { vai(-1); segura(); });
  prox.addEventListener('click', () => { vai(1); segura(); });
  track.addEventListener('scroll', atualiza, { passive: true });
  track.addEventListener('scrollend', atualiza);
  addEventListener('resize', atualiza);
  atualiza();

  /* passa sozinho: um card a cada 2 s; no fim volta ao começo.
     Pausa com o cursor em cima, com foco, ao arrastar/usar as setas e fora da tela. */
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const area = track.closest('section');
  let pausa = false;
  const visivel = () => { const r = track.getBoundingClientRect(); return r.bottom > innerHeight * .2 && r.top < innerHeight * .8; };
  track.addEventListener('mouseenter', () => pausa = true);
  track.addEventListener('mouseleave', () => pausa = false);
  area.addEventListener('focusin', e => { if (e.target.matches(':focus-visible')) pausa = true; });
  area.addEventListener('focusout', () => pausa = false);
  ['pointerdown', 'wheel', 'touchstart'].forEach(ev => track.addEventListener(ev, () => segura(), { passive: true }));
  setInterval(() => {
    if (!visivel() || pausa || document.hidden || Date.now() < ate) return;
    const noFim = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (noFim) track.scrollTo({ left: 0 }); else track.scrollBy({ left: passo() });
  }, 2000);
})();

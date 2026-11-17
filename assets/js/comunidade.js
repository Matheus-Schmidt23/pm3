/* PM3 · Comunidade: carrosséis (benefícios e vagas) e faixa da Jornada de Protagonismo */
(function(){
  /* slider genérico: uma fileira com snap, setas que avançam uma "página" e passagem automática */
  const slider = (trackId, attr, ms) => {
    const track = document.getElementById(trackId);
    if (!track) return;
    const cards = [...track.children];
    const ant = document.querySelector(`[data-${attr}=ant]`), prox = document.querySelector(`[data-${attr}=prox]`);
    const passo = () => cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
    const porTela = () => Math.max(1, Math.floor(track.clientWidth / passo()));
    const atualiza = () => {
      ant.disabled = track.scrollLeft <= 4;
      prox.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    let ate = 0;
    const segura = (t = 7000) => { ate = Date.now() + t; };
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
    }, ms);
  };
  slider('bcTrack', 'bc', 2600);
  slider('jobsTrack', 'jb', 3200);
})();

/* Jornada de Protagonismo: cada balão troca a foto de fundo; passa sozinha até o primeiro clique */
(function(){
  const sec = document.getElementById('protagonismo');
  if (!sec) return;
  const bgs = [...sec.querySelectorAll('.jp-bg')], btns = [...sec.querySelectorAll('[data-jp]')];
  let i = 0, auto = true;
  const mostra = n => { i = n; bgs.forEach((b, k) => b.classList.toggle('on', k === n)); btns.forEach((b, k) => b.setAttribute('aria-pressed', k === n ? 'true' : 'false')); };
  btns.forEach(b => b.addEventListener('click', () => { auto = false; mostra(+b.dataset.jp); }));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const visivel = () => { const r = sec.getBoundingClientRect(); return r.bottom > innerHeight * .2 && r.top < innerHeight * .8; };
  setInterval(() => { if (auto && visivel() && !document.hidden) mostra((i + 1) % bgs.length); }, 5000);
})();

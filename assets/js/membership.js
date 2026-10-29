/* PM3 · Membership · interações da página */
(function(){
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* manifesto: palavras se preenchem conforme a rolagem; *palavra* ganha destaque */
  const fill = $('#fill');
  if (fill){
    const pin = fill.querySelector('.nota-pin'); if (pin) pin.remove();
    const html = fill.textContent.trim().split(/\s+/).map(w => {
      const hl = /^\*.*\*[.,]?$/.test(w);
      return `<span class="w${hl ? ' hl' : ''}">${w.replace(/\*/g,'')}</span>`;
    }).join(' ');
    fill.innerHTML = html; if (pin) fill.appendChild(pin);
    const ws = [...fill.querySelectorAll('.w')];
    const pinta = () => {
      const r = fill.getBoundingClientRect(), vh = innerHeight;
      const p = Math.max(0, Math.min(1, (vh * .82 - r.top) / (r.height + vh * .38)));
      const k = Math.round(p * ws.length);
      ws.forEach((w, i) => w.classList.toggle('on', i < k));
    };
    if (calmo) ws.forEach(w => w.classList.add('on'));
    else { addEventListener('scroll', pinta, { passive: true }); pinta(); }
  }

  /* filtro do catálogo */
  $$('.chip').forEach(ch => ch.addEventListener('click', () => {
    $$('.chip').forEach(c => c.setAttribute('aria-pressed', c === ch));
    const f = ch.dataset.f;
    $$('#fgrid .f-card').forEach(c => c.classList.toggle('is-hidden', f !== 'todas' && c.dataset.a !== f));
  }));

  /* trilhas: um item aberto por vez */
  $$('.acc-item > button').forEach(b => b.addEventListener('click', () => {
    const it = b.parentElement, abrir = !it.classList.contains('open');
    $$('.acc-item').forEach(x => { x.classList.remove('open'); x.querySelector('button').setAttribute('aria-expanded','false'); });
    if (abrir){ it.classList.add('open'); b.setAttribute('aria-expanded','true'); trocaFoto(it); }
  }));

  /* trilhas: o painel ao lado troca para a foto da trilha aberta (duas camadas que se cruzam) */
  const art = $('.trilhas-art'), fotos = art ? [...art.querySelectorAll('.ph')] : [];
  function trocaFoto(it){
    if (!art || !it.dataset.img) return;
    const atual = fotos.find(f => f.classList.contains('on')), prox = fotos.find(f => f !== atual);
    if (atual && atual.style.backgroundImage.includes(it.dataset.img)) return;
    prox.style.backgroundImage = `url('${it.dataset.img}')`;
    prox.classList.add('on'); if (atual) atual.classList.remove('on');
    const itens = [...it.parentElement.children];
    $('#trN').textContent = String(itens.indexOf(it) + 1).padStart(2, '0');
    $('#trT').textContent = it.querySelector('.tt').textContent;
  }
  /* pré-carrega as fotos das trilhas para a troca não piscar */
  $$('.acc-item[data-img]').forEach(it => { const im = new Image(); im.src = it.dataset.img; });

  /* seletor de pagamento */
  const P = {
    12: ['12x', '299,92', 'ou R$ 3.599 à vista no cartão · sem juros'],
    1:  ['', '3.599', 'à vista no cartão · ou no Pix com 10% de desconto']
  };
  $$('.seg button').forEach(b => b.addEventListener('click', () => {
    $$('.seg button').forEach(x => x.setAttribute('aria-pressed', x === b));
    const [x, v, n] = P[b.dataset.p];
    $('#px').textContent = x; $('#px').style.display = x ? '' : 'none';
    $('#pv').textContent = v; $('#pn').textContent = n;
  }));

  /* barra de compra fixa no celular: aparece depois do hero e some na seção de planos */
  const bar = $('#buybar'), hero = $('.m-hero'), planos = $('#planos');
  const vis = { hero: true, planos: false };
  const atualiza = () => bar.classList.toggle('show', !vis.hero && !vis.planos);
  new IntersectionObserver(([e]) => { vis.hero = e.isIntersecting; atualiza(); }).observe(hero);
  new IntersectionObserver(([e]) => { vis.planos = e.isIntersecting; atualiza(); }, { threshold: .15 }).observe(planos);
})();


/* catálogo: carrossel de formações. Respeita o filtro de áreas (só conta e rola entre as visíveis). */
(function(){
  const track = document.getElementById('fgrid');
  if (!track) return;
  const ant = document.querySelector('[data-fc=ant]'), prox = document.querySelector('[data-fc=prox]');
  const vis = () => [...track.children].filter(c => !c.classList.contains('is-hidden'));
  const passo = () => { const v = vis(); return v[1] ? v[1].offsetLeft - v[0].offsetLeft : track.clientWidth; };
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
  document.querySelectorAll('.chip').forEach(ch => ch.addEventListener('click', () => {
    track.scrollTo({ left: 0, behavior: 'instant' });
    requestAnimationFrame(atualiza);
    segura();
  }));
  atualiza();

  /* passa sozinho: um card a cada 3 s; no fim volta ao começo. Mesmas pausas do carrossel de sprints. */
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
    if (!visivel() || pausa || document.hidden || Date.now() < ate || vis().length < 2) return;
    const noFim = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (noFim) track.scrollTo({ left: 0 }); else track.scrollBy({ left: passo() });
  }, 3000);
})();

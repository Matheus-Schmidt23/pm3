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
    12: ['12x', '299,91', 'ou R$ 3.599 à vista no cartão · sem juros'],
    24: ['24x', '149,95', 'via NuPay, sem juros, sujeito a aprovação de crédito'],
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

/* card principal do topo: luz que segue o mouse e traço de luz no 3 (só com mouse de verdade e sem "reduzir movimento") */
(function(){
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const main = document.querySelector('.m-main');

  /* --mx/--my: posição do cursor em %; --px/--py: de -0.5 a 0.5; --rx/--ry: inclinação em graus */
  const liga = (el, inclina) => {
    let raf = 0;
    el.addEventListener('pointerenter', () => el.classList.add('on'));
    el.addEventListener('pointermove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        el.style.setProperty('--px', (x - .5).toFixed(3));
        el.style.setProperty('--py', (y - .5).toFixed(3));
        if (inclina){
          el.style.setProperty('--rx', ((.5 - y) * 9).toFixed(2) + 'deg');
          el.style.setProperty('--ry', ((x - .5) * 11).toFixed(2) + 'deg');
        }
      });
    });
    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      el.classList.remove('on');
      ['--px','--py','--rx','--ry'].forEach(v => el.style.setProperty(v, v.startsWith('--r') ? '0deg' : '0'));
    });
  };


  if (main){
    main.insertAdjacentHTML('afterbegin', '<span class="spot" aria-hidden="true"></span>');
    /* traço de luz que percorre o contorno do 3 */
    const path = main.querySelector('.three path');
    if (path){
      const trace = path.cloneNode();
      trace.setAttribute('class', 'trace');
      trace.setAttribute('pathLength', '1');
      path.after(trace);
    }
    liga(main, false);
  }
})();

/* instrutores: slider de uma fileira; as setas avançam uma "página" de cards */
(function(){
  const track = document.querySelector('.prof-grid');
  if (!track) return;
  const cards = [...track.children];
  const ant = document.querySelector('[data-pf=ant]'), prox = document.querySelector('[data-pf=prox]');
  const cont = document.querySelector('.prof-count');
  const passo = () => cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
  const porTela = () => Math.max(1, Math.round(track.clientWidth / passo()));
  const pad = n => String(n).padStart(2, '0');
  const atualiza = () => {
    const i = Math.round(track.scrollLeft / passo()), n = porTela();
    const fim = Math.min(cards.length, i + n);
    cont.innerHTML = `<b>${pad(i + 1)}–${pad(fim)}</b> de ${cards.length} instrutores`;
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
  area.addEventListener('focusin', () => pausa = true);
  area.addEventListener('focusout', () => pausa = false);
  ['pointerdown', 'wheel', 'touchstart'].forEach(ev => track.addEventListener(ev, () => segura(), { passive: true }));
  setInterval(() => {
    if (!visivel() || pausa || document.hidden || Date.now() < ate) return;
    const noFim = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (noFim) track.scrollTo({ left: 0 }); else track.scrollBy({ left: passo() });
  }, 2000);
})();

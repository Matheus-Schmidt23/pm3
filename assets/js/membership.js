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
    if (abrir){ it.classList.add('open'); b.setAttribute('aria-expanded','true'); }
  }));

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

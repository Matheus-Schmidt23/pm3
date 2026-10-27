/* PM3 · modelo de página de produto · interações */
(function(){
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

  /* ementa: módulos abrem e fecham de forma independente */
  const mods = $$('.mod');
  mods.forEach(m => m.querySelector('button').addEventListener('click', () => {
    const on = m.classList.toggle('open');
    m.querySelector('button').setAttribute('aria-expanded', on);
  }));

  /* barra de horas por módulo: cada fatia proporcional à duração */
  const bar = $('#hbar');
  if (bar){
    const hs = mods.map(m => +m.dataset.h || 0);
    bar.innerHTML = hs.map((h, i) => `<i style="flex:${h}" data-i="${i}"></i>`).join('');
    const fatias = [...bar.children];
    mods.forEach((m, i) => {
      m.addEventListener('mouseenter', () => fatias[i].classList.add('hl'));
      m.addEventListener('mouseleave', () => fatias[i].classList.remove('hl'));
    });
  }

  /* subnavegação: mostra preço quando gruda e marca a seção atual */
  const sub = $('#subnav');
  if (sub){
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    const links = [...sub.querySelectorAll('nav a')];
    const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const marca = () => {
      sub.classList.toggle('stuck', sub.getBoundingClientRect().top <= navH + 1);
      const y = navH + sub.offsetHeight + 40;
      let cur = null;
      secs.forEach(s => { if (s.getBoundingClientRect().top <= y) cur = s.id; });
      links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur));
    };
    addEventListener('scroll', marca, { passive: true }); marca();
  }

  /* barra de compra no celular: some no topo e na seção de investimento */
  const bb = $('#buybar'), hero = $('#topo-curso'), inv = $('#investimento');
  if (bb && hero && inv){
    const vis = { hero: true, inv: false };
    const at = () => bb.classList.toggle('show', !vis.hero && !vis.inv);
    new IntersectionObserver(([e]) => { vis.hero = e.isIntersecting; at(); }).observe(hero);
    new IntersectionObserver(([e]) => { vis.inv = e.isIntersecting; at(); }, { threshold: .15 }).observe(inv);
  }

  /* carrossel: setas rolam um cartão por vez e se desativam nas pontas */
  $$('.car').forEach(car => {
    const tr = car.querySelector('.car-track'), ant = car.querySelector('[data-car=ant]'), prox = car.querySelector('[data-car=prox]');
    if (!tr || !ant || !prox) return;
    const passo = () => { const c = tr.children[0], g = parseFloat(getComputedStyle(tr).columnGap) || 16; return (c ? c.getBoundingClientRect().width : tr.clientWidth) + g; };
    const estado = () => { ant.disabled = tr.scrollLeft < 4; prox.disabled = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4; };
    ant.addEventListener('click', () => tr.scrollBy({ left: -passo(), behavior: 'smooth' }));
    prox.addEventListener('click', () => tr.scrollBy({ left: passo(), behavior: 'smooth' }));
    tr.addEventListener('scroll', estado, { passive: true }); addEventListener('resize', estado); estado();
  });
})();

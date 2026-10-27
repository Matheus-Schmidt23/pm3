/* trilhas: acordeão — uma trilha aberta por vez, as outras recolhidas com botão de expandir */
(function(){
  const grid = document.querySelector('.trb-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.trb')];
  const MAIS = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M8 3v10M3 8h10"/></svg>';
  cards.forEach((c, i) => {
    const body = c.querySelector('.trb-body');
    body.id = body.id || 'trb-body-' + (i + 1);
    const mini = document.createElement('div');
    mini.className = 'trb-mini';
    mini.innerHTML = `<b>${c.querySelector('h3').innerHTML}</b><span>${c.querySelector('.trb-pack').textContent}</span>`;
    const bt = document.createElement('button');
    bt.type = 'button';
    bt.className = 'trb-tog';
    bt.setAttribute('aria-controls', body.id);
    bt.setAttribute('aria-label', 'Expandir trilha ' + c.querySelector('h3').textContent);
    bt.innerHTML = MAIS;
    mini.appendChild(bt);
    c.querySelector('.trb-vis').after(mini);
    c.addEventListener('click', e => { if (!c.classList.contains('open') && !e.target.closest('a')) abre(i); });
  });
  const abre = i => cards.forEach((c, k) => {
    const on = k === i;
    c.classList.toggle('open', on);
    c.querySelector('.trb-tog').setAttribute('aria-expanded', on);
    c.querySelector('.trb-body').inert = !on;
  });
  
  /* altura das trilhas = a do conteúdo mais longo (no acordeão vertical, cada card aberto tem a sua) */
  const mede = () => {
    grid.classList.add('mede');
    const hs = cards.map(c => c.querySelector('.trb-body').offsetHeight);
    grid.classList.remove('mede');
    const vis = matchMedia('(max-width:900px)').matches ? 180 : 210;
    cards.forEach((c, k) => c.style.setProperty('--h', (vis + hs[k]) + 'px'));
    grid.style.setProperty('--hmax', (vis + Math.max(...hs)) + 'px');
  };
  addEventListener('resize', mede);
  grid.classList.add('acc', 'acc-ini');
  requestAnimationFrame(() => requestAnimationFrame(() => grid.classList.remove('acc-ini')));
  abre(0);
  mede();
  if (document.fonts) document.fonts.ready.then(mede);
})();

/* PM3 · Home · interações da página */
(function(){
  /* brilho do hero segue o cursor: o único efeito forte da página */
  const hero = document.querySelector('#hero .h-main') || document.getElementById('hero');
  if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    let raf;
    hero.addEventListener('pointermove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%');
        hero.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }
})();

/* hero: as fotos de pessoas da PM3 se alternam com um cruzamento suave */
(function(){
  const pic = document.getElementById('hPic');
  if (!pic) return;
  const fotos = [...pic.querySelectorAll('.ph')];
  if (fotos.length < 2) return;
  /* peso da página: só a foto da tela entra no carregamento; as próximas vêm uma de cada vez,
     duas à frente da que está aparecendo (antes as 17 fotos baixavam juntas, cerca de 4 MB) */
  const bg = k => { const f = fotos[(k + fotos.length) % fotos.length]; if (f.dataset.bg && !f.style.backgroundImage) f.style.backgroundImage = `url('${f.dataset.bg}')`; };
  const carrega = () => { bg(i + 1); bg(i + 2); };
  /* etiqueta com o nome e o cargo de quem está na foto, ao lado do logo da empresa (sem cargo: Instrutor/Instrutora PM3) */
  const tag = pic.querySelector('.tag');
  const legenda = (f, anima) => {
    if (!tag || !f.dataset.nome) return;
    const cargo = f.dataset.cargo || `Instrutor${f.dataset.g === 'a' ? 'a' : ''} PM3`;
    const html = `<span class="tg-t"><b>${f.dataset.nome}</b><span>${cargo}</span></span>` + (f.dataset.logo ? `<span class="tg-co"><img src="${f.dataset.logo}" alt="${f.dataset.emp || ''}" style="height:${f.dataset.lh || 16}px"></span>` : '');
    if (!anima) { tag.innerHTML = html; return; }
    tag.classList.add('troca');
    setTimeout(() => { tag.innerHTML = html; tag.classList.remove('troca'); }, 700);
  };
  /* toda visita começa pelo Farinazzo (sem animação na troca inicial); depois segue a ordem do HTML */
  let i = Math.max(0, fotos.findIndex(f => /Farinazzo/.test(f.dataset.nome || '')));
  /* a primeira foto aparece já visível, mas sem zoom; ao soltar o sem-anim o Ken Burns começa nela também */
  {
    const f = fotos[i];
    if (f.dataset.bg) f.style.backgroundImage = `url('${f.dataset.bg}')`;
    pic.classList.add('sem-anim');
    fotos[0].classList.remove('on');
    f.classList.add('on');
    void pic.offsetWidth;
    setTimeout(() => pic.classList.remove('sem-anim'), 60);
  }
  legenda(fotos[i], false);
  if (document.readyState === 'complete') carrega(); else addEventListener('load', carrega);
  /* só gira com a foto na tela: assim a primeira pessoa vista é a sorteada, inclusive no celular,
     onde a foto fica abaixo do texto */
  let visivel = false;
  new IntersectionObserver(es => es.forEach(e => visivel = e.isIntersecting), { threshold: .5 }).observe(pic);
  setInterval(() => {
    if (document.hidden || !visivel) return;
    fotos[i].classList.remove('on');
    i = (i + 1) % fotos.length;
    fotos[i].classList.add('on');
    legenda(fotos[i], true);
    bg(i + 2);
  }, 6500);
})();

/* hero: traço de luz no contorno do 3 e leve paralaxe com o cursor */
(function(){
  const main = document.querySelector('#hero .h-main');
  const path = main && main.querySelector('.three path');
  if (!path) return;
  const trace = path.cloneNode();
  trace.setAttribute('class', 'trace');
  trace.setAttribute('pathLength', '1');
  path.after(trace);
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let raf = 0;
  main.addEventListener('pointerenter', () => main.classList.add('on'));
  main.addEventListener('pointermove', e => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = main.getBoundingClientRect();
      main.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3));
      main.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3));
    });
  });
  main.addEventListener('pointerleave', () => { main.classList.remove('on'); main.style.setProperty('--px', 0); main.style.setProperty('--py', 0); });
})();

/* formatos: cada cartão inclina de leve e ganha um brilho e uma borda luminosa que seguem o cursor */
(function(){
  const tiles = [...document.querySelectorAll('.bento .tile')];
  if (!tiles.length || !matchMedia('(hover:hover)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  tiles.forEach(t => {
    t.insertAdjacentHTML('beforeend', '<span class="tl-spot" aria-hidden="true"></span><span class="tl-ring" aria-hidden="true"></span>');
    const forca = t.classList.contains('t-b2b') ? 2 : t.classList.contains('t-member') ? 4 : 6;
    t.addEventListener('pointermove', e => {
      const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      t.classList.add('tilting');
      t.style.setProperty('--mx', (x * 100) + '%');
      t.style.setProperty('--my', (y * 100) + '%');
      t.style.setProperty('--rx', ((.5 - y) * forca) + 'deg');
      t.style.setProperty('--ry', ((x - .5) * forca) + 'deg');
    });
    t.addEventListener('pointerleave', () => {
      t.classList.remove('tilting');
      t.style.setProperty('--rx', '0deg');
      t.style.setProperty('--ry', '0deg');
    });
  });
})();

/* certificado: os quatro modelos se alternam a cada 5 s (fade no mockup); clicar escolhe um e pausa a troca */
(() => {
  const box = document.getElementById('cxTroca'); if (!box) return;
  const tabs = [...box.querySelectorAll('.cx-tabs button')]; if (!tabs.length) return;
  const T = 5000, img = n => `url('../img/${n}')`;
  tabs.forEach(b => { new Image().src = 'assets/img/' + (matchMedia('(min-width:861px)').matches ? b.dataset.crop : b.dataset.full); });
  let i = 0, timer = null, visivel = false;
  box.style.setProperty('--cx-t', T / 1000 + 's');
  const mostra = n => {
    i = (n + tabs.length) % tabs.length;
    tabs.forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i); });
    box.classList.add('saindo');
    setTimeout(() => {
      box.style.setProperty('--cert-full', img(tabs[i].dataset.full));
      box.style.setProperty('--cert-crop', img(tabs[i].dataset.crop));
      box.classList.remove('saindo');
    }, 320);
  };
  const roda = () => { clearInterval(timer); if (matchMedia('(prefers-reduced-motion:reduce)').matches) return; timer = setInterval(() => visivel && mostra(i + 1), T); };
  tabs.forEach((b, k) => b.addEventListener('click', () => { clearInterval(timer); box.classList.add('parado'); mostra(k); }));
  new IntersectionObserver(es => es.forEach(e => { visivel = e.isIntersecting; }), { threshold: .3 }).observe(box);
  roda();
})();

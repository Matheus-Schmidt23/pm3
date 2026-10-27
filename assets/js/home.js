/* PM3 · Home · interações da página */
(function(){
  /* faixa de campanha: fecha e lembra neste navegador */
  const camp = document.getElementById('camp');
  try { if (sessionStorage.getItem('pm3_camp') === 'off') camp.classList.add('off'); } catch(e){}
  camp.querySelector('button').addEventListener('click', () => { camp.classList.add('off'); try { sessionStorage.setItem('pm3_camp','off'); } catch(e){} });

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
  /* só a primeira foto entra no carregamento da página; as outras vêm depois */
  const carrega = () => fotos.forEach(f => { if (f.dataset.bg) f.style.backgroundImage = `url('${f.dataset.bg}')`; });
  if (document.readyState === 'complete') carrega(); else addEventListener('load', carrega);
  /* etiqueta com o nome de quem está na foto (Instrutor/Instrutora PM3) */
  const tag = pic.querySelector('.tag');
  const legenda = (f, anima) => {
    if (!tag || !f.dataset.nome) return;
    const html = `<span class="tg-t"><b>${f.dataset.nome}</b><span>Instrutor${f.dataset.g === 'a' ? 'a' : ''} PM3</span></span>` + (f.dataset.logo ? `<span class="tg-co"><img src="${f.dataset.logo}" alt="${f.dataset.emp || ''}" style="height:${f.dataset.lh || 16}px"></span>` : '');
    if (!anima) { tag.innerHTML = html; return; }
    tag.classList.add('troca');
    setTimeout(() => { tag.innerHTML = html; tag.classList.remove('troca'); }, 700);
  };
  /* cada visita começa por uma pessoa sorteada (sem animação na troca inicial) */
  let i = Math.floor(Math.random() * fotos.length);
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

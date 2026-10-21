/* PM3 · Home · interações da página */
(function(){
  /* faixa de campanha: fecha e lembra neste navegador */
  const camp = document.getElementById('camp');
  try { if (sessionStorage.getItem('pm3_camp') === 'off') camp.classList.add('off'); } catch(e){}
  camp.querySelector('button').addEventListener('click', () => { camp.classList.add('off'); try { sessionStorage.setItem('pm3_camp','off'); } catch(e){} });

  /* brilho do hero segue o cursor: o único efeito forte da página */
  const hero = document.getElementById('hero');
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

/* depoimentos: carrossel que avança sozinho; pausa com o cursor, foco ou toque */
(function(){
  const car = document.getElementById('dpCar');
  if (!car) return;
  const track = car.querySelector('.dp-track');
  let ate = 0;
  const segurar = (ms = 9000) => { ate = Date.now() + ms; };
  const cards = [...track.children];
  const bar = car.querySelector('.dp-bar i');
  const passo = () => cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
  /* último índice que a rolagem alcança (no desktop cabem dois cards por vez) */
  const ultimo = () => Math.max(0, Math.round((track.scrollWidth - track.clientWidth) / passo()));
  let atual = 0;
  const mostrar = () => {
    const n = atual >= ultimo() ? cards.length : atual + 1;
    if (bar) bar.style.width = (n / cards.length * 100) + '%';
  };
  const ir = i => { atual = Math.min(Math.max(0, i), ultimo()); track.scrollTo({ left: atual * passo() }); mostrar(); };
  const avancar = () => ir(atual >= ultimo() ? 0 : atual + 1);
  const voltar = () => ir(atual <= 0 ? ultimo() : atual - 1);
  const atualizar = () => { atual = Math.round(track.scrollLeft / passo()); mostrar(); };
  /* só a rolagem feita pela pessoa (arrastar, trackpad) recalcula a posição */
  let mexendo = 0;
  track.addEventListener('pointerdown', () => mexendo = Date.now());
  track.addEventListener('wheel', () => mexendo = Date.now(), { passive: true });
  track.addEventListener('touchstart', () => mexendo = Date.now(), { passive: true });
  track.addEventListener('keydown', () => mexendo = Date.now());
  track.addEventListener('scroll', () => { if (Date.now() - mexendo < 1500) atualizar(); }, { passive: true });
  track.addEventListener('scrollend', () => { if (Date.now() - mexendo < 3000) atualizar(); });
  car.querySelector('[data-dp=prox]').addEventListener('click', () => { avancar(); segurar(); });
  car.querySelector('[data-dp=ant]').addEventListener('click', () => { voltar(); segurar(); });
  mostrar();
  /* ao mudar a largura (girar o celular, redimensionar), realinha no card atual sem animação */
  addEventListener('resize', () => { track.style.scrollBehavior = 'auto'; ir(atual); track.style.scrollBehavior = ''; });

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let pausa = false;
  car.addEventListener('mouseenter', () => pausa = true);
  car.addEventListener('mouseleave', () => pausa = false);
  car.addEventListener('focusin', () => pausa = true);
  car.addEventListener('focusout', () => pausa = false);
  track.addEventListener('pointerdown', () => segurar());
  track.addEventListener('wheel', () => segurar(), { passive: true });
  let visivel = false;
  new IntersectionObserver(es => es.forEach(e => visivel = e.isIntersecting), { threshold: .3 }).observe(car);
  setInterval(() => { if (visivel && !pausa && Date.now() > ate && !document.hidden) avancar(); }, 4800);
})();

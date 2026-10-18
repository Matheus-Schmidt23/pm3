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

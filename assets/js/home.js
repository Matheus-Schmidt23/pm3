/* PM3 · Home · interações da página */
(function(){
  /* faixa de campanha: fecha e lembra neste navegador */
  const camp = document.getElementById('camp');
  try { if (sessionStorage.getItem('pm3_camp') === 'off') camp.classList.add('off'); } catch(e){}
  camp.querySelector('button').addEventListener('click', () => { camp.classList.add('off'); try { sessionStorage.setItem('pm3_camp','off'); } catch(e){} });

  /* faixa Stack: lanterna da homepage da Stack, a posição do cursor acende os cubos.
     Começa à direita (longe do texto) e volta para lá quando o cursor sai. */
  const st = document.getElementById('stackBand');
  if (st && matchMedia('(hover: hover) and (pointer: fine)').matches){
    const repouso = () => { st.style.setProperty('--gx', '84%'); st.style.setProperty('--gy', '38%'); };
    repouso();
    st.addEventListener('mousemove', e => {
      const r = st.getBoundingClientRect();
      st.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      st.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
    st.addEventListener('mouseleave', repouso);
  }

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

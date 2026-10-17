/* PM3 · Home · interações da página */
(function(){
  /* faixa de campanha: fecha e lembra neste navegador */
  const camp = document.getElementById('camp');
  try { if (sessionStorage.getItem('pm3_camp') === 'off') camp.classList.add('off'); } catch(e){}
  camp.querySelector('button').addEventListener('click', () => { camp.classList.add('off'); try { sessionStorage.setItem('pm3_camp','off'); } catch(e){} });

  /* faixa Stack: pixels em dissolução, gerador do Design System da Stack (genDissolve) */
  const pix = document.getElementById('stPix');
  if (pix){
    const o = { cols: 64, rows: 6, color: '#E7FF00', seed: 21, gap: .25, maxDensity: .9, curve: 2.4 };
    let s = o.seed >>> 0 || 1; const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s >>> 0) / 4294967296; };
    const cell = 100, gap = cell * o.gap, pitch = cell + gap, W = o.cols * pitch - gap, H = o.rows * pitch - gap, parts = [];
    for (let r = 0; r < o.rows; r++){
      const p = Math.pow(o.rows > 1 ? r / (o.rows - 1) : 1, o.curve) * o.maxDensity + .015;
      for (let c = 0; c < o.cols; c++) if (rnd() < p) parts.push(`<rect x="${c * pitch}" y="${r * pitch}" width="${cell}" height="${cell}"/>`);
    }
    pix.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><g fill="${o.color}">${parts.join('')}</g></svg>`;
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

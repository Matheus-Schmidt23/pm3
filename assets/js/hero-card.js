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

/* PM3 · protótipo alfa · header, mega menu, rodapé, consentimento e notas.
   Um lugar só para o que se repete em todas as páginas. */
(function(){
  const PAGE = document.body.dataset.page || '';
  /* páginas já desenhadas no protótipo; as outras mostram um aviso */
  const PRONTAS = ['membership.html','home.html','formacao-product-manager.html','sprint-fundamentos-gestao-produtos.html','formacoes.html','sprints.html','cursos.html','pos-tech.html','para-empresas.html','blog.html','faq.html'];

  const FORMACOES = [
    ['Product Manager','formacao-product-manager.html','Gestão de produtos'],
    ['Product Discovery','#','Gestão de produtos'],
    ['Product Leadership','#','Liderança'],
    ['Product Growth','#','Marketing'],
    ['Product Marketing','#','Marketing'],
    ['Product Analytics','#','Dados'],
    ['Analista de Dados','#','Dados'],
    ['Product Design','#','Design'],
    ['AI Product Builder','#','IA'],
    ['AI Product Specialist','#','IA']
  ];
  const SPRINTS = [
    ['Gestão de produtos','sprints.html#gestao',6],
    ['Dados','sprints.html#dados',11],
    ['Design','sprints.html#design',4],
    ['Marketing','sprints.html#marketing',5],
    ['Negócios','sprints.html#negocios',3],
    ['Liderança e habilidades humanas','sprints.html#lideranca',19]
  ];

  const chev = '<svg class="chev" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1.5 3.5 5 7l3.5-3.5"/></svg>';
  const arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 8h11M9 4l4 4-4 4"/></svg>';
  const cur = f => PAGE === f ? ' aria-current="page"' : '';

  const mega = (id, titulo, texto, itens, rodape) => `
    <div class="mega" id="${id}"><div class="wrap"><div class="mega-in">
      <div class="mega-intro"><p class="h3">${titulo}</p><p>${texto}</p></div>
      <ul class="mega-list">${itens}</ul>
      <div class="mega-foot">${rodape}</div>
    </div></div></div>`;

  const header = `
  <header class="site-header" id="topo">
    <div class="wrap bar">
      <a class="logo" href="home.html" aria-label="PM3, página inicial"><img src="assets/logo/pm3-logo-branco.svg" alt="PM3" width="92" height="28"></a>
      <ul class="nav" id="nav">
        <li><a href="membership.html"${cur('membership')}>Membership</a></li>
        <li><button type="button" aria-expanded="false" aria-controls="mega-formacoes">Formações ${chev}</button>
          ${mega('mega-formacoes','Formações','Programas completos, do fundamento à liderança. Todos inclusos na Membership.',
            FORMACOES.map(([n,h,a])=>`<li><a href="${h}">${n}<small>${a}</small></a></li>`).join(''),
            '<a href="formacoes.html">Ver todas as formações →</a><a href="cursos.html">Catálogo completo →</a>')}
        </li>
        <li><button type="button" aria-expanded="false" aria-controls="mega-sprints">Sprints ${chev}</button>
          ${mega('mega-sprints','Sprints','Cursos curtos e direto ao ponto, para resolver um desafio específico.',
            SPRINTS.map(([n,h,q])=>`<li><a href="${h}">${n}<small>${q} cursos</small></a></li>`).join(''),
            '<a href="sprints.html">Ver todas as sprints →</a><a href="sprint-fundamentos-gestao-produtos.html">Comece por Fundamentos →</a>')}
        </li>
        <li><a href="pos-tech.html"${cur('pos-tech')}>Pós Tech</a></li>
        <li><a href="para-empresas.html"${cur('para-empresas')}>Para empresas</a></li>
        <li><a href="blog.html"${cur('blog')}>Blog</a></li>
        <li><a href="faq.html"${cur('faq')}>FAQ</a></li>
        <li class="nav-mobile-cta"><a class="btn btn-light btn-block" href="#">Login</a><a class="btn btn-primary btn-block" href="membership.html#planos">Assinar a Membership</a></li>
      </ul>
      <div class="bar-actions">
        <a class="login" href="#">Login</a>
        <a class="btn btn-primary btn-sm" href="membership.html#planos">Assinar</a>
        <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav"><span></span></button>
      </div>
    </div>
  </header>`;

  const footer = `
  <footer class="site-footer">
    <div class="wrap">
      <div class="foot-top">
        <div class="foot-brand">
          <img src="assets/logo/pm3-logo-branco.svg" alt="PM3" width="111" height="34">
          <p>A escola de produtos digitais de quem faz produto de verdade. Pessoas criam produtos.</p>
          <a class="btn btn-light btn-sm" href="membership.html#planos">Conhecer a Membership ${arrow}</a>
        </div>
        <div><h4>Formações</h4><ul>${FORMACOES.map(([n,h])=>`<li><a href="${h}">${n}</a></li>`).join('')}</ul></div>
        <div><h4>Sprints</h4><ul>${SPRINTS.map(([n,h])=>`<li><a href="${h}">${n}</a></li>`).join('')}<li><a href="cursos.html">Catálogo completo</a></li></ul></div>
        <div><h4>Conteúdo</h4><ul><li><a href="blog.html">Blog</a></li><li><a href="#">Glossário de produto</a></li><li><a href="#">Biblioteca</a></li><li><a href="#">Panorama do mercado de produto</a></li></ul>
          <h4 style="margin-top:28px">Para você</h4><ul><li><a href="membership.html">Membership</a></li><li><a href="pos-tech.html">Pós Tech</a></li><li><a href="para-empresas.html">Para empresas</a></li></ul></div>
        <div><h4>PM3</h4><ul><li><a href="#">Sobre a PM3</a></li><li><a href="#">Instrutores</a></li><li><a href="#">Dar aula na PM3</a></li><li><a href="faq.html">FAQ</a></li><li><a href="#">Contato</a></li></ul></div>
      </div>
    </div>
    <div class="alun-band" aria-label="Grupo Alun">
      <span class="mz mz-l" aria-hidden="true"></span>
      <span class="mz mz-r" aria-hidden="true"></span>
      <div class="wrap alun-in">
        <a class="alun-id" href="https://alun.com.br/" target="_blank" rel="noopener">A PM3 faz parte do <b>Grupo Alun</b>: maior ecossistema de educação tech da América Latina</a>
        <ul class="alun-brands" aria-label="Empresas do Grupo Alun">
          <li><a href="home.html"><img src="assets/logo/pm3-logo-branco.svg" alt="PM3" style="height:16px"></a></li>
          <li><a href="https://www.alura.com.br/" target="_blank" rel="noopener"><img src="assets/alun/alura-branco.svg" alt="Alura" style="height:16px"></a></li>
          <li><a href="https://www.fiap.com.br/" target="_blank" rel="noopener"><img src="assets/alun/fiap-branco.png" alt="FIAP" style="height:16px"></a></li>
          <li><a href="https://www.startse.com/" target="_blank" rel="noopener"><img src="assets/alun/startse-branco.svg" alt="StartSe" style="height:16px"></a></li>
        </ul>
      </div>
    </div>
    <div class="wrap"><div class="foot-bottom"><span>© 2027 PM3. Todos os direitos reservados.</span><nav><a href="#">Política de privacidade</a><a href="#">Termos de uso</a><a href="#" data-consent-open>Preferências de cookies</a></nav></div></div>
  </footer>`;

  const consent = `
  <div class="consent" role="dialog" aria-label="Consentimento de cookies" id="consent">
    <b>Sua privacidade</b>
    <p>Usamos cookies para medir o uso do site e personalizar anúncios. Nada é carregado antes da sua escolha.</p>
    <div class="row"><button class="btn btn-line" data-c="recusar">Recusar</button><button class="btn btn-primary" data-c="aceitar">Aceitar</button></div>
    <button class="btn-text" data-c="personalizar">Personalizar</button>
  </div>`;

  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer + consent +
    '<div class="toast" id="toast"></div>');

  /* menu: mega no desktop, gaveta no celular */
  const nav = document.getElementById('nav');
  const fecharMegas = except => nav.querySelectorAll('li.open').forEach(li => { if (li !== except){ li.classList.remove('open'); li.querySelector('button')?.setAttribute('aria-expanded','false'); }});
  nav.querySelectorAll('li > button').forEach(b => {
    const li = b.parentElement;
    /* no desktop o hover já abriu: o clique só mantém aberto; no celular, alterna */
    b.addEventListener('click', () => { const abre = matchMedia('(min-width:1081px)').matches || !li.classList.contains('open'); fecharMegas(li); li.classList.toggle('open', abre); b.setAttribute('aria-expanded', abre); });
    li.addEventListener('mouseenter', () => { if (matchMedia('(min-width:1081px)').matches){ fecharMegas(li); li.classList.add('open'); b.setAttribute('aria-expanded','true'); }});
    li.addEventListener('mouseleave', () => { if (matchMedia('(min-width:1081px)').matches){ li.classList.remove('open'); b.setAttribute('aria-expanded','false'); }});
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape'){ fecharMegas(); document.documentElement.classList.remove('nav-open'); }});
  const tog = document.querySelector('.menu-toggle');
  tog.addEventListener('click', () => { const o = document.documentElement.classList.toggle('nav-open'); tog.setAttribute('aria-expanded', o); document.body.style.overflow = o ? 'hidden' : ''; });

  /* consentimento: guarda a escolha só neste navegador */
  const c = document.getElementById('consent');
  let escolha = null; try { escolha = localStorage.getItem('pm3_consent'); } catch(e){}
  if (!escolha) setTimeout(() => c.classList.add('show'), 900);
  c.addEventListener('click', e => { const v = e.target.dataset.c; if (!v) return; if (v === 'personalizar'){ aviso('No site real: categorias de cookies com Google Consent Mode'); return; } try { localStorage.setItem('pm3_consent', v); } catch(err){} c.classList.remove('show'); });
  document.querySelector('[data-consent-open]').addEventListener('click', e => { e.preventDefault(); c.classList.add('show'); });

  /* aviso para páginas que ainda não existem no protótipo */
  const toast = document.getElementById('toast'); let tt;
  function aviso(t){ toast.textContent = t; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2600); }
  window.pm3Aviso = aviso;
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a) return;
    const h = a.getAttribute('href');
    if (h === '#'){ e.preventDefault(); aviso('Esta página ainda não faz parte do protótipo'); return; }
    const arq = h.split('#')[0];
    if (arq && arq.endsWith('.html') && arq !== 'index.html' && arq !== 'galeria.html' && !PRONTAS.includes(arq)){ e.preventDefault(); aviso('Página prevista no protótipo, ainda em desenho'); }
  });

  /* números que contam ao aparecer: data-count, data-pre, data-suf */
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => n.toLocaleString('pt-BR');
  const conta = el => {
    const alvo = +el.dataset.count, pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    if (calmo){ el.textContent = pre + fmt(alvo) + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const passo = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + fmt(Math.round(alvo * e)) + suf; if (p < 1) requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
  };
  const ioN = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ conta(en.target); ioN.unobserve(en.target); }}), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => ioN.observe(el));

  /* entrada ao rolar */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }}), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

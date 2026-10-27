/* PM3 · protótipo alfa · header, mega menu, rodapé, consentimento e notas.
   Um lugar só para o que se repete em todas as páginas. */
(function(){
  const PAGE = document.body.dataset.page || '';
  /* páginas já desenhadas no protótipo; as outras mostram um aviso */
  const PRONTAS = ['membership.html','home.html','formacao-product-manager.html','sprint-fundamentos-gestao-produtos.html','formacoes.html','sprints.html','cursos.html','pos-tech.html','para-empresas.html','blog.html','faq.html','comunidade.html'];

  const FORMACOES = [
    ['Product Management','formacao-product-manager.html','Gestão de produtos'],
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
          ${mega('mega-formacoes','Formações','Cursos completos de 21 a 79 horas, com projeto real e certificado. Todos inclusos na Membership.',
            FORMACOES.map(([n,h,a])=>`<li><a href="${h}">${n}<small>${a}</small></a></li>`).join(''),
            '<a href="formacoes.html">Ver todas as formações →</a>')}
        </li>
        <li><button type="button" aria-expanded="false" aria-controls="mega-sprints">Sprints ${chev}</button>
          ${mega('mega-sprints','Sprints','Cursos de 2 a 12 horas, cada um focado em um desafio específico. Inclusos na Membership.',
            SPRINTS.map(([n,h,q])=>`<li><a href="${h}">${n}<small>${q} cursos</small></a></li>`).join(''),
            '<a href="sprints.html">Ver todos os sprints →</a>')}
        </li>
        <li><a href="pos-tech.html"${cur('pos-tech')}>Pós Tech</a></li>
        <li><a href="para-empresas.html"${cur('para-empresas')}>Para empresas</a></li>
        <li><a href="comunidade.html"${cur('comunidade')}>Comunidade</a></li>
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
          <p>Escola de produtos digitais e IA: formações, sprints, Membership e Pós Tech. Pessoas criam produtos.</p>
          <a class="ft-link" href="membership.html#planos">Conhecer a Membership ${arrow}</a>
          <a class="ft-link" href="cursos.html">Catálogo completo ${arrow}</a>
        </div>
        <div><h4>Formações</h4><ul>${FORMACOES.map(([n,h])=>`<li><a href="${h}">${n}</a></li>`).join('')}</ul></div>
        <div><h4>Sprints</h4><ul>${SPRINTS.map(([n,h])=>`<li><a href="${h}">${n}</a></li>`).join('')}</ul></div>
        <div><h4>Conteúdo</h4><ul><li><a href="blog.html">Blog</a></li><li><a href="#">Glossário de produto</a></li><li><a href="#">Biblioteca</a></li><li><a href="#">Panorama do mercado de produto</a></li></ul>
          <h4 style="margin-top:28px">Para você</h4><ul><li><a href="membership.html">Membership</a></li><li><a href="pos-tech.html">Pós Tech</a></li><li><a href="para-empresas.html">Para empresas</a></li><li><a href="comunidade.html">Comunidade</a></li></ul></div>
        <div><h4>PM3</h4><ul><li><a href="#">Sobre a PM3</a></li><li><a href="#">Instrutores</a></li><li><a href="#">Dar aula na PM3</a></li><li><a href="faq.html">FAQ</a></li><li><a href="#">Contato</a></li></ul></div>
      </div>
    </div>
    <div class="wrap"><div class="foot-bottom"><span>© 2027 PM3. Todos os direitos reservados.</span><nav><a href="#">Política de privacidade</a><a href="#">Termos de uso</a><a href="#" data-consent-open>Preferências de cookies</a></nav></div></div>
    <div class="alun-band" aria-label="Grupo Alun">
      <span class="mz mz-l" aria-hidden="true"></span>
      <span class="mz mz-r" aria-hidden="true"></span>
      <div class="wrap alun-in">
        <a class="alun-id" href="https://alun.com.br/" target="_blank" rel="noopener">A PM3 faz parte do <b>Grupo Alun</b>: maior ecossistema de educação tech da América Latina</a>
        <ul class="alun-brands" aria-label="Empresas do Grupo Alun">
          <li><img src="assets/logo/pm3-logo-branco.svg" alt="PM3" style="height:16px"></li>
          <li><img src="assets/alun/alura-branco.svg" alt="Alura" style="height:16px"></li>
          <li><img src="assets/alun/fiap-branco.png" alt="FIAP" style="height:13.5px"></li>
          <li><img src="assets/alun/startse-branco.svg" alt="StartSe" style="height:13.5px"></li>
        </ul>
      </div>
    </div>
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
    const t0 = performance.now(), dur = 3000;
    const passo = t => { const p = Math.min(1, (t - t0) / dur), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      el.textContent = pre + fmt(Math.round(alvo * e)) + suf; if (p < 1) requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
  };
  const ioN = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ conta(en.target); ioN.unobserve(en.target); }}), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => ioN.observe(el));

  /* entrada ao rolar */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }}), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* primeira dobra: em telas mais baixas que o desenho (notebooks 16:9), os elementos do hero
   (título, foto, textos, atalhos) encolhem juntos pela variável --s. A largura e as margens
   do container não mudam, então o hero segue alinhado ao header e ao resto do site. */
(function(){
  const hero = document.querySelector('.h-hero, .c-hero, .v-hero, .b-hero');
  if (!hero) return;
  const encaixa = () => {
    hero.style.removeProperty('--s');
    hero.style.removeProperty('--livre');
    if (innerWidth < 1081) return;
    const livre = innerHeight - (hero.getBoundingClientRect().top + scrollY);
    /* o hero em cards (Home) ocupa exatamente a primeira dobra */
    hero.style.setProperty('--livre', livre + 'px');
    if (hero.offsetHeight <= livre + 1) return;
    /* nem tudo escala (paddings laterais, textos pequenos): busca a maior escala que cabe */
    let lo = .62, hi = 1;
    for (let i = 0; i < 8; i++){
      const s = (lo + hi) / 2;
      hero.style.setProperty('--s', s.toFixed(3));
      if (hero.offsetHeight <= livre + 1) lo = s; else hi = s;
    }
    hero.style.setProperty('--s', lo.toFixed(3));
  };
  encaixa();
  addEventListener('resize', encaixa);
  addEventListener('load', encaixa);
  if (document.fonts) document.fonts.ready.then(encaixa);
  /* fechar a faixa de campanha libera espaço: recalcula */
  document.addEventListener('click', e => { if (e.target.closest('#camp button')) requestAnimationFrame(encaixa); });
})();

/* sem viúvas em todo o site: as últimas palavras de parágrafos, listas e legendas ficam juntas
   (espaço não separável), então nenhuma linha final fica com uma ou duas palavras sozinhas.
   Vale também para o que é desenhado depois (catálogo, FAQ), via MutationObserver. */
(function(){
  /* onde o navegador já evita viúvas sozinho (text-wrap:pretty, no base.css), colar palavras
     só atrapalha: ele passa a quebrar linhas cedo demais no meio do parágrafo */
  if (window.CSS && CSS.supports('text-wrap', 'pretty')) return;
  const SEL = 'p, li, dd, small, figcaption, blockquote, .lead, .to > span, .who span';
  const NB = '\u00A0';
  const cola = el => {
    if (el.dataset.semViuva || el.closest('[contenteditable], pre, code, nav.site-nav')) return;
    el.dataset.semViuva = '1';
    /* só o bloco mais interno (ex.: o <p> dentro do <blockquote>), senão as palavras seriam coladas duas vezes */
    if (el.querySelector(SEL)) return;
    const txt = el.textContent.trim();
    if (txt.split(/\s+/).length < 6) return;
    /* junta as 3 últimas palavras; se ficar longo demais para telas estreitas, junta só 2 */
    const ult = txt.split(/\s+/).slice(-3);
    const n = ult.join(' ').length <= 30 ? 2 : (ult.slice(-2).join(' ').length <= 22 ? 1 : 0);
    if (!n) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nos = []; let t; while ((t = walker.nextNode())) nos.push(t);
    const orig = nos.map(x => x.data);
    let falta = n;
    for (let i = nos.length - 1; i >= 0 && falta > 0; i--){
      const s = nos[i].data.replace(/\s+$/, '');
      const fim = nos[i].data.slice(s.length);
      let out = '';
      for (let j = s.length - 1; j >= 0; j--){
        if (falta > 0 && s[j] === ' ' && j > 0 && s[j - 1] !== ' '){ out = NB + out; falta--; }
        else out = s[j] + out;
      }
      nos[i].data = out + fim;
    }
    /* se as palavras juntas não cabem na largura do bloco (ex.: colunas estreitas no celular), desfaz */
    if (el.scrollWidth > el.clientWidth + 1 || document.documentElement.scrollWidth > innerWidth) nos.forEach((x, k) => { x.data = orig[k]; });
  };
  const roda = raiz => (raiz.querySelectorAll ? raiz.querySelectorAll(SEL) : []).forEach(cola);
  const inicia = () => {
    roda(document);
    let pend = 0;
    new MutationObserver(ms => {
      cancelAnimationFrame(pend);
      pend = requestAnimationFrame(() => ms.forEach(m => m.addedNodes.forEach(nd => { if (nd.nodeType === 1){ if (nd.matches(SEL)) cola(nd); roda(nd); } })));
    }).observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inicia); else inicia();
})();

/* luz: manchas de luz em movimento nas seções escuras (o certificado fica de fora).
   As manchas variam por seção (cores e posições sorteadas de forma estável); o cursor anda com inércia
   num único requestAnimationFrame, que só roda enquanto há uma seção escura visível com o mouse em cima. */
(function(){
  const alvos = [...document.querySelectorAll('section.section.black, section.section.deep')]
    .filter(s => !s.matches('.bento-sec, .ia-sec, .alun-sec2, .trilhas-sec') && !s.querySelector(':scope > .luz'));
  if (!alvos.length) return;
  const cores = ['rgba(102,69,177,.9)','rgba(176,77,221,.75)','rgba(77,43,159,.9)','rgba(255,177,42,.35)','rgba(237,20,91,.35)','rgba(252,203,201,.3)'];
  const semente = (n => () => (n = (n * 9301 + 49297) % 233280) / 233280);
  alvos.forEach((s, k) => {
    const r = semente(k * 97 + 13);
    const luz = document.createElement('div');
    luz.className = 'luz'; luz.setAttribute('aria-hidden', 'true');
    let html = '';
    const n = 2 + (k % 2);
    for (let i = 0; i < n; i++) {
      /* caixa sempre dentro da seção (altura em % da seção): a mancha se apaga antes da borda */
      const w = 32 + r() * 22, h = 50 + r() * 24, x = (i % 2 ? 48 : 0) + r() * (52 - w + 4), y = 4 + r() * (92 - h);
      const c = i === n - 1 && r() > .5 ? cores[3 + Math.floor(r() * 3)] : cores[Math.floor(r() * 3)];
      html += `<i class="bl" style="width:${w}%;height:${h}%;left:${x}%;top:${y}%;background:radial-gradient(closest-side,${c},transparent);--d:${26 + r() * 16}s;--atraso:${-r() * 20}s;--tx:${(r() - .5) * 22}%;--ty:${(r() - .5) * 18}%"></i>`;
    }
    luz.innerHTML = html;
    s.classList.add('tem-luz');
    s.prepend(luz);
  });
})();

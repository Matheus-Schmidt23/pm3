/* PM3 · monta Formações, Sprints e /cursos/ a partir de catalogo.js.
   Roda antes de layout.js, para que entradas e notas peguem o conteúdo gerado. */
(function(){
  const { AREAS, FORMACOES, SPRINTS } = window.PM3_CATALOGO;
  const PAGE = document.body.dataset.page;
  const $ = s => document.querySelector(s);
  const arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 8h11M9 4l4 4-4 4"/></svg>';
  const NIVEL = { 'Base': 1, 'Intermediário': 2, 'Avançado': 3 };
  const lvl = n => `<span class="lvl" aria-hidden="true">${[1,2,3].map(i => `<i class="${i <= NIVEL[n] ? 'on' : ''}"></i>`).join('')}</span>`;

  /* ---------- /formacoes/ ---------- */
  if (PAGE === 'formacoes'){
    const ordem = ['gestao','ia','dados','marketing','design','lideranca'];
    /* catálogo: um card de venda por formação, filtrável por área */
    const nomeA = a => AREAS[a].curto;
    const lista = ordem.flatMap(a => FORMACOES.filter(f => f.area === a));
    /* mesmo card da Membership (cards-formacao.css) */
    const ic = {
      h: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="8" cy="8" r="6.2"/><path d="M8 4.6V8l2.4 1.6"/></svg>',
      mod: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 1.8 14.2 5 8 8.2 1.8 5z"/><path d="m1.8 8 6.2 3.2L14.2 8"/><path d="m1.8 11 6.2 3.2 6.2-3.2"/></svg>',
      cert: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="8" cy="6.2" r="4.2"/><path d="m5.6 9.6-1.1 4.8L8 12.8l3.5 1.6-1.1-4.8"/></svg>',
      go: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 8h11M9 4l4 4-4 4"/></svg>'
    };
    $('#fx-chips').innerHTML = `<button type="button" class="on" data-f="">Todas <small>${lista.length}</small></button>` +
      ordem.map(a => `<button type="button" data-f="${a}">${nomeA(a)} <small>${FORMACOES.filter(f => f.area === a).length}</small></button>`).join('');
    $('#fx-grid').innerHTML = lista.map((f, i) => `<a class="f-card reveal${f.destaque === 'Comece aqui' ? ' feature' : ''}" data-a="${f.area}" data-d="${i % 3}" href="${f.url}">
      <div class="f-vis" style="background-image:url('assets/capas/${f.capa}-800.jpg?v=3')" aria-hidden="true"></div>
      <div class="f-body"><div class="top"><span class="tag tag-area">${nomeA(f.area)}</span>${f.destaque ? `<span class="tag tag-yellow">${f.destaque}</span>` : ''}</div>
        <h3>${f.nome}</h3><p>${f.quem}</p>
        <ul class="f-facts">${f.h ? `<li>${ic.h}${f.h}h</li>` : ''}<li>${ic.mod}${f.mod} módulos</li><li class="fc-cert">${ic.cert}Certificado</li></ul>
        <div class="meta"><span>Ver formação</span><span class="go">${ic.go}</span></div></div></a>`).join('') +
      `<a class="f-more reveal" href="membership.html"><div><small>Membership PM3</small><h3>Todas as dez<span class="em">em uma só assinatura.</span></h3>
        <p>12 meses de acesso às 10 formações, às +40 sprints, mentorias, workshops ao vivo e comunidade.</p></div>
        <div class="row"><div class="pr"><b>12x R$ 299,91</b><span>ou R$ 3.599 à vista</span></div><span class="btn btn-light">Conhecer a Membership ${ic.go}</span></div></a>`;
    const filtra = a => {
      document.querySelectorAll('#fx-chips button').forEach(b => b.classList.toggle('on', b.dataset.f === a));
      document.querySelectorAll('#fx-grid .f-card').forEach(c => c.hidden = !!a && c.dataset.a !== a);
      $('#fx-grid .f-more').hidden = !!a;
    };
    $('#fx-chips').addEventListener('click', e => { const b = e.target.closest('button'); if (b) filtra(b.dataset.f); });
    document.querySelectorAll('[data-filtro]').forEach(l => l.addEventListener('click', () => filtra(l.dataset.filtro)));
  }

  /* ---------- /sprints/ ---------- */
  if (PAGE === 'sprints'){
    /* catálogo: um card por sprint (mesmo card de Formações), filtrável por vertical */
    const ordem = ['gestao','dados','design','marketing','negocios','lideranca'];
    const nomeA = a => a === 'lideranca' ? 'Liderança' : AREAS[a].curto;
    const CAPAS = ['fundamentos-gestao-produtos','roadmap-priorizacao','tecnicas-pesquisa','tecnologia-pms','prd','product-ops-fundamentos','product-ops-avancado','metodos-analise-dados','power-bi','excel','metricas-negocios','python','visualizacao-dashboards','teste-ab','sql','lgpd','problem-solving','vieses-analises','design-thinking','design-servico','ui-design','go-to-market','product-growth','product-marketing','aquisicao','sales-enablement','okrs','metodologias-ageis','gestao-processos','educacao-corporativa','negociacao-lideres','comunicacao-assertiva','apresentacao-slides','diversidade-inclusao','trabalho-remoto','gestao-tempo','lideranca-equipe','saude-mental','delegacao','feedback','ie-lideres','ie-trabalho','oratoria','tecnicas-negociacao'];
    SPRINTS.forEach((s, i) => { s.capa = CAPAS[i]; });
    const ic = {
      h: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="8" cy="8" r="6.2"/><path d="M8 4.6V8l2.4 1.6"/></svg>',
      cert: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="8" cy="6.2" r="4.2"/><path d="m5.6 9.6-1.1 4.8L8 12.8l3.5 1.6-1.1-4.8"/></svg>',
      go: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 8h11M9 4l4 4-4 4"/></svg>'
    };
    const lista = ordem.flatMap(a => SPRINTS.filter(s => s.area === a));
    $('#fx-chips').innerHTML = `<button type="button" class="on" data-f="">Todas <small>${lista.length}</small></button>` +
      ordem.map(a => `<button type="button" data-f="${a}">${nomeA(a)} <small>${SPRINTS.filter(s => s.area === a).length}</small></button>`).join('');
    $('#fx-grid').innerHTML = lista.map((s, i) => `<a class="f-card reveal${s.url !== '#' ? ' feature' : ''}" data-a="${s.area}" data-d="${i % 4}" href="${s.url}">
      <div class="f-vis" style="background-image:url('assets/capas/sprints/${s.capa}.jpg')" aria-hidden="true"></div>
      <div class="f-body"><div class="top"><span class="tag tag-area">${nomeA(s.area)}</span>${s.url !== '#' ? '<span class="tag tag-yellow">Comece aqui</span>' : ''}</div>
        <h3>${s.nome}</h3><p>${s.obj}</p>
        <ul class="f-facts"><li>${ic.h}${s.h}h</li><li>${ic.cert}Certificado</li></ul>
        <div class="meta"><span>Ver sprint</span><span class="go">${ic.go}</span></div></div></a>`).join('') +
      `<a class="f-more f-more-full reveal" href="membership.html"><div><small>Membership PM3</small><h3>Todas as sprints<span class="em">e as 10 formações.</span></h3>
        <p>12 meses de acesso às +40 sprints, às 10 formações, mentorias, workshops ao vivo e comunidade.</p></div>
        <div class="row"><div class="pr"><b>12x R$ 299,91</b><span>ou R$ 3.599 à vista</span></div><span class="btn btn-light">Conhecer a Membership ${ic.go}</span></div></a>`;
    /* mostra 12 por vez; "Carregar mais" abre os próximos 12 (respeitando o filtro) */
    const PAG = 12; let area = '', limite = PAG;
    $('#fx-grid').insertAdjacentHTML('afterend', '<div class="fx-more"><button type="button" class="btn btn-primary" id="fx-mais">Carregar mais sprints</button><small id="fx-cont"></small></div>');
    const mostra = () => {
      const cards = [...document.querySelectorAll('#fx-grid .f-card')];
      const doFiltro = cards.filter(c => !area || c.dataset.a === area);
      cards.forEach(c => c.hidden = true);
      doFiltro.slice(0, limite).forEach(c => { c.hidden = false; c.classList.add('in'); });
      const resta = doFiltro.length - Math.min(limite, doFiltro.length);
      $('#fx-mais').hidden = resta <= 0;
      $('#fx-mais').textContent = `Carregar mais ${Math.min(PAG, resta)} sprints`;
      $('#fx-cont').textContent = `Mostrando ${Math.min(limite, doFiltro.length)} de ${doFiltro.length}`;
    };
    const filtra = a => {
      area = a; limite = PAG;
      document.querySelectorAll('#fx-chips button').forEach(b => b.classList.toggle('on', b.dataset.f === a));
      mostra();
    };
    $('#fx-chips').addEventListener('click', e => { const b = e.target.closest('button'); if (b) filtra(b.dataset.f); });
    $('#fx-mais').addEventListener('click', () => { limite += PAG; mostra(); });
    mostra();
  }

  /* ---------- /cursos/ ---------- */
  if (PAGE === 'cursos'){
    const POS = [
      { nome: 'Digital Product Management', area: 'gestao', obj: 'Pós-graduação PM3 + FIAP com certificação do MEC.' },
      { nome: 'IA para Negócios: Gestão Estratégica e Liderança', area: 'ia', obj: 'Pós-graduação PM3 + FIAP com certificação do MEC.' },
      { nome: 'Tech Management', area: 'negocios', obj: 'Pós-graduação PM3 + FIAP com certificação do MEC.' }
    ];
    const ITENS = [
      ...FORMACOES.map(f => ({ tipo: 'formacao', nome: f.nome, area: f.area, h: f.h, txt: f.quem, url: f.url, dest: f.destaque })),
      ...SPRINTS.map(s => ({ tipo: 'sprint', nome: s.nome, area: s.area, h: s.h, txt: s.obj, url: s.url })),
      ...POS.map(p => ({ tipo: 'pos', nome: p.nome, area: p.area, h: null, txt: p.obj, url: 'pos-tech.html' }))
    ];
    const TIPOS = { formacao: 'Formação', sprint: 'Sprint', pos: 'Pós Tech' };
    const DUR = { curta: ['Até 5 horas', h => h != null && h <= 5], media: ['De 6 a 15 horas', h => h > 5 && h <= 15], longa: ['Mais de 15 horas', h => h > 15] };
    const st = { q: '', tipo: new Set(), area: new Set(), dur: '', ord: 'rel' };

    /* filtros renderizados com contagem */
    const cnt = (k, v) => ITENS.filter(i => k === 'dur' ? DUR[v][1](i.h) : i[k] === v).length;
    const opt = (name, type, v, lb) => `<label class="fopt"><input type="${type}" name="${name}" value="${v}"><span class="bx"></span><span class="lb">${lb}</span><small>${cnt(name, v)}</small></label>`;
    $('#f-tipo').innerHTML = Object.entries(TIPOS).map(([v, l]) => opt('tipo','checkbox',v,l)).join('');
    $('#f-area').innerHTML = Object.keys(AREAS).filter(a => ITENS.some(i => i.area === a)).map(a => opt('area','checkbox',a,AREAS[a].nome)).join('');
    $('#f-dur').innerHTML = Object.entries(DUR).map(([v, [l]]) => opt('dur','radio',v,l)).join('');
    if (matchMedia('(max-width:860px)').matches) document.querySelector('.filters').open = false;

    const card = i => {
      const cls = i.tipo === 'formacao' ? ' f' : i.tipo === 'pos' ? ' pos' : '';
      const inc = i.tipo === 'pos' ? 'PM3 + FIAP' : 'Na Membership';
      return `<a class="ccard${cls}" href="${i.url}"><div class="top"><span class="tag ${i.tipo === 'sprint' ? 'tag-soft' : 'tag-dark'}">${TIPOS[i.tipo]}</span>${i.dest ? `<span class="tag tag-yellow">${i.dest}</span>` : ''}</div>
        <h3>${i.nome}</h3><p>${i.txt}</p><div class="ft"><span><b>${i.h ? i.h + 'h' : i.tipo === 'pos' ? 'Pós-graduação' : '6 módulos'}</b> · ${AREAS[i.area].curto}</span><span class="inc">${inc}</span></div></a>`;
    };
    const membro = `<a class="ccard member" href="membership.html"><div class="top"><span class="tag" style="background:#000;color:#fff">Membership</span></div>
      <h3>Todas as formações e sprints em uma assinatura</h3><p>10 formações, +40 sprints, mentorias, workshops ao vivo e comunidade por 12 meses.</p>
      <div class="ft"><span><b>12x R$ 299,91</b></span><span class="inc" style="color:#000">Conhecer →</span></div></a>`;

    const sem = s => s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
    const render = () => {
      let r = ITENS.filter(i =>
        (!st.q || sem(i.nome + ' ' + i.txt).includes(sem(st.q))) &&
        (!st.tipo.size || st.tipo.has(i.tipo)) && (!st.area.size || st.area.has(i.area)) &&
        (!st.dur || DUR[st.dur][1](i.h)));
      if (st.ord === 'menor') r = [...r].sort((a, b) => (a.h ?? 999) - (b.h ?? 999));
      if (st.ord === 'maior') r = [...r].sort((a, b) => (b.h ?? -1) - (a.h ?? -1));
      if (st.ord === 'az') r = [...r].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
      const filtrando = st.q || st.tipo.size || st.area.size || st.dur;
      $('#cnt').innerHTML = `${r.length} <span>${r.length === 1 ? 'curso' : 'cursos'}${filtrando ? (r.length === 1 ? ' encontrado' : ' encontrados') : ' no catálogo'}</span>`;
      $('#cgrid').innerHTML = r.length ? (!filtrando ? membro : '') + r.map(card).join('')
        : `<div class="empty"><b>Nenhum curso com esses filtros</b>Remova um filtro ou busque outro termo.</div>`;
      const chips = [...st.tipo].map(v => ['tipo', v, TIPOS[v]]).concat([...st.area].map(v => ['area', v, AREAS[v].curto]), st.dur ? [['dur', st.dur, DUR[st.dur][0]]] : []);
      $('#active').innerHTML = chips.map(([k, v, l]) => `<button type="button" data-k="${k}" data-v="${v}">${l}</button>`).join('');
      $('#fcount').textContent = chips.length ? `(${chips.length})` : '';
    };
    const sync = () => document.querySelectorAll('.fopt input').forEach(inp => {
      inp.checked = inp.name === 'dur' ? st.dur === inp.value : st[inp.name].has(inp.value); });

    document.querySelector('.filters').addEventListener('change', e => {
      const t = e.target; if (!t.name) return;
      if (t.name === 'dur') st.dur = t.value; else t.checked ? st[t.name].add(t.value) : st[t.name].delete(t.value);
      render();
    });
    $('#active').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.k === 'dur') st.dur = ''; else st[b.dataset.k].delete(b.dataset.v); sync(); render(); });
    $('#fclear').addEventListener('click', () => { st.tipo.clear(); st.area.clear(); st.dur = ''; sync(); render(); });
    $('#q').addEventListener('input', e => { st.q = e.target.value.trim(); render(); });
    $('#ord').addEventListener('change', e => { st.ord = e.target.value; render(); });

    /* entrada por link: /cursos/?tipo=sprint&area=dados (no protótipo, via hash) */
    const p = new URLSearchParams(location.hash.slice(1));
    (p.get('tipo') || '').split(',').filter(v => TIPOS[v]).forEach(v => st.tipo.add(v));
    (p.get('area') || '').split(',').filter(v => AREAS[v]).forEach(v => st.area.add(v));
    sync(); render();
  }
})();

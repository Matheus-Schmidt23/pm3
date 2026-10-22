/* PM3 · monta Formações, Sprints e /cursos/ a partir de catalogo.js.
   Roda antes de layout.js, para que entradas e notas peguem o conteúdo gerado. */
(function(){
  const { AREAS, FORMACOES, SPRINTS } = window.PM3_CATALOGO;
  const PAGE = document.body.dataset.page;
  const $ = s => document.querySelector(s);
  const arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 8h11M9 4l4 4-4 4"/></svg>';
  const horas = h => h == null ? 'carga a confirmar' : h + 'h';
  const NIVEL = { 'Base': 1, 'Intermediário': 2, 'Avançado': 3 };
  const lvl = n => `<span class="lvl" aria-hidden="true">${[1,2,3].map(i => `<i class="${i <= NIVEL[n] ? 'on' : ''}"></i>`).join('')}</span>`;

  /* ---------- /formacoes/ ---------- */
  if (PAGE === 'formacoes'){
    const ordem = ['gestao','ia','dados','marketing','design','lideranca'];
    /* catálogo: um card de venda por formação, filtrável por área */
    const nomeA = a => a === 'gestao' ? AREAS[a].nome : AREAS[a].curto;
    const lista = ordem.flatMap(a => FORMACOES.filter(f => f.area === a));
    const check = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="m3.5 8.5 3 3 6-7"/></svg>';
    $('#fx-chips').innerHTML = `<button type="button" class="on" data-f="">Todas <small>${lista.length}</small></button>` +
      ordem.map(a => `<button type="button" data-f="${a}">${nomeA(a)} <small>${FORMACOES.filter(f => f.area === a).length}</small></button>`).join('');
    $('#fx-grid').innerHTML = lista.map((f, i) => `<a class="fx reveal" data-a="${f.area}" data-d="${i % 2}" href="${f.url}">
      <div class="fx-vis" style="background-image:url('assets/capas/${f.capa}-800.jpg?v=3')"><span class="tag">${nomeA(f.area)}</span>${f.destaque ? `<span class="tag tag-yellow">${f.destaque}</span>` : ''}</div>
      <div class="fx-body">
        <span class="fx-lvl">${lvl(f.nivel)}${f.nivel}</span>
        <h3>${f.nome}</h3>
        <p>${f.quem}</p>
        <ul class="fx-learn">${f.aprende.map(t => `<li>${check}${t}</li>`).join('')}</ul>
        <div class="fx-foot"><span class="fx-facts"><b>${f.h ? f.h + 'h' : f.mod + ' módulos'}</b>${f.h ? ` · ${f.mod} módulos` : ''} · Certificado</span><span class="fx-go">Ver formação${arrow}</span></div>
      </div></a>`).join('');
    const filtra = a => {
      document.querySelectorAll('#fx-chips button').forEach(b => b.classList.toggle('on', b.dataset.f === a));
      document.querySelectorAll('#fx-grid .fx').forEach(c => c.hidden = !!a && c.dataset.a !== a);
    };
    $('#fx-chips').addEventListener('click', e => { const b = e.target.closest('button'); if (b) filtra(b.dataset.f); });
    document.querySelectorAll('[data-filtro]').forEach(l => l.addEventListener('click', () => filtra(l.dataset.filtro)));
    const max = Math.max(...FORMACOES.map(f => f.h || 0));
    $('#cmp tbody').innerHTML = FORMACOES.map(f => `<tr>
      <td><a href="${f.url}">${f.nome}</a></td><td>${AREAS[f.area].curto}</td>
      <td class="num">${horas(f.h)}${f.h ? `<span class="bar" style="width:${Math.round(f.h / max * 100)}%"></span>` : ''}</td>
      <td class="num">${f.mod}</td><td>${lvl(f.nivel)}${f.nivel}</td><td>${f.quem}</td></tr>`).join('');
  }

  /* ---------- /sprints/ ---------- */
  if (PAGE === 'sprints'){
    const ordem = ['gestao','dados','design','marketing','negocios','lideranca'];
    const intro = {
      gestao: 'Roadmap, PRD, pesquisa e operações de produto.', dados: 'SQL, Python, BI, métricas e experimentos.',
      design: 'Design thinking, serviço e interface.', marketing: 'Growth, go-to-market e aquisição.',
      negocios: 'OKRs, ágil e processos.', lideranca: 'Comunicação, feedback, negociação e gestão de pessoas.'
    };
    const grupos = ordem.map(a => ({ a, ss: SPRINTS.filter(s => s.area === a) }));
    $('#vnav').innerHTML = grupos.map(g => `<a href="#${g.a}">${AREAS[g.a].nome}<small>${g.ss.length}</small></a>`).join('');
    $('#verts').innerHTML = grupos.map(g => {
      const tot = g.ss.reduce((t, s) => t + s.h, 0);
      return `<section class="vert" id="${g.a}" aria-labelledby="t-${g.a}">
        <div class="vert-head"><span class="n">${String(g.ss.length).padStart(2,'0')}</span><div><h2 id="t-${g.a}">${AREAS[g.a].nome}</h2><p>${intro[g.a]}</p></div><div class="tot"><b>${tot}h</b>de conteúdo na vertical</div></div>
        <div class="slist">${g.ss.map(s => `<a class="srow${s.url !== '#' ? ' hot' : ''}" href="${s.url}"><b>${s.nome}</b><span>${s.obj}</span><em class="hh" style="font-style:normal">${s.h}h</em></a>`).join('')}</div>
      </section>`;
    }).join('');
    const links = [...document.querySelectorAll('#vnav a')], secs = links.map(l => $(l.getAttribute('href')));
    const marca = () => { let cur = null; secs.forEach(s => { if (s.getBoundingClientRect().top < 200) cur = s.id; });
      links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + cur)); };
    addEventListener('scroll', marca, { passive: true }); marca();
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

/* PM3 · páginas institucionais (Sobre, Instrutores, Depoimentos, Seja instrutor, Contato, 404).
   Carrega antes do layout.js, para que os cards gerados aqui ganhem a animação .reveal. */
(function(){
  const PAGE = document.body.dataset.page || '';
  const $ = s => document.querySelector(s);
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
  const tira = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const ins = window.PM3_INSTRUTORES || [];
  const AREA = { gestao: 'Produto', ia: 'IA', dados: 'Dados', design: 'Design', marketing: 'Marketing', lideranca: 'Liderança' };
  const icLi = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.6 5.6H1V15h2.6V5.6ZM2.3 1.2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM15 9.7c0-2.5-.5-4.3-3.4-4.3-1.4 0-2.3.8-2.7 1.5V5.6H6.4V15H9v-4.7c0-1.2.2-2.4 1.8-2.4 1.5 0 1.5 1.4 1.5 2.5V15H15V9.7Z"/></svg>';

  /* ordem estável que mistura empresas (evita 14 pessoas do mesmo lugar em sequência) e põe as fotos boas primeiro */
  const embaralha = (arr, seed = 7) => { const a = arr.slice(); let s = seed; for (let i = a.length - 1; i > 0; i--){ s = (s * 9301 + 49297) % 233280; const j = Math.floor(s / 233280 * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------- avatares e número de instrutores em qualquer página ---------- */
  document.querySelectorAll('[data-ins-avs]').forEach(el => {
    const n = +el.dataset.insAvs || 6;
    el.innerHTML = embaralha(ins, 3).slice(0, n).map(p => `<img src="assets/people/instrutores/${p.f}" alt="" width="44" height="44" loading="lazy">`).join('');
  });
  document.querySelectorAll('[data-ins-total]').forEach(el => el.textContent = ins.length);

  /* ---------- /instrutores/ ---------- */
  if (PAGE === 'instrutores'){
    const empresas = [...new Set(ins.map(p => p.e).filter(Boolean))];
    $('#n-emp').textContent = empresas.length;
    $('#n-ins').textContent = ins.length;

    /* mural de rostos no hero */
    const faces = $('#faces');
    faces.innerHTML = embaralha(ins.filter(p => p.m), 11).slice(0, 12).map((p, i) => `<span style="transition-delay:${(i % 4) * 60 + Math.floor(i / 4) * 90}ms"><img src="assets/people/instrutores/${p.f}" alt="" width="160" height="200" loading="${i < 10 ? 'eager' : 'lazy'}"></span>`).join('');
    requestAnimationFrame(() => setTimeout(() => faces.classList.add('in'), 120));

    /* faixa de empresas: as que mais aparecem primeiro */
    const freq = {}; ins.forEach(p => { if (p.e) freq[p.e] = (freq[p.e] || 0) + 1; });
    const top = Object.keys(freq).sort((a, b) => freq[b] - freq[a]).slice(0, 28);
    $('#cos').innerHTML = [...top, ...top].map(e => `<span>${esc(e)}</span>`).join('');

    /* filtros: área, formação e busca */
    const ordemA = ['gestao','ia','dados','design','marketing','lideranca'];
    const formacoes = [...new Set(ins.flatMap(p => p.cursos))].sort((a, b) => a.localeCompare(b, 'pt'));
    $('#chips').innerHTML = `<button type="button" class="on" data-a="">Todos <small>${ins.length}</small></button>` +
      ordemA.map(a => `<button type="button" data-a="${a}">${AREA[a]} <small>${ins.filter(p => p.areas.includes(a)).length}</small></button>`).join('');
    $('#f-form').innerHTML = '<option value="">Todas as formações</option>' + formacoes.map(f => `<option>${esc(f)}</option>`).join('');

    const lista = embaralha(ins, 5);
    const card = p => `<article class="ins">
      <div class="ph"><img src="assets/people/instrutores/${p.f}" alt="Foto de ${esc(p.n)}" width="400" height="440" loading="lazy"></div>
      ${p.li ? `<a class="li" href="${esc(p.li)}" target="_blank" rel="noopener" aria-label="LinkedIn de ${esc(p.n)}">${icLi}</a>` : ''}
      <div class="bd"><b>${esc(p.n)}</b><span class="role">${esc(p.c)}</span>${p.e ? `<span class="co">${esc(p.e)}</span>` : ''}
        <div class="tags">${p.cursos.map(c => `<span>${esc(c)}</span>`).join('')}</div></div>
    </article>`;
    const st = { a: '', f: '', q: '' };
    const PAG = 24; let limite = PAG;
    const grid = $('#ins-grid'), mais = $('#ins-mais');
    const render = () => {
      const q = norm(st.q);
      const r = lista.filter(p => (!st.a || p.areas.includes(st.a)) && (!st.f || p.cursos.includes(st.f)) &&
        (!q || norm(p.n + ' ' + p.c + ' ' + p.e + ' ' + p.cursos.join(' ')).includes(q)));
      grid.innerHTML = r.slice(0, limite).map(card).join('');
      $('#fcount').textContent = r.length === 1 ? '1 instrutor' : `${r.length} instrutores`;
      $('#ins-empty').classList.toggle('show', !r.length);
      mais.hidden = r.length <= limite;
    };
    $('#chips').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
      st.a = b.dataset.a; document.querySelectorAll('#chips button').forEach(x => x.classList.toggle('on', x === b)); limite = PAG; render(); });
    $('#f-form').addEventListener('change', e => { st.f = e.target.value; limite = PAG; render(); });
    $('#f-q').addEventListener('input', e => { st.q = e.target.value; limite = PAG; render(); });
    mais.addEventListener('click', () => { limite = Infinity; render(); });
    $('#ins-limpa').addEventListener('click', () => { st.a = st.f = st.q = ''; $('#f-q').value = ''; $('#f-form').value = '';
      document.querySelectorAll('#chips button').forEach((x, i) => x.classList.toggle('on', i === 0)); limite = PAG; render(); });
    render();
  }

  /* ---------- /depoimentos/ ---------- */
  if (PAGE === 'depoimentos'){
    const dep = (window.PM3_DEPOIMENTOS || []).map(d => ({ ...d, t: tira(d.t) }));
    /* curso citado no texto (o WordPress não guarda o curso de cada depoimento) */
    const CURSOS = [
      ['Product Growth', /growth/i], ['Product Discovery', /discovery/i], ['Product Analytics', /analytics/i],
      ['Product Marketing', /product marketing|marketing de produto|\bpmm\b/i], ['Product Leadership', /leadership|lideran/i],
      ['Product Management', /gest[aã]o de produto|curso de product manag|forma[cç][aã]o (em|de) product manag/i]
    ];
    dep.forEach(d => { const c = CURSOS.find(([, re]) => re.test(d.t)); d.curso = c ? c[0] : ''; });
    const empresas = /nubank|ifood|meta|quintoandar|claro|mrv|mercado livre|natura|boticário|itaú|picpay|stone|loft|vtex|olx/i;
    /* ordem: textos curtos e de grandes empresas primeiro; os mais antigos por último */
    dep.sort((a, b) => (empresas.test(b.c) - empresas.test(a.c)) || (b.ano - a.ano) || (a.t.length - b.t.length));

    const destaque = dep.find(d => /nubank/i.test(d.c)) || dep[0];
    const ordemC = ['Product Management','Product Discovery','Product Growth','Product Analytics','Product Marketing','Product Leadership'];
    $('#chips').innerHTML = `<button type="button" class="on" data-c="">Todos <small>${dep.length - 1}</small></button>` +
      ordemC.filter(c => dep.some(d => d.curso === c)).map(c => `<button type="button" data-c="${c}">${c} <small>${dep.filter(d => d.curso === c).length}</small></button>`).join('');

    /* no mural, o lilás vai para quem conta um resultado de carreira (promoção, mudança de cargo) */
    const carreira = d => /promovid|finalizei como PM|começar minha carreira/i.test(d.t);
    const card = (d, i) => `<figure class="dq${carreira(d) ? ' feat' : ''}${d.t.length > 330 ? ' long' : ''} reveal" data-d="${i % 3}">
      <span class="qm" aria-hidden="true">“</span>
      <blockquote><p>${esc(d.t)}</p></blockquote>
      ${d.t.length > 330 ? '<button type="button" class="more" aria-expanded="false">Ler depoimento completo</button>' : ''}
      ${d.curso ? `<span class="curso">${esc(d.curso)}</span>` : ''}
      <figcaption class="who"><img src="assets/people/depoimentos/${d.f}" alt="Foto de ${esc(d.n)}" width="52" height="52" loading="lazy"><div><b>${esc(d.n)}</b><span>${esc(d.c)}</span></div></figcaption>
    </figure>`;
    const grid = $('#dq-grid');
    let filtro = '';
    /* na primeira carga a animação de entrada fica com o layout.js; ao filtrar, os cards já aparecem prontos */
    const render = (primeira) => {
      const r = dep.filter(d => d !== destaque && (!filtro || d.curso === filtro));
      grid.innerHTML = r.map(card).join('');
      $('#fcount').textContent = `${r.length} depoimentos`;
      if (!primeira) grid.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    };
    $('#chips').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
      filtro = b.dataset.c; document.querySelectorAll('#chips button').forEach(x => x.classList.toggle('on', x === b)); render(); });
    grid.addEventListener('click', e => { const b = e.target.closest('.more'); if (!b) return;
      const f = b.closest('.dq'); const o = f.classList.toggle('open'); b.setAttribute('aria-expanded', o); b.textContent = o ? 'Mostrar menos' : 'Ler depoimento completo'; });
    render(true);

    /* destaque no hero */
    const q = $('#q-card');
    if (q && destaque){
      q.innerHTML = `<span class="qm" aria-hidden="true">“</span><blockquote>${esc(destaque.t.split(/(?<=[.!])\s/)[0])}</blockquote>
        <div class="who"><img src="assets/people/depoimentos/${destaque.f}" alt="Foto de ${esc(destaque.n)}" width="56" height="56"><div><b>${esc(destaque.n)}</b><span>${esc(destaque.c)}</span></div></div>`;
    }
    $('#n-dep').textContent = dep.length;
  }

  /* ---------- formulário de Seja instrutor (não envia nada no protótipo) ---------- */
  const form = $('#f-instrutor');
  if (form){
    const err = (fld, msg) => { const w = fld.closest('.fld, .fchk'); w.classList.toggle('err', !!msg); const h = w.querySelector('.help'); if (h) h.textContent = msg || ''; return !msg; };
    const valida = el => {
      const v = (el.value || '').trim();
      if (el.type === 'checkbox') return err(el, el.checked ? '' : 'Precisamos do seu aceite para entrar em contato.');
      if (el.required && !v) return err(el, 'Campo obrigatório.');
      if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return err(el, 'Confira o e-mail.');
      if (el.name === 'linkedin' && v && !/linkedin\.com\//i.test(v)) return err(el, 'Cole o link do seu perfil no LinkedIn.');
      return err(el, '');
    };
    form.insertAdjacentHTML('beforeend', '<input type="text" name="_site" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">');
    form.querySelectorAll('input, select, textarea').forEach(el => el.addEventListener('blur', () => { if (el.closest('.fld,.fchk')) valida(el); }));
    form.addEventListener('submit', e => {
      e.preventDefault();
      const campos = [...form.querySelectorAll('[required]')];
      const ok = campos.map(valida).every(Boolean);
      if (!ok){ form.querySelector('.err input, .err select, .err textarea')?.focus(); return; }
      /* envio pelo PM3Forms (assets/js/forms.js), com o texto do consentimento (LGPD) */
      const btn = form.querySelector('button[type=submit]'); btn.disabled = true;
      const consentimento = form.querySelector('input[name=lgpd]')?.closest('label')?.textContent.replace(/\s+/g, ' ').trim();
      const comForms = fn => window.PM3Forms ? Promise.resolve().then(fn)
        : new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'assets/js/forms.js?v=1'; s.onload = res; s.onerror = rej; document.head.appendChild(s); }).then(fn);
      comForms(() => window.PM3Forms.enviar('instrutor', window.PM3Forms.ler(form), { form, consentimento }))
        .then(() => { form.hidden = true; const fim = $('#f-ok'); fim.classList.add('show'); fim.querySelector('h2').focus(); })
        .catch(() => { window.pm3Aviso && window.pm3Aviso('Não foi possível enviar agora. Tente de novo em instantes.'); })
        .finally(() => { btn.disabled = false; });
    });
  }

  /* ---------- 404: busca vai para o catálogo ---------- */
  const nf = $('#nf-busca');
  if (nf) nf.addEventListener('submit', e => {
    e.preventDefault();
    const q = nf.querySelector('input').value.trim();
    location.href = 'cursos.html' + (q ? '#q=' + encodeURIComponent(q) : '');
  });
})();

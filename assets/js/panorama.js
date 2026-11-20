/* PM3 · Panorama · formulário de acesso aos estudos (protótipo: nada é enviado)
   Como no hub atual, "Acessar estudo" abre um modal com o mesmo formulário, intitulado com o nome do estudo. */
(function(){
  const base = document.getElementById('form');
  if (!base) return;
  /* carrega o forms.js (envio ao HubSpot) só quando alguém envia */
  const comForms = fn => window.PM3Forms ? Promise.resolve().then(fn)
    : new Promise((ok, erro) => { const s = document.createElement('script'); s.src = 'assets/js/forms.js?v=1'; s.onload = ok; s.onerror = erro; document.head.appendChild(s); }).then(fn);
  base.insertAdjacentHTML('beforeend', '<input type="text" name="_site" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">');

  const erro = (el, msg) => {
    const f = el.closest('.field'); if (!f) return;
    f.classList.toggle('err', !!msg);
    const h = f.querySelector('.help'); if (h) h.textContent = msg || '';
  };
  const valida = el => {
    const v = el.value.trim();
    if (el.required && !v) return erro(el, 'Campo obrigatório'), false;
    if (el.type === 'email' && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return erro(el, 'E-mail inválido'), false;
    if (el.type === 'tel' && v && v.replace(/\D/g, '').length < 10) return erro(el, 'Informe o DDD e o número'), false;
    return erro(el, ''), true;
  };
  const prepara = form => {
    const campos = [...form.querySelectorAll('input[required],select[required]')];
    campos.forEach(el => el.addEventListener('blur', () => valida(el)));
    form.addEventListener('submit', e => {
      e.preventDefault();
      const ok = campos.map(valida).every(Boolean);
      if (!ok){ campos.find(c => c.closest('.field').classList.contains('err')).focus(); return; }
      /* envio pelo PM3Forms (assets/js/forms.js, carregado sob demanda); no modal, o nome do estudo vai junto */
      const btn = form.querySelector('button[type=submit]'); btn.disabled = true;
      comForms(() => {
        const campos = window.PM3Forms.ler(form);
        const est = form.closest('[role=dialog]')?.querySelector('h2, h3')?.textContent.trim(); if (est) campos.pm3_estudo = est;
        return window.PM3Forms.enviar('panorama', campos, { form });
      }).then(() => { form.classList.add('sent'); form.querySelector('.ok').scrollIntoView({block:'nearest'}); })
        .catch(() => { window.pm3Aviso && window.pm3Aviso('Não foi possível enviar agora. Tente de novo em instantes.'); })
        .finally(() => { btn.disabled = false; });
    });
  };
  prepara(base);

  /* ---- modal ---- */
  let modal, titulo, ultimo;
  const monta = () => {
    modal = document.createElement('div');
    modal.className = 'pn-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'pnm-t');
    modal.innerHTML =
      '<div class="pn-back" data-fechar></div>' +
      '<div class="pn-box">' +
        '<button type="button" class="pn-x" data-fechar aria-label="Fechar"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m3 3 10 10M13 3 3 13"/></svg></button>' +
        '<p class="kicker">Acessar estudo</p>' +
        '<h2 id="pnm-t"></h2>' +
        '<p class="sub">Preencha uma vez e acesse todos os estudos, incluindo o Panorama 2026-2027.</p>' +
      '</div>';
    const form = base.cloneNode(true);
    form.removeAttribute('id');
    form.removeAttribute('data-nota');
    form.classList.remove('reveal', 'in', 'sent');
    form.querySelector('.pn-form-head').remove();
    form.querySelectorAll('[id]').forEach(el => { el.id = 'm-' + el.id; });
    form.querySelectorAll('label[for]').forEach(l => { l.htmlFor = 'm-' + l.htmlFor; });
    form.querySelectorAll('input,select').forEach(el => { el.value = ''; });
    const btn = form.querySelector('.btn');
    btn.firstChild.textContent = 'Acessar estudo ';
    modal.querySelector('.pn-box').appendChild(form);
    prepara(form);
    document.body.appendChild(modal);
    titulo = modal.querySelector('#pnm-t');
    modal.addEventListener('click', e => { if (e.target.closest('[data-fechar]')) fechar(); });
  };
  const abrir = (nome, origem) => {
    if (!modal) monta();
    ultimo = origem;
    titulo.textContent = nome;
    modal.classList.add('open');
    document.body.classList.add('pn-lock');
    setTimeout(() => modal.querySelector('input').focus(), 260);
  };
  const fechar = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('pn-lock');
    if (ultimo) ultimo.focus();
  };
  document.querySelectorAll('[data-estudo]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); abrir(a.dataset.estudo, a); });
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && modal && modal.classList.contains('open')) fechar(); });
})();

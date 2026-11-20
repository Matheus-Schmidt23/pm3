/* PM3 · PM3 para empresas · formulário de proposta (protótipo: nada é enviado) */
(function(){
  const form = document.getElementById('lead');
  if (!form) return;

  /* botões da página já marcam o interesse no formulário */
  document.querySelectorAll('[data-int]').forEach(a => a.addEventListener('click', () => {
    const r = form.querySelector(`input[name="interesse"][value="${a.dataset.int}"]`);
    if (r) r.checked = true;
  }));

  const LIVRES = /@(gmail|hotmail|outlook|live|yahoo|icloud|bol|uol|terra)\./i;
  const erro = (el, msg) => {
    const f = el.closest('.field'); if (!f) return;
    f.classList.toggle('err', !!msg);
    const h = f.querySelector('.help'); if (h) h.textContent = msg || '';
  };
  const valida = el => {
    const v = el.value.trim();
    if (el.required && !v) return erro(el, 'Campo obrigatório'), false;
    if (el.type === 'email' && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return erro(el, 'E-mail inválido'), false;
    if (el.type === 'email' && LIVRES.test(v)) return erro(el, 'Use o seu e-mail corporativo'), false;
    return erro(el, ''), true;
  };
  form.insertAdjacentHTML('beforeend', '<input type="text" name="_site" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">');
  form.querySelectorAll('input[required]:not([type=checkbox]),select[required]').forEach(el => el.addEventListener('blur', () => valida(el)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const campos = [...form.querySelectorAll('input[required]:not([type=checkbox]),select[required]')];
    const ok = campos.map(valida).every(Boolean);
    const lgpd = form.querySelector('input[name=lgpd]');
    if (!lgpd.checked){ window.pm3Aviso && window.pm3Aviso('Marque o consentimento para continuar'); }
    if (!ok || !lgpd.checked){ (campos.find(c => c.closest('.field').classList.contains('err')) || lgpd).focus(); return; }
    /* envio pelo PM3Forms (assets/js/forms.js), com o texto do consentimento registrado no HubSpot (LGPD) */
    const btn = form.querySelector('button[type=submit]'); btn.disabled = true;
    const consentimento = lgpd.closest('label')?.textContent.replace(/\s+/g, ' ').trim();
    const comForms = fn => window.PM3Forms ? Promise.resolve().then(fn)
      : new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'assets/js/forms.js?v=1'; s.onload = res; s.onerror = rej; document.head.appendChild(s); }).then(fn);
    comForms(() => window.PM3Forms.enviar('empresas', window.PM3Forms.ler(form), { form, consentimento }))
      .then(() => { form.classList.add('sent'); form.querySelector('.ok').focus?.(); })
      .catch(() => { window.pm3Aviso && window.pm3Aviso('Não foi possível enviar agora. Tente de novo ou fale pelo WhatsApp.'); })
      .finally(() => { btn.disabled = false; });
  });
})();

/* Assessment: palavras se preenchem conforme a rolagem; *palavra* ganha destaque (mesmo efeito do manifesto do Membership) */
(function(){
  const fill = document.getElementById('asFill');
  if (!fill) return;
  fill.innerHTML = fill.textContent.trim().split(/\s+/).map(w => {
    const hl = /^\*.*\*[.,]?$/.test(w);
    return `<span class="w${hl ? ' hl' : ''}">${w.replace(/\*/g,'')}</span>`;
  }).join(' ');
  const ws = [...fill.querySelectorAll('.w')];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches){ ws.forEach(w => w.classList.add('on')); return; }
  const pinta = () => {
    const r = fill.getBoundingClientRect(), vh = innerHeight;
    const p = Math.max(0, Math.min(1, (vh * .82 - r.top) / (r.height + vh * .38)));
    const k = Math.round(p * ws.length);
    ws.forEach((w, i) => w.classList.toggle('on', i < k));
  };
  addEventListener('scroll', pinta, { passive: true }); pinta();
})();

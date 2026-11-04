/* PM3 · Panorama · formulário de acesso aos estudos (protótipo: nada é enviado) */
(function(){
  const form = document.getElementById('lead');
  if (!form) return;

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
  form.querySelectorAll('input[required]:not([type=checkbox]),select[required]').forEach(el => el.addEventListener('blur', () => valida(el)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const campos = [...form.querySelectorAll('input[required]:not([type=checkbox]),select[required]')];
    const ok = campos.map(valida).every(Boolean);
    const lgpd = form.querySelector('input[name=lgpd]');
    if (!lgpd.checked){ window.pm3Aviso && window.pm3Aviso('Marque o consentimento para continuar'); }
    if (!ok || !lgpd.checked){ (campos.find(c => c.closest('.field').classList.contains('err')) || lgpd).focus(); return; }
    form.classList.add('sent');
    form.querySelector('.ok').focus?.();
  });
})();

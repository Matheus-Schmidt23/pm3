/* PM3 · Panorama · formulários de acesso aos estudos (protótipo: nada é enviado) */
(function(){
  const forms = document.querySelectorAll('form.lead-form');
  if (!forms.length) return;

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

  forms.forEach(form => {
    const campos = [...form.querySelectorAll('input[required],select[required]')];
    campos.forEach(el => el.addEventListener('blur', () => valida(el)));
    form.addEventListener('submit', e => {
      e.preventDefault();
      const ok = campos.map(valida).every(Boolean);
      if (!ok){ campos.find(c => c.closest('.field').classList.contains('err')).focus(); return; }
      form.classList.add('sent');
      form.querySelector('.ok').scrollIntoView({block:'nearest'});
    });
  });
})();

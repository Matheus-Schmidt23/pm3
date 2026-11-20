/* PM3 · envio dos formulários para o HubSpot (conta 21748317, a mesma do site atual).
   Todos os formulários do site chamam PM3Forms.enviar(chave, campos, opções). Nenhum servidor é necessário:
   o HubSpot aceita o envio direto do navegador pela API pública de formulários (v3, sem chave).

   MODO DE ENVIO (PM3_FORMS.envio):
     'simulado' : padrão do protótipo. Nada sai do navegador; o pacote que iria para o HubSpot aparece no console.
     'teste'    : tudo vai para o formulário de teste (formTeste), criado pelo time no HubSpot com os mesmos campos.
     'producao' : cada formulário vai para o seu GUID. Formulário sem GUID não envia (aviso no console).
   Para testar sem mudar o arquivo: ?forms=teste na URL (só vale com formTeste preenchido).

   O código de rastreamento do HubSpot (cookie hubspotutk, que liga o lead à visita) só carrega fora do modo simulado
   e depois do "Aceitar" no aviso de cookies. */
window.PM3_FORMS = window.PM3_FORMS || {
  portal: '21748317',
  envio: 'simulado',
  formTeste: '',  /* GUID do formulário de teste (pedir ao time de marketing) */
  forms: {
    /* ementa das formações: formulário único do site atual, com o curso no campo oculto pm3_b2c_form_name_tracking */
    'ementa':        { guid: '0b7f669e-9985-4903-88d4-94d83ab4457d', segmento: 'B2C' },
    /* ementa das sprints: hoje é RD Station (um formulário por sprint). Definir o GUID se migrar para o HubSpot */
    'ementa-sprint': { guid: '', segmento: 'B2C' },
    /* e-book das pós (Digital Product Management, Tech Management, IA para Negócios) */
    'ebook-pos':     { guid: '', segmento: 'B2C' },
    /* Panorama 2026-2027: confirmar o GUID do hub atual e os nomes internos de momento e área */
    'panorama':      { guid: '', segmento: 'B2C', mapa: { whatsapp: 'hs_whatsapp_phone_number' } },
    /* PM3 para empresas: formulário atual do site; os campos time e interesse precisam existir no HubSpot */
    'empresas':      { guid: 'ed78afa1-ddcb-46b4-a14d-f270641d163a', segmento: 'B2B', mapa: { nome: 'firstname', empresa: 'company', mensagem: 'message' } },
    /* Seja instrutor: não existe hoje; criar no HubSpot (linkedin, área, tema e formato como propriedades novas) */
    'instrutor':     { guid: '', segmento: 'Instrutor', mapa: { nome: 'firstname', cargo: 'jobtitle' } }
  }
};

window.PM3Forms = (function(){
  const C = window.PM3_FORMS;
  const modo = () => { const q = new URLSearchParams(location.search).get('forms'); return q === 'teste' && C.formTeste ? 'teste' : C.envio; };
  const cookie = n => (document.cookie.match('(?:^|; )' + n + '=([^;]*)') || [])[1] || '';
  const consentiu = () => { try { return localStorage.getItem('pm3_consent') === 'aceitar'; } catch(e){ return false; } };

  /* rastreamento do HubSpot: só com envio real e consentimento */
  const rastreio = () => {
    if (modo() === 'simulado' || !consentiu() || document.getElementById('hs-script-loader')) return;
    const s = document.createElement('script'); s.id = 'hs-script-loader'; s.async = true; s.defer = true;
    s.src = 'https://js.hs-scripts.com/' + C.portal + '.js'; document.head.appendChild(s);
  };
  rastreio();
  document.addEventListener('click', e => { if (e.target.closest('[data-c="aceitar"]')) setTimeout(rastreio, 0); });

  /* armadilha para robôs: campo invisível que pessoas não preenchem */
  const armadilha = form => {
    if (form.querySelector('input[name="_site"]')) return;
    form.insertAdjacentHTML('beforeend', '<input type="text" name="_site" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">');
  };
  document.querySelectorAll('form[data-hs]').forEach(armadilha);

  const utms = () => { const q = new URLSearchParams(location.search), o = {}; ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k => { if (q.get(k)) o[k] = q.get(k); }); return o; };

  /* monta o pacote no formato da API v3 do HubSpot */
  const pacote = (chave, campos, opt) => {
    const f = C.forms[chave] || {}, mapa = f.mapa || {};
    const todos = Object.assign({}, campos, utms());
    if (f.segmento && !('pm3__segmento' in todos)) todos.pm3__segmento = f.segmento;
    const fields = Object.entries(todos).filter(([k, v]) => v !== '' && v != null && k !== 'lgpd' && k !== '_site')
      .map(([k, v]) => ({ objectTypeId: '0-1', name: mapa[k] || k, value: String(v) }));
    const p = { fields, context: { pageUri: location.href, pageName: document.title } };
    const hutk = cookie('hubspotutk'); if (hutk) p.context.hutk = hutk;
    if (opt && opt.consentimento) p.legalConsentOptions = { consent: { consentToProcess: true, text: opt.consentimento } };
    return p;
  };

  /* envia; devolve uma promessa que resolve com { simulado | enviado } e rejeita se o HubSpot recusar */
  const enviar = (chave, campos, opt = {}) => {
    if (opt.form && opt.form.querySelector('input[name="_site"]')?.value) return Promise.resolve({ ignorado: 'armadilha' });
    const p = pacote(chave, campos, opt), m = modo();
    const guid = m === 'teste' ? C.formTeste : (C.forms[chave] || {}).guid;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'generate_lead', form_key: chave, form_mode: m });
    if (m === 'simulado' || !guid){
      if (m !== 'simulado') console.warn('[PM3Forms] "' + chave + '" sem GUID do HubSpot: nada enviado.');
      console.info('[PM3Forms] ' + (m === 'simulado' ? 'modo simulado' : 'sem GUID') + ' · ' + chave + ' → portal ' + C.portal + ' / ' + (guid || '(sem GUID)'), p);
      window.PM3Forms.ultimo = { chave, guid, pacote: p };
      return Promise.resolve({ simulado: true, pacote: p });
    }
    return fetch('https://api.hsforms.com/submissions/v3/integration/submit/' + C.portal + '/' + guid, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p)
    }).then(r => r.ok ? r.json().then(j => ({ enviado: true, resposta: j })) : r.text().then(t => { console.error('[PM3Forms] HubSpot recusou', r.status, t); throw new Error('hubspot ' + r.status); }));
  };

  /* lê os campos de um <form> (checkbox vira true/false) */
  const ler = form => { const o = {}; [...form.elements].forEach(el => { if (!el.name || el.name === '_site' || el.type === 'submit') return; o[el.name] = el.type === 'checkbox' ? el.checked : (el.value || '').trim(); }); return o; };

  return { enviar, ler, armadilha, modo, ultimo: null };
})();

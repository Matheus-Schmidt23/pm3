/* PM3 · download da ementa: modal de captura (protótipo, não envia nada)
   Replica o formulário atual do site (HubSpot): nome, e-mail*, WhatsApp*, área de interesse,
   mais os campos ocultos segmento, UTMs e form_name_tracking. */
(function(){
  const gatilhos = [...document.querySelectorAll('[data-ementa]')];
  if (!gatilhos.length) return;

  const AREAS = ['Gestão de Produto', 'Inteligência Artificial', 'Marketing & Growth', 'Dados & Analytics', 'Design', 'Outros'];
  const cfg = window.EMENTA || {};
  const curso = cfg.curso || 'este curso';
  const tracking = cfg.tracking || 'ementa';
  const stats = cfg.stats || '';
  const capa = cfg.capa || '';
  const rotulo = cfg.rotulo || 'Ementa em PDF', titulo = cfg.titulo || 'Quer ver mais? Baixe a ementa completa', chamada = cfg.chamada || 'Preencha os dados e receba a ementa do curso.', botao = cfg.botao || 'Baixar ementa', pronto = cfg.pronto || 'Tudo certo! Sua ementa está pronta';
  const topicos = cfg.topicos || ['Todos os módulos e tópicos', 'Carga horária e conteúdo de cada módulo', 'Professores e cases de cada módulo'];
  const ICON_OK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 8.5 3 3 7-7"/></svg>';

  const el = document.createElement('div');
  el.className = 'em-modal';
  el.id = 'em-modal';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-labelledby', 'em-modal-t');
  el.setAttribute('data-nota', 'No site atual, o botão abre um formulário HubSpot com nome, e-mail*, WhatsApp* e área de interesse, e envia os campos ocultos pm3__segmento=B2C, UTMs e pm3_b2c_form_name_tracking ("ementa cpm" na página de Product Management). Manter os mesmos campos e nomes para não quebrar a base de leads nem as automações. Aqui nada é enviado.');
  el.innerHTML =
    '<div class="em-back" data-fechar></div>' +
    '<div class="em-box">' +
      '<button type="button" class="em-x" data-fechar aria-label="Fechar"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m3 3 10 10M13 3 3 13"/></svg></button>' +
      '<div class="em-side">' +
        (capa ? '<div class="em-cover" style="background-image:url(\'' + capa + '\')" role="img" aria-label="Capa de ' + curso + '"></div>' : '') +
        '<div class="in"><span class="tag">' + rotulo + '</span><h3>' + curso + '</h3>' +
        '<ul>' + topicos.map(t => '<li>' + ICON_OK + t + '</li>').join('') + '</ul></div>' +
      '</div>' +
      '<div class="em-main">' +
        '<div class="em-form-wrap">' +
          '<h2 id="em-modal-t">' + titulo + '</h2>' +
          '<p class="sub">' + chamada + (stats ? ' ' + stats : '') + '</p>' +
          '<form class="em-form" novalidate>' +
            '<div class="em-field"><label for="em-nome">Nome</label><input id="em-nome" name="firstname" type="text" autocomplete="given-name"></div>' +
            '<div class="em-field"><label for="em-email">Seu melhor e-mail<i>*</i></label><input id="em-email" name="email" type="email" autocomplete="email" inputmode="email" required><span class="msg">Informe um e-mail válido.</span></div>' +
            '<div class="em-field"><label for="em-zap">Número de WhatsApp<i>*</i></label><input id="em-zap" name="hs_whatsapp_phone_number" type="tel" autocomplete="tel" inputmode="tel" placeholder="(11) 99999-9999" required><span class="msg">Informe um número com DDD.</span></div>' +
            '<div class="em-field"><label for="em-area">Em qual área você quer aprofundar seus conhecimentos?</label><select id="em-area" name="pm3_b2c_area_de_interesse"><option value="">Selecione</option>' + AREAS.map(a => '<option>' + a + '</option>').join('') + '</select></div>' +
            '<button class="btn btn-primary btn-em" type="submit"><svg class="ic-doc" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2h7l4 4v12H5z"/><path d="M12 2v4h4M10.5 9v5M8.2 12l2.3 2.3 2.3-2.3"/></svg>' + botao + '</button>' +
            '<p class="em-legal">Ao baixar, você aceita receber contato da PM3 sobre este curso. Veja a <a href="#">Política de Privacidade</a>.</p>' +
          '</form>' +
        '</div>' +
        '<div class="em-ok" aria-live="polite">' +
          '<span class="tick">' + ICON_OK + '</span>' +
          '<h2>' + pronto + '</h2>' +
          '<p class="sub">Enviamos uma cópia para o seu e-mail. Se preferir, baixe agora.</p>' +
          '<a class="btn btn-primary btn-em" href="#baixar-pdf" data-baixar><svg class="ic-doc" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2h7l4 4v12H5z"/><path d="M12 2v4h4M10.5 9v5M8.2 12l2.3 2.3 2.3-2.3"/></svg>Baixar o PDF</a>' +
          '<p class="alt">Ficou com dúvida sobre o curso? <a href="#investimento" data-fechar>Veja como se inscrever</a>.</p>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(el);

  const box = el.querySelector('.em-box'), form = el.querySelector('form');
  const campo = n => form.elements[n];
  let origem = null;

  const foco = () => [...el.querySelectorAll('button,a[href],input,select')].filter(e => e.offsetParent !== null);
  const abrir = (de, onde) => {
    origem = de;
    box.classList.remove('sent');
    form.reset();
    el.querySelectorAll('.em-field').forEach(f => f.classList.remove('err'));
    el.classList.add('open');
    document.body.classList.add('em-lock');
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'ementa_abrir', form_name_tracking: tracking, posicao: onde || 'desconhecida' });
    setTimeout(() => campo('firstname').focus(), 60);
  };
  const fechar = () => {
    el.classList.remove('open');
    document.body.classList.remove('em-lock');
    if (origem) origem.focus();
  };

  gatilhos.forEach(g => g.addEventListener('click', e => { e.preventDefault(); abrir(g, g.dataset.ementa); }));
  el.addEventListener('click', e => { if (e.target.closest('[data-fechar]')) fechar(); });
  el.querySelector('[data-baixar]').addEventListener('click', e => { e.preventDefault(); if (window.pm3Aviso) window.pm3Aviso('No site real: o PDF da ementa é baixado aqui'); });
  addEventListener('keydown', e => {
    if (!el.classList.contains('open')) return;
    if (e.key === 'Escape') fechar();
    if (e.key === 'Tab'){
      const f = foco(); if (!f.length) return;
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a){ e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z){ e.preventDefault(); a.focus(); }
    }
  });

  /* máscara simples de telefone brasileiro */
  campo('hs_whatsapp_phone_number').addEventListener('input', e => {
    const d = e.target.value.replace(/\D/g, '').slice(0, 11);
    e.target.value = d.length > 10 ? d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      : d.length > 6 ? d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
      : d.length > 2 ? d.replace(/(\d{2})(\d{0,5})/, '($1) $2') : d;
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = campo('email'), zap = campo('hs_whatsapp_phone_number');
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    const okZap = zap.value.replace(/\D/g, '').length >= 10;
    email.closest('.em-field').classList.toggle('err', !okEmail);
    zap.closest('.em-field').classList.toggle('err', !okZap);
    if (!okEmail){ email.focus(); return; }
    if (!okZap){ zap.focus(); return; }
    const q = new URLSearchParams(location.search);
    const carga = {
      firstname: campo('firstname').value.trim(), email: email.value.trim(), hs_whatsapp_phone_number: zap.value,
      pm3_b2c_area_de_interesse: campo('pm3_b2c_area_de_interesse').value,
      pm3__segmento: 'B2C', pm3_b2c_form_name_tracking: tracking
    };
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(k => carga[k] = q.get(k) || '');
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'ementa_enviar', form_name_tracking: tracking });
    console.info('[protótipo] lead de ementa (não enviado):', carga);
    box.classList.add('sent'); box.scrollTop = 0;
    el.querySelector('.em-ok .btn').focus();
  });
})();

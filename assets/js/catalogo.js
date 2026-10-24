/* PM3 · catálogo do protótipo: uma fonte só para Formações, Sprints e /cursos/.
   Fonte: 00. DADOS PM3/Catálogo de cursos (formações e catalogo-sprints.md, jul/2026).
   No site real, isto vem do CMS e é renderizado no servidor (HTML pronto para o Google). */
window.PM3_CATALOGO = (function(){
  const AREAS = {
    gestao:    { nome: 'Gestão de produtos', curto: 'Produto' },
    ia:        { nome: 'Inteligência artificial', curto: 'IA' },
    dados:     { nome: 'Dados', curto: 'Dados' },
    design:    { nome: 'Design', curto: 'Design' },
    marketing: { nome: 'Marketing', curto: 'Marketing' },
    negocios:  { nome: 'Negócios', curto: 'Negócios' },
    lideranca: { nome: 'Liderança e habilidades humanas', curto: 'Liderança' }
  };

  /* formações: horas e módulos da página atual da Membership */
  const FORMACOES = [
    { nome: 'Product Manager', area: 'gestao', h: 37, mod: 6, nivel: 'Base', capa: 'product-manager', aprende: ['Product Market Fit','Discovery na era da IA','Dados e analytics'], url: 'formacao-product-manager.html', destaque: 'Comece aqui',
      quem: 'Para quem está entrando em produto ou quer consolidar estratégia, discovery e execução.' },
    { nome: 'Product Discovery', area: 'gestao', h: 26, mod: 5, nivel: 'Intermediário', capa: 'product-discovery', aprende: ['Problemas e oportunidades','Desenho e teste de soluções','Discovery contínuo'], url: '#',
      quem: 'Para validar hipóteses e reduzir o risco de produto antes de construir.' },
    { nome: 'Product Leadership', area: 'lideranca', h: 29, mod: 5, nivel: 'Avançado', capa: 'product-leadership', aprende: ['Visão e estratégia','Gestão de pessoas','Estratégia de portfólio'], url: '#',
      quem: 'Para PMs plenos e sêniores que assumem pessoas e decisões de alto nível.' },
    { nome: 'AI Product Builder', area: 'ia', h: null, mod: 6, nivel: 'Intermediário', capa: 'ai-product-builder', aprende: ['Automações com n8n','Agentes com Claude Code','Aplicações com Lovable'], url: '#', destaque: 'IA na prática',
      quem: 'Para ir além do uso de IA e construir automações, agentes e aplicações.' },
    { nome: 'AI Product Specialist', area: 'ia', h: 40, mod: 5, nivel: 'Intermediário', capa: 'ai-product-specialist', aprende: ['Base técnica de IA','IA aplicada ao produto','Confiabilidade e segurança'], url: '#',
      quem: 'Para aplicar IA de forma estratégica na construção e priorização de produto.' },
    { nome: 'Product Analytics', area: 'dados', h: 21, mod: 6, nivel: 'Intermediário', capa: 'product-analytics', aprende: ['Métricas de produto','Experimentos e testes','Dados para stakeholders'], url: '#',
      quem: 'Para usar dados com segurança: métricas certas, experimentos e stakeholders.' },
    { nome: 'Analista de Dados', area: 'dados', h: 74, mod: 6, nivel: 'Base', capa: 'analista-de-dados', aprende: ['Arquitetura e governança','Estatística aplicada','Visualização de dados'], url: '#',
      quem: 'Para migrar para dados ou estruturar a base técnica de análise.' },
    { nome: 'Product Growth', area: 'marketing', h: 44, mod: 7, nivel: 'Intermediário', capa: 'product-growth', aprende: ['Aquisição e ativação','Retenção e recomendação','Monetização'], url: '#',
      quem: 'Para dominar aquisição, ativação, retenção, recomendação e monetização.' },
    { nome: 'Product Marketing', area: 'marketing', h: 36, mod: 5, nivel: 'Intermediário', capa: 'product-marketing', aprende: ['Inteligência de mercado','Posicionamento','Pricing e go-to-market'], url: '#',
      quem: 'Para especializar-se em posicionamento e go-to-market na interface com produto.' },
    { nome: 'Product Design', area: 'design', h: 79, mod: 6, nivel: 'Intermediário', capa: 'product-design', aprende: ['Design estratégico','Pesquisa e enquadramento','Interfaces e validação'], url: '#',
      quem: 'Para designers e PMs que precisam dominar o processo de design, da pesquisa à interface.' }
  ];

  /* sprints: catálogo consolidado (44 itens) */
  const S = (nome, area, h, obj, url) => ({ nome, area, h, obj, url: url || '#' });
  const SPRINTS = [
    S('Fundamentos de Gestão de Produtos','gestao',12,'As fases da gestão de produtos, da oportunidade ao discovery, priorização e entrega.','sprint-fundamentos-gestao-produtos.html'),
    S('Roadmap de Produto e Priorização','gestao',7,'Técnicas de priorização e roadmaps estratégicos orientados a resultados.'),
    S('Técnicas de Pesquisa','gestao',11,'Métodos qualitativos e quantitativos para validar hipóteses sobre usuários e mercado.'),
    S('Tecnologia para Product Managers','gestao',6,'Arquitetura, infraestrutura e desenvolvimento para colaborar com engenharia.'),
    S('PRD: Documento de Requisitos de Produto','gestao',3,'O PRD na prática para alinhar equipes e definir problemas.'),
    S('Product Operations: fundamentos','gestao',4,'As bases para implementar Product Operations com foco no cliente.'),
    S('Product Operations: estratégias avançadas','gestao',4,'Estruturar, posicionar e escalar Product Operations com impacto mensurável.'),
    S('Métodos de Análise de Dados','dados',9,'Estatística aplicada, funil, cohorts, correlações e experimentos.'),
    S('Power BI: análises avançadas','dados',6,'Projetos de BI do zero, com relatórios e dashboards avançados.'),
    S('Excel: além das fórmulas','dados',5,'Análise de cenários, funções condicionais e dashboards no Excel.'),
    S('Métricas de Negócios Digitais','dados',5,'Indicadores financeiros, de produto e de marketing ligados à estratégia.'),
    S('Análise de dados com Python','dados',4,'Manipulação e análise exploratória com Python e Pandas.'),
    S('Visualização de dados e Design de Dashboards','dados',4,'Narrativas visuais e dashboards interativos no Looker Studio.'),
    S('Experimentação com Teste A/B','dados',3,'Do planejamento à interpretação de testes A/B com rigor estatístico.'),
    S('SQL para Manipulação e Análise de Dados','dados',2,'Consultar, filtrar e manipular bancos relacionais para decidir.'),
    S('Lei Geral de Proteção de Dados Pessoais','dados',2,'Diretrizes da LGPD para conformidade no tratamento de dados.'),
    S('Problem Solving na Prática','dados',2,'Diagnosticar problemas, formular hipóteses e desenhar soluções.'),
    S('Identificando vieses e armadilhas em análises','dados',2,'Reconhecer armadilhas analíticas e mitigar vieses cognitivos.'),
    S('Design Thinking','design',5,'Mapear problemas, idear soluções e testar protótipos focados no cliente.'),
    S('Design de Serviço','design',5,'Jornadas, blueprints e ecossistemas de serviço alinhados à estratégia.'),
    S('UI Design','design',3,'Interfaces visuais funcionais, com estética e usabilidade.'),
    S('Go-to-market: lançamento de produtos digitais','marketing',11,'Planos de GTM do posicionamento à mensuração pós-lançamento.'),
    S('Fundamentos de Product Growth','marketing',10,'Product-led growth e frameworks de retenção e escala.'),
    S('Fundamentos de Product Marketing','marketing',7,'Posicionamento, inteligência de mercado e lançamentos.'),
    S('Estratégia de Aquisição de clientes','marketing',4,'Escolher entre modelos sales-led, marketing-led e product-led.'),
    S('Sales Enablement','marketing',3,'Processos, treinamentos e conteúdos alinhados entre marketing e vendas.'),
    S('Gestão de Resultados com OKRs','negocios',10,'Definir, desdobrar, acompanhar e revisar OKRs.'),
    S('Metodologias Ágeis','negocios',6,'Mentalidade ágil, Scrum e Kanban na gestão de times e projetos.'),
    S('Gestão de Processos','negocios',5,'Mapeamento BPMN, gargalos e automação de fluxos.'),
    S('Educação Corporativa na prática','lideranca',6,'T&D, onboarding, PDIs e mensuração de ROI.'),
    S('Estratégias de Negociação para Líderes','lideranca',4,'Negociação avançada, mediação e gestão de conflitos.'),
    S('Comunicação assertiva no trabalho','lideranca',4,'Comunicação assertiva e não violenta para fortalecer conexões.'),
    S('Apresentação de slides profissionais','lideranca',4,'Estrutura e design para apresentações claras e persuasivas.'),
    S('Diversidade e inclusão no trabalho','lideranca',4,'Ações estratégicas de diversidade, equidade e inclusão.'),
    S('Produtividade no trabalho remoto','lideranca',4,'Planejamento e gestão do tempo no modelo flexível.'),
    S('Gestão de tempo e produtividade','lideranca',4,'Organizar a rotina e priorizar tarefas de alto impacto.'),
    S('Liderança e trabalho em equipe','lideranca',4,'União do time, distribuição de tarefas e confiança.'),
    S('Saúde mental no trabalho para líderes','lideranca',4,'Ambientes psicologicamente seguros e gestão do estresse.'),
    S('Delegação e engajamento de equipes','lideranca',4,'Matrizes de delegação e maturidade do time.'),
    S('Como dar feedback construtivo','lideranca',4,'Estruturas para dar e receber feedbacks acionáveis.'),
    S('Inteligência emocional para líderes','lideranca',3,'Autoconsciência e empatia para decidir e liderar.'),
    S('Inteligência emocional no trabalho','lideranca',3,'Inteligências socioemocionais para comunicação e saúde mental.'),
    S('Oratória para apresentações de impacto','lideranca',3,'Voz, corpo e discurso para falar com segurança.'),
    S('Técnicas de negociação','lideranca',3,'Método Harvard, perfis comportamentais e persuasão.')
  ];

  /* capa de cada sprint (assets/capas/sprints/), na mesma ordem da lista acima */
  const CAPAS = ['fundamentos-gestao-produtos','roadmap-priorizacao','tecnicas-pesquisa','tecnologia-pms','prd','product-ops-fundamentos','product-ops-avancado','metodos-analise-dados','power-bi','excel','metricas-negocios','python','visualizacao-dashboards','teste-ab','sql','lgpd','problem-solving','vieses-analises','design-thinking','design-servico','ui-design','go-to-market','product-growth','product-marketing','aquisicao','sales-enablement','okrs','metodologias-ageis','gestao-processos','educacao-corporativa','negociacao-lideres','comunicacao-assertiva','apresentacao-slides','diversidade-inclusao','trabalho-remoto','gestao-tempo','lideranca-equipe','saude-mental','delegacao','feedback','ie-lideres','ie-trabalho','oratoria','tecnicas-negociacao'];
  SPRINTS.forEach((s, i) => { s.capa = CAPAS[i]; });

  return { AREAS, FORMACOES, SPRINTS };
})();

# Gera as páginas das Pós Tech Tech Management e IA para Negócios a partir do modelo pos-digital-product-management.html.
# Fonte do conteúdo: docs/postech-dossie-2027-1.txt (dossiê Pós Tech 2027.1) conferido com as páginas oficiais da FIAP
# (postech.fiap.com.br/curso/tech-management e /ia-para-negocios). Valores e FAQ são os mesmos das três pós.
# Rodar na pasta prototipo:  & ".\tools\gerar-pos.ps1"
$ErrorActionPreference = 'Stop'
$proto = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding($false)
$modelo = [IO.File]::ReadAllText((Join-Path $proto 'pos-digital-product-management.html'), $utf8)

function Esc([string]$s) { $s.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;') }
function Entre([string]$t, [string]$ini, [string]$fim, [string]$novo) {
  $a = $t.IndexOf($ini); $b = $t.IndexOf($fim)
  if ($a -lt 0 -or $b -lt 0 -or $b -lt $a) { throw "marcador não encontrado: $ini / $fim" }
  $t.Substring(0, $a) + $novo + $t.Substring($b)
}
function Troca([string]$t, [string]$de, [string]$para) {
  if ($t.IndexOf($de) -lt 0) { throw "trecho não encontrado: $($de.Substring(0,[Math]::Min(60,$de.Length)))" }
  $t.Replace($de, $para)
}

$CHK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 8.5 3 3 7-7"/></svg>'
$IC = @{
  users  = '<circle cx="6" cy="6" r="2.2"/><circle cx="11.5" cy="7" r="1.8"/><path d="M2 13c.4-2.4 2-3.6 4-3.6s3.6 1.2 4 3.6M10 10c1.8-.2 3.4.8 3.8 3"/>'
  layers = '<path d="M8 2 2 5l6 3 6-3z"/><path d="m2 8 6 3 6-3M2 11l6 3 6-3"/>'
  shield = '<path d="M8 1.8 3 3.8v4c0 3 2.2 5.2 5 6.4 2.8-1.2 5-3.4 5-6.4v-4z"/><path d="m5.8 8 1.6 1.6L10.5 6.5"/>'
  chart  = '<path d="M2 12l4-4 3 3 5-6M10.5 5H14v3.5"/>'
  search = '<circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3.5 3.5"/>'
  spark  = '<path d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M12 4l-2 2M6 10l-2 2"/>'
  flag   = '<path d="M3.5 14V2.5M3.5 3h8l-1.5 3 1.5 3h-8"/>'
}
$CERTN = 'Discover','Build','Deploy','Scale','Go Live'

# COORDENAÇÃO: as três pós mostram sempre todos os coordenadores da Pós Tech, na ordem e com os cargos da página oficial da FIAP.
# A FIAP tirou as fotos do site (imagens vazias; os arquivos antigos dão 403). Só há foto real de Andréa Paiva (FIAP, outubro) e
# Flávia Varga (cadastro de instrutores da PM3). Quem não tem foto entra na lista em texto, nunca com avatar de iniciais.
$COORD = @(
  @{ n='Andréa Paiva'; r='Diretora de Pós-Graduação Digital'; e='FIAP'; foto='assets/people/pos-andrea-paiva-hd.jpg'; logo='<img src="assets/alun/site/fiap.svg" alt="FIAP" style="height:14px">' },
  @{ n='Flávia Varga'; r='Head of Innovation'; e='alacre'; foto='assets/people/pos-flavia-varga.jpg' },
  @{ n='Queit Elizandra Zunino'; r='Diretoria Global de Tecnologia & Pessoas'; e='' },
  @{ n='Erika Tavares'; r='Líder de Iniciativas, mentora e embaixadora'; e='Mulheres de Produto' },
  @{ n='Viviane Elias'; r='C-Level, board member e governança corporativa'; e='FIAP' },
  @{ n='Celso Poderoso'; r='Global Director, Business Reporting Governance'; e='McCain' },
  @{ n='Ana Raquel'; r='Cientista de dados'; e='Itaú' },
  @{ n='Gustavo Lima'; r='Engenheiro de software principal'; e='F1rst Digital Services' },
  @{ n='Thamiris Adriano'; r='IT Analyst III'; e='F1rst Digital Services' },
  @{ n='Vinicius Vieira'; r='SecOps Manager'; e='Trustly' },
  @{ n='Douglas Martins'; r='Senior DevOps Engineer'; e='iugu' },
  @{ n='Daniele Garcia'; r='Developer'; e='Ambev Tech' }
)
function CoordBlock([string]$destaque, [string]$frase) {
  # $destaque: nome de quem coordena esta pós (vem primeiro e ganha o selo); $frase: lead da seção
  $lista = @($COORD | Where-Object { $_.n -eq $destaque }) + @($COORD | Where-Object { $_.n -ne $destaque })
  $comFoto = @($lista | Where-Object { $_.foto }); $semFoto = @($lista | Where-Object { -not $_.foto })
  $cards = for ($i = 0; $i -lt $comFoto.Count; $i++) {
    $p = $comFoto[$i]; $co = if ($p.logo) { '<span class="co co-logo">' + $p.logo + '</span>' } elseif ($p.e) { '<span class="co">' + (Esc $p.e) + '</span>' } else { '' }
    $papel = $(if ($p.n -eq 'Andréa Paiva') { $p.r } elseif ($p.n -eq $destaque) { 'Coordenação desta pós · ' + $p.r } else { 'Coordenadora · ' + $p.r })
    '        <figure class="prof reveal"' + $(if ($i) { ' data-d="' + $i + '"' }) + '><div class="ph"><img src="' + $p.foto + '" alt="Foto de ' + (Esc $p.n) + '" loading="lazy">' + $co + '</div><figcaption><b>' + (Esc $p.n) + '</b><span>' + (Esc $papel) + '</span></figcaption></figure>'
  }
  $lis = foreach ($p in $semFoto) { '        <li' + $(if ($p.n -eq $destaque) { ' class="is-curso"' }) + '><b>' + (Esc $p.n) + '</b><span>' + (Esc $p.r) + '</span>' + $(if ($p.e) { '<em>' + (Esc $p.e) + '</em>' }) + $(if ($p.n -eq $destaque) { '<i>Coordenação desta pós</i>' }) + '</li>' }
@"
<!-- 8 · COORDENAÇÃO -->
<section class="section on-dark coord-sec" id="coordenacao" aria-labelledby="co-t">
  <div class="wrap">
    <div class="sec-head">
      <div><p class="kicker"><span class="n">05</span> Coordenação</p><h2 class="h2" id="co-t">Sua pós conduzida<br><span class="c2">por grandes especialistas</span></h2></div>
      <p class="lead">$frase</p>
    </div>
    <div class="coord-wrap" data-nota="Todos os coordenadores da Pós Tech, como na página oficial da FIAP (a mesma equipe nas três pós). A FIAP tirou as fotos do site: só Andréa Paiva e Flávia Varga têm foto real; os demais aparecem em texto até a FIAP enviar as fotos oficiais.">
      <div class="prof-row coord-fotos">
$($cards -join "`n")
      </div>
      <ul class="coord-list" aria-label="Coordenadores da Pós Tech">
$($lis -join "`n")
      </ul>
    </div>
  </div>
</section>


"@
}
$COORD_LEAD = 'Direção de Pós-Graduação Digital da FIAP e uma coordenação com especialistas de empresas como Itaú, McCain, Ambev Tech e Trustly. A mesma equipe conduz as três pós.'

# Decisão (2026-11-20): a faixa de coordenação fica só na página mãe (pos-tech.html); as páginas de cada pós não têm a seção.
# 1) página mãe: coordenação completa, seção 7
$hubPath = Join-Path $proto 'pos-tech.html'
$hub = [IO.File]::ReadAllText($hubPath, $utf8)
$hub = Entre $hub '<!-- 7 · COORDENAÇÃO -->' '<!-- 9 · FAQ -->' ((CoordBlock '' $COORD_LEAD).Replace('<!-- 8 · COORDENAÇÃO -->', '<!-- 7 · COORDENAÇÃO -->'))
[IO.File]::WriteAllText($hubPath, $hub, $utf8)
# 2) modelo (Digital Product Management): sem a seção, sem o link no submenu e kickers renumerados
$dpmPath = Join-Path $proto 'pos-digital-product-management.html'
if ($modelo.Contains('<!-- 8 · COORDENAÇÃO -->')) {
  $modelo = Entre $modelo '<!-- 8 · COORDENAÇÃO -->' '<!-- 9 · INVESTIMENTO -->' ''
  $modelo = $modelo.Replace('<a href="#coordenacao">Coordenação</a>', '')
  foreach ($k in @(@('06','05','Investimento'), @('07','06','Certificação'), @('08','07','Estenda seu curso'), @('10','08','Dúvidas'))) {
    $modelo = Troca $modelo ('<p class="kicker"><span class="n">' + $k[0] + '</span> ' + $k[2] + '</p>') ('<p class="kicker"><span class="n">' + $k[1] + '</span> ' + $k[2] + '</p>')
  }
  [IO.File]::WriteAllText($dpmPath, $modelo, $utf8)
}

$CURSOS = @(
 @{
  slug = 'tech-management'; arq = 'pos-tech-management.html'; nome = 'Tech Management'
  h1 = 'Tech<br><span class="l2">Management</span>'
  titulo = 'Pós Tech em Tech Management: PM3 + FIAP, Grupo Alun | PM3'
  desc = 'Pós-graduação 100% digital e hands-on em Tech Management, da PM3 com a FIAP, no Grupo Alun: formação de Tech Lead que conecta liderança técnica e estratégia de negócio. 360 horas, 10 meses e 5 fases.'
  ogdesc = 'Lidere times e conecte tecnologia com negócio gerando valor. Formação de Tech Lead: 360 horas, 10 meses.'
  ldDesc = 'Pós-graduação para formar Tech Leads: gestão de times de alta performance, comunicação, finanças, arquitetura, governança e IA na liderança técnica.'
  heroLead = 'Lidere times e conecte tecnologia com negócio gerando valor. Uma formação de Tech Lead da PM3 com a FIAP, no Grupo Alun.'
  h2 = 'De especialista<br><span class="c2">a Tech Lead</span>'
  lead = 'Domine a gestão de times de alta performance, comunicação, finanças e o uso de IA na liderança técnica. Uma pós-graduação da PM3 com a FIAP, no Grupo Alun, para especialistas técnicos que querem assumir a liderança.'
  quem = 'Para desenvolvedores seniores e especialistas que buscam desenvolver habilidades de gestão e negócios para assumir posições de liderança.'
  outs = @(
    @('users','Liderar times de tecnologia','Liderar equipes de tecnologia com comunicação, negociação e gestão de pessoas.'),
    @('layers','Conectar tecnologia e negócio','Conectar decisões de arquitetura e produtos digitais aos objetivos do negócio.'),
    @('shield','Governar com FinOps e segurança','Aplicar governança, segurança e FinOps à gestão de ambientes tecnológicos.'),
    @('chart','Decidir com dados e IA','Usar dados e IA para orientar estratégias e conduzir mudanças organizacionais.'))
  skills = @(
    'Liderança adaptativa, inteligência emocional e gestão de pessoas (OKRs e 1:1s)',
    'Visão estratégica de produtos digitais, Lean Startup e Design Thinking',
    'Comunicação assertiva, negociação e gestão de conflitos em TI',
    'Governança de TI, Enterprise Architecture e FinOps (gestão de custos)',
    'Desenho estratégico de arquiteturas de software, cloud e microsserviços',
    'Gestão de segurança, LGPD, Privacy by Design e DevSecOps',
    'Formação e gestão de squads, cultura organizacional e gestão da mudança',
    'Estratégia de Data &amp; Analytics e integração de IA aplicada aos negócios')
  tools = @('Scrum, SAFe, LeSS e Spotify Model','TOGAF, Zachman e COBIT','OKRs, PDCA e BSC','FinOps e cloud (AWS, Azure, GCP)','Observabilidade (Datadog, New Relic, Opsgenie)','DDD, Event Storming e ArchiMate','IA generativa aplicada à gestão e à liderança')
  kit = ''
  notaSobre = 'Posicionamento, público, preparação, competências e ferramentas vêm do dossiê Pós Tech 2027.1 (FIAP + Alura + PM3) e batem com a página oficial da FIAP.'
  emH2 = 'Cinco fases,<br><span class="c2">dez meses</span>'
  fases = @(
   @{ t='Digital Strategy &amp; Agile: liderança, estratégia de produto e IA'; c='Digital Strategy &amp; Agile'; d=@(
     @('O líder de times de tecnologia', @('Teorias e abordagens para a liderança','Tipos de líder','Habilidades e competências da liderança','Autogestão','Inteligência emocional e neurociência na liderança')),
     @('Digital Strategy', @('Mindset, métodos e ferramentas','Aplicação de Design Thinking','Design de serviços, estratégico e organizacional','CX / UX')),
     @('Estratégia de produtos digitais', @('Visão e estratégia para produtos digitais','Product-Market Fit e métricas de acompanhamento','Product Discovery &amp; Design','Ciclo de vida do produto e o dia a dia do time')),
     @('Lean Startup', @('Lean Startup como ferramenta de inovação','Como aplicar o Lean Startup nos projetos','MVP, pivot e métodos ágeis','Intraempreendedorismo')),
     @('IA na disrupção dos negócios', @('Introdução a IA','Tipos, diferenciação e estratégias de uso','Discussões sobre ética em IA','Privacidade e as implicações sociais das tecnologias emergentes')) ) },
   @{ t='Equipes de alta performance: times, finanças e comunicação'; c='Equipes de alta performance'; d=@(
     @('Montando equipes de alta performance', @('Gestão 4.0: fundamentos e práticas de liderança colaborativa','Design de time e fluxo de trabalho','Modelos de equipe eficientes: Unfix, Spotify Model, LeSS, SAFe etc.','Maximizando potenciais da equipe','Diversidade como diferencial competitivo')),
     @('Gestão de times ágeis e multidisciplinares', @('Gestão de portfólio e iniciativas','Frameworks de desenvolvimento e squads no modelo ágil','Design: do Design ao Planning','Entrega: do Product Backlog à Retrospectiva','Gestão de métricas e indicadores ágeis com impacto no negócio')),
     @('Gestão financeira e sourcing', @('Estratégia de sourcing','Métodos de implementação de solução de TI','Processo de sourcing: RFP e LAP','Bimodal IT &amp; Techquilibrium','Digital Excellence: IT4IT Value Streams','Budgeting, forecast e financial plan')),
     @('Comunicação e negociação em projetos de TI', @('Construindo conexões e comunicação em projetos de TI','Técnicas de persuasão e gestão de conflitos','Processo de comunicação','Como dar e receber feedbacks','Técnicas de apresentação')),
     @('IA para times híbridos', @('Novas formas de trabalho','Desenhar o time híbrido: topologias, papéis e fronteiras','Delegação governada: níveis de autonomia e reversibilidade','Medir o ganho: performance e métricas do time híbrido','Pessoas no centro: competência, confiança e cultura')) ) },
   @{ t='Arquitetura, cloud e FinOps: decisões técnicas com visão de negócio'; c='Arquitetura, cloud e FinOps'; d=@(
     @('Arquiteturas de software', @('Arquiteturas da atualidade e seus trade-offs','Documentação de arquitetura com o Modelo C4','Requisitos funcionais e não funcionais','Propostas arquiteturais com RFCs e ADRs','Gerenciamento de débito técnico')),
     @('Estratégia cloud &amp; FinOps e GreenOps', @('Princípios, benefícios e motivadores da estratégia cloud','Single cloud, multicloud e cloud híbrida','Frameworks Well-Architected e segurança para soluções em nuvem','FinOps by Design','Pricing model adjustments')),
     @('Software Engineering &amp; Solution Design', @('Gestão de desenvolvimento de software: visão estratégica','Estrutura e requisitos: DDD e Event Storming','Novas tecnologias: no-code e low-code','Backend e frontend: stacks e tecnologias','Business logic &amp; automation: integrações e APIs','Operating environment tools: DevOps e CI/CD')),
     @('Privacy by Design e by Default', @('Fundamentos de Privacy by Design e by Default','Data Driven Society','Fundamentos da LGPD e do GDPR','Privacidade na era da ciência de dados: o papel dos dados sintéticos em análises seguras','O futuro da privacidade: novas tecnologias e desafios para o Privacy by Design')),
     @('IA para engenharia', @('Os trade-offs da engenharia assistida por IA','Do prompt ao pull request: o fluxo de trabalho com agentes de codificação','Pipeline, testes e guardrails automáticos','IA by design','Responsabilidade e explicabilidade da IA na engenharia')),
     @('Mentoria Liderança Tech', @('O debug de si: quem sou eu além do título? (autoconhecimento)','Meu valor como produto (posicionamento)','Da intenção à entrega (execução com clareza)','Liderar pessoas, não só entregas (liderança transformadora)','Quando a crise chega (integração das 5 crises)')) ) },
   @{ t='Governança, dados e segurança: escalando ambientes tecnológicos'; c='Governança, dados e segurança'; d=@(
     @('Governança em TI', @('Governança corporativa e de TI','Frameworks de governança em TI','Gerenciamento de riscos','Aplicando COBIT')),
     @('Integrações de plataforma e ecossistemas', @('Hype Cycle, tendências e aplicabilidade','Integrações e APIs','Open Data, blockchain e smart contracts','IA generativa democratizada e General AI')),
     @('Data Science &amp; IA', @('Fundamentos de dados e estratégia de valor','Dados e inteligência artificial como produtos','Engenharia de dados e arquitetura escalável','Governança, compliance e segurança em dados e IA','Inteligência artificial na prática e no futuro')),
     @('DevOps &amp; Cyber Security', @('Cyber security: o que é importante para um Tech Lead','Cybersecurity: Red Team, Blue Team, Purple Team','Cultura DevOps nas organizações','Técnicas de DevSecOps','Relação entre o DevOps e metodologias ágeis')),
     @('Observability', @('Observabilidade: do monitoramento à visão estratégica','Ferramentas de observabilidade: avaliação e decisão','Observabilidade em ação: integração e processos','Observabilidade: gerando valor para o negócio')),
     @('Gestão da mudança em TI', @('Gestão da mudança','RFC e ADR','Times adaptáveis','Gestão tática','Gestão do conhecimento e do erro')),
     @('IA para governança', @('Governança de IA','Governar a IA que já está em casa','Governança de agentes e de fornecedores','IA aplicada à colaboração','IA governando IA: governança de multiagentes')) ) },
   @{ t='Enterprise Architecture e liderança: cultura, pessoas e IA'; c='Enterprise Architecture e liderança'; d=@(
     @('EA: Enterprise Architecture', @('Introdução à arquitetura corporativa com TOGAF','Criando componentes com SOA','Microsserviços com ArchiMate® Corporate','Documentação de arquitetura corporativa')),
     @('Direito digital', @('Sociedade informacional: liberdade de expressão e liberdade de informação','Governança da internet e impactos regulatórios','Ética e regulação no uso de inteligência artificial','Gestão de SI: prevenção, contenção e responsabilidade','Frameworks de segurança: ISOs 27001/2022, 27002/2022 e 27701/2019')),
     @('Gestão das equipes e retenção', @('Gestão de resultados: do BSC ao OKR','1:1 e feedback no desenvolvimento de equipes','Autonomia e empowerment das equipes','Implementando a cultura do aprendizado nos times')),
     @('Cultura organizacional', @('Desvendando o DNA cultural das organizações','Implementando o conceito de cultura organizacional','Cultura hacking: a arte de influenciar e transformar os times','Cultura em times de tecnologia: orquestrando o sucesso coletivo')),
     @('Advanced Leadership Skills', @('Motivação 4.0 (protagonismo e autorresponsabilidade)','Mindful leadership','Lifelong learning','ESG e GreenOps')),
     @('IA para liderança', @('O novo papel do líder tech na era da IA','Organizações aumentadas por IA','Delegação, confiança e responsabilidade com IA','Construção de budget à prova de IA','Talentos, carreira e retenção na era da IA')) ) }
  )
  notaFases = 'Disciplinas e tópicos das 5 fases conforme o dossiê Pós Tech 2027.1 e a página oficial da FIAP. A FIAP só dá título à fase 1 (Digital Strategy &amp; Agile); os títulos das fases 2 a 5 resumem as disciplinas de cada fase e precisam do ok da coordenação.'
  coordNome = 'Queit Elizandra Zunino'
  coordLead = 'Coordenação de Queit Elizandra Zunino, da Diretoria Global de Tecnologia &amp; Pessoas, com a direção de Pós-Graduação Digital da FIAP e especialistas de empresas como Itaú, McCain, Ambev Tech e Trustly.'
  coordNota = 'Coordenação conforme o dossiê Pós Tech 2027.1 (Queit Zunino). A página oficial da FIAP lista a equipe sem fotos, e não há foto de Queit Zunino no site da PM3: por isso ela aparece só no texto. Pedir a foto oficial à FIAP para incluir o card.'
  coordCards = @(
    '<figure class="prof reveal"><div class="ph"><img src="assets/people/pos-andrea-paiva-hd.jpg" alt="Foto de Andréa Paiva" loading="lazy"><span class="co co-logo"><img src="assets/alun/site/fiap.svg" alt="FIAP" style="height:14px"></span></div><figcaption><b>Andréa Paiva</b><span>Diretora de Pós-Graduação Digital</span></figcaption></figure>')
 },
 @{
  slug = 'ia-para-negocios'; arq = 'pos-ia-para-negocios.html'; nome = 'IA para Negócios'; coverB = '1.2'
  h1 = 'IA para<br><span class="l2">Negócios</span>'
  titulo = 'Pós Tech em IA para Negócios: PM3 + FIAP, Grupo Alun | PM3'
  desc = 'Pós-graduação 100% digital e hands-on em IA para Negócios, da PM3 com a FIAP, no Grupo Alun: gestão estratégica e liderança com IA, da estratégia ao go-to-market. 360 horas, 10 meses e 5 fases.'
  ogdesc = 'Lidere a transformação dos negócios com IA: estratégia, liderança e decisões orientadas por dados. 360 horas, 10 meses.'
  ldDesc = 'Pós-graduação em gestão estratégica e liderança com IA: estratégia, inteligência competitiva, agentes de IA, dados e go-to-market.'
  heroLead = 'Lidere a transformação dos negócios com IA: estratégia, liderança e decisões orientadas por dados. Uma pós-graduação da PM3 com a FIAP, no Grupo Alun.'
  h2 = 'Estratégia, liderança<br><span class="c2">e IA na prática</span>'
  lead = 'Lidere a transformação digital dos negócios com gestão estratégica, de pessoas e tecnologia na prática. Antecipe tendências, construa cenários, decida com dados e use a IA para inovar e multiplicar a produtividade do time, em um projeto integrador que evolui ao longo das cinco fases.'
  quem = 'Para profissionais e gestores em ascensão ou transição para a liderança que buscam visão estratégica, inovação e uso da IA para decidir melhor.'
  outs = @(
    @('search','Estratégia com dados e IA','Construir estratégias de negócio com inteligência de mercado, dados e IA.'),
    @('spark','IA na produtividade','Aplicar IA à produtividade, automação de processos e inovação.'),
    @('users','Liderar a mudança','Liderar equipes e conduzir mudanças com comunicação, negociação e visão sistêmica.'),
    @('shield','Decidir com ética','Tomar decisões orientadas por dados com ética e governança em IA.'))
  skills = @('Pensamento estratégico e sistêmico','Liderança e gestão de equipes','Resolução de problemas complexos','Decisão orientada por dados e IA','IA aplicada à produtividade','Criatividade e inovação','Comunicação e negociação','Adaptabilidade e gestão da mudança','Orientação ao cliente e valor','Ética e governança em IA')
  tools = @('IA generativa e assistentes','Pesquisa e gestão do conhecimento com IA','Apresentações e comunicação com IA','Design e prototipação','Construção de soluções com IA','Automação e agentes de IA','Dados e analytics','Estratégia e gestão','Agilidade e gestão de projetos','Inteligência de mercado e foresight estratégico')
  kit = ''
  notaSobre = 'Posicionamento, público, preparação, competências e ferramentas vêm do dossiê Pós Tech 2027.1 (FIAP + Alura + PM3) e batem com a página oficial da FIAP.'
  emH2 = 'Cinco fases,<br><span class="c2">dez meses</span>'
  fases = @(
   @{ t='Planejamento estratégico: estratégia, cenários e IA para a gestão'; c='Planejamento estratégico'; d=@(
     @('Planejamento e gerenciamento estratégico', @('Estratégia','Visão e propósito','O processo de planejamento estratégico','Ferramentas de análise estratégica','Pensamento sistêmico')),
     @('Inteligência competitiva e cenários com IA', @('Fundamentos de inteligência competitiva','Análise de mercado e concorrência','Tendências e sinais de mudança','Pesquisa e análise apoiadas por IA','Construção de cenários com IA','Insights para tomada de decisão')),
     @('Design Thinking', @('Mudando o modo de pensar','Aplicação do Design Thinking','Design Sprint e design de serviços','Resolução de problemas complexos','Tecnologias e ferramentas para Design Thinking')),
     @('Inteligência artificial na disrupção dos negócios', @('Introdução a IA','Tipos, diferenciação e estratégias de uso','Discussões sobre ética em IA','Privacidade e as implicações sociais das tecnologias emergentes')),
     @('IA para produtividade executiva', @('ChatGPT para gestores e líderes','Claude para pesquisa, análise e síntese','Perplexity e NotebookLM para inteligência e gestão do conhecimento','Gamma, Napkin e Canva AI para comunicação executiva','Automação pessoal e produtividade com IA','Oficina integrada: resolvendo problemas reais com IA')) ) },
   @{ t='Liderança estratégica: pessoas, inovação e agentes de IA'; c='Liderança estratégica'; d=@(
     @('Liderando a estratégia', @('Criação de valor e diferenciação','Abordagem estratégica','BSC','OKR','Diversidade e equidade','ESG')),
     @('Comportamento organizacional', @('Liderança estratégica','Estruturação de cargos','Liderança estratégica: metas e incentivos','Stakeholders: identificação, análise e estratégias para engajamento','Comunicação institucional e branding','Gestão de comunicação em equipes distribuídas','Abordagens híbridas na gestão de projetos','Lifelong learning')),
     @('Liderança em tempos de transformação', @('Cultura organizacional','Mindset e soft skills','Liderança adaptativa e transformacional','Gestão de conflitos','Ferramentas para gestão de equipes ágeis','Gestão da transformação','Gestão da mudança')),
     @('Gestão da inovação', @('Conceitos e teorias da inovação','Modelos de inovação','Ferramentas para a gestão da inovação','Intraempreendedorismo e empreendedorismo','Tecnologias escaláveis')),
     @('Design organizacional e gestão de estruturas', @('Como projetar estruturas organizacionais ágeis e flexíveis','Reorganizando times e processos para otimizar recursos e melhorar o desempenho coletivo','Aplicando práticas de gestão de conflitos em equipes multidisciplinares','Implementando modelos inovadores: squads e estruturas horizontais','Promovendo uma cultura de aprendizado contínuo e inovação estratégica')),
     @('Agentes de IA e automação de negócios', @('Da IA generativa aos agentes de IA','Identificação de processos e oportunidades de automação','Construção de agentes de IA','Workflows inteligentes e integração entre ferramentas','Automação de processos de negócio com IA','Oficina integrada: construindo um agente e uma automação para um problema real de negócio')) ) },
   @{ t='Jornada digital e dados: cliente, plataformas e soluções com IA'; c='Jornada digital e dados'; d=@(
     @('Jornada digital', @('Personas','Mapa de empatia','Cadeia de valor','Jornada digital','UX e UI')),
     @('Validação e modelagem de negócios', @('Modelagem de negócios','Técnicas de validação','Análise de ecossistemas digitais e plataformas','Criação e gerenciamento de ecossistemas e plataformas','Estratégias para construir e escalar plataformas')),
     @('Transformação digital e governança de dados', @('Papel dos dados na transformação digital','Técnicas de análise de dados','Visualização de dados e tomada de decisões','Governança','Regulamentações de proteção de dados (como GDPR e LGPD) para proteger a organização e os dados dos clientes')),
     @('Fundamentos e práticas de agentes inteligentes', @('Fundamentos dos agentes inteligentes','Arquitetura e funcionamento dos agentes','LLMs, memória, contexto e uso de ferramentas','Planejamento, execução de tarefas e autonomia','Sistemas multiagentes e supervisão humana','Oficina prática: aplicação de agentes inteligentes em um problema de negócio')),
     @('Construção de soluções com IA', @('Do problema de negócio à solução com IA','Desenho e arquitetura da solução','Prototipação com IA','Construção com IA, no-code e low-code','Testes, validação e evolução da solução','Oficina integrada: construindo uma solução funcional com IA')) ) },
   @{ t='Mercado e agilidade: posicionamento, experimentação e governança da IA'; c='Mercado e agilidade'; d=@(
     @('Segmentação de mercado', @('Introdução à segmentação de mercado','Critérios de segmentação e seleção de mercado-alvo','Posicionamento de mercado','Ferramentas e técnicas de pesquisa de mercado','Análise e viabilidade financeira de projetos')),
     @('Ambientes de experimentação', @('A importância da cultura de testes','Prototipagem','A importância da validação de forma ágil e eficiente','Ferramentas para prototipagem','Ciclo de vida')),
     @('Metodologias ágeis', @('Cultura e mentalidade ágil','Método Lean, Design Thinking e aplicações em projetos','Métodos ágeis: Scrum, Kanban e Scrumban','KPIs, agilidade e DevOps: gestão de times para resultados e impacto contínuo')),
     @('Gestão de relacionamento e crises', @('Gestão de riscos organizacionais','Comunicação de crise','Planos de continuidade de negócios','Transparência e ética na comunicação','Estratégias para minimizar os impactos de eventos adversos')),
     @('Implementação e governança da IA nas organizações', @('Estratégia e maturidade para adoção de IA','Identificação e priorização de casos de uso','Viabilidade, impacto e indicadores de iniciativas de IA','Governança, ética, privacidade e segurança em IA','Riscos, supervisão humana e IA responsável','Implementação, gestão da mudança e adoção organizacional')) ) },
   @{ t='Go-to-market e escala: crescimento, dados e IA para negócios'; c='Go-to-market e escala'; d=@(
     @('Go-to-Market e escalabilidade', @('Fundamentos do growth hacking e mentalidade de crescimento','O ciclo de crescimento','Métricas e ferramentas de análise para crescimento','Técnicas de aquisição e retenção de clientes','Escalabilidade e crescimento em ambientes digitais')),
     @('Growth hacking e estratégias de crescimento', @('Fundamentos do growth hacking e mentalidade de crescimento','O ciclo de crescimento','Métricas e ferramentas de análise para crescimento','Técnicas de aquisição e retenção de clientes','Escalabilidade e crescimento em ambientes digitais')),
     @('Data Driven Decision', @('Data Driven Decision','Fundamentos, assessment e estratégia','Arquitetura de dados e self-service analytics','Análise de negócios, GenAI e Agentic AI')),
     @('Cibersegurança e riscos tecnológicos', @('Princípios básicos de cibersegurança','Tipos de ameaças cibernéticas','Políticas e práticas de segurança cibernética','Desenvolvimento de estratégias de mitigação de riscos','Planos de resposta a incidentes cibernéticos','O futuro da cibersegurança: tendências e novas ameaças')),
     @('IA para negócios', @('Estratégia de IA e geração de valor','IA aplicada à gestão e tomada de decisão','IA, inovação e novos modelos de negócio','Agentes, automação e escalabilidade com IA','Tendências e futuro da IA nos negócios','Oficina integradora: estratégia e aplicação da IA em um desafio real de negócio')),
     @('Liderança com propósito', @('Autoconsciência em um mundo complexo','Competências e carreiras com propósito','Conexões de valor para o impacto coletivo','A estratégia com alma: inteligência emocional','Construindo um legado de liderança autêntica')) ) }
  )
  notaFases = 'Grade 2027.1 já consolidada, como na página oficial da FIAP: Foresight Estratégico deu lugar a Inteligência Competitiva e Cenários com IA (fase 1) e os blocos de IA para Negócios das fases 1 a 4 viraram uma disciplina só na fase 5. Títulos das fases conforme a página da Pós Tech (pos-tech.html). Atenção: a FIAP e o dossiê repetem a mesma lista de tópicos em Go-to-Market e escalabilidade e em Growth hacking (fase 5); confirmar com a coordenação.'
  coordNome = 'Flávia Varga'
  coordLead = 'Coordenação de Flávia Varga, Head of Innovation, com a direção de Pós-Graduação Digital da FIAP e especialistas de empresas como Itaú, McCain, Ambev Tech e Trustly.'
  coordNota = 'Coordenação conforme o dossiê Pós Tech 2027.1 (Flavia Varga). A página oficial da FIAP lista a equipe sem fotos; a foto de Flávia Varga vem do cadastro de instrutores do site da PM3.'
  coordCards = @(
    '<figure class="prof reveal"><div class="ph"><img src="assets/people/pos-flavia-varga.jpg" alt="Foto de Flávia Varga" loading="lazy"></div><figcaption><b>Flávia Varga</b><span>Coordenadora · Head of Innovation</span></figcaption></figure>',
    '<figure class="prof reveal" data-d="1"><div class="ph"><img src="assets/people/pos-andrea-paiva-hd.jpg" alt="Foto de Andréa Paiva" loading="lazy"><span class="co co-logo"><img src="assets/alun/site/fiap.svg" alt="FIAP" style="height:14px"></span></div><figcaption><b>Andréa Paiva</b><span>Diretora de Pós-Graduação Digital</span></figcaption></figure>')
 }
)

foreach ($c in $CURSOS) {
  $t = $modelo
  $url = "https://pm3.com.br/pos-tech/$($c.slug)/"

  # cabeçalho, SEO e dados estruturados
  $t = Troca $t 'Pós Tech em Digital Product Management: PM3 + FIAP, Grupo Alun | PM3' $c.titulo
  $t = [regex]::Replace($t, '<meta name="description" content="[^"]*">', '<meta name="description" content="' + $c.desc + '">')
  $t = Troca $t 'https://pm3.com.br/pos-tech/digital-product-management/' $url
  $t = Troca $t 'Pós Tech em Digital Product Management | PM3 + FIAP · Grupo Alun' "Pós Tech em $($c.nome) | PM3 + FIAP · Grupo Alun"
  $t = [regex]::Replace($t, '<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="' + $c.ogdesc + '">')
  $t = Troca $t 'og/pos-digital-product-management.jpg' "og/pos-$($c.slug).jpg"
  $t = Troca $t '"name":"Digital Product Management","item"' ('"name":"' + $c.nome + '","item"')
  $t = Troca $t '"name":"Pós Tech em Digital Product Management","courseCode":"Digital Product Management"' ('"name":"Pós Tech em ' + $c.nome + '","courseCode":"' + $c.nome + '"')
  $t = [regex]::Replace($t, '("courseCode":"[^"]*",\s*"description":")[^"]*"', '${1}' + $c.ldDesc + '"')
  $t = [regex]::Replace($t, '<!--\s*PÁGINA DE UMA PÓS TECH.*?-->', "<!--`n  PÁGINA DA PÓS TECH $($c.nome.ToUpper()), gerada por tools/gerar-pos.ps1 a partir de pos-digital-product-management.html (mesmo modelo).`n  Conteúdo: dossiê Pós Tech 2027.1 (docs/postech-dossie-2027-1.txt) conferido com https://postech.fiap.com.br/curso/$($c.slug). Valores, FAQ, comunidade e extensões são os mesmos das três pós.`n  Para mudar o conteúdo, edite o script e rode de novo; não edite este HTML à mão.`n-->", 'Singleline')

  # hero
  $t = Troca $t 'assets/capas/pos-fiap/digital-product-management.webp' "assets/capas/pos-fiap/$($c.slug).webp"
  # brilho da capa (pos-curso.css clareia 2,2x por padrão; a capa de IA para Negócios já é clara)
  if ($c.coverB) { $t = Troca $t "<div class=`"cover`" aria-hidden=`"true`" style=`"background-image" "<div class=`"cover`" aria-hidden=`"true`" style=`"--cover-b:$($c.coverB);background-image" }
  $t = Troca $t '/pos-tech/digital-product-management/.' "/pos-tech/$($c.slug)/."
  $t = Troca $t '<li aria-current="page">Digital Product Management</li>' "<li aria-current=`"page`">$($c.nome)</li>"
  $t = Troca $t '<h1 class="display" id="h1">Digital<br>Product<br><span class="l2">Management</span></h1>' "<h1 class=`"display`" id=`"h1`">$($c.h1)</h1>"
  $t = [regex]::Replace($t, '(<h1 class="display" id="h1">.*?</h1>\s*<p class="lead">)[^<]*(</p>)', '${1}' + $c.heroLead + '${2}', 'Singleline')
  $t = Troca $t 'postech.fiap.com.br/curso/digital-product-management' "postech.fiap.com.br/curso/$($c.slug)"

  # 3 · sobre
  $outs = for ($i = 0; $i -lt $c.outs.Count; $i++) { $o = $c.outs[$i]; '      <div class="pc-out"><div class="top"><span class="ic"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + $IC[$o[0]] + '</svg></span><span class="num">0' + ($i + 1) + '</span></div><h3>' + $o[1] + '</h3><p>' + $o[2] + '</p></div>' }
  $skills = ($c.skills | ForEach-Object { "        <li>$CHK$_</li>" }) -join "`n"
  $tools = ($c.tools | ForEach-Object { "<span>$_</span>" }) -join ''
  $kit = $(if ($c.kit) { "`n      <p class=`"pc-kit`">$($c.kit)</p>" } else { '' })
  $sobre = @"
<!-- 3 · SOBRE A PÓS -->
<section class="section black on-dark pos-dark" id="sobre" aria-labelledby="sb-t">
  <div class="wrap">
    <div class="sec-head">
      <div><p class="kicker"><span class="n">01</span> Sobre a pós</p><h2 class="h2" id="sb-t">$($c.h2)</h2></div>
      <p class="lead">$($c.lead)</p>
    </div>
    <ul class="pos-spec reveal" aria-label="Em resumo"><li><b>10&nbsp;meses</b><span>de duração</span></li><li><b>360h</b><span>de conteúdo</span></li><li><b>100%</b><span>digital e hands-on</span></li><li><b>5</b><span>certificações, uma por fase</span></li><li><b>FIAP</b><span>emite o certificado</span></li></ul>
    <div class="pc-who reveal" data-nota="$($c.notaSobre)">
      <p class="kicker">Para quem é</p>
      <p>$($c.quem)</p>
    </div>
    <p class="kicker" style="margin:0 0 16px">Você vai se preparar para</p>
    <div class="pc-outs four reveal">
$($outs -join "`n")
    </div>
    <div class="pc-skills reveal">
      <div><p class="kicker">Competências e habilidades</p><ul class="pc-list">
$skills
      </ul></div>
      <div><p class="kicker">Ferramentas e tecnologias</p><div class="pc-tools">$tools</div>$kit</div>
    </div>
  </div>
</section>


"@
  $t = Entre $t '<!-- 3 · SOBRE A PÓS -->' '<!-- 4 · CONTEÚDO -->' $sobre

  # 4 · conteúdo (fases)
  $meses = 'Meses 1 e 2','Meses 3 e 4','Meses 5 e 6','Meses 7 e 8','Meses 9 e 10'
  $mods = for ($i = 0; $i -lt 5; $i++) {
    $f = $c.fases[$i]
    $discs = foreach ($d in $f.d) { '          <div class="disc"><h4>' + $d[0] + '</h4><ul>' + (($d[1] | ForEach-Object { "<li>$_</li>" }) -join '') + '</ul></div>' }
    "      <div class=`"mod`"><button type=`"button`" aria-expanded=`"false`"><span class=`"mn`">0$($i+1)</span><span class=`"mt`">$($f.t)</span><span class=`"mh`">$($meses[$i])</span><span class=`"pl`" aria-hidden=`"true`"></span></button>`n        <div class=`"mod-body`"><div><div class=`"in`">`n" + ($discs -join "`n") + "`n        </div></div></div></div>"
  }
  $conteudo = @"
<!-- 4 · CONTEÚDO -->
<section class="section on-dark pos-dark pos-ink" id="conteudo" aria-labelledby="em-t">
  <div class="wrap ementa-grid">
    <div class="ementa-aside">
      <p class="kicker"><span class="n">02</span> Conteúdo</p>
      <h2 class="h2" id="em-t">$($c.emH2)</h2>
      <p class="lead" style="margin-top:20px">Seu curso possui 5 fases. A cada fase concluída, você recebe uma certificação, além do certificado do curso completo.</p>
      <div class="ementa-tot"><div><b>360h</b><span>de conteúdo</span></div><div><b>5</b><span>fases</span></div><div><b>10</b><span>meses</span></div></div>
    </div>
    <div class="mods pos-mods" id="mods" data-nota="$($c.notaFases)">
$($mods -join "`n")
    </div>
  </div>
</section>


"@
  $t = Entre $t '<!-- 4 · CONTEÚDO -->' '<!-- 5 · CERTIFICAÇÕES -->' $conteudo

  # 5 · certificações (nomes oficiais das microcertificações da FIAP: Achievement 1 a 5)
  $lis = for ($i = 0; $i -lt 5; $i++) { "      <li data-n=`"0$($i+1)`"><span class=`"pc-n`">0$($i+1)</span><span class=`"pc-k`">Achievement $($i+1) · $($CERTN[$i])</span><h3>$($c.fases[$i].c)</h3><span class=`"pc-m`">$($meses[$i])</span><i class=`"pc-bar`" style=`"--p:$((($i+1)*0.2).ToString([Globalization.CultureInfo]::InvariantCulture))`" aria-hidden=`"true`"></i></li>" }
  $t = [regex]::Replace($t, '(<ol class="pcert reveal" data-nota=")[^"]*(">).*?(\s*<li class="pc-final">)', { param($m) $m.Groups[1].Value + 'Uma microcertificação a cada fase, com os nomes oficiais da FIAP (Achievement 1: Discover a Achievement 5: Go Live). O título abaixo de cada uma resume a fase.' + $m.Groups[2].Value + "`n" + ($lis -join "`n") + $m.Groups[3].Value }, 'Singleline')

  # 8 · coordenação: só na página mãe (pos-tech.html); o modelo já vem sem a seção

  # certificado, barra de compra e e-book
  $t = Troca $t 'e o curso por Digital Product Management.' "e o curso por Digital Product Management. PROVISÓRIO: o mockup ainda mostra Digital Product Management; gerar a versão de $($c.nome)."
  $t = Troca $t '<small>Pós Tech Digital Product Management</small>' "<small>Pós Tech $($c.nome)</small>"
  $t = Troca $t 'curso:"Digital Product Management",tracking:"ebook pos digital-product-management"' ('curso:"' + $c.nome + '",tracking:"ebook pos ' + $c.slug + '"')

  if ($t -match 'Digital Product Management' -and ($t -split 'Digital Product Management').Count -gt 3) { Write-Warning "$($c.arq): ainda cita Digital Product Management $((($t -split 'Digital Product Management').Count) - 1)x" }
  [IO.File]::WriteAllText((Join-Path $proto $c.arq), $t, $utf8)
  $nd = ($c.fases | ForEach-Object { $_.d.Count } | Measure-Object -Sum).Sum
  "{0,-28} 5 fases, {1} disciplinas" -f $c.arq, $nd
}

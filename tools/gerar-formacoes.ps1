# PM3 · protótipo · gera as páginas das formações a partir do plano de estudos oficial.
# Fontes:
#   00. DADOS PM3\Catálogo de cursos\formacoes\*.md (resumo: horas, módulos, "o que entrega")
#   00. DADOS PM3\Catálogo de cursos\formacoes\ementas-completas\*.md (tópicos e aulas)
#   tools\formacoes.json (textos de cada página) e assets\js\instrutores-dados.js (quem ensina)
# Uso: powershell -File tools\gerar-formacoes.ps1   (salvo em UTF-8 com BOM, por causa dos acentos)
# A página de Product Management é feita à mão e não é gerada aqui.
$ErrorActionPreference = 'Stop'
$proto = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
$cat = Join-Path (Resolve-Path 'C:\Users\Administrador\Desktop\Vibecoding\00. DADOS PM3\Cat*logo de cursos').Path 'formacoes'
$cfgs = [IO.File]::ReadAllText((Join-Path $PSScriptRoot 'formacoes.json'), $utf8) | ConvertFrom-Json

function Esc([string]$s){ if ($null -eq $s) { return '' }; return $s.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;').Replace('"','&quot;') }
function JsEsc([string]$s){ return $s.Replace('\','\\').Replace('"','\"') }
function Horas([string]$s){ if ($s -match '(\d+)h(\d+)') { $h = [int]$Matches[1]; if ([int]$Matches[2] -ge 30) { $h++ }; return $h }; return 0 }

$ICON = @{
  search = '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>'
  shield = '<path d="M12 3 4 6.5v5c0 4.6 3.4 8.4 8 9.5 4.6-1.1 8-4.9 8-9.5v-5z"/><path d="m9 12 2 2 4-4"/>'
  code   = '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M8 9l-2 2 2 2M16 9l2 2-2 2"/>'
  chart  = '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'
  graph  = '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.3 11 15.7 7M8.3 13l7.4 4"/>'
  users  = '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c1.9.7 3.1 2.5 3.5 5.2"/>'
  spark  = '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'
  flow   = '<rect x="3" y="4" width="6" height="5" rx="1.2"/><rect x="15" y="15" width="6" height="5" rx="1.2"/><path d="M6 9v4a2 2 0 0 0 2 2h7"/>'
  grid   = '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'
  tree   = '<circle cx="12" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M12 7.5V12M6 16.5V14h12v2.5M12 12v2"/>'
  dollar = '<circle cx="12" cy="12" r="9"/><path d="M15 9.2c-.6-1-1.7-1.5-3-1.5-1.8 0-3 .9-3 2.2 0 3.2 6 1.8 6 4.8 0 1.3-1.3 2.3-3 2.3-1.4 0-2.6-.6-3.2-1.6M12 6v1.7M12 16.9V18"/>'
  rocket = '<path d="M5 15c-1.5 1.5-2 4-2 6 2 0 4.5-.5 6-2"/><path d="M9 15 6 12c2.5-5 6.5-8.5 15-9-.5 8.5-4 12.5-9 15z"/><circle cx="15" cy="9" r="1.8"/>'
  layers = '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>'
  globe  = '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>'
  target = '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>'
  loop   = '<path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.7L4 15.5M4 20v-4.5h4.5"/>'
  flask  = '<path d="M9 3h6M10 3v6l-5.5 9.5A1.6 1.6 0 0 0 5.9 21h12.2a1.6 1.6 0 0 0 1.4-2.5L14 9V3"/><path d="M7.5 15h9"/>'
  chat   = '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>'
  flag   = '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'
}
$IALOGO = @{ n8n = '<img src="assets/logos/n8n.svg" alt="n8n" style="height:30px">'; lovable = '<img src="assets/logos/lovable.svg" alt="Lovable" style="height:13px">' }
$COLOGO = @{
  'Nubank' = '<img src="assets/logos/nubank.svg" alt="Nubank" style="height:15px">'
  'PM3' = '<img src="assets/logo/pm3-logo-preto.svg" alt="PM3" style="height:15px">'
  'Stripe' = '<img src="assets/logos/stripe.svg" alt="Stripe" style="height:20px">'
  'PicPay' = '<img src="assets/logos/picpay.svg" alt="PicPay" style="height:16px">'
  'Booking.com' = '<img src="assets/logos/booking.svg" alt="Booking.com" style="height:14px">'
}
$CHECK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m3 8.5 3 3 7-7"/></svg>'
$ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg>'
$DOC = '<svg class="ic-doc" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 2h7l4 4v12H5z"/><path d="M12 2v4h4M10.5 9v5M8.2 12l2.3 2.3 2.3-2.3"/></svg>'
$LOUROS = [IO.File]::ReadAllText((Join-Path $proto 'formacao-product-manager.html'), $utf8)
if ($LOUROS -notmatch '(?s)(<svg class="lr".*?</svg>)') { throw 'louros não encontrados no modelo' }
$LOUROS = $Matches[1]

# instrutores: uma linha por pessoa em instrutores-dados.js
$INSTR = @()
foreach ($l in [IO.File]::ReadAllLines((Join-Path $proto 'assets\js\instrutores-dados.js'), $utf8)) {
  if ($l -match "\{ n: '((?:[^'\\]|\\.)*)', c: '((?:[^'\\]|\\.)*)', e: '((?:[^'\\]|\\.)*)', f: '([^']*)'.*cursos: \[([^\]]*)\]") {
    $INSTR += [pscustomobject]@{ n = $Matches[1].Replace("\'","'"); c = $Matches[2].Replace("\'","'"); e = $Matches[3].Replace("\'","'"); f = $Matches[4]; cursos = $Matches[5] }
  }
}

foreach ($cf in $cfgs) {
  $resumo = [IO.File]::ReadAllLines((Join-Path $cat ($cf.md + '.md')), $utf8)
  $durTxt = ''; $dedTxt = ''
  foreach ($l in $resumo) { if ($l -match 'Dura..o do conte.do\*\*: (\S+) .*Dedica..o estimada\*\*: (\S+)') { $durTxt = $Matches[1]; $dedTxt = $Matches[2] } }
  $horas = Horas $durTxt; $dedic = Horas $dedTxt

  # módulos do resumo (tabela)
  $mods = @()
  foreach ($l in $resumo) {
    if ($l -match '^\| (\d+) \| ([^|]+) \| ([^|]+) \| ([^|]*) \|') {
      $cols = $l.Trim('|').Split('|') | ForEach-Object { $_.Trim() }
      $mods += [pscustomobject]@{ n = [int]$cols[0]; t = $cols[1]; aulas = $cols[2]; entrega = $(if ($cols.Count -ge 6) { $cols[5] } else { '' }); topicos = New-Object System.Collections.ArrayList; desc = '' }
    }
  }

  # tópicos e aulas da ementa completa
  $aulas = 0; $fEm = Join-Path $cat ('ementas-completas\' + $cf.md + '.md')
  if (Test-Path $fEm) {
    $cur = $null
    foreach ($l in [IO.File]::ReadAllLines($fEm, $utf8)) {
      if ($l -match '^## M.dulo (\d+)') { $cur = $mods | Where-Object { $_.n -eq [int]$Matches[1] }; continue }
      if (-not $cur) { continue }
      if ($l -match '^\*([^*].*[^*])\*$' -and -not $cur.desc) { $cur.desc = $Matches[1].Trim(); continue }
      if ($l -match '^- \[Aula\]') { $aulas++; continue }
      if ($l -match '^\*\*(.+)\*\*$') {
        $t = $Matches[1].Trim()
        $t = $t -replace '^\d{5}\s+', '' -replace '^\d+(\.\d+)*\.?\s+', '' -replace '^B\s+', ''
        $t = $t -replace '^B.nus\s*[:\-]\s*(.+)$', '$1 (bônus)' -replace '\s{2,}', ' '
        if ($t -match '^(Onboarding|Avalia|Teste seu conhecimento|Artigo|Material complementar)') { continue }
        # erros de digitação do plano de estudos
        $t = $t -replace '^Atvidade', 'Atividade' -replace 'Crossell', 'Cross-sell' -replace "KPI's", 'KPIs' -replace '\s+-\s+Aula Case$', '' -replace '^B.nus Mesacast\s*-\s*(.+)$', '$1 (bônus)'
        $t = $t.Substring(0,1).ToUpper() + $t.Substring(1)
        if (-not $cur.topicos.Contains($t)) { [void]$cur.topicos.Add($t) }
      }
    }
  }
  $nMods = $mods.Count
  $isBuilder = ($cf.id -eq 'ai-product-builder')
  if ($isBuilder) {
    $aulasB = 0; $aplic = 0
    foreach ($m in $mods) { if ($m.aulas -match '(\d+) aulas \+ (\d+) aplica') { $aulasB += [int]$Matches[1]; $aplic += [int]$Matches[2]; [void]$m.topicos.Add("$($Matches[1]) aulas e $($Matches[2]) $(if ([int]$Matches[2] -gt 1) {'aplicações práticas'} else {'aplicação prática'})") } }
    $aulas = $aulasB
  }

  # ---------- montagem ----------
  $nome = $cf.nome; $nomeH = Esc $nome
  $statsTxt = $(if ($isBuilder) { "$nMods módulos, $aulas aulas e $aplic aplicações práticas" } else { "${horas}h, $nMods módulos, $aulas aulas" })
  $factsHtml = $(if ($isBuilder) {
      "<div><b>$nMods</b><span>módulos</span></div><div><b>$aulas</b><span>aulas</span></div><div><b>$aplic</b><span>aplicações práticas</span></div>"
    } else {
      "<div><b>${horas}h</b><span>de conteúdo</span></div><div><b>$nMods</b><span>módulos</span></div><div><b>$aulas</b><span>aulas</span></div>"
    })
  $notaFacts = $(if ($isBuilder) { 'Formação em lançamento: o plano oficial traz só a estrutura (6 módulos, aulas e aplicações práticas), sem carga horária. Os módulos são publicados aos poucos; não mostrar horas até o time confirmar.' } else { "Números do plano de estudos oficial (Catálogo de cursos): $durTxt de conteúdo, $aulas aulas em vídeo e dedicação estimada de $dedTxt." })
  $tags = '<span class="tag tag-dark">Formação</span><span class="tag tag-dark">' + (Esc $cf.area) + '</span>' + $(if ($cf.destaque) { '<span class="tag tag-yellow">' + (Esc $cf.destaque) + '</span>' } else { '' })
  $codigo = ($cf.md -split '-')[0]; if ($isBuilder) { $codigo = 'aipb' }

  $modsHtml = ($mods | ForEach-Object {
    $m = $_
    $d = $null
    if ($cf.modDesc.PSObject.Properties.Name -contains [string]$m.n) { $d = $cf.modDesc.([string]$m.n) }
    elseif ($m.entrega -and $m.entrega -notmatch '\.\.\.$') { $d = $m.entrega }
    elseif ($m.desc) { $d = $m.desc }
    $tit = ($m.t -replace '^M.dulo \d+\s*[:\-–]\s*', '')
    $lis = ($m.topicos | ForEach-Object { '<li>' + (Esc $_) + '</li>' }) -join ''
    # o primeiro módulo carrega aberto para equilibrar a coluna da ementa com a lateral; os demais, fechados
    $ab = [object]::ReferenceEquals($m, $mods[0])
    '      <div class="mod' + $(if ($ab) { ' open' }) + '"><button type="button" aria-expanded="' + $(if ($ab) { 'true' } else { 'false' }) + '"><span class="mn">' + $m.n.ToString('00') + '</span><span class="mt">' + (Esc $tit) + '</span><span class="pl" aria-hidden="true"></span></button>' + "`n" +
    '        <div class="mod-body"><div><div class="in">' + $(if ($d) { '<p>' + (Esc $d) + '</p>' } else { '' }) + "`n" +
    '          <ul>' + $lis + '</ul></div></div></div></div>'
  }) -join "`n"

  $sec = $cf.secao
  $secLabel = $sec.kicker
  $iaHtml = ''; $i = 0
  foreach ($it in $sec.itens) {
    $i++
    $foot = '<span class="ia-mod">' + (Esc $it.m) + '</span>'
    if ($it.case) { $foot += '<span class="ia-case"><b>' + (Esc $it.case) + '</b></span>' }
    if ($it.logo) { $foot += '<span class="ia-case">' + $IALOGO[$it.logo] + '</span>' }
    $pref = $(if ($sec.tipo -eq 'ia') { 'IA' } else { 'Prática' })
    $iaHtml += '      <article class="ia-item reveal" data-d="' + (($i - 1) % 3) + '"><div class="ia-top"><span class="ia-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + $ICON[$it.ic] + '</svg></span><span class="ia-n">' + $pref + ' ' + $i.ToString('00') + '</span></div><div class="ia-txt"><h3>' + (Esc $it.t) + '</h3><p>' + (Esc $it.p) + '</p></div><div class="ia-foot">' + $foot + '</div></article>' + "`n"
  }

  # logos dos cases: tools/logos-cases.ps1 (nome → logo; sem logo, texto)
  if (-not (Get-Command CaseItem -ErrorAction SilentlyContinue)) { . (Join-Path $PSScriptRoot 'logos-cases.ps1') }
  $casesHtml = ($cf.cases.itens | ForEach-Object { CaseItem $_ }) -join ''

  # instrutores da formação: CEO e co-founder primeiro, depois a ordem do cadastro
  $lista = @($INSTR | Where-Object { $_.cursos -match ("'" + [regex]::Escape($nome) + "'") })
  $lista = @($lista | Where-Object { $_.e -eq 'PM3' }) + @($lista | Where-Object { $_.e -ne 'PM3' })
  $empresas = $lista | Where-Object { $_.e -and $_.e -ne 'PM3' } | Group-Object e | Sort-Object Count -Descending | Select-Object -First 4 | ForEach-Object { $_.Name }
  $profHtml = ($lista | ForEach-Object {
    $p = $_
    $co = ''
    if ($p.e) { if ($COLOGO.ContainsKey($p.e)) { $co = '<span class="co co-logo">' + $COLOGO[$p.e] + '</span>' } else { $co = '<span class="co">' + (Esc $p.e) + '</span>' } }
    '      <figure class="prof"><div class="ph"><img src="assets/people/instrutores/' + $p.f + '" alt="Foto de ' + (Esc $p.n) + '" loading="lazy" width="480" height="600">' + $co + '</div><figcaption><b>' + (Esc $p.n) + '</b><span>' + (Esc $p.c) + '</span></figcaption></figure>'
  }) -join "`n"
  $profLead = "$($lista.Count) instrutores com experiência em " + ((@($empresas) | ForEach-Object { Esc $_ }) -join ', ') + ' e outras empresas, que levam para a aula a prática do dia a dia.'

  $tempoFaq = $(if ($isBuilder) { "A formação está em lançamento: os 6 módulos são publicados aos poucos e você acompanha cada um assim que é liberado, dentro dos 12 meses de acesso. A carga horária final ainda não está fechada." } else { "São $horas horas de conteúdo. Contando exercícios e práticas, a dedicação estimada é de cerca de $dedic horas, no seu ritmo, dentro dos 12 meses de acesso." })
  $sprintQ = $(if ($isBuilder) { 'Qual a diferença para a formação AI Product Specialist?' } else { 'Qual a diferença para a sprint ' + $cf.sprint.nome + '?' })
  $faqs = @(
    @("A formação $nome é para mim?", $cf.quem),
    @($sprintQ, $cf.sprint.texto),
    @('A formação tem certificado?', "Sim. Ao concluir, você recebe o certificado PM3 de $nome, pronto para adicionar ao LinkedIn."),
    @('Quanto tempo leva para concluir?', $tempoFaq),
    @('Como funciona o parcelamento?', 'Você paga no cartão em até 12x ou à vista. Condições de Pix e outras formas aparecem no checkout.'),
    @('Qual a diferença para o Membership?', "A formação avulsa dá acesso só a $nome, por 12 meses. O Membership custa 12x R$ 299,92 (R$ 3.599 à vista) e inclui, também por 12 meses, as 10 formações, as +40 sprints, mentorias, workshops ao vivo e comunidade.")
  )
  $faqHtml = ''; $k = 0
  foreach ($q in $faqs) { $faqHtml += '      <details' + $(if ($k -eq 0) { ' open' } else { '' }) + '><summary>' + (Esc $q[0]) + '<i aria-hidden="true"></i></summary><p>' + (Esc $q[1]) + '</p></details>' + "`n"; $k++ }
  $faqLd = ($faqs | ForEach-Object { '  {"@type":"Question","name":"' + (JsEsc $_[0]) + '","acceptedAnswer":{"@type":"Answer","text":"' + (JsEsc $_[1]) + '"}}' }) -join ",`n"
  $tempoLd = $(if ($isBuilder) { '' } else { '"timeRequired":"PT' + $horas + 'H",' })
  $workLd = $(if ($isBuilder) { '' } else { ',"courseWorkload":"PT' + $horas + 'H"' })
  $certTxt = $(if ($isBuilder) { "Ao concluir a formação, você recebe o certificado PM3 de $nome, com o nome do curso e a carga horária, pronto para o LinkedIn e o currículo." } else { "Ao concluir as $horas horas da formação, você recebe o certificado PM3 de $nome, com o nome do curso e a carga horária, pronto para o LinkedIn e o currículo." })
  $itemF = $(if ($isBuilder) { "$nMods módulos e $aplic aplicações práticas" } else { "$nMods módulos, ${horas}h, $aulas aulas" })

  $html = @"
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Formação $($nomeH): curso online com certificado | PM3</title>
<meta name="description" content="$(Esc $cf.desc)">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="$($cf.canonical)">
<meta property="og:title" content="Formação $nomeH | PM3">
<meta property="og:description" content="$(Esc $cf.lead)">
<meta property="og:image" content="https://pm3.com.br/og/$($cf.arquivo -replace '\.html$','.jpg')">
<link rel="icon" type="image/svg+xml" href="assets/logo/pm3-simbolo-roxo.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=Rubik:wght@400;500&family=Playfair+Display:ital,wght@1,500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/tokens.css?v=2">
<link rel="stylesheet" href="assets/css/base.css?v=32">
<link rel="stylesheet" href="assets/css/components.css?v=9">
<link rel="stylesheet" href="assets/css/course.css?v=29">
<link rel="stylesheet" href="assets/css/ementa.css?v=2">
<link rel="stylesheet" href="assets/css/certificado.css?v=14">
<link rel="stylesheet" href="assets/css/instrutores.css?v=5">
<link rel="stylesheet" href="assets/css/planos.css?v=2">
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
 {"@type":"BreadcrumbList","itemListElement":[
  {"@type":"ListItem","position":1,"name":"Home","item":"https://pm3.com.br/"},
  {"@type":"ListItem","position":2,"name":"Formações","item":"https://pm3.com.br/formacoes/"},
  {"@type":"ListItem","position":3,"name":"$(JsEsc $nome)","item":"$($cf.canonical)"}]},
 {"@type":"Course","name":"Formação $(JsEsc $nome)",
  "description":"$(JsEsc $cf.resumo)",
  "provider":{"@type":"EducationalOrganization","name":"PM3","sameAs":"https://pm3.com.br/"},
  "inLanguage":"pt-BR","educationalCredentialAwarded":"Certificado PM3 de $(JsEsc $nome)",
  $tempoLd"numberOfCredits":$nMods,
  "hasCourseInstance":{"@type":"CourseInstance","courseMode":"online"$workLd},
  "offers":[{"@type":"Offer","category":"Paid","price":"3299.00","priceCurrency":"BRL","availability":"https://schema.org/InStock","url":"$($cf.canonical)"}]},
 {"@type":"FAQPage","mainEntity":[
$faqLd]}
]}
</script>
</head>
<body data-page="$($cf.arquivo -replace '\.html$','')">
<!-- GERADA por tools/gerar-formacoes.ps1 a partir do plano de estudos oficial e de tools/formacoes.json. Edite lá e rode o script de novo. -->

<main>

<!-- 1 · HERO -->
<section class="c-hero has-cover grain on-dark" id="topo-curso" aria-labelledby="h1">
  <div class="cover-bg" aria-hidden="true" style="background-image:url('assets/capas/$($cf.capa)-1600.jpg')"></div>
  <div class="wrap">
    <ol class="crumbs" aria-label="Você está em" data-nota="A URL atual $($cf.canonical -replace 'https://pm3.com.br','') fica igual, porque já rankeia."><li><a href="home.html">Home</a></li><li><a href="formacoes.html">Formações</a></li><li aria-current="page">$nomeH</li></ol>
    <div class="c-hero-grid">
      <div>
        <div class="c-tags">$tags</div>
        <h1 class="display" id="h1">$($cf.h1)</h1>
        <p class="lead">$(Esc $cf.lead)</p>
        <div class="hero-ctas"><a class="btn btn-light btn-em" href="#baixar-ementa" data-ementa="hero">$DOC Baixar ementa completa</a><span class="hint">PDF gratuito com módulos e tópicos</span></div>
        <div class="facts" data-nota="$(Esc $notaFacts)">
          $factsHtml
        </div>
      </div>
      <aside class="buy" id="comprar" aria-label="Comprar a formação" data-nota="Formação avulsa a R$ 3.299, o mesmo preço das outras formações (a confirmar por formação).">
        <p class="kicker">Formação avulsa</p>
        <div class="val"><span class="x">12x</span><b><sup>R$</sup>274,92</b></div>
        <p class="sub">ou R$ 3.299 à vista · acesso por 12 meses</p>
        <a class="btn btn-primary" href="#">Fazer inscrição $ARROW</a>
        <ul>
          <li>$CHECK Certificado de $nomeH</li>
          <li>$CHECK Estude no seu ritmo, 100% online</li>
          <li>$CHECK 7 dias de garantia</li>
        </ul>
        <a class="upsell" href="membership.html" data-nota="Venda cruzada: por 12x R$ 299,92 a pessoa leva as 10 formações e as +40 sprints.">
          <span class="sym"><img src="assets/logo/pm3-simbolo-preto.svg" alt=""></span>
          <span><b>Ou acesse as 10 formações</b><span>Membership: 12x R$ 299,92</span></span>
          $ARROW
        </a>
      </aside>
    </div>
  </div>
</section>

<!-- 2 · SUBNAVEGAÇÃO -->
<div class="subnav" id="subnav">
  <div class="wrap">
    <nav aria-label="Seções da página">
      <a href="#ementa">Ementa</a><a href="#ia">$(Esc $secLabel)</a><a href="#investimento">Investimento</a><a href="#instrutores">Instrutores</a><a href="#certificado">Certificado</a><a href="#duvidas">Dúvidas</a>
    </nav>
    <div class="sub-cta"><div class="mini"><b>12x R$ 274,92<small>ou R$ 3.299 à vista</small></b><a class="btn btn-primary btn-sm" href="#investimento">Inscrever</a></div><a class="btn btn-line btn-sm btn-em sub-ementa" href="#baixar-ementa" data-ementa="subnav">$DOC Ementa</a></div>
  </div>
</div>

<!-- 3 · EMENTA -->
<section class="section white" id="ementa" aria-labelledby="em-t">
  <div class="wrap ementa-grid">
    <div class="ementa-aside">
      <p class="kicker"><span class="n">01</span> Ementa</p>
      <h2 class="h2" id="em-t">O que<br>você vai<br><span class="c2">aprender</span></h2>
      <p class="lead" style="margin-top:20px">Confira tudo que você vai dominar neste curso.</p>
      <div class="ementa-tot">$factsHtml</div>
      <div class="em-dl"><div class="row"><span class="pdf" aria-hidden="true">PDF</span><div><b>Quer ver mais?</b><div class="meta">Baixe a ementa completa. Preencha o formulário e faça o download da ementa do curso.</div></div></div><a class="btn btn-light btn-em" href="#baixar-ementa" data-ementa="lateral-ementa">$DOC Baixar ementa</a></div>
    </div>
    <div class="mods" id="mods" data-nota="Módulos e tópicos do plano de estudos oficial da formação, com o texto no HTML (lido pelo Google e pelas IAs).">
$modsHtml
    </div>
  </div>
  <div class="wrap">
    <div class="em-cases-band reveal">
      <div class="em-cases-lb"><h3>$(Esc $cf.cases.titulo)</h3><p>$(Esc $cf.cases.texto)</p></div>
      <ul class="em-cases-logos em-cases-txt" style="--n:$(@($cf.cases.itens).Count)">$casesHtml</ul>
    </div>
  </div>
</section>

<!-- 4 · $(Esc $secLabel) -->
<section class="section black on-dark ia-sec" id="ia" aria-labelledby="ia-t">
  <div class="ia-bg" aria-hidden="true"></div>
  <div class="wrap">
    <div class="sec-head">
      <div><p class="kicker"><span class="n">02</span> $(Esc $secLabel)</p><h2 class="h2" id="ia-t">$($sec.h2)</h2></div>
      <p class="lead">$(Esc $sec.lead)</p>
    </div>
    <div class="ia-grid">
$iaHtml    </div>
  </div>
</section>

<!-- 5 · INVESTIMENTO -->
<section class="section white" id="investimento" aria-labelledby="iv-t">
  <div class="wrap">
    <div class="sec-head">
      <div><p class="kicker"><span class="n">03</span> Investimento</p><h2 class="h2" id="iv-t">Escolha<br><span class="c2">o seu plano</span></h2></div>
      <p class="lead">Só esta formação, todas as formações e sprints com o Membership, ou a pós-graduação com a FIAP. Formação e Membership em até 12x, Pós Tech em 18x.</p>
    </div>
    <div class="pl3">
      <article class="pl3-card pl3-f reveal">
        <span class="pl3-k">Formação avulsa</span>
        <h3>$nomeH<small>1 formação · 12 meses de acesso</small></h3>
        <div class="pl3-v"><span class="x">12x</span><b><sup>R$</sup>274,92</b><small>ou R$ 3.299 à vista</small></div>
        <ul><li>$CHECK$itemF</li><li>$CHECK Certificado de $nomeH</li><li>$CHECK 7 dias de garantia</li></ul>
        <a class="btn btn-line" href="#">Comprar a formação</a>
      </article>
      <article class="pl3-card pl3-m on-dark reveal" data-d="1">
        <span class="pl3-best">Melhor escolha</span>
        <span class="pl3-k">Membership PM3</span>
        <h3>Todas as formações<small>10 formações e +40 sprints · 12 meses</small></h3>
        <div class="pl3-v"><span class="x">12x</span><b><sup>R$</sup>299,92</b><small>ou R$ 3.599 à vista</small></div>
        <ul><li>$CHECK Esta formação e mais 9</li><li>$CHECK +40 sprints, mentorias e workshops ao vivo</li><li>$CHECK Comunidade PM3 e Certificado de Product Master</li></ul>
        <a class="btn btn-light" href="membership.html">Assinar o Membership $ARROW</a>
      </article>
      <article class="pl3-card pl3-p on-dark reveal" data-d="2">
        <span class="pl3-k">Pós Tech · FIAP + PM3</span>
        <h3>Pós-graduação<small>Certificado reconhecido pelo MEC · 10 meses</small></h3>
        <div class="pl3-v"><span class="x">18x</span><b><sup>R$</sup>780</b><small>matrícula com a FIAP</small></div>
        <ul><li>$CHECK Digital Product Management, Tech Management ou IA para Negócios</li><li>$CHECK 360 horas, com encontros ao vivo</li><li>$CHECK Tech Challenge em 5 fases e Hackathon</li><li>$CHECK 20% de desconto para alunos PM3, FIAP e Alura</li></ul>
        <a class="btn btn-line" href="pos-tech.html">Conhecer a Pós Tech $ARROW</a>
      </article>
    </div>
    <div class="pay">
      <span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1.5" y="3.5" width="13" height="9" rx="2"/><path d="M1.5 6.5h13"/></svg>Cartão em até 12x</span>
      <span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 1.5 2.5 3.8v3.7c0 3.2 2.3 6 5.5 7 3.2-1 5.5-3.8 5.5-7V3.8z"/></svg>7 dias de garantia</span>
      <span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 1.5 3 9h4.5L7 14.5 13 7H8.5z"/></svg>Acesso imediato</span>
      <span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="6.5"/><path d="M8 4.5v4l2.5 1.5"/></svg>Para empresas: <a href="para-empresas.html">fale com a PM3</a></span>
    </div>
  </div>
</section>

<!-- 6 · INSTRUTORES -->
<section class="section black on-dark" id="instrutores" aria-labelledby="in-t">
  <div class="wrap">
    <div class="sec-head">
      <div><p class="kicker"><span class="n">04</span> Quem ensina</p><h2 class="h2" id="in-t">Aulas com grandes nomes<br><span class="c2">do mercado</span></h2></div>
      <p class="lead">$profLead</p>
    </div>
    <div class="prof-grid" role="region" aria-label="Instrutores da formação" tabindex="0" data-nota="Instrutores ligados a esta formação no cadastro atual do site (WordPress), com cargo e empresa de cada um.">
$profHtml
    </div>
    <div class="prof-nav"><div class="prof-btns"><button type="button" data-pf="ant" aria-label="Instrutores anteriores"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 8H3M7 4 3 8l4 4"/></svg></button><button type="button" data-pf="prox" aria-label="Próximos instrutores"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 8h11M9 4l4 4-4 4"/></svg></button></div></div>
  </div>
</section>

<!-- 7 · CERTIFICADO -->
<section class="cx-sec on-dark" id="certificado" aria-labelledby="ce-t">
  <div class="cx-hero cx-var" style="--cert-full:url('../img/certificado-veludo.jpg?v=3');--cert-crop:url('../img/certificado-veludo-crop.jpg?v=3')" data-nota="PROVISÓRIO: o mockup ainda é o de Product Management. Falta o mockup do certificado desta formação.">
    <div class="wrap">
      <div class="cx-copy">
        <p class="kicker"><span class="n">05</span> Certificado</p>
        <h2 class="h2" id="ce-t">Certificado<br><span class="c2">reconhecido<br>pelo mercado<br>de produto.</span></h2>
        <p class="lead">$(Esc $certTxt)</p>
        <ul class="cx-proof">
          <li><span class="cx-aw">$LOUROS<b>Top 5</b></span><span class="cx-lb">Empresas mais admiradas em Produto no Brasil</span></li>
          <li><span class="cx-aw">$LOUROS<b>+800</b></span><span class="cx-lb">Empresas confiam nas formações da PM3</span></li>
          <li><span class="cx-aw">$LOUROS<b>9 em 10</b></span><span class="cx-lb">Profissionais de produto conhecem a PM3</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- 8 · FAQ -->
<section class="section" id="duvidas" aria-labelledby="fq-t">
  <div class="wrap faq-grid">
    <div>
      <p class="kicker"><span class="n">06</span> Dúvidas</p>
      <h2 class="h2" id="fq-t">Perguntas<br><span class="c2">frequentes</span></h2>
      <p class="muted" style="margin-top:20px">Fale com o time pelo WhatsApp ou pelo e-mail contato@pm3.com.br.</p>
      <a class="btn btn-line btn-sm" href="contato.html">Falar com a PM3</a>
    </div>
    <div class="faq">
$faqHtml    </div>
  </div>
</section>

</main>

<div class="buybar" id="buybar" aria-hidden="true">
  <div><b>12x R$ 274,92</b><small>Formação $nomeH</small></div>
  <a class="btn btn-light btn-sm" href="#investimento" tabindex="-1">Inscrever</a>
</div>

<script src="assets/js/layout.js?v=65"></script>
<script src="assets/js/course.js?v=5"></script>
<script src="assets/js/instrutores.js?v=6"></script>
<script>window.EMENTA={curso:"$(JsEsc $nome)",tracking:"ementa $codigo",stats:"$(JsEsc $statsTxt).",capa:"assets/capas/$($cf.capa)-800.jpg"};</script>
<script src="assets/js/ementa.js?v=6"></script>
</body>
</html>
"@
  # sem instrutores no cadastro (ex.: AI Product Specialist): a seção sai e as outras são renumeradas
  if ($lista.Count -eq 0) {
    $a = $html.IndexOf('<!-- 6 · INSTRUTORES -->'); $b = $html.IndexOf('<!-- 7 · CERTIFICADO -->')
    $html = $html.Remove($a, $b - $a)
    $html = $html.Replace('<a href="#instrutores">Instrutores</a>', '')
    $html = $html.Replace('<span class="n">05</span> Certificado', '<span class="n">04</span> Certificado').Replace('<span class="n">06</span> Dúvidas', '<span class="n">05</span> Dúvidas')
    $html = $html -replace '<script src="assets/js/instrutores\.js\?v=6"></script>\r?\n', ''
  }
  [IO.File]::WriteAllText((Join-Path $proto $cf.arquivo), $html, $utf8)
  "{0,-40} {1,3}h {2} mod {3,3} aulas {4,2} instrutores" -f $cf.arquivo, $horas, $nMods, $aulas, $lista.Count
}

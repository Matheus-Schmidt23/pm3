# Gera as páginas das sprints a partir do modelo sprint-fundamentos-gestao-produtos.html (feito à mão, não é sobrescrito).
# Fontes: tools/sprints-wp.json (extraído do site atual por tools/extrair-sprints.ps1: módulos, tópicos, cases, instrutores, horas),
# assets/js/catalogo.js (lista de sprints do protótipo, área e capa) e assets/js/instrutores-dados.js (instrutores que já existem no protótipo).
# Fotos de instrutores que ainda não estão no protótipo são baixadas do site atual uma vez para assets/people/instrutores/.
# Rodar na pasta prototipo:  & ".\tools\gerar-sprints.ps1"
$ErrorActionPreference = 'Stop'
$proto = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding($false)
Add-Type -AssemblyName PresentationCore, WindowsBase
. (Join-Path $PSScriptRoot 'logos-cases.ps1')  # CaseItem: nome da empresa → logo

function Esc([string]$s) { if ($null -eq $s) { return '' }; $s.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;').Replace('"','&quot;') }
function JsEsc([string]$s) { $s.Replace('\','\\').Replace('"','\"') }
function Norm([string]$s) { (($s.Normalize([Text.NormalizationForm]::FormD) -replace '\p{Mn}','') -replace '^(curso\s+(de\s+)?)','' -replace '[^\p{L}\p{N} ]','' -replace '\s+',' ').Trim().ToLower() }
function Slug([string]$s) { ((($s.Normalize([Text.NormalizationForm]::FormD) -replace '\p{Mn}','').ToLower()) -replace '[^a-z0-9]+','-').Trim('-') }
function Entre([string]$t, [string]$ini, [string]$fim, [string]$novo) {
  $a = $t.IndexOf($ini); $b = $t.IndexOf($fim)
  if ($a -lt 0 -or $b -lt 0 -or $b -lt $a) { throw "marcador não encontrado: $ini / $fim" }
  $t.Substring(0, $a) + $novo + $t.Substring($b)
}
function Troca([string]$t, [string]$de, [string]$para) { if ($t.IndexOf($de) -lt 0) { throw "trecho não encontrado: $($de.Substring(0,[Math]::Min(70,$de.Length)))" }; $t.Replace($de, $para) }
# lead: frases inteiras até ~260 caracteres
function Curto([string]$s, [int]$max = 260) {
  $fr = [regex]::Matches($s, '[^.!?]+[.!?]+(\s|$)') | ForEach-Object { $_.Value.Trim() }
  if (-not $fr) { return $s }
  $out = ''; foreach ($f in $fr) { if ($out -and ($out.Length + $f.Length + 1) -gt $max) { break }; $out = ($out + ' ' + $f).Trim() }
  $out
}
# quebra o nome em até 3 linhas equilibradas para o h1
function Linhas([string]$s) {
  $w = $s -split ' '; if ($s.Length -le 14) { return (Esc $s) }
  $alvo = [Math]::Max(10, [Math]::Ceiling($s.Length / [Math]::Min(3, [Math]::Ceiling($s.Length / 13))))
  $ls = @(); $cur = ''
  foreach ($x in $w) { if ($cur -and ($cur.Length + 1 + $x.Length) -gt $alvo + 3) { $ls += $cur; $cur = $x } else { $cur = ($cur + ' ' + $x).Trim() } }
  if ($cur) { $ls += $cur }
  ($ls | ForEach-Object { Esc $_ }) -join '<br>'
}

$modelo = [IO.File]::ReadAllText((Join-Path $proto 'sprint-fundamentos-gestao-produtos.html'), $utf8)
$dadosSite = Get-Content (Join-Path $PSScriptRoot 'sprints-wp.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$SITE = @{}; foreach ($s in $dadosSite) { $SITE[(Norm $s.titulo)] = $s }

# nomes do protótipo que diferem do site atual
$ALIAS = @{
  'Estratégias de Negociação para Líderes' = 'Estratégias de Negociações para Líderes'
  'Comunicação assertiva no trabalho' = 'Comunicação assertiva no ambiente de trabalho'
  'Diversidade e inclusão no trabalho' = 'Práticas de diversidade e inclusão no trabalho'
  'Como dar feedback construtivo' = 'Como dar feedback construtivo e eficiente'
  'Identificando vieses e armadilhas em análises' = 'Identificando vieses e armadilhas em análises'
}
# sem conteúdo ou feita à mão
$PULAR = @('Fundamentos de Gestão de Produtos', 'Tecnologia para Product Managers')

# catálogo do protótipo: nome, área, horas, objetivo e capa
$js = [IO.File]::ReadAllText((Join-Path $proto 'assets\js\catalogo.js'), $utf8)
$AREAS = @{}; foreach ($m in [regex]::Matches($js, "(\w+):\s*\{ nome: '([^']+)', curto: '([^']+)' \}")) { $AREAS[$m.Groups[1].Value] = $m.Groups[2].Value }
$SP = @([regex]::Matches($js, "S\('((?:[^'\\]|\\.)*)','([a-z]+)',(\d+),'((?:[^'\\]|\\.)*)'") | ForEach-Object { [pscustomobject]@{ nome = $_.Groups[1].Value.Replace("\'","'"); area = $_.Groups[2].Value; h = [int]$_.Groups[3].Value; obj = $_.Groups[4].Value.Replace("\'","'") } })
$CAPAS = [regex]::Match($js, "const CAPAS = \[(.*?)\]").Groups[1].Value -split ',' | ForEach-Object { $_.Trim().Trim("'") }
if ($SP.Count -ne $CAPAS.Count) { throw "SPRINTS ($($SP.Count)) e CAPAS ($($CAPAS.Count)) com tamanhos diferentes" }
for ($i = 0; $i -lt $SP.Count; $i++) { $SP[$i] | Add-Member capa $CAPAS[$i] }

# formação que aprofunda o tema (coluna "Complementa" do catalogo-sprints.md; RAG e Responsible AI → AI Product Specialist)
$FORM = @{ CPM = @('Product Management','formacao-product-manager.html'); CPD = @('Product Discovery','formacao-product-discovery.html'); CPL = @('Product Leadership','formacao-product-leadership.html'); CPG = @('Product Growth','formacao-product-growth.html'); CPMk = @('Product Marketing','formacao-product-marketing.html'); CPA = @('Product Analytics','formacao-product-analytics.html'); AD = @('Analista de Dados','formacao-analista-de-dados.html'); CPDe = @('Product Design','formacao-product-design.html'); AIS = @('AI Product Specialist','formacao-ai-product-specialist.html') }
$COMP = @{}
$catMd = Get-Item 'C:\Users\Administrador\Desktop\Vibecoding\00. DADOS PM3\Cat*logo de cursos\sprints\catalogo-sprints.md'
foreach ($l in [IO.File]::ReadAllLines($catMd.FullName, $utf8)) { if ($l -match '^\| ' -and $l -notmatch '^\| Sprint \|') { $c = $l -split '\|'; $cod = ([regex]::Match($c[6], '\b(CPMk|CPDe|CPM|CPD|CPL|CPG|CPA|AD)\b')).Value; if ($cod) { $COMP[(Norm $c[1])] = $cod } } }
$COMP[(Norm 'RAG para Produtos de IA')] = 'AIS'; $COMP[(Norm 'Responsible AI')] = 'AIS'

# cases: nome da empresa a partir do arquivo de logo do site atual (muitos logos são brancos, feitos para fundo escuro)
$CASE = [ordered]@{ 'nubank' = 'Nubank'; 'octadesk' = 'Octadesk'; 'image-3-1' = 'Favo'; 'livework' = 'Livework'; 'dotz' = 'Dotz'; 'pm3_logo' = 'PM3'; 'ifood' = 'iFood'; 'logo-min' = 'RD Station'; 'memed' = 'Memed'; 'seek' = 'Seek'; 'group-2609715' = 'RD Station'; 'ze-delivery' = 'Zé Delivery'; 'total-pass' = 'TotalPass'; 'studocu' = 'Studocu'; 'pngwing' = 'Pipefy'; 'olx' = 'OLX'; 'verios' = 'Verios'; 'vtex' = 'VTEX'; 'getninjas' = 'GetNinjas'; 'creditas' = 'Creditas'; 'gupy' = 'Gupy'; 'catho' = 'Catho'; 'pipefy' = 'Pipefy' }
function CaseNome([string]$u) { $f = (($u -split '/')[-1]).ToLower(); foreach ($k in $CASE.Keys) { if ($f.Contains($k)) { return $CASE[$k] } }; throw "case sem nome: $f" }

# instrutores já no protótipo
$DADOS = @{}
foreach ($l in [IO.File]::ReadAllLines((Join-Path $proto 'assets\js\instrutores-dados.js'), $utf8)) {
  if ($l -match "\{ n: '((?:[^'\\]|\\.)*)', c: '((?:[^'\\]|\\.)*)', e: '((?:[^'\\]|\\.)*)', f: '([^']*)'") { $k = Norm $Matches[1].Replace("\'","'"); if (-not $DADOS.ContainsKey($k)) { $DADOS[$k] = @{ n = $Matches[1].Replace("\'","'"); c = $Matches[2].Replace("\'","'"); e = $Matches[3].Replace("\'","'"); f = $Matches[4] } } }
}
$FOTOS = Join-Path $proto 'assets\people\instrutores'
function Foto($p) {
  $arq = (Slug $p.nome) + '.jpg'; $dest = Join-Path $FOTOS $arq
  if (Test-Path $dest) { return $arq }
  $tmp = [IO.Path]::GetTempFileName()
  Invoke-WebRequest $p.foto -OutFile $tmp -UseBasicParsing
  $st = [IO.File]::OpenRead($tmp); $src = ([Windows.Media.Imaging.BitmapDecoder]::Create($st, 'PreservePixelFormat', 'OnLoad')).Frames[0]; $st.Close()
  $w = $src.PixelWidth; $h = $src.PixelHeight; $s = [Math]::Min($w, $h)
  $crop = New-Object Windows.Media.Imaging.CroppedBitmap($src, (New-Object Windows.Int32Rect([int](($w - $s) / 2), 0, $s, $s)))
  $sc = [Math]::Min(1.0, 400.0 / $s); $tb = New-Object Windows.Media.Imaging.TransformedBitmap($crop, (New-Object Windows.Media.ScaleTransform($sc, $sc)))
  $conv = New-Object Windows.Media.Imaging.FormatConvertedBitmap($tb, [Windows.Media.PixelFormats]::Bgr24, $null, 0)
  $enc = New-Object Windows.Media.Imaging.JpegBitmapEncoder; $enc.QualityLevel = 88; $enc.Frames.Add([Windows.Media.Imaging.BitmapFrame]::Create($conv))
  $fs = [IO.File]::Create($dest); $enc.Save($fs); $fs.Close(); Remove-Item $tmp
  "  foto nova: $arq ($w x $h)" | Write-Host
  $arq
}
$PM3LOGO = '<img src="assets/logo/pm3-logo-preto.svg" alt="PM3" style="height:15px">'
$CHECK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m3 8.5 3 3 7-7"/></svg>'

$feitas = @()
foreach ($sp in $SP) {
  if ($PULAR -contains $sp.nome) { continue }
  $chave = Norm $(if ($ALIAS.ContainsKey($sp.nome)) { $ALIAS[$sp.nome] } else { $sp.nome })
  $d = $SITE[$chave]; if (-not $d) { throw "sem dados do site atual: $($sp.nome)" }
  $arqHtml = "sprint-$($sp.capa).html"
  $nome = $sp.nome; $h = [int]$d.horas; if (-not $h) { $h = $sp.h }
  $mods = @($d.modulos); $nm = $mods.Count
  $areaNome = $(if ($sp.area -eq 'ia') { 'AI Skills' } else { $AREAS[$sp.area] });  # cursos de IA = linha AI Skills $areaLow = $areaNome.Substring(0,1) + $areaNome.Substring(1)
  $lead = Curto ([string]$d.descricao)
  $obj = $sp.obj

  # 1 · hero e cabeçalho
  $t = $modelo
  $t = Troca $t 'Fundamentos de Gestão de Produtos: curso rápido | PM3' ((Esc $nome) + ": curso rápido | PM3")
  $t = [regex]::Replace($t, '<meta name="description" content="[^"]*">', { '<meta name="description" content="' + (Esc "Curso rápido ${nome}: $nm módulos. $obj Incluso no Membership PM3.") + '">' })
  $t = $t.Replace('https://pm3.com.br/sprints/gestao-produtos/curso-fundamentos-gestao-produtos/', $d.url)
  $t = Troca $t '<meta property="og:title" content="Curso rápido Fundamentos de Gestão de Produtos | PM3">' ('<meta property="og:title" content="Curso rápido ' + (Esc $nome) + ' | PM3">')
  $t = [regex]::Replace($t, '<meta property="og:description" content="[^"]*">', { '<meta property="og:description" content="' + (Esc $obj) + '">' })
  $t = Troca $t 'og/sprint-fundamentos-gestao-produtos.jpg' "og/sprint-$($sp.capa).jpg"
  $t = Troca $t '<body data-page="sprint-fundamentos-gestao-produtos">' "<body data-page=`"sprint-$($sp.capa)`">"
  $t = [regex]::Replace($t, '<!--\s*MODELO DE PÁGINA DE CURSO.*?-->', "<!--`n  PÁGINA DA SPRINT $($nome.ToUpper()), gerada por tools/gerar-sprints.ps1 a partir de sprint-fundamentos-gestao-produtos.html (mesmo modelo).`n  Conteúdo: página atual $($d.url) (módulos, tópicos, cases e instrutores), extraído em tools/sprints-wp.json.`n  Para mudar, edite os dados ou o script e rode de novo; não edite este HTML à mão.`n-->", 'Singleline')
  $t = Troca $t "assets/capas/sprints/fundamentos-gestao-produtos.jpg')" "assets/capas/sprints/$($sp.capa).jpg')"
  $notaCrumb = 'O curso rápido mostra a vertical no caminho (Cursos rápidos › ' + $areaNome + '). URL atual mantida: ' + ($d.url -replace 'https://pm3.com.br','') + '.' + $(if ($d.selo -eq 'Gratuito') { ' No site atual este curso rápido é gratuito; no protótipo ele segue o modelo dos demais (incluso no Membership). Decidir se continua gratuito.' } else { '' })
  $t = [regex]::Replace($t, '<ol class="crumbs".*?</ol>', { '<ol class="crumbs" aria-label="Você está em" data-nota="' + (Esc $notaCrumb) + '"><li><a href="home.html">Home</a></li><li><a href="sprints.html">Cursos rápidos</a></li><li><a href="sprints.html#' + $sp.area + '">' + (Esc $areaNome) + '</a></li><li aria-current="page">' + (Esc $nome) + '</li></ol>' }, 'Singleline')
  $t = Troca $t '<div class="c-tags"><span class="tag tag-dark">Curso rápido</span><span class="tag tag-dark">Gestão de produtos</span><span class="tag tag-yellow">Para iniciantes</span></div>' ('<div class="c-tags"><span class="tag tag-dark">Curso rápido</span><span class="tag tag-dark">' + (Esc $areaNome) + '</span><span class="tag tag-yellow">Conclua em menos de 1 semana</span></div>')
  # palavra muito longa (ex.: Experimentação) não cabe no celular: reduz a fonte do título pela variável --s do course.css
  $maior = ($nome -split ' ' | Measure-Object Length -Maximum).Maximum
  $escala = if ($maior -gt 12) { ' style="--s:' + ([Math]::Round(12 / $maior, 2)).ToString([Globalization.CultureInfo]::InvariantCulture) + '"' } else { '' }
  $t = Troca $t '<h1 class="display h-sprint" id="h1">Fundamentos<br>de Gestão<br>de Produtos</h1>' ('<h1 class="display h-sprint" id="h1"' + $escala + '>' + (Linhas $nome) + '</h1>')
  # [^>]* porque o h1 pode levar style="--s:…" (nomes com palavra longa); sem isso o lead do modelo ficava nessas sprints
  $antes = $t
  $t = [regex]::Replace($t, '(<h1 class="display h-sprint" id="h1"[^>]*>.*?</h1>\s*<p class="lead">)[^<]*(</p>)', { param($m) $m.Groups[1].Value + (Esc $lead) + $m.Groups[2].Value }, 'Singleline')
  if ($t -eq $antes -and $lead -notmatch '^Em 4 módulos') { throw "lead do hero não foi trocado: $nome" }
  $facts = "<div><b>$nm</b><span>módulo$(if ($nm -ne 1) { 's' })</span></div>`n          <div><b>100%</b><span>online</span></div>`n          <div><b>1</b><span>certificado</span></div>"
  $t = Troca $t "<div><b>4</b><span>módulos</span></div>`n          <div><b>100%</b><span>online</span></div>`n          <div><b>1</b><span>certificado</span></div>" $facts

  # 3 · ementa
  $cases = @($d.cases | ForEach-Object { CaseNome $_ } | Select-Object -Unique)
  $casesHtml = ''
  if ($cases.Count) {
    $txt = if ($cases.Count -eq 1) { "Você vai aprender com o case aplicado de $($cases[0])." } else { 'Você vai aprender com cases aplicados de ' + (($cases[0..($cases.Count - 2)]) -join ', ') + ' e ' + $cases[-1] + '.' }
    # mesmo padrão da formação: faixa de cases embaixo da ementa, na largura toda; a grade tem uma coluna por logo (nunca sobra célula vazia)
    $clsN = if ($cases.Count -eq 1) { ' em-cases-1' } else { '' }
    $casesHtml = @"
  <div class="wrap">
    <div class="em-cases-band$clsN reveal" data-nota="Cases usados nas aulas do curso, os mesmos que a página atual mostra em 'Com cases de empresas'. Logos em tools/logos-cases.json; os brancos do site atual aparecem em preto.">
      <div class="em-cases-lb"><h3>$(if ($cases.Count -eq 1) { 'Case real' } else { 'Cases reais' })</h3><p>$(Esc $txt)</p></div>
      <ul class="em-cases-logos em-cases-txt" style="--n:$($cases.Count)">$(($cases | ForEach-Object { CaseItem $_ }) -join '')</ul>
    </div>
  </div>
"@
  }
  # padrão aprovado de ementa (igual à formação): sanfona com só o primeiro módulo aberto
  $cards = for ($i = 0; $i -lt $nm; $i++) {
    $m = $mods[$i]
    $desc = ([string]$m.descricao) -replace '\s*(Neste|Nesse|No)\s[^.]*?(vai|você vai|vamos)\s+(aprender|ver|abordar)[^.]*:\s*$','' -replace '\s*(Você|Voce) vai aprender:\s*$','' -replace '\s*(Em seguida|Para finalizar)[^.]*:\s*$',''
    $tops = @($m.topicos | Where-Object { $_ })
    $ul = if ($tops.Count) { "`n          <ul>" + (($tops | ForEach-Object { '<li>' + (Esc $_) + '</li>' }) -join '') + '</ul>' } else { '' }
    $ab = $i -eq 0
    "      <div class=`"mod$(if ($ab) { ' open' })`"><button type=`"button`" aria-expanded=`"$(if ($ab) { 'true' } else { 'false' })`"><span class=`"mn`">$('{0:D2}' -f ($i + 1))</span><span class=`"mt`">$(Esc $m.titulo)</span><span class=`"pl`" aria-hidden=`"true`"></span></button>`n        <div class=`"mod-body`"><div><div class=`"in`">$(if ($desc) { '<p>' + (Esc $desc) + '</p>' })$ul</div></div></div></div>"
  }
  $semTop = @($mods | Where-Object { -not @($_.topicos).Count }).Count
  $notaMods = "Curso rápido com $nm módulo$(if ($nm -ne 1) { 's' }), no mesmo padrão de ementa da formação: blocos recolhíveis, só o primeiro aberto. Títulos, descrições e tópicos da página atual do curso." + $(if ($semTop) { " $semTop módulo(s) sem lista de tópicos no site atual: o bloco mostra só a descrição." } else { '' })
  $ementa = @"
<!-- 3 · EMENTA -->
<section class="section white" id="ementa" aria-labelledby="em-t">
  <div class="wrap ementa-grid">
    <div class="ementa-aside">
      <p class="kicker"><span class="n">01</span> Ementa</p>
      <h2 class="h2" id="em-t">O que<br>você vai<br><span class="c2">aprender</span></h2>
      <p class="lead" style="margin-top:20px">Confira tudo que você vai dominar neste curso.</p>
      <div class="ementa-tot"><div><b>$nm</b><span>módulo$(if ($nm -ne 1) { 's' })</span></div><div><b>100%</b><span>online</span></div><div><b>1</b><span>certificado</span></div></div>
      <div class="em-dl"><div class="row"><span class="pdf" aria-hidden="true">PDF</span><div><b>Quer ver mais?</b><div class="meta">Baixe a ementa completa. Preencha o formulário e faça o download da ementa do curso rápido.</div></div></div><a class="btn btn-light btn-em" href="#baixar-ementa" data-ementa="lateral-ementa"><svg class="ic-doc" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 2h7l4 4v12H5z"/><path d="M12 2v4h4M10.5 9v5M8.2 12l2.3 2.3 2.3-2.3"/></svg> Baixar ementa</a></div>
    </div>
    <div class="mods" id="mods" data-nota="$(Esc $notaMods)">
$($cards -join "`n")
    </div>
  </div>
$casesHtml</section>


"@
  $t = Entre $t '<!-- 3 · EMENTA -->' '<!-- 4 · COMO ACESSAR' $ementa

  # 5 · instrutores
  $pessoas = foreach ($p in @($d.instrutores | Where-Object { $_.nome })) {
    $k = Norm $p.nome
    if ($DADOS.ContainsKey($k)) { $x = $DADOS[$k]; [pscustomobject]@{ n = $x.n; c = $x.c; e = $x.e; f = $x.f } }
    else { [pscustomobject]@{ n = $p.nome; c = ($p.cargo -replace '\s+no Itaú$',''); e = $(if ($p.empresa) { $p.empresa } elseif ($p.cargo -match ' no (Itaú)$') { 'Itaú' } else { '' }); f = (Foto $p) } }
  }
  $pessoas = @($pessoas)
  $temInstr = $pessoas.Count -gt 0
  if ($temInstr) {
    $figs = foreach ($p in $pessoas) {
      $co = if ($p.e -eq 'PM3' -or $p.e -eq 'na PM3') { '<span class="co co-logo">' + $PM3LOGO + '</span>' } elseif ($p.e) { '<span class="co">' + (Esc $p.e) + '</span>' } else { '' }
      '      <figure class="prof"><div class="ph"><img src="assets/people/instrutores/' + $p.f + '" alt="Foto de ' + (Esc $p.n) + '" loading="lazy" width="480" height="600">' + $co + '</div><figcaption><b>' + (Esc $p.n) + '</b><span>' + (Esc $p.c) + '</span></figcaption></figure>'
    }
    $emps = @($pessoas | Where-Object { $_.e -and $_.e -notmatch '^(na )?PM3$|Autônomo' } | ForEach-Object { $_.e } | Select-Object -Unique)
    $leadI = if ($pessoas.Count -eq 1) { $p1 = $pessoas[0]; 'Aulas com ' + $p1.n + ', ' + $p1.c + $(if ($p1.e -and $p1.e -notmatch '^(na )?PM3$|Autônomo') { ' na ' + $p1.e } elseif ($p1.e -match 'PM3') { ' na PM3' } else { '' }) + ', que leva para a aula a prática do dia a dia.' }
             elseif ($emps.Count) { "$($pessoas.Count) instrutores com experiência em " + $(if ($emps.Count -eq 1) { $emps[0] } else { (($emps[0..([Math]::Min(3, $emps.Count) - 2)]) -join ', ') + ' e ' + $emps[[Math]::Min(3, $emps.Count) - 1] }) + ', que levam para a aula a prática do dia a dia.' }
             else { "$($pessoas.Count) instrutores que levam para a aula a prática do dia a dia." }
    $titI = if ($pessoas.Count -eq 1) { 'Aula com quem<br><span class="c2">faz no dia a dia</span>' } else { 'Aulas com grandes nomes<br><span class="c2">do mercado</span>' }
    $instr = @"
<!-- 5 · INSTRUTORES (componente instrutores.css + instrutores.js, o mesmo do Membership) -->
<section class="section black on-dark" id="instrutores" aria-labelledby="in-t">
  <div class="wrap">
    <div class="sec-head">
      <div><p class="kicker"><span class="n">03</span> Quem ensina</p><h2 class="h2" id="in-t">$titI</h2></div>
      <p class="lead">$(Esc $leadI)</p>
    </div>
    <div class="prof-grid" role="region" aria-label="Instrutores do curso rápido" tabindex="0" data-nota="Instrutores listados hoje na página do curso no site da PM3. Quem já está no protótipo usa o cadastro de instrutores-dados.js; os demais, cargo, empresa e foto da página atual.">
$($figs -join "`n")
    </div>
    <div class="prof-nav"><div class="prof-btns"><button type="button" data-pf="ant" aria-label="Instrutores anteriores"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 8H3M7 4 3 8l4 4"/></svg></button><button type="button" data-pf="prox" aria-label="Próximos instrutores"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 8h11M9 4l4 4-4 4"/></svg></button></div></div>
  </div>
</section>
"@
  } else { $instr = '' }
  $t = Entre $t '<!-- 5 · INSTRUTORES' '<!-- 6 · CERTIFICADO' $instr
  if (-not $temInstr) {
    $t = Troca $t '<a href="#instrutores">Instrutores</a>' ''
    $t = Troca $t '<p class="kicker"><span class="n">04</span> Certificado</p>' '<p class="kicker"><span class="n">03</span> Certificado</p>'
    $t = Troca $t '<p class="kicker"><span class="n">05</span> Dúvidas</p>' '<p class="kicker"><span class="n">04</span> Dúvidas</p>'
    $t = $t.Replace('<script src="assets/js/instrutores.js?v=6"></script>' + "`n", '')
  }

  # 6 · certificado (mockup ainda é o de Fundamentos)
  $t = Troca $t 'Ao concluir o curso, você recebe o certificado PM3 de Fundamentos de Gestão de Produtos, com o nome do curso, pronto para o LinkedIn e o currículo.' ("Ao concluir o curso, você recebe o certificado PM3 de " + (Esc $nome) + ', com o nome do curso, pronto para o LinkedIn e o currículo.')
  $t = Troca $t 'data-nota="Mockup do certificado deste curso. Para outro curso' 'data-nota="PROVISÓRIO: o mockup ainda é o do curso rápido Fundamentos de Gestão de Produtos; gerar o deste curso. Para outro curso'

  # 7 · FAQ
  $faq = [System.Collections.ArrayList]@()
  [void]$faq.Add(@('As aulas são ao vivo ou gravadas?', 'Os cursos rápidos são 100% online, com aulas gravadas: você estuda onde, quando e no ritmo que quiser. Na Comunidade PM3, há encontros ao vivo para tirar dúvidas e trocar experiências com referências do mercado.'))
  [void]$faq.Add(@('Quanto tempo leva?', "São $nm módulo$(if ($nm -ne 1) { 's' }) para fazer no seu ritmo: dá para concluir em menos de uma semana."))
  [void]$faq.Add(@('Recebo certificado?', 'Sim. Ao concluir o curso, você recebe o certificado da PM3, pronto para adicionar ao LinkedIn.'))
  [void]$faq.Add(@('Como acesso este curso rápido?', 'Ele está incluso no Membership PM3 (12x R$ 299,92), com todos os cursos rápidos e as 10 formações por 12 meses, e na assinatura PM3 Cursos Rápidos (12x R$ 166,50), só com os cursos rápidos.'))
  $cod = $COMP[(Norm $(if ($ALIAS.ContainsKey($sp.nome)) { $ALIAS[$sp.nome] } else { $sp.nome }))]
  if ($cod) { $f = $FORM[$cod]; [void]$faq.Add(@('Quero me aprofundar no tema. Qual formação faço depois?', "A Formação $($f[0]) aprofunda o assunto deste curso. No Membership, as duas estão no mesmo acesso de 12 meses.")) }
  [void]$faq.Add(@('E se eu não gostar?', 'Você tem 7 dias de garantia: se não gostar, pede o reembolso pelo e-mail contato@pm3.com.br.'))
  $det = for ($i = 0; $i -lt $faq.Count; $i++) { '      <details' + $(if ($i -eq 0) { ' open' }) + '><summary>' + (Esc $faq[$i][0]) + '<i aria-hidden="true"></i></summary><p>' + (Esc $faq[$i][1]) + '</p></details>' }
  $t = [regex]::Replace($t, '(<div class="faq")>.*?(\s*</div>\s*</div>\s*</section>\s*</main>)', { param($m) $m.Groups[1].Value + ' data-nota="Respostas adaptadas da FAQ atual dos cursos rápidos (ao vivo ou gravadas, certificado, garantia). A formação indicada vem da coluna Complementa do catálogo de cursos rápidos.">' + "`n" + ($det -join "`n") + $m.Groups[2].Value }, 'Singleline')

  # JSON-LD
  $ld = @"
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
 {"@type":"BreadcrumbList","itemListElement":[
  {"@type":"ListItem","position":1,"name":"Home","item":"https://pm3.com.br/"},
  {"@type":"ListItem","position":2,"name":"Cursos rápidos","item":"https://pm3.com.br/sprints/"},
  {"@type":"ListItem","position":3,"name":"$(JsEsc $nome)","item":"$($d.url)"}]},
 {"@type":"Course","name":"$(JsEsc $nome)",
  "description":"$(JsEsc $obj)",
  "provider":{"@type":"EducationalOrganization","name":"PM3","sameAs":"https://pm3.com.br/"},
  "inLanguage":"pt-BR","timeRequired":"PT${h}H",
  "hasCourseInstance":{"@type":"CourseInstance","courseMode":"online","courseWorkload":"PT${h}H"},
  "offers":[{"@type":"Offer","category":"Subscription","price":"3599.00","priceCurrency":"BRL","description":"Incluso no Membership PM3 (12 meses)","url":"https://pm3.com.br/membership/"}]},
 {"@type":"FAQPage","mainEntity":[
$((($faq | ForEach-Object { '  {"@type":"Question","name":"' + (JsEsc $_[0]) + '","acceptedAnswer":{"@type":"Answer","text":"' + (JsEsc $_[1]) + '"}}' })) -join ",`n")]}
]}
</script>
"@
  $t = [regex]::Replace($t, '<script type="application/ld\+json">.*?</script>', { $ld }, 'Singleline')

  # e-book da ementa
  $t = [regex]::Replace($t, '<script>window\.EMENTA=.*?</script>', { '<script>window.EMENTA={curso:"' + (JsEsc $nome) + '",tracking:"ementa sprint ' + $sp.capa + '",stats:"' + $nm + ' módulo' + $(if ($nm -ne 1) { 's' }) + '.",capa:"assets/capas/sprints/' + $sp.capa + '.jpg"};</script>' })

  if ($t -match 'Fundamentos de Gestão de Produtos' -and $t -notmatch 'PROVISÓRIO') { Write-Warning "$arqHtml cita Fundamentos" }
  [IO.File]::WriteAllText((Join-Path $proto $arqHtml), $t, $utf8)
  $feitas += [pscustomobject]@{ arq = $arqHtml; nome = $nome; h = $h; mod = $nm; instr = $pessoas.Count; cases = $cases.Count }
}
$feitas | Format-Table -AutoSize | Out-String -Width 200
"páginas: $($feitas.Count)"

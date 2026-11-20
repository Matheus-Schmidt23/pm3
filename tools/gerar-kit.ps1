# Gera ferramentas.html (Kit de ferramentas para Product Managers).
# Conteúdo: página atual pm3.com.br/ferramentas-para-product-managers-pm3/ (20 categorias, 202 links), extraído em tools/kit-ferramentas.json.
# Ícones: favicon de cada site, baixado para assets/img/kit/<host>.png|.ico (Google s2 e, na falta, DuckDuckGo). Sem ícone: símbolo genérico.
# Rodar na pasta prototipo:  & ".\tools\gerar-kit.ps1"
$ErrorActionPreference = 'Stop'
$proto = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding($false)
function Esc([string]$s) { if ($null -eq $s) { return '' }; $s.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;').Replace('"','&quot;') }
function Slug([string]$s) { ((($s.Normalize([Text.NormalizationForm]::FormD) -replace '\p{Mn}','').ToLower()) -replace '[^a-z0-9]+','-').Trim('-') }

$cats = Get-Content (Join-Path $PSScriptRoot 'kit-ferramentas.json') -Raw -Encoding UTF8 | ConvertFrom-Json
# correções de link do site atual (o resto do conteúdo é mantido como está)
$FIXURL = @{ 'Appcues|https://www.zoho.com/pt-br/sites/' = 'https://www.appcues.com/' }
$ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5"/></svg>'
$GEN = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.6 2.6a3.2 3.2 0 0 0-3.9 4.3L2.3 10.3a1.3 1.3 0 0 0 1.8 1.8l3.4-3.4a3.2 3.2 0 0 0 4.3-3.9l-1.9 1.9-1.6-.4-.4-1.6z"/></svg>'

$total = 0; $chips = @(); $cards = @()
foreach ($c in $cats) {
  $id = Slug $c.t; $n = @($c.itens).Count; $total += $n
  $chips += '<button type="button" data-f="' + $id + '">' + (Esc $c.t) + ' <small>' + $n + '</small></button>'
  $lis = foreach ($it in $c.itens) {
    $nome = [string]$it.n; $br = $nome -match '🇧🇷'; $nome = ($nome -replace '🇧🇷','').Trim()
    $url = [string]$it.u; $k = "$nome|$url"; if ($FIXURL.ContainsKey($k)) { $url = $FIXURL[$k] }
    $hostN = ([uri]$url).Host -replace '^www\.',''
    $ic = $null; foreach ($ext in '.png','.ico') { if (Test-Path (Join-Path $proto "assets\img\kit\$hostN$ext")) { $ic = "assets/img/kit/$hostN$ext"; break } }
    $icHtml = if ($ic) { '<img src="' + $ic + '" alt="" width="20" height="20" loading="lazy">' } else { $GEN }
    '          <li><a href="' + (Esc $url) + '" target="_blank" rel="noopener"><span class="k-ic">' + $icHtml + '</span><span class="nm">' + (Esc $nome) + $(if ($br) { ' <em>Brasil</em>' }) + '</span>' + $ARROW + '</a></li>'
  }
  $cards += @"
      <article class="kit-cat reveal" data-c="$id" id="$id">
        <header><h3>$(Esc $c.t)</h3><span>$n ferramenta$(if ($n -ne 1) { 's' })</span></header>
        <ul>
$($lis -join "`n")
        </ul>
      </article>
"@
}
$ncats = @($cats).Count

$html = @"
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kit de ferramentas para Product Managers: $total ferramentas em $ncats categorias | PM3</title>
<meta name="description" content="Curadoria da PM3 com $total ferramentas gringas e brasileiras usadas por Product Managers no dia a dia: dados de produto, roadmaps, protótipos, testes A/B, onboarding, pesquisa e mais.">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="https://pm3.com.br/ferramentas-para-product-managers-pm3/">
<meta property="og:title" content="Kit de ferramentas para Product Managers | PM3">
<meta property="og:description" content="$total ferramentas usadas por Product Managers, organizadas em $ncats categorias.">
<link rel="icon" type="image/svg+xml" href="assets/logo/pm3-simbolo-roxo.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=Rubik:wght@400;500&family=Playfair+Display:ital,wght@1,500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/tokens.css?v=2">
<link rel="stylesheet" href="assets/css/base.css?v=32">
<link rel="stylesheet" href="assets/css/components.css?v=10">
<link rel="stylesheet" href="assets/css/institucional.css?v=7">
<link rel="stylesheet" href="assets/css/kit.css?v=2">
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
 {"@type":"BreadcrumbList","itemListElement":[
  {"@type":"ListItem","position":1,"name":"Home","item":"https://pm3.com.br/"},
  {"@type":"ListItem","position":2,"name":"Kit de ferramentas para Product Managers","item":"https://pm3.com.br/ferramentas-para-product-managers-pm3/"}]},
 {"@type":"CollectionPage","name":"Kit de ferramentas para Product Managers","description":"Curadoria da PM3 com $total ferramentas usadas por Product Managers, em $ncats categorias.","publisher":{"@type":"EducationalOrganization","name":"PM3","sameAs":"https://pm3.com.br/"}}
]}
</script>
</head>
<body data-page="ferramentas">
<!--
  KIT DE FERRAMENTAS PARA PRODUCT MANAGERS, gerada por tools/gerar-kit.ps1 a partir de tools/kit-ferramentas.json (conteúdo da página atual).
  Para mudar a lista, edite o JSON e rode o script de novo; não edite este HTML à mão.
-->
<main>

<!-- 1 · HERO -->
<section class="i-hero on-dark" aria-labelledby="h1">
  <div class="i-hero-in grain">
    <div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>
    <div data-nota="Mesmo conteúdo da página atual (/ferramentas-para-product-managers-pm3/, URL mantida), no visual do site novo: busca, filtro por categoria e o ícone de cada ferramenta.">
      <ol class="crumbs" aria-label="Você está em"><li><a href="home.html">Home</a></li><li aria-current="page">Kit de ferramentas</li></ol>
      <h1 class="display" id="h1">Kit de<br>ferramentas<br><span class="l2">para PMs</span></h1>
      <p class="lead">Nós da PM3 fizemos uma curadoria de ferramentas gringas e brasileiras, usadas por Product Managers no dia a dia, para te ajudar a elevar a barra em produto.</p>
    </div>
    <div class="kit-stats" aria-label="Em resumo">
      <div><b>$total</b><span>ferramentas</span></div>
      <div><b>$ncats</b><span>categorias</span></div>
      <div><b>Gringas</b><span>e brasileiras</span></div>
      <a class="btn btn-light" href="#lista">Ver as ferramentas <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M8 2v11M4 9l4 4 4-4"/></svg></a>
    </div>
  </div>
</section>

<!-- 2 · FERRAMENTAS -->
<section class="section black on-dark cat-dark kit-sec" id="lista" aria-labelledby="kt-t">
  <div class="wrap">
    <div class="sec-head">
      <div><p class="kicker"><span class="n">01</span> Navegue por categoria</p><h2 class="h2" id="kt-t">Ferramentas para<br><span class="c2">cada etapa do produto</span></h2></div>
      <p class="lead">Filtre por categoria ou procure pelo nome. Os links abrem o site de cada ferramenta.</p>
    </div>
    <div class="kit-bar">
      <label class="kit-busca"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="7" cy="7" r="4.6"/><path d="m10.5 10.5 3.5 3.5"/></svg><span class="sr-only">Buscar ferramenta</span><input type="search" id="kit-q" placeholder="Buscar ferramenta (ex.: Figma, Amplitude, Jira)" autocomplete="off"></label>
      <div class="fx-chips" id="kit-chips" role="group" aria-label="Filtrar por categoria"><button type="button" class="on" data-f="">Todas <small>$total</small></button>$($chips -join '')</div>
    </div>
    <div class="kit-grid" id="kit-grid" data-nota="Lista igual à da página atual, para revisão do time: algumas ferramentas mudaram de nome ou foram descontinuadas (Google Optimize, Chartio, Automate.io, BlueJeans, InVision e Adobe XD; Integromat virou Make, UserLeap virou Sprig, Data Studio virou Looker Studio, Autopilot virou Ortto). Único ajuste: o link do Appcues em Onboarding apontava para o Zoho Sites.">
$($cards -join "`n")
    </div>
    <p class="kit-vazio" id="kit-vazio" hidden>Nenhuma ferramenta com esse nome. Que tal sugerir para a gente?</p>
  </div>
</section>

<!-- 3 · SUGESTÃO -->
<section class="section black on-dark kit-cta-sec" aria-labelledby="sg-t">
  <div class="wrap">
    <div class="kit-cta reveal">
      <div><p class="kicker"><span class="n">02</span> Sugestões</p><h2 class="h2" id="sg-t">Sentiu falta de<br><span class="c2">alguma ferramenta?</span></h2></div>
      <div><p class="lead">Manda pra gente que publicamos aqui!</p><a class="btn btn-light" href="https://forms.gle/rN2kSTRiMU57LTv58" target="_blank" rel="noopener">Enviar sugestão de ferramenta <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg></a></div>
    </div>
  </div>
</section>

</main>

<script src="assets/js/layout.js?v=66"></script>
<script>
/* filtro por categoria + busca por nome */
(function(){
  const chips = document.getElementById('kit-chips'), q = document.getElementById('kit-q'), vazio = document.getElementById('kit-vazio');
  const cats = [...document.querySelectorAll('.kit-cat')];
  const norm = s => s.normalize('NFD').replace(/\p{Mn}/gu,'').toLowerCase();
  let area = '';
  const aplica = () => {
    const t = norm(q.value.trim()); let algum = false;
    cats.forEach(c => {
      let n = 0;
      c.querySelectorAll('li').forEach(li => { const ok = !t || norm(li.textContent).includes(t); li.hidden = !ok; if (ok) n++; });
      const mostra = (!area || c.dataset.c === area) && n > 0; c.hidden = !mostra; if (mostra) { algum = true; c.classList.add('in'); }
    });
    vazio.hidden = algum;
  };
  chips.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; area = b.dataset.f; chips.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); aplica(); });
  q.addEventListener('input', aplica);
  const h = location.hash.slice(1); const alvo = h && chips.querySelector('button[data-f="' + h + '"]'); if (alvo) alvo.click();
})();
</script>
</body>
</html>
"@
[IO.File]::WriteAllText((Join-Path $proto 'ferramentas.html'), $html, $utf8)
"ferramentas.html: $ncats categorias, $total ferramentas"

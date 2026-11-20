# Extrai o conteúdo das 48 sprints do site atual (pm3.com.br) para tools/sprints-wp.json.
# Fontes: API do WordPress (/wp-json/wp/v2/sprints: título, vertical, horas, selo, capa, URL) e o HTML de cada página
# (módulos com descrição e tópicos, cases, instrutores, FAQ). Os módulos não vêm pela API (o CPT "modulos" só tem título).
# Uso: & ".\tools\extrair-sprints.ps1" [-Cache <pasta com as páginas já baixadas, <id>.html>]
param([string]$Cache = '')
$ErrorActionPreference = 'Stop'
$proto = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding($false)
function Dec([string]$s) { ([System.Net.WebUtility]::HtmlDecode(($s -replace '<br\s*/?>',' ' -replace '<[^>]+>',''))) -replace '\s+',' ' -replace '^\s+|\s+$','' }
function Full([string]$u) { if (-not $u) { return '' }; $u -replace '-\d+x\d+(\.[a-z]+)$','$1' }

$api = @(); for ($p = 1; $p -le 5; $p++) { try { $j = (Invoke-WebRequest "https://pm3.com.br/wp-json/wp/v2/sprints?per_page=100&page=$p" -UseBasicParsing).Content | ConvertFrom-Json; if (-not $j) { break }; $api += $j } catch { break } }
$vert = @{}; try { ((Invoke-WebRequest 'https://pm3.com.br/wp-json/wp/v2/vertical?per_page=100' -UseBasicParsing).Content | ConvertFrom-Json) | ForEach-Object { $vert[[string]$_.id] = (Dec $_.name) } } catch {}

$saida = foreach ($s in ($api | Sort-Object { $_.link })) {
  $h = $null
  if ($Cache -and (Test-Path (Join-Path $Cache "$($s.id).html"))) { $h = [IO.File]::ReadAllText((Join-Path $Cache "$($s.id).html"), $utf8) }
  else { $h = (Invoke-WebRequest $s.link -UseBasicParsing -TimeoutSec 40).Content }

  $h1 = Dec ([regex]::Match($h, '<h1 class="HeroCourse-title">(.*?)</h1>', 'Singleline').Groups[1].Value)
  $desc = Dec ([regex]::Match($h, '<div class="HeroCourse-description">(.*?)</div>', 'Singleline').Groups[1].Value)
  $casesBloco = [regex]::Match($h, '<div class="HeroCourse-cases-logos">(.*?)</div>', 'Singleline').Groups[1].Value
  $cases = @([regex]::Matches($casesBloco, '<img[^>]*?src="([^"]+)"') | ForEach-Object { Full $_.Groups[1].Value })

  $mods = @()
  $partes = $h -split 'ModuleAccordionsV3-title--module">'
  for ($i = 1; $i -lt $partes.Count; $i++) {
    $b = $partes[$i]; $fim = $b.IndexOf('ModuleAccordionsV3-bar'); if ($fim -gt 0) { $b = $b.Substring(0, $fim) }
    $tit = Dec ($b.Substring(0, $b.IndexOf('</span>')))
    $wrap = [regex]::Match($b, 'ModuleAccordionsV3-description-wrapper">(.*)', 'Singleline').Groups[1].Value
    $ps = @([regex]::Matches($wrap, '<p[^>]*>(.*?)</p>', 'Singleline') | ForEach-Object { Dec $_.Groups[1].Value } | Where-Object { $_ })
    $lis = @([regex]::Matches($wrap, '<li[^>]*>(.*?)</li>', 'Singleline') | ForEach-Object { Dec $_.Groups[1].Value } | Where-Object { $_ })
    $mods += [ordered]@{ titulo = ($tit -replace '^\d+\s*[–-]\s*',''); descricao = ($ps -join ' '); topicos = $lis }
  }

  $instr = @()
  foreach ($m in [regex]::Matches($h, '<div class="InstructorsV3-card[ "][^>]*>(.*?)<div class="InstructorsV3-card-info">(.*?)</div>', 'Singleline')) {
    $img = Full ([regex]::Match($m.Groups[1].Value, '<img[^>]*?src="([^"]+)"').Groups[1].Value)
    $li = [regex]::Match($m.Groups[1].Value, 'href="(https?://[^"]*linkedin[^"]*)"').Groups[1].Value
    $info = @([regex]::Matches($m.Groups[2].Value, '<p[^>]*>(.*?)</p>', 'Singleline') | ForEach-Object { Dec $_.Groups[1].Value })
    $instr += [ordered]@{ nome = $info[0]; cargo = $(if ($info.Count -gt 1) { $info[1] } else { '' }); empresa = $(if ($info.Count -gt 2) { $info[2] } else { '' }); foto = $img; linkedin = $li }
  }
  if (-not $instr.Count) {
    # sem a seção de instrutores: usa o bloco do topo da página (nome, cargo e foto, sem empresa)
    foreach ($m in [regex]::Matches($h, '<div class="InstructorsAccordion-item[^"]*">\s*<img[^>]*?src="([^"]+)".*?InstructorsAccordion-name">\s*(?:<span[^>]*>[^<]*</span>)?\s*([^<]+)</p>\s*<p class="InstructorsAccordion-office">\s*(?:<span[^>]*>[^<]*</span>)?\s*([^<]*)</p>', 'Singleline')) {
      $instr += [ordered]@{ nome = (Dec $m.Groups[2].Value); cargo = (Dec $m.Groups[3].Value); empresa = ''; foto = (Full $m.Groups[1].Value); linkedin = '' }
    }
  }
  $faq = @([regex]::Matches($h, 'AccordionV3-trigger[^>]*>\s*<span[^>]*>(.*?)</span>', 'Singleline') | ForEach-Object { Dec $_.Groups[1].Value })

  [ordered]@{
    id = $s.id; titulo = (Dec $s.title.rendered); h1 = $h1; url = $s.link
    vertical = $(if ($s.vertical) { ($s.vertical | ForEach-Object { $vert[[string]$_] }) -join ', ' } else { '' })
    horas = $s.pm3_duration_of_course; selo = $s.pm3_tag_name; capa = $s.post_thumbnail.post_thumbnail_url
    descricao = $desc; cases = $cases; modulos = $mods; instrutores = $instr; faq = $faq
  }
}
# Cursos de IA (AI Skills) que o protótipo trata como sprints: ficam no CPT "cursos", com outro template de página.
$EXTRA = @(
  @{ url = 'https://pm3.com.br/rag-para-produtos-de-ai/'; vertical = 'IA' },
  @{ url = 'https://pm3.com.br/responsible-ai/'; vertical = 'IA' }
)
$extras = foreach ($e in $EXTRA) {
  $slug = ($e.url -split '/')[-2]
  if ($Cache -and (Test-Path (Join-Path $Cache "$slug.html"))) { $h = [IO.File]::ReadAllText((Join-Path $Cache "$slug.html"), $utf8) }
  else { $h = [Text.Encoding]::UTF8.GetString((Invoke-WebRequest $e.url -UseBasicParsing).RawContentStream.ToArray()) }
  $hero = [regex]::Match($h, '<h1[^>]*>(.*?)</h1>(.*?)<a ', 'Singleline')
  $heroPs = @([regex]::Matches($hero.Groups[2].Value, '<p[^>]*>(.*?)</p>', 'Singleline') | ForEach-Object { Dec $_.Groups[1].Value } | Where-Object { $_ })
  $mods = foreach ($m in [regex]::Matches($h, '<details class="modulo-item[^"]*"[^>]*>.*?<span class="modulo-title">(.*?)</span>.*?<div class="modulo-body">(.*?)</div>\s*</details>', 'Singleline')) {
    $ps = @([regex]::Matches($m.Groups[2].Value, '<p[^>]*>(.*?)</p>', 'Singleline') | ForEach-Object { Dec $_.Groups[1].Value } | Where-Object { $_ })
    [ordered]@{ titulo = (Dec $m.Groups[1].Value); descricao = ($ps -join ' '); topicos = @([regex]::Matches($m.Groups[2].Value, '<li[^>]*>(.*?)</li>', 'Singleline') | ForEach-Object { Dec $_.Groups[1].Value }) }
  }
  $instr = foreach ($m in [regex]::Matches($h, '<div class="instrutora?-card">(.*?)</section>', 'Singleline')) {
    $b = $m.Groups[1].Value; $img = [regex]::Match($b, '<img[^>]*?src="([^"]+)"').Groups[1].Value; if ($img -like '/*') { $img = 'https://descubra.pm3.com.br' + $img }  # as páginas AI Skills servem as imagens do descubra.pm3.com.br
    [ordered]@{ nome = (Dec ([regex]::Match($b, 'instrutora?-name">(.*?)<', 'Singleline').Groups[1].Value)); cargo = (Dec ([regex]::Match($b, 'instrutora?-role">(.*?)</p>', 'Singleline').Groups[1].Value)); empresa = ''; foto = $img; linkedin = [regex]::Match($b, 'href="(https?://[^"]*linkedin[^"]*)"').Groups[1].Value; bio = (Dec ([regex]::Match($b, 'instrutora?-bio">(.*?)</p>', 'Singleline').Groups[1].Value)) }
  }
  $horas = [regex]::Match((Dec $h), 'Cerca de (\d+)\s*h de (?:dedica|conte)').Groups[1].Value
  [ordered]@{
    id = $slug; titulo = (Dec $hero.Groups[1].Value); h1 = (Dec $hero.Groups[1].Value); url = $e.url; vertical = $e.vertical
    horas = $horas; selo = ''; capa = ''; descricao = ($heroPs -join ' '); cases = @(); modulos = @($mods); instrutores = @($instr)
    faq = @([regex]::Matches($h, '<summary[^>]*>(?:(?!</summary>).)*?</summary>', 'Singleline') | ForEach-Object { Dec $_.Value } | Where-Object { $_ -match '\?$' })
    paraQuem = @([regex]::Matches(([regex]::Match($h, 'id="para-quem"(.*?)</section>', 'Singleline').Groups[1].Value), '<li[^>]*>(.*?)</li>', 'Singleline') | ForEach-Object { Dec $_.Groups[1].Value })
  }
}
$saida = @($saida) + @($extras)
$json = $saida | ConvertTo-Json -Depth 8
[IO.File]::WriteAllText((Join-Path $PSScriptRoot 'sprints-wp.json'), $json, $utf8)
"sprints: $(@($saida).Count) -> tools\sprints-wp.json"

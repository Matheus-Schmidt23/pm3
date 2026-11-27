# PM3 · prova social (carrossel "Quem passa pela PM3 recomenda") nas páginas de curso e na home.
# Uma fonte só: tools/prova-social.html. Os geradores (gerar-formacoes.ps1, gerar-sprints.ps1) chamam Add-ProvaSocial
# logo antes de gravar cada página; para páginas feitas à mão: . .\tools\prova-social.ps1; Add-ProvaSocialArquivo home.html
# O que faz: insere a seção antes da dobra do certificado (section.cx-sec), numera a seção (último kicker + 1),
# renumera os kickers seguintes, põe "Depoimentos" no submenu da página e carrega depoimentos.css/js. Idempotente.

function Add-ProvaSocial([string]$h) {
  if ($h.Contains('id="dpCar"')) { return $h }
  $snip = [IO.File]::ReadAllText((Join-Path $PSScriptRoot 'prova-social.html'), (New-Object Text.UTF8Encoding $false)).TrimEnd()
  $i = $h.IndexOf('<section class="cx-sec')
  if ($i -lt 0) { return $h }
  # entra antes do comentário que abre a dobra do certificado, quando houver
  $pre = $h.LastIndexOf('<!--', $i)
  if ($pre -ge 0 -and $h.Substring($pre, $i - $pre) -match '^<!--[^>]*-->\s*$') { $i = $pre }
  $antes = $h.Substring(0, $i); $depois = $h.Substring($i)
  $ms = [regex]::Matches($antes, '<span class="n">(\d+)</span>')
  $n = if ($ms.Count) { [int]$ms[$ms.Count - 1].Groups[1].Value + 1 } else { 1 }
  $depois = [regex]::Replace($depois, '<span class="n">(\d+)</span>', { param($m) '<span class="n">' + ('{0:D2}' -f ([int]$m.Groups[1].Value + 1)) + '</span>' })
  $h = $antes + $snip.Replace('{{N}}', ('{0:D2}' -f $n)) + "`n`n" + $depois
  $h = $h.Replace('<a href="#certificado">Certificado</a>', '<a href="#depoimentos">Depoimentos</a><a href="#certificado">Certificado</a>')
  if ($h -notmatch 'assets/css/depoimentos\.css') {
    $h = [regex]::Replace($h, '(<link rel="stylesheet" href="assets/css/certificado\.css[^"]*">)', { param($m) $m.Value + "`n" + '<link rel="stylesheet" href="assets/css/depoimentos.css?v=2">' })
  }
  if ($h -notmatch 'assets/js/depoimentos\.js') {
    $k = $h.LastIndexOf('</body>')
    $h = $h.Insert($k, '<script src="assets/js/depoimentos.js?v=1"></script>' + "`n")
  }
  return $h
}

# o inverso: tira a seção e devolve a numeração (gerar-sprints.ps1 parte do modelo Fundamentos, que já tem a seção)
function Remove-ProvaSocial([string]$h) {
  $a = $h.IndexOf('<!-- DEPOIMENTOS: prova social')
  if ($a -lt 0) { return $h }
  $b = $h.IndexOf('</section>', $a) + '</section>'.Length
  while ($b -lt $h.Length -and "`r`n".Contains($h[$b])) { $b++ }
  $depois = [regex]::Replace($h.Substring($b), '<span class="n">(\d+)</span>', { param($m) '<span class="n">' + ('{0:D2}' -f ([int]$m.Groups[1].Value - 1)) + '</span>' })
  $h = $h.Substring(0, $a) + $depois
  return $h.Replace('<a href="#depoimentos">Depoimentos</a>', '')
}

function Add-ProvaSocialArquivo([string]$arq) {
  $p = (Resolve-Path $arq).Path
  $utf8 = New-Object Text.UTF8Encoding $false
  $t = [IO.File]::ReadAllText($p, $utf8)
  $novo = Add-ProvaSocial $t
  if ($novo -ne $t) { [IO.File]::WriteAllText($p, $novo, $utf8); "prova social: $arq" }
}

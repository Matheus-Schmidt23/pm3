# Logos da faixa "Cases reais" (formações e sprints). Mapa em tools/logos-cases.json: nome da empresa → arquivo.
#   f + h: logo (altura em px); dark: logo branco do site atual, mostrado em preto (filtro); sombra: logo branco com fundo próprio
#   ic: ferramenta (ícone + nome em texto)
# Quem não está no mapa aparece em texto (sem logo encontrado: Techfit, Tapps Games, Admissão Digital, Easy Taxi, TV 3.0, DunderOps, SQL).
$script:LOGOS = Get-Content (Join-Path $PSScriptRoot 'logos-cases.json') -Raw -Encoding UTF8 | ConvertFrom-Json
function CaseItem([string]$nome) {
  $e = { param($s) $s.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;').Replace('"','&quot;') }
  $l = $script:LOGOS.PSObject.Properties[$nome]
  if (-not $l) { return '<li class="lg-txt">' + (& $e $nome) + '</li>' }
  $v = $l.Value
  if ($v.ic) { return '<li class="lg-ic"><img src="' + $v.ic + '" alt="" loading="lazy"><span>' + (& $e $nome) + '</span></li>' }
  $cls = @(); if ($v.dark) { $cls += 'lg-dark' }; if ($v.sombra) { $cls += 'lg-sombra' }
  '<li><img src="' + $v.f + '" alt="' + (& $e $nome) + '"' + $(if ($cls) { ' class="' + ($cls -join ' ') + '"' }) + ' style="height:' + $v.h + 'px" loading="lazy"></li>'
}

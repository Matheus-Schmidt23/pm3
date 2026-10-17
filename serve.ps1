# Servidor estático mínimo para o protótipo (sem Node nem Python)
# Uso: powershell -ExecutionPolicy Bypass -File serve.ps1  →  http://localhost:5173/
param([int]$Port = 5173, [string]$Root = $PSScriptRoot)
$Root = (Resolve-Path $Root).Path
$types = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.svg'='image/svg+xml'; '.jpg'='image/jpeg'; '.png'='image/png'; '.json'='application/json'; '.woff2'='font/woff2' }
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Host "Servindo $Root em http://localhost:$Port/"
while ($l.IsListening) {
  $ctx = $l.GetContext()
  $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
  if ($path -eq '' -or $path.EndsWith('/')) { $path += 'index.html' }
  $file = Join-Path $Root $path
  if ((Test-Path $file -PathType Leaf) -and ((Resolve-Path $file).Path.StartsWith($Root))) {
    $bytes = [IO.File]::ReadAllBytes($file)
    $ext = [IO.Path]::GetExtension($file).ToLower()
    $ctx.Response.ContentType = $(if ($types[$ext]) { $types[$ext] } else { 'application/octet-stream' })
    $ctx.Response.Headers.Add('Cache-Control','no-store')
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else { $ctx.Response.StatusCode = 404 }
  $ctx.Response.Close()
}

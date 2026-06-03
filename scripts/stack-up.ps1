# Bring the example stack up and wait until gateway is healthy.
# Usage:
#   pwsh ./scripts/stack-up.ps1           # rebuild only changed images
#   pwsh ./scripts/stack-up.ps1 -Fresh    # docker compose down -v + full rebuild
#   pwsh ./scripts/stack-up.ps1 -NoBuild  # skip --build flag
param(
  [switch]$Fresh,
  [switch]$NoBuild,
  [int]$TimeoutSeconds = 180
)

$ErrorActionPreference = 'Stop'
$ROOT = Split-Path $PSScriptRoot -Parent
Push-Location $ROOT
try {
  if ($Fresh) {
    Write-Host 'Tearing down with volumes...' -ForegroundColor Yellow
    docker compose down -v 2>&1 | Out-Host
  }

  $buildFlag = if ($NoBuild) { '' } else { '--build' }
  Write-Host "Starting stack ($($buildFlag.Trim() -or 'no rebuild'))..." -ForegroundColor Cyan
  if ($NoBuild) {
    docker compose up -d 2>&1 | Out-Host
  } else {
    docker compose up -d --build 2>&1 | Out-Host
  }

  Write-Host "Waiting for gateway to be healthy on :8668..." -ForegroundColor Cyan
  $start = Get-Date
  $ready = $false
  while (((Get-Date) - $start).TotalSeconds -lt $TimeoutSeconds) {
    try {
      $r = Invoke-WebRequest -Uri 'http://localhost:8668/health' -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
      if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { $ready = $true; break }
    } catch { Start-Sleep -Milliseconds 1000 }
  }

  if (-not $ready) {
    Write-Host 'Gateway did not become healthy in time.' -ForegroundColor Red
    docker compose ps 2>&1 | Out-Host
    exit 1
  }

  Write-Host 'Stack is up. Gateway: http://localhost:8668  Portal: http://localhost:8669' -ForegroundColor Green
} finally {
  Pop-Location
}

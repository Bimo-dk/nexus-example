param(
  [switch]$Volumes
)
$ErrorActionPreference = 'Continue'
$ROOT = Split-Path $PSScriptRoot -Parent
Push-Location $ROOT
try {
  if ($Volumes) {
    docker compose down -v 2>&1 | Out-Host
  } else {
    docker compose down 2>&1 | Out-Host
  }
} finally {
  Pop-Location
}

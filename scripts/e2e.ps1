# Full e2e cycle: bring stack up -> install Playwright if needed -> run tests
# Usage:
#   pwsh ./scripts/e2e.ps1                # against running stack (no rebuild)
#   pwsh ./scripts/e2e.ps1 -Up            # docker compose up --build first
#   pwsh ./scripts/e2e.ps1 -Up -Fresh     # docker compose down -v + up --build
#   pwsh ./scripts/e2e.ps1 -KeepUp        # don't tear down after tests
param(
  [switch]$Up,
  [switch]$Fresh,
  [switch]$KeepUp,
  [switch]$Headed,
  [string]$Grep = ''
)

$ErrorActionPreference = 'Stop'
$ROOT = Split-Path $PSScriptRoot -Parent
$E2E = Join-Path $ROOT 'e2e'

try {
  if ($Up) {
    $upArgs = @{ }
    if ($Fresh) { $upArgs['Fresh'] = $true }
    & (Join-Path $PSScriptRoot 'stack-up.ps1') @upArgs
  } else {
    Write-Host 'Skipping stack startup (-Up not set). Assuming stack is already running.' -ForegroundColor DarkGray
  }

  Push-Location $E2E
  try {
    if (-not (Test-Path 'node_modules/@playwright')) {
      Write-Host 'Installing Playwright deps...' -ForegroundColor Cyan
      npm install --silent 2>&1 | Out-Host
      Write-Host 'Installing Chromium browser...' -ForegroundColor Cyan
      npx playwright install chromium 2>&1 | Out-Host
    }

    $testArgs = @('test')
    if ($Headed) { $testArgs += '--headed' }
    if ($Grep) { $testArgs += "--grep=$Grep" }

    Write-Host "Running Playwright tests..." -ForegroundColor Cyan
    & npx playwright @testArgs
    $exitCode = $LASTEXITCODE
  } finally {
    Pop-Location
  }
} finally {
  if ($Up -and -not $KeepUp) {
    Write-Host 'Tearing stack down...' -ForegroundColor Yellow
    & (Join-Path $PSScriptRoot 'stack-down.ps1')
  }
}

exit $exitCode

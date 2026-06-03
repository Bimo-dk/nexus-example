# nexus-example e2e tests

Playwright UI smoke tests that drive the full Bimo-Nexus example stack: gateway, host, both remotes, registry and portal.

## What's covered

| Test | What it asserts |
|---|---|
| Gateway loads | `/` reaches a healthy `Nexus Host` shell with no unexpected console errors |
| Dashboard renders | `/dashboard` shows the loaded-remotes panel |
| Demos page mounts patterns | `/demos` renders all 4 pattern sections + at least one `<nexus-component>` |
| Eager grid loads | Pattern 2's 5 federated components all transition out of the `nx-loading` state |
| On-demand loads on click | Clicking "Load" in Pattern 3 reveals the federated component |
| Modal dialog opens | Clicking a tile in Pattern 4 opens a modal with the federated content |

Console errors that aren't on a known-benign allowlist fail the test.

## Run locally

```bash
# from nexus-example/
pwsh ./scripts/e2e.ps1 -Up           # docker compose up --build, then tests
pwsh ./scripts/e2e.ps1 -Up -Fresh    # docker compose down -v first
pwsh ./scripts/e2e.ps1               # tests only (stack already running)
pwsh ./scripts/e2e.ps1 -Up -Headed   # open the browser so you can watch
pwsh ./scripts/e2e.ps1 -Up -Grep 'eager grid'   # run a single test
```

The script installs Playwright + Chromium on first run.

## Run tests against staging / another env

```bash
NEXUS_BASE_URL=https://nexus-staging.bimo.dk npx playwright test
```

## Reports

```bash
cd e2e && npx playwright show-report
```

HTML report opens with screenshots + traces for any failed test.

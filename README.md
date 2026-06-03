# nexus-example

Developer playground for the **Bimo-Nexus** micro frontend platform. Demonstrates a complete running stack where you can experiment with host and remotes without setting up the whole system manually.

## What you get

When you run `docker compose up`:

| Service | Type | Port | Description |
|---|---|---|---|
| `gateway` | **pre-built** image | **8668** | Browser goes here — public entry point |
| `portal` | **pre-built** image | **8669** | Admin UI for adding/removing remotes |
| `registry` | **pre-built** image | (internal) | Source of truth for remote configuration |
| `host` | **built locally** from `./host/` | (internal) | Layout shell — federates remotes |
| `remote-one` | **built locally** from `./remote-one/` | (internal) | Example micro frontend |
| `remote-two` | **built locally** from `./remote-two/` | (internal) | Another example MFE |

Pre-built images are pulled from `ghcr.io/bimo-dk/*`. Local services are built from editable source code.

## Quick start

```bash
# 1. Clone
git clone https://github.com/Bimo-dk/nexus-example.git
cd nexus-example

# 2. Configure .env
cp .env.example .env
# Edit .env — set NODE_AUTH_TOKEN to a PAT with read:packages scope
# (required so the host build can fetch @bimo-dk/nexus-core)

# 3. Log in to ghcr.io to pull pre-built images
echo $NODE_AUTH_TOKEN | docker login ghcr.io -u <your-github-user> --password-stdin

# 4. Start everything
docker compose up --build

# 5. Open in browser
# http://localhost:8668   -> the application (gateway -> host -> remotes)
# http://localhost:8669   -> admin portal
```

## Developer workflow

### Edit remote-one and see changes

```bash
# Edit code in ./remote-one/src/app/remote-entry/entry.component.ts
docker compose up -d --build remote-one
# Hard-refresh browser -> changes are live
```

### Edit host

```bash
# Edit code in ./host/src/app/...
docker compose up -d --build host
```

### Add a new remote (UI only)

1. Open http://localhost:8669
2. Remotes -> Add remote
3. Fill in name + URL -> Save
4. Host discovers it via WebSocket and registers the route immediately

### Add a new remote (with code)

1. Normally built from `bnx generate remote` (from `@bimo-dk/nexus-cli`)
2. Add as a service in this `docker-compose.yml`:
   ```yaml
   remote-three:
     build: ./remote-three
     expose: ["80"]
     networks: [nexus-net]
   ```
3. Add an nginx proxy route in the gateway (requires the pre-built gateway image to be updated separately)
4. `docker compose up --build remote-three`
5. Register with the registry via the Portal UI

## Folder structure

```
nexus-example/
├── docker-compose.yml          -> orchestrator
├── .env.example                -> configuration template
├── README.md                   -> (you are here)
├── host/                       -> LOCAL host-template source — edit here
├── remote-one/                 -> LOCAL remote — edit here
└── remote-two/                 -> LOCAL remote — edit here
```

## How the gateway routes

The gateway image has a built-in nginx proxy:

| URL prefix | Internal destination |
|---|---|
| `/host/*` | `host:80/*` |
| `/remotes/remoteOne/*` | `remote-one:80/*` |
| `/remotes/remoteTwo/*` | `remote-two:80/*` |
| `/api/*` | `registry:3000/api/*` |
| `/ws` | `registry:3000/ws` (WebSocket broadcast) |
| Everything else | gateway's own SPA index.html |

For this reason the service names in this `docker-compose.yml` MUST match exactly: `host`, `remote-one`, `remote-two`, `registry`. Do not change them.

## If you want to add a remote-three

The gateway image has ONLY proxies for `remoteOne` and `remoteTwo` built in. To add `remoteThree`:

1. Fork the `nexus-gateway` repo
2. Add a proxy block in `nginx.conf` for `/remotes/remoteThree/`
3. Build + push your own image: `ghcr.io/<you>/nexus-gateway:latest`
4. Change `image:` in this `docker-compose.yml` to your fork

Alternatively: send a PR to [nexus-gateway](https://github.com/Bimo-dk/nexus-gateway) that makes the number of remotes configurable.

## Troubleshooting

| Problem | Solution |
|---|---|
| `denied: requested access to the resource is denied` on pull | Log in to ghcr.io first: `docker login ghcr.io` |
| Host build fails with `401 Unauthorized` | Set `NODE_AUTH_TOKEN` in `.env` to a PAT with `read:packages` |
| Browser shows "Host shell unavailable" | Host container is down — `docker compose logs host` |
| Portal shows no remotes | Registry volume is empty — `docker compose down -v && docker compose up` |

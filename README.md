# nexus-example

Developer playground for **Bimo-Nexus** micro frontend platform. Demonstrerer en komplet kørende stack hvor du kan eksperimentere med host og remotes uden at sætte hele systemet op manuelt.

## Hvad du får

Når du kører `docker compose up`:

| Service | Type | Port | Beskrivelse |
|---|---|---|---|
| `gateway` | **pre-built** image | **8668** | Browser går hertil — public entry-point |
| `portal` | **pre-built** image | **8669** | Admin UI til at tilføje/fjerne remotes |
| `registry` | **pre-built** image | (intern) | Source of truth for remote-konfiguration |
| `host` | **lokalt bygget** fra `./host/` | (intern) | Layout shell — federerer remotes |
| `remote-one` | **lokalt bygget** fra `./remote-one/` | (intern) | Eksempel micro frontend |
| `remote-two` | **lokalt bygget** fra `./remote-two/` | (intern) | Endnu en eksempel-MFE |

Pre-built images pulles fra `ghcr.io/bimo-dk/*`. Lokale services bygger fra editérbar kildekode.

## Quick start

```bash
# 1. Klon
git clone https://github.com/Bimo-dk/nexus-example.git
cd nexus-example

# 2. Konfigurer .env
cp .env.example .env
# Rediger .env — sæt NODE_AUTH_TOKEN til en PAT med read:packages scope
# (kræves for host-build kan hente @bimo-dk/nexus-core)

# 3. Login til ghcr.io for at pulle pre-built images
echo $NODE_AUTH_TOKEN | docker login ghcr.io -u <din-github-user> --password-stdin

# 4. Start alt
docker compose up --build

# 5. Åbn i browser
# http://localhost:8668   ← applikationen (gateway → host → remotes)
# http://localhost:8669   ← admin portal
```

## Developer workflow

### Edit remote-one og se ændringer

```bash
# Ret kode i ./remote-one/src/app/remote-entry/entry.component.ts
docker compose up -d --build remote-one
# Hard-refresh browser → ændringer er live
```

### Edit host

```bash
# Ret kode i ./host/src/app/...
docker compose up -d --build host
```

### Tilføj en ny remote (kun via UI)

1. Åbn http://localhost:8669
2. Remotes → Add remote
3. Udfyld navn + URL → Save
4. Host opdager den via WebSocket og registrerer ruten øjeblikkelig

### Tilføj en ny remote (med kode)

1. Bygges normalt fra `bnx generate remote` (kommer fra `@bimo-dk/nexus-cli`)
2. Tilføj som service i denne `docker-compose.yml`:
   ```yaml
   remote-three:
     build: ./remote-three
     expose: ["80"]
     networks: [nexus-net]
   ```
3. Tilføj nginx proxy-route i gateway (kræver pre-built gateway-image opdateres separat)
4. `docker compose up --build remote-three`
5. Registrer hos registry via Portal UI

## Mappestruktur

```
nexus-example/
├── docker-compose.yml          ← orchestrator
├── .env.example                ← konfiguration-template
├── README.md                   ← (du er her)
├── host/                       ← LOKAL host-template kode — edit her
├── remote-one/                 ← LOKAL remote — edit her
└── remote-two/                 ← LOKAL remote — edit her
```

## Hvordan gateway router

Gateway-imagen har built-in nginx proxy:

| URL-prefix | Internt destination |
|---|---|
| `/host/*` | `host:80/*` |
| `/remotes/remoteOne/*` | `remote-one:80/*` |
| `/remotes/remoteTwo/*` | `remote-two:80/*` |
| `/api/*` | `registry:3000/api/*` |
| `/ws` | `registry:3000/ws` (WebSocket broadcast) |
| Alt andet | gateway's egen SPA index.html |

Derfor SKAL service-navnene i denne `docker-compose.yml` matche præcis: `host`, `remote-one`, `remote-two`, `registry`. Skift dem ikke.

## Hvis du vil tilføje en remote-three

Gateway image'en har KUN proxies for `remoteOne` og `remoteTwo` indbygget. For at tilføje `remoteThree`:

1. Fork `nexus-gateway` repo
2. Tilføj proxy-block i `nginx.conf` for `/remotes/remoteThree/`
3. Build + push dit eget image: `ghcr.io/<dig>/nexus-gateway:latest`
4. Skift `image:` i denne `docker-compose.yml` til dit fork

Eller alternativt: send PR til [nexus-gateway](https://github.com/Bimo-dk/nexus-gateway) der gør antallet af remotes konfigurerbart.

## Troubleshooting

| Problem | Løsning |
|---|---|
| `denied: requested access to the resource is denied` ved pull | Login til ghcr.io først: `docker login ghcr.io` |
| Host-build fejler med `401 Unauthorized` | Sæt `NODE_AUTH_TOKEN` i `.env` til en PAT med `read:packages` |
| Browser viser "Host shell utilgængelig" | Host-container er nede — `docker compose logs host` |
| Portal viser ingen remotes | Registry-volumet er tomt — `docker compose down -v && docker compose up` |

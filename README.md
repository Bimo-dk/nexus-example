# NexusShop

Komplet webshop-demo til [Nexus](https://nexus.bimo.dk/) micro frontend platformen.
Viser alle centrale features med 5 remotes der hver har sit eget ansvarsområde.

## Hvad dette eksempel demonstrerer

| Feature | Hvor |
|---|---|
| `nexusRoute()` — route-baserede remotes | Alle 5 remotes som sider |
| `<nexus-component>` — komponent mounting | MiniCart i hostens navbar |
| Cross-remote composition | cart-remote eksponerer MiniCart der bruges af host |
| Automatisk selvregistrering med `UPSTREAM_URL` | Alle remotes via docker-compose env |
| Remotes kan hedde hvad de vil | Docker service-navne matcher ikke remote-navne |
| `@NexusComponent` metadata | Component catalog på :8669 viser alle komponenter |

## Arkitektur

| Remote | Docker service | Route | Eksponerede komponenter |
|---|---|---|---|
| `catalog` | `remote-catalog` | `/products` | `CatalogPage` |
| `product` | `remote-product` | `/products/:id` | `ProductPage` |
| `cart` | `remote-cart` | `/cart` | `CartPage`, `MiniCart` |
| `checkout` | `remote-checkout` | `/checkout` | `CheckoutPage` |
| `account` | `remote-account` | `/account` | `AccountPage` |

## Quick start

```bash
# 1. Konfigurer .env
cp .env.example .env
# Sæt NODE_AUTH_TOKEN til en PAT med read:packages scope

# 2. Log ind på ghcr.io for at hente pre-byggede images
echo $NODE_AUTH_TOKEN | docker login ghcr.io -u <din-github-bruger> --password-stdin

# 3. Start alt
docker compose up --build
```

## Hvad der kører

- Application: http://localhost:8668
- Admin portal: http://localhost:8669

## Tilføj et nyt remote

Tilføj en ny service i `docker-compose.yml` med `PUBLIC_URL` og `UPSTREAM_URL` sat:

```yaml
remote-wishlist:
  build:
    context: ./remote-wishlist
    secrets:
      - node_auth_token
  expose: ["80"]
  environment:
    REGISTRY_INTERNAL_URL: http://registry:3000
    NEXUS_TOKEN: ${NEXUS_TOKEN:-dev-token}
    PUBLIC_URL: /remotes/wishlist/remoteEntry.json
    UPSTREAM_URL: http://remote-wishlist:80
  depends_on:
    registry: { condition: service_healthy }
  networks: [nexus-net]
```

Kør `docker compose up --build remote-wishlist`. Det registrerer sig selv.
Ingen andre filer at ændre.

# syntax=docker/dockerfile:1.7
# ============================================================================
# remote-one — Bimo-Nexus example remote
#
# Uses BuildKit secrets so NODE_AUTH_TOKEN is NEVER leaked in build logs.
# Build via docker compose: secret passed automatically (see docker-compose.yml).
# Build manually: docker build --secret id=node_auth_token,env=NODE_AUTH_TOKEN .
# ============================================================================

FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json .npmrc ./

RUN --mount=type=secret,id=node_auth_token,required=true \
    NODE_AUTH_TOKEN=$(cat /run/secrets/node_auth_token) \
    npm install --no-audit --no-fund --legacy-peer-deps

COPY tsconfig*.json angular.json federation.config.js ./
COPY src ./src
COPY public ./public

RUN node -e "const fs=require('fs'); const p='src/environments/environment.prod.ts'; let c=fs.readFileSync(p,'utf8'); c=c.replace('BUILD_TIME_PLACEHOLDER', new Date().toISOString()); fs.writeFileSync(p,c);"

RUN npm run build:prod

FROM nginx:alpine
RUN apk add --no-cache wget gettext

COPY --from=builder /app/dist/remote-catalog/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.d/40-runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]

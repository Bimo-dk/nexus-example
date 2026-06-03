# Bygges fra projekt-rod-context.
FROM node:22-alpine AS builder

WORKDIR /workspace/nexus-example/remote-one
COPY nexus-example/remote-one/package*.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps

COPY nexus-example/remote-one/tsconfig*.json nexus-example/remote-one/angular.json nexus-example/remote-one/federation.config.js ./
COPY nexus-example/remote-one/src ./src
COPY nexus-example/remote-one/public ./public

RUN node -e "const fs=require('fs'); const p='src/environments/environment.prod.ts'; let c=fs.readFileSync(p,'utf8'); c=c.replace('BUILD_TIME_PLACEHOLDER', new Date().toISOString()); fs.writeFileSync(p,c);"

RUN npm run build:prod

FROM nginx:alpine
RUN apk add --no-cache wget

COPY --from=builder /workspace/nexus-example/remote-one/dist/remote-one/browser /usr/share/nginx/html
COPY nexus-example/remote-one/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]

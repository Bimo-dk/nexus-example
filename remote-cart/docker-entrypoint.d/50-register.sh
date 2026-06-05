#!/bin/sh
REG=/usr/share/nginx/html/assets/remote-reg.json

if [ ! -f "$REG" ]; then
  echo "[nexus-register] ERROR: remote-reg.json not found — image may need a rebuild" >&2
  exit 0
fi

REGISTRY_URL="${REGISTRY_URL:-http://registry:8670}"
NEXUS_TOKEN="${NEXUS_TOKEN:-dev-token}"
PUBLIC_URL="${PUBLIC_URL:-}"
UPSTREAM_URL="${UPSTREAM_URL:-}"

NAME=$(grep -o '"name":"[^"]*"' "$REG" | sed 's/"name":"//;s/"//')
MODULE=$(grep -o '"exposedModule":"[^"]*"' "$REG" | sed 's/"exposedModule":"//;s/"//')

if [ -z "$NAME" ] || [ -z "$MODULE" ]; then
  echo "[nexus-register] ERROR: could not parse remote-reg.json" >&2
  exit 0
fi

if [ -z "$PUBLIC_URL" ]; then
  echo "[nexus-register] WARN: PUBLIC_URL not set — skipping server-side registration for ${NAME}" >&2
  exit 0
fi

if [ -n "$UPSTREAM_URL" ]; then
  BODY="{\"name\":\"${NAME}\",\"url\":\"${PUBLIC_URL}\",\"routePath\":\"${NAME}\",\"exposedModule\":\"${MODULE}\",\"enabled\":true,\"upstreamUrl\":\"${UPSTREAM_URL}\"}"
else
  BODY="{\"name\":\"${NAME}\",\"url\":\"${PUBLIC_URL}\",\"routePath\":\"${NAME}\",\"exposedModule\":\"${MODULE}\",\"enabled\":true}"
fi

REG_ENDPOINT="${REGISTRY_URL%/}/remotes"
echo "[nexus-register] Registering ${NAME} at ${REG_ENDPOINT} (url=${PUBLIC_URL})"

i=1
while [ $i -le 5 ]; do
  if wget -qO- \
       --header="Content-Type: application/json" \
       --header="X-Nexus-Token: ${NEXUS_TOKEN}" \
       --post-data="${BODY}" \
       "${REG_ENDPOINT}" 2>/dev/null; then
    echo "[nexus-register] ${NAME} registered"
    exit 0
  fi
  echo "[nexus-register] ERROR: registry unreachable at ${REG_ENDPOINT} (attempt ${i}/5)" >&2
  sleep "$i"
  i=$((i + 1))
done

echo "[nexus-register] ERROR: ${NAME} registration failed after 5 attempts" >&2
echo "[nexus-register] WARN: nginx starting anyway — remote will not be discoverable until registered" >&2
exit 0

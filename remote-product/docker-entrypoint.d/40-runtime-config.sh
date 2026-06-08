#!/bin/sh
set -eu

TEMPLATE=/usr/share/nginx/html/assets/config.template.json
OUTPUT=/usr/share/nginx/html/assets/config.json

if [ ! -f "$TEMPLATE" ]; then
  echo "[runtime-config] Template not found: $TEMPLATE — skipping" >&2
  exit 0
fi

export REGISTRY_URL="${REGISTRY_URL:-http://registry:8670}"
export NEXUS_TOKEN="${NEXUS_TOKEN:-dev-token}"
export PUBLIC_URL="${PUBLIC_URL:-}"
export UPSTREAM_URL="${UPSTREAM_URL:-}"

envsubst < "$TEMPLATE" > "$OUTPUT"

echo "[runtime-config] Generated $OUTPUT with:"
echo "  REGISTRY_URL=$REGISTRY_URL"
echo "  PUBLIC_URL=$PUBLIC_URL"
echo "  UPSTREAM_URL=$UPSTREAM_URL"

#!/bin/sh
set -eu
: "${REGISTRY_ORIGIN:=http://host.docker.internal:8669}"
export REGISTRY_ORIGIN
envsubst '${REGISTRY_ORIGIN}' \
  < /tmp/nginx.dev.conf.template \
  > /etc/nginx/conf.d/default.conf
echo "[host] nginx proxy: /api/* -> ${REGISTRY_ORIGIN}/api/*"

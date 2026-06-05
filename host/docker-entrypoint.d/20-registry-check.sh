#!/bin/sh
REGISTRY_ORIGIN="${REGISTRY_ORIGIN:-http://host.docker.internal:8669}"
HEALTH="${REGISTRY_ORIGIN%/}/health"

echo "[nexus-host] Checking registry at ${HEALTH}"

i=1
while [ $i -le 3 ]; do
  if wget -qO- "${HEALTH}" 2>/dev/null; then
    echo "[nexus-host] Registry is reachable"
    exit 0
  fi
  echo "[nexus-host] ERROR: registry not reachable at ${HEALTH} (attempt ${i}/3)" >&2
  sleep 2
  i=$((i + 1))
done

echo "[nexus-host] ERROR: registry at ${REGISTRY_ORIGIN} did not respond — host will start but remotes may not load" >&2
exit 0

#!/usr/bin/env bash
set -euo pipefail

SERVER="${SERVER:-softdab-server}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/UAVITALOOP/frontend/dist}"

if [[ ! -d "dist" ]]; then
  echo "dist/ not found. Run npm run build first." >&2
  exit 1
fi

ssh "$SERVER" "mkdir -p '$REMOTE_DIR'"
rsync -az --delete dist/ "$SERVER:$REMOTE_DIR/"

echo "UA frontend dist deployed to $SERVER:$REMOTE_DIR"

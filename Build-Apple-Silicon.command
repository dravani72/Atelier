#!/bin/bash
set -euo pipefail
ATELIER_ROOT="$(cd "$(dirname "$0")" && pwd)"
export PATH="$HOME/.cargo/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
if bash "$ATELIER_ROOT/scripts/build-macos.sh"; then
  open "$ATELIER_ROOT/dist/apple-silicon"
else
  echo 'Build did not complete. Read the error above.' >&2
  read -r -p 'Press Return to close this window.' ATELIER_REPLY
  exit 1
fi

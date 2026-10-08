#!/bin/bash
set -euo pipefail
ATELIER_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ATELIER_BIN="$ATELIER_ROOT/src-tauri/target/aarch64-apple-darwin/release/bundle/macos/Atelier.app/Contents/MacOS/atelier"
[ "$(uname -s)" = Darwin ] || { echo 'Smoke test requires macOS.' >&2; exit 1; }
# Run only on a fresh CI account; this test must never touch an existing user's workspace.
ATELIER_DATABASE="$HOME/Library/Application Support/studio.atelier.boards/atelier.sqlite3"
[ ! -e "$ATELIER_DATABASE" ] || { echo 'A workspace already exists; refusing to run this fresh-account test.' >&2; exit 1; }
"$ATELIER_BIN" > "$ATELIER_ROOT/dist/apple-silicon/native-launch.log" 2>&1 &
ATELIER_PID=$!
trap 'kill "$ATELIER_PID" 2>/dev/null || true' EXIT
ATELIER_LOADED=no
for ATELIER_ATTEMPT in 1 2 3 4 5 6 7 8 9 10; do
  kill -0 "$ATELIER_PID" 2>/dev/null || { cat "$ATELIER_ROOT/dist/apple-silicon/native-launch.log"; exit 1; }
  if [ -f "$ATELIER_DATABASE" ] && /usr/bin/sqlite3 "$ATELIER_DATABASE" 'SELECT length(data) FROM workspace WHERE id=1;' | /usr/bin/grep -Eq '^[1-9][0-9]*$'; then
    ATELIER_LOADED=yes
    break
  fi
  sleep 2
done
[ "$ATELIER_LOADED" = yes ] || { echo 'The desktop frontend did not save its starter workspace.' >&2; cat "$ATELIER_ROOT/dist/apple-silicon/native-launch.log"; exit 1; }
echo 'Native launch passed: process remained alive and the real WebView saved a workspace through the Rust bridge.'

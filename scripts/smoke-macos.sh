#!/bin/bash
set -euo pipefail
ATELIER_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ATELIER_ROOT/scripts/macos-env.sh"
ATELIER_BIN="$ATELIER_APP/Contents/MacOS/atelier"
[ "$(uname -s)" = Darwin ] || { echo 'Smoke test requires macOS.' >&2; exit 1; }
# Run only on a fresh CI account; this test must never touch an existing user's workspace.
ATELIER_DATABASE="$HOME/Library/Application Support/studio.atelier.boards/atelier.sqlite3"
[ ! -e "$ATELIER_DATABASE" ] || { echo 'A workspace already exists; refusing to run this fresh-account test.' >&2; exit 1; }
"$ATELIER_BIN" > "$ATELIER_DIST/native-launch.log" 2>&1 &
ATELIER_PID=$!
trap 'kill "$ATELIER_PID" 2>/dev/null || true' EXIT
ATELIER_LOADED=no
for ATELIER_ATTEMPT in 1 2 3 4 5 6 7 8 9 10; do
  kill -0 "$ATELIER_PID" 2>/dev/null || { cat "$ATELIER_DIST/native-launch.log"; exit 1; }
  if [ -f "$ATELIER_DATABASE" ] && /usr/bin/sqlite3 "$ATELIER_DATABASE" 'SELECT length(data) FROM workspace WHERE id=1;' | /usr/bin/grep -Eq '^[1-9][0-9]*$'; then
    ATELIER_LOADED=yes
    break
  fi
  sleep 2
done
[ "$ATELIER_LOADED" = yes ] || { echo 'The desktop frontend did not save its starter workspace.' >&2; cat "$ATELIER_DIST/native-launch.log"; exit 1; }
echo 'Native launch passed: process remained alive and the real WebView saved a workspace through the Rust bridge.'

kill "$ATELIER_PID" 2>/dev/null || true
wait "$ATELIER_PID" 2>/dev/null || true
ATELIER_TEST_MEDIA="$(mktemp -d)"
ffmpeg -v error -f lavfi -i color=c=red:s=320x180:r=24 -t 3 -c:v libx264 -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 "$ATELIER_TEST_MEDIA/h264.mp4"
ffmpeg -v error -f lavfi -i color=c=green:s=320x180:r=24 -t 3 -c:v libx265 -tag:v hvc1 -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 "$ATELIER_TEST_MEDIA/hevc.mov"
ffmpeg -v error -f lavfi -i color=c=blue:s=320x180:r=24 -t 3 -c:v mpeg4 "$ATELIER_TEST_MEDIA/mpeg4.avi"
for ATELIER_VIDEO in "$ATELIER_TEST_MEDIA"/*; do
  ATELIER_LOG="$ATELIER_DIST/mpv-$(basename "$ATELIER_VIDEO").json"
  ATELIER_MPV_SMOKE_FILE="$ATELIER_VIDEO" ATELIER_MPV_SMOKE_LOG="$ATELIER_LOG" "$ATELIER_BIN" >> "$ATELIER_DIST/native-launch.log" 2>&1 &
  ATELIER_PID=$!
  ATELIER_PLAYED=no
  for ATELIER_ATTEMPT in {1..20}; do
    kill -0 "$ATELIER_PID" 2>/dev/null || { cat "$ATELIER_DIST/native-launch.log"; exit 1; }
    if [ -s "$ATELIER_LOG" ]; then ATELIER_PLAYED=yes; break; fi
    sleep 1
  done
  [ "$ATELIER_PLAYED" = yes ] || { echo "libmpv failed to render $ATELIER_VIDEO"; cat "$ATELIER_DIST/native-launch.log"; exit 1; }
  python3 - "$ATELIER_LOG" <<'PYTEST'
import json,sys
s=json.load(open(sys.argv[1]));assert s['frames']>10 and s['time']>0.15 and s['icc'] and s['codec'] and s['surfaceVisible'] and s['surfaceWindow'] > 0 and not s['error'];print('Native libmpv rendered:',s)
PYTEST
  ATELIER_SURFACE_ID="$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1]))["surfaceWindow"])' "$ATELIER_LOG")"
  ATELIER_CAPTURE="$ATELIER_DIST/mpv-$(basename "$ATELIER_VIDEO").png"
  /usr/sbin/screencapture -x -l "$ATELIER_SURFACE_ID" "$ATELIER_CAPTURE"
  case "$(basename "$ATELIER_VIDEO")" in
    h264.mp4) ATELIER_EXPECTED=red ;;
    hevc.mov) ATELIER_EXPECTED=green ;;
    mpeg4.avi) ATELIER_EXPECTED=blue ;;
  esac
  swift "$ATELIER_ROOT/scripts/check-video-capture.swift" "$ATELIER_CAPTURE" "$ATELIER_EXPECTED"
  kill "$ATELIER_PID" 2>/dev/null || true
  wait "$ATELIER_PID" 2>/dev/null || true
done
rm -rf "$ATELIER_TEST_MEDIA"
echo 'Native libmpv playback passed: H.264 MP4, HEVC MOV, MPEG-4 AVI, rendered pixels and display ICC profile.'

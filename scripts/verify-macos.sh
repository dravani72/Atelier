#!/bin/bash
set -euo pipefail
ATELIER_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ATELIER_APP="$ATELIER_ROOT/src-tauri/target/aarch64-apple-darwin/release/bundle/macos/Atelier.app"
ATELIER_EXECUTABLE="$ATELIER_APP/Contents/MacOS/atelier"
[ "$(uname -s)" = Darwin ] || { echo 'Verification requires macOS.' >&2; exit 1; }
[ -f "$ATELIER_EXECUTABLE" ] || { echo 'The macOS build is missing.' >&2; exit 1; }
ATELIER_ARCH="$(lipo -archs "$ATELIER_EXECUTABLE")"
[ "$ATELIER_ARCH" = arm64 ] || { echo "Expected arm64, found: $ATELIER_ARCH" >&2; exit 1; }
/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$ATELIER_APP/Contents/Info.plist" | /usr/bin/grep -qx 'studio.atelier.boards'
/usr/libexec/PlistBuddy -c 'Print :LSMinimumSystemVersion' "$ATELIER_APP/Contents/Info.plist" | /usr/bin/grep -qx '13.0'
codesign --verify --deep --strict --verbose=2 "$ATELIER_APP"
ATELIER_LIBRARIES="$(otool -L "$ATELIER_EXECUTABLE" | /usr/bin/tail -n +2)"
if printf '%s\n' "$ATELIER_LIBRARIES" | /usr/bin/grep -E '(/opt/homebrew/|/usr/local/|/Users/|/workspace/)' >/dev/null; then
  echo 'The application references a nonportable build-machine library.' >&2
  exit 1
fi
ATELIER_FOUND_DMG=no
while IFS= read -r ATELIER_DMG; do
  hdiutil verify "$ATELIER_DMG"
  ATELIER_FOUND_DMG=yes
done < <(find "$ATELIER_ROOT/src-tauri/target/aarch64-apple-darwin/release/bundle/dmg" -maxdepth 1 -name '*.dmg')
[ "$ATELIER_FOUND_DMG" = yes ] || { echo 'No DMG was produced.' >&2; exit 1; }
echo 'Verified: native arm64, macOS 13+, bundle metadata, local signature, library paths, and DMG integrity.'

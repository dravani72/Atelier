#!/bin/bash
set -euo pipefail
ATELIER_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ATELIER_ROOT/scripts/macos-env.sh"
ATELIER_EXECUTABLE="$ATELIER_APP/Contents/MacOS/atelier"
[ "$(uname -s)" = Darwin ] || { echo 'Verification requires macOS.' >&2; exit 1; }
[ -f "$ATELIER_EXECUTABLE" ] || { echo 'The macOS build is missing.' >&2; exit 1; }
ATELIER_ARCH="$(lipo -archs "$ATELIER_EXECUTABLE")"
[ "$ATELIER_ARCH" = "$ATELIER_NATIVE_ARCH" ] || { echo "Expected $ATELIER_NATIVE_ARCH, found: $ATELIER_ARCH" >&2; exit 1; }
/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$ATELIER_APP/Contents/Info.plist" | /usr/bin/grep -qx 'studio.atelier.boards'
/usr/libexec/PlistBuddy -c 'Print :LSMinimumSystemVersion' "$ATELIER_APP/Contents/Info.plist" | /usr/bin/grep -qx "$ATELIER_MIN_MACOS"
codesign --verify --deep --strict --verbose=2 "$ATELIER_APP"
ATELIER_LIBRARIES="$(otool -L "$ATELIER_EXECUTABLE" | /usr/bin/tail -n +2)"
if printf '%s\n' "$ATELIER_LIBRARIES" | /usr/bin/grep -E '(/opt/homebrew/|/usr/local/|/Users/|/workspace/)' >/dev/null; then
  echo 'The application references a nonportable build-machine library.' >&2
  exit 1
fi
for ATELIER_DYLIB in "$ATELIER_APP"/Contents/Frameworks/*.dylib; do
  lipo -archs "$ATELIER_DYLIB" | /usr/bin/grep -qw "$ATELIER_NATIVE_ARCH"
  if otool -L "$ATELIER_DYLIB" | /usr/bin/tail -n +2 | /usr/bin/grep -E '(/opt/homebrew/|/usr/local/|/Users/|/workspace/)' >/dev/null; then echo "Nonportable media dependency: $ATELIER_DYLIB" >&2; exit 1; fi
done
ATELIER_FOUND_DMG=no
while IFS= read -r ATELIER_DMG; do
  hdiutil verify "$ATELIER_DMG"
  ATELIER_FOUND_DMG=yes
done < <(find "$ATELIER_BUNDLE_ROOT/dmg" -maxdepth 1 -name '*.dmg')
[ "$ATELIER_FOUND_DMG" = yes ] || { echo 'No DMG was produced.' >&2; exit 1; }
python3 "$ATELIER_ROOT/scripts/verify-macos-minimum.py" "$ATELIER_APP" "$ATELIER_MIN_MACOS"
echo "Verified: native $ATELIER_NATIVE_ARCH, macOS $ATELIER_MIN_MACOS+, bundle metadata, local signature, library paths, and DMG integrity."

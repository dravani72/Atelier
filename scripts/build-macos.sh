#!/bin/bash
set -euo pipefail
ATELIER_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ATELIER_ROOT"
if [ "$(uname -s)" != Darwin ]; then
  echo "This build must run on a Mac or a macOS GitHub Actions runner." >&2
  exit 1
fi
if ! xcrun --find clang >/dev/null 2>&1; then
  echo "Install Xcode Command Line Tools with: xcode-select --install" >&2
  exit 1
fi
for ATELIER_TOOL in node npm cargo rustup; do
  if ! command -v "$ATELIER_TOOL" >/dev/null 2>&1; then
    echo "Missing $ATELIER_TOOL. Install Node.js 22+ and Rust stable, then run this script again." >&2
    exit 1
  fi
done
node -e 'if(Number(process.versions.node.split(".")[0])<22){console.error("Node.js 22 or newer is required");process.exit(1)}'
source scripts/macos-env.sh
[ "$(uname -m)" = "$ATELIER_NATIVE_ARCH" ] || { echo "Build on a native $ATELIER_NATIVE_ARCH Mac to bundle matching media libraries." >&2; exit 1; }
export MACOSX_DEPLOYMENT_TARGET="$ATELIER_MIN_MACOS"
rustup target add "$ATELIER_TARGET"
command -v brew >/dev/null || { echo "Homebrew is needed on the build Mac (not end-user Macs)." >&2; exit 1; }
brew install mpv
export ATELIER_MPV_PREFIX="$(brew --prefix)"
npm ci
npm test
cargo test --locked --manifest-path src-tauri/Cargo.toml --no-default-features
npm exec -- tauri build --target "$ATELIER_TARGET" --config "$ATELIER_MACOS_CONFIG" --bundles app
python3 scripts/bundle-mpv.py "$ATELIER_APP"
ATELIER_DMG_DIR="$ATELIER_BUNDLE_ROOT/dmg"
mkdir -p "$ATELIER_DMG_DIR"
ATELIER_STAGE="$(mktemp -d)"
ditto "$ATELIER_APP" "$ATELIER_STAGE/Atelier.app"
ln -s /Applications "$ATELIER_STAGE/Applications"
hdiutil create -ov -volname Atelier -srcfolder "$ATELIER_STAGE" -format UDZO "$ATELIER_DMG_DIR/Atelier_${ATELIER_VERSION}_${ATELIER_PACKAGE_ARCH}.dmg"
rm -rf "$ATELIER_STAGE"
bash scripts/verify-macos.sh
mkdir -p "$ATELIER_DIST"
ditto -c -k --sequesterRsrc --keepParent "$ATELIER_BUNDLE_ROOT/macos/Atelier.app" "$ATELIER_DIST/Atelier_${ATELIER_VERSION}_${ATELIER_LABEL}.app.zip"
find "$ATELIER_BUNDLE_ROOT/dmg" -maxdepth 1 -name '*.dmg' -exec cp {} "$ATELIER_DIST/" \;
(cd "$ATELIER_DIST" && shasum -a 256 ./*.zip ./*.dmg > SHA256SUMS.txt)
echo "$ATELIER_LABEL packages: $ATELIER_DIST"

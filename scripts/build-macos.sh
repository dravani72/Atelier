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
export MACOSX_DEPLOYMENT_TARGET=14.0
rustup target add aarch64-apple-darwin
command -v brew >/dev/null || { echo "Homebrew is needed on the build Mac (not end-user Macs)." >&2; exit 1; }
brew install mpv
export ATELIER_MPV_PREFIX="$(brew --prefix)"
npm ci
npm test
cargo test --locked --manifest-path src-tauri/Cargo.toml --no-default-features
npm exec -- tauri build --target aarch64-apple-darwin --config src-tauri/tauri.macos.conf.json --bundles app
ATELIER_APP="$ATELIER_ROOT/src-tauri/target/aarch64-apple-darwin/release/bundle/macos/Atelier.app"
python3 scripts/bundle-mpv.py "$ATELIER_APP"
ATELIER_DMG_DIR="$ATELIER_ROOT/src-tauri/target/aarch64-apple-darwin/release/bundle/dmg"
mkdir -p "$ATELIER_DMG_DIR"
ATELIER_STAGE="$(mktemp -d)"
ditto "$ATELIER_APP" "$ATELIER_STAGE/Atelier.app"
ln -s /Applications "$ATELIER_STAGE/Applications"
hdiutil create -ov -volname Atelier -srcfolder "$ATELIER_STAGE" -format UDZO "$ATELIER_DMG_DIR/Atelier_0.3.0_aarch64.dmg"
rm -rf "$ATELIER_STAGE"
bash scripts/verify-macos.sh
ATELIER_BUNDLE_ROOT="$ATELIER_ROOT/src-tauri/target/aarch64-apple-darwin/release/bundle"
mkdir -p "$ATELIER_ROOT/dist/apple-silicon"
ditto -c -k --sequesterRsrc --keepParent "$ATELIER_BUNDLE_ROOT/macos/Atelier.app" "$ATELIER_ROOT/dist/apple-silicon/Atelier_0.3.0_AppleSilicon.app.zip"
find "$ATELIER_BUNDLE_ROOT/dmg" -maxdepth 1 -name '*.dmg' -exec cp {} "$ATELIER_ROOT/dist/apple-silicon/" \;
(cd "$ATELIER_ROOT/dist/apple-silicon" && shasum -a 256 ./*.zip ./*.dmg > SHA256SUMS.txt)
echo "Apple Silicon packages: $ATELIER_ROOT/dist/apple-silicon"

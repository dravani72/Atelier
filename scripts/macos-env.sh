#!/bin/bash
# Shared architecture settings for build, verification and native smoke tests.
ATELIER_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ -z "${ATELIER_TARGET:-}" ]; then
  case "$(uname -m)" in
    arm64) ATELIER_TARGET=aarch64-apple-darwin;;
    x86_64) ATELIER_TARGET=x86_64-apple-darwin;;
    *) echo 'Unsupported build host architecture.' >&2; return 1;;
  esac
fi
case "$ATELIER_TARGET" in
  aarch64-apple-darwin)
    ATELIER_NATIVE_ARCH=arm64
    ATELIER_PACKAGE_ARCH=aarch64
    ATELIER_LABEL=AppleSilicon
    ATELIER_DIST_NAME=apple-silicon
    ATELIER_MIN_MACOS=14.0
    ATELIER_MACOS_CONFIG=src-tauri/tauri.macos.conf.json
    ATELIER_MEDIA_LABEL=
    ;;
  x86_64-apple-darwin)
    ATELIER_NATIVE_ARCH=x86_64
    ATELIER_PACKAGE_ARCH=x86_64
    ATELIER_LABEL=Intel
    ATELIER_DIST_NAME=intel
    ATELIER_MIN_MACOS=15.0
    ATELIER_MACOS_CONFIG=src-tauri/tauri.macos-intel.conf.json
    ATELIER_MEDIA_LABEL=_Intel
    ;;
  *) echo "Unsupported macOS target: $ATELIER_TARGET" >&2; return 1;;
esac
ATELIER_VERSION="$(node -p "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).version" "$ATELIER_ROOT/package.json")"
export ATELIER_TARGET ATELIER_NATIVE_ARCH ATELIER_MIN_MACOS ATELIER_VERSION
export ATELIER_DIST="$ATELIER_ROOT/dist/$ATELIER_DIST_NAME"
export ATELIER_MEDIA_SOURCES="Atelier_${ATELIER_VERSION}${ATELIER_MEDIA_LABEL}_MediaSources"
ATELIER_BUNDLE_ROOT="$ATELIER_ROOT/src-tauri/target/$ATELIER_TARGET/release/bundle"
ATELIER_APP="$ATELIER_BUNDLE_ROOT/macos/Atelier.app"

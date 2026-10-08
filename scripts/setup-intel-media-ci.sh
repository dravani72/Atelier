#!/bin/bash
# A fresh GitHub Intel runner only. Do not reset a developer's Homebrew checkout.
set -euo pipefail
[ "${GITHUB_ACTIONS:-}" = true ] && [ "$(uname -s)" = Darwin ] && [ "$(uname -m)" = x86_64 ] || { echo 'Pinned media setup is restricted to fresh Intel GitHub Actions runners.' >&2; exit 1; }
export HOMEBREW_NO_INSTALL_FROM_API=1
export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_INSTALL_CLEANUP=1
ATELIER_MEDIA_CORE_COMMIT=f4288f5dcc2195b4088c2352bc42446ce7c2728f
ATELIER_CORE="$(brew --repository)/Library/Taps/homebrew/homebrew-core"
# Runner images can ship patched core definitions. Preserve that entire checkout
# and make a separate clean one; never reset or discard those changes.
if [ -e "$ATELIER_CORE" ]; then
  [ ! -e "$RUNNER_TEMP/atelier-original-homebrew-core" ] || { echo 'Core backup already exists.' >&2; exit 1; }
  mv "$ATELIER_CORE" "$RUNNER_TEMP/atelier-original-homebrew-core"
fi
mkdir -p "$ATELIER_CORE"
git -C "$ATELIER_CORE" init
git -C "$ATELIER_CORE" remote add origin https://github.com/Homebrew/homebrew-core.git
git -C "$ATELIER_CORE" fetch --depth=1 origin "$ATELIER_MEDIA_CORE_COMMIT"
git -C "$ATELIER_CORE" checkout --detach "$ATELIER_MEDIA_CORE_COMMIT"
[ "$(git -C "$ATELIER_CORE" rev-parse HEAD)" = "$ATELIER_MEDIA_CORE_COMMIT" ]
# Clear only installed packages in the pinned media dependency graph. Otherwise
# newer runner-provided libraries would silently mix with the pinned recipes.
brew deps --formula mpv > "$RUNNER_TEMP/atelier-media-deps.txt"
printf 'mpv\n' >> "$RUNNER_TEMP/atelier-media-deps.txt"
brew list --formula > "$RUNNER_TEMP/atelier-installed-formulas.txt"
python3 - "$RUNNER_TEMP" <<'PY'
import pathlib,subprocess,sys
root=pathlib.Path(sys.argv[1]);needed=set((root/'atelier-media-deps.txt').read_text().splitlines());installed=set((root/'atelier-installed-formulas.txt').read_text().splitlines());conflicts=sorted(needed & installed)
if conflicts:subprocess.check_call(['brew','uninstall','--force','--ignore-dependencies',*conflicts])
PY
brew install --force-bottle mpv
{
  echo 'HOMEBREW_NO_INSTALL_FROM_API=1'
  echo 'HOMEBREW_NO_AUTO_UPDATE=1'
  echo 'HOMEBREW_NO_INSTALL_CLEANUP=1'
  echo "ATELIER_MEDIA_CORE_COMMIT=$ATELIER_MEDIA_CORE_COMMIT"
} >> "$GITHUB_ENV"

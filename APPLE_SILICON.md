# Atelier for Apple Silicon

Target: native ARM64 (`aarch64-apple-darwin`), M-series Macs, macOS 13 or newer. No Rosetta required by the resulting application.

**Current status: this package contains source and the Apple Silicon build setup. It does not contain a compiled Mac application or installer yet. The macOS build and native launch must still be completed on a Mac.**

## Build on your Mac

Install Xcode Command Line Tools (`xcode-select --install`), Node.js 22 or newer, and Rust stable. Then open Terminal in the extracted `atelier` folder and run:

```sh
bash scripts/build-macos.sh
```

Alternatively, double-click `Build-Apple-Silicon.command`. It checks prerequisites rather than silently installing them, installs the Rust ARM64 target and locked project dependencies, runs tests, and builds and verifies the native app and DMG. The build requires internet access to obtain dependencies. The completed app runs offline.

Successful output appears in `dist/apple-silicon/`:

- `Atelier_0.1.0_AppleSilicon.app.zip`: zipped Mac application, preserving bundle metadata.
- An ARM64 `.dmg`: drag `Atelier.app` into Applications.
- `SHA256SUMS.txt`: checksums of the packaged files.

Open the installed app from Applications. It uses the system WKWebView and SQLite; there is no Node.js or Rust runtime requirement for users of the built application.

## Build using GitHub Actions

The prepared `.github/workflows/apple-silicon.yml` builds on the native ARM64 `macos-14` runner. It verifies the machine's architecture before building, uses an explicit ARM64 Rust target, validates the app's ARM64 binary and macOS minimum version, checks the code signature and library paths, verifies DMG integrity, and uploads installable artifacts.

The workflow can be run manually from a repository's Actions tab once present on its default branch. It also runs when the source is pushed to the dedicated `atelier-macos-build` branch. It does not publish a release or change another application's deployment.

## Signing

The default build uses a local ad-hoc signature (`signingIdentity: "-"`). This satisfies local ARM64 code-signature integrity checks, but it is not a Developer ID signature or Apple notarization. A downloaded build may need approval under System Settings → Privacy & Security → Open Anyway. The build does not disable Gatekeeper or remove quarantine flags.

For publicly distributed, normally trusted downloads, build with your Developer ID certificate and notarize through Apple. Those credentials are not supplied in this package.

## Native acceptance checks after a successful build

1. Launch the app from Applications on an M-series Mac; confirm the board and toolbar appear.
2. Edit a note and close immediately; reopen and verify that final edit persisted.
3. Add an image, video, and file; play the video and save the file through the native dialog.
4. Export a JSON backup through the native save dialog, then import it.
5. Open a web link and verify it opens in the default browser.
6. Launch a second copy and verify it focuses the existing instance.
7. Check pan/zoom with the trackpad, Command shortcuts, native window closing, and recovery snapshots.

These native checks have not been performed in the Linux preparation environment. Browser and Rust core tests do not prove Mac runtime behavior.

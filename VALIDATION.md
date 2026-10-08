# Validation — Atelier 0.1.0

Completed 2026-10-08. Mac application source commit: `533960bab1d49fae8b58e81f3d617ff66b392cd6`.

## Apple Silicon build — passed

[Successful GitHub Actions run](https://github.com/dravani72/Atelier/actions/runs/37795193013).

- Runner verified as native ARM64.
- Rust release compilation for `aarch64-apple-darwin` completed.
- `Atelier.app` and `Atelier_0.1.0_aarch64.dmg` created.
- Executable architecture checked with `lipo`: `arm64`.
- Bundle identifier and macOS 13.0 minimum version verified.
- Ad-hoc signature passed `codesign --verify --deep --strict`.
- Linked dependencies checked for nonportable Homebrew/user/build-machine paths. None found. The check excludes `otool`'s first line, which is the inspected executable's own path.
- DMG passed `hdiutil verify` checksum validation.
- Native app process launched on the Mac runner and remained alive. Its real WKWebView initialized the board UI and saved the starter workspace through the actual Tauri command bridge into SQLite.
- Application ZIP, DMG, and SHA-256 checksums uploaded as the `Atelier-macOS-AppleSilicon` artifact.
- Downloaded artifact and its contained packages matched their recorded SHA-256 checksums.

## Shared implementation — passed

- Seven Node.js model/format tests: templates, undo/redo, connector integrity, imports, checklist export, safe Markdown rendering, and cryptographic UUID fallback.
- Six actual Rust/SQLite tests: save/reopen persistence, invalid-save preservation, revision recovery, invalid hierarchy/version, dangling connectors, and frontend-fixture/schema compatibility. These also ran on the Mac runner.
- Main browser workflow: note/title/tag/annotation editing, persisted reopening, search, duplicate/delete/undo/redo, drag/resize, tasks, templates, nested boards, image upload, JSON export, and sketches.
- Advanced browser workflow: safe note formatting, connectors, multi-selection/alignment, file download, valid/invalid imports, card transfer, and saved preferences.
- Mocked native bridge contract: load/save/export arguments and final-edit flushing before window destruction.
- No page errors in those browser workflows.
- Rust formatting checks, configuration-schema validation, shell-script syntax checks, and visual inspection of the initial workspace.
- Linux desktop compilation and Debian packaging also completed for the earlier standalone delivery.

## Remaining acceptance tests

Native interactive file dialogs, external-browser opening, Mac trackpad gestures and Command shortcuts, actual close/reopen flushing, second-instance behavior, media codecs, and recovery UI still need manual checks on a user Mac. The CI native smoke test proves startup and real frontend saving; it does not automate every interaction.

No Developer ID signing, Apple notarization, clean-machine installation, Windows build, production performance profiling, accessibility audit, or large-workspace QA has been performed. The Mac build has a valid local ad-hoc signature and may require Gatekeeper approval after download. It is not a notarized commercial release.

The application is local and single-user. Cloud synchronization, shared editing, and other hosted Milanote service features are outside this release's scope.


## 0.4.0 template and native-drop validation

- Node tests cover all 44 catalog adapters, section-relative geometry, fresh IDs, provenance, four recipe hierarchies, JSON round-tripping and managed-ID traversal rejection.
- Playwright bridge tests cover catalog search/filtering, project fields, Retina Finder coordinate conversion, large-video references, generic original retrieval and persistence. These simulate native drag events; they are not a physical Finder automation test.
- Rust tests exercise real source-to-managed copies, unchanged originals after source edits, large video imports without embedded previews, rejected folders/relative paths and bounded batch counts.
- Existing browser canvas, advanced editing, storage, 3D viewer and native-video bridge regressions run before upload.
- Real Apple Silicon build and native smoke tests passed on macOS 14 in [run 37811153055](https://github.com/dravani72/Atelier/actions/runs/37811153055), source commit `2c9ae67e8271b49b7708fdfad0e05bc133076e58`.
- Packaging checks passed: arm64 executable/dependencies, minimum macOS 14 metadata, local code signature, relocated portable libmpv dependency paths and `hdiutil` DMG integrity.
- The actual WebView launched and saved its workspace through Rust/SQLite. Native libmpv rendered H.264 MP4 (13 frames), HEVC MOV (11 frames, VideoToolbox-copy) and MPEG-4 AVI (13 frames), with display ICC applied and no playback errors.
- Artifact `11564863687` SHA-256: `718d9d4ffba72f08b132adc1b924da03ebfb29350d95a022de6c9142f8f8ea0a`. Download integrity and all inner package checksums are verified before delivery.
- The app has a local ad-hoc signature; Apple Developer ID signing and notarization were not performed. Physical Finder dragging on a personal Mac remains a manual acceptance check; event mapping is covered by browser bridge tests and Rust real-file copy tests.


## Intel macOS delivery — Atelier 0.4.0

Completed 2026-10-08. Source commit: `483e027196241841a234fd7684a6d7a844493f36`.

- Native Intel build passed in [run 37817700851](https://github.com/dravani72/Atelier/actions/runs/37817700851), on `macos-15-intel`. Rust target and all bundled media libraries were checked for `x86_64` architecture.
- The Intel app and DMG require **macOS 15.0+**. Its dependency inspection found a bundled library requiring 15.0, so both the deployment target and installer metadata were set to 15.0. The verifier checks every bundled Mach-O file against the declared minimum; it does not merely check the app's plist.
- All bundle identity, local signature, relocated-library-path and DMG integrity checks passed. The actual WKWebView launched and saved data through Rust/SQLite.
- Native libmpv rendered H.264 MP4 (11 frames), HEVC MOV (15 frames, VideoToolbox-copy) and MPEG-4 AVI (13 frames), with display ICC applied and no playback errors.
- Intel artifact `11568197250` SHA-256: `087477e676ab727e1610d4ad05ef7aaf89d0af5de35b63f39614bd6705aafea0a`. The downloaded artifact ZIP and every inner package matched their recorded SHA-256 checksums.
- Delivered installer: `Atelier_0.4.0_x86_64.dmg` (39,631,468 bytes). Corresponding media sources/recipes/patches/build records: `Atelier_0.4.0_Intel_MediaSources.zip` (233,024,952 bytes).
- The architecture-aware packaging changes also passed the Apple Silicon regression build and native smoke tests in [run 37817700764](https://github.com/dravani72/Atelier/actions/runs/37817700764). Apple Silicon retains its macOS 14.0 minimum.
- Intel and Apple Silicon packages are separate native installers and share the workspace schema. Developer ID signing, notarization and installation on every supported personal Mac model were not performed.

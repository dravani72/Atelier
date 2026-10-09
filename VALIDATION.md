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

## Timeline cards — validation (after 0.4.0)

Completed 2026-10-08 in a Linux container against the uncommitted working tree. No macOS build or native launch was run for this change, and no installer contains it yet.

- 14 Node.js model tests pass, four of them new: drop-frame and non-drop timecode round trips at every supported rate, calendar ticks and Monday-aligned weeks, connection integrity through delete/duplicate/validation, and rate, start and scale changes.
- 11 Rust tests pass (`cargo test --no-default-features`), two of them new. `tests/fixtures/timeline.json` is validated by both the JavaScript and the Rust validator and survives a SQLite save and reload byte for byte.
- `tests/timeline-ui.mjs` passes in headless Chromium: drag-to-connect, retime/trim/lane drags, undo/redo, range, start timecode, frame-rate and scale edits, date entry, the Connect tool, the picker, keyboard nudge and disconnect, a browser file drop, JSON/SVG/Markdown export, reload, re-import, and source-card deletion. Its second half drives the mocked Tauri bridge: hover feedback and a Finder drop of a managed video plus a text file onto the track.
- The existing main, advanced, template/drop, native-bridge and video-bridge browser suites still pass. `tests/viewer-ui.mjs` passes intermittently in this container before and after the change: it reloads 600 ms after saving a model view, which races the 400 ms autosave under software WebGL.

Not checked: WKWebView rendering and its native date picker, real Finder drops and trackpad gestures in the desktop app, very large boards, and boards with hundreds of clips.


## Grey video, palettes and graphite icon

The earlier 0.4.0 native checks counted frames and verified ICC availability; they did **not** establish that the window displayed correctly colored video. A grey framebuffer could satisfy the former pixel-sum check. Those checks are superseded by the captured-color checks below.

- Software rendering replaces the grey-only OpenGL presentation. Libmpv converts into aligned `rgb0` memory; immutable sRGB-tagged CGImages are presented in a native Cocoa child surface. Preview conversion is capped at 1280 × 720, uses CPU decoding/conversion, and is intended for SDR viewing. Original video files are unchanged. HDR accuracy and demanding-codec performance are not established by these tests.
- Apple Silicon packaging and native startup passed for source `9190fe405256f3f6119afa6a12b3c3e822d65df5` in [run 37865778797](https://github.com/dravani72/Atelier/actions/runs/37865778797). H.264, HEVC and MPEG-4 produced center RGB values `[252, 0, 0]`, `[0, 128, 0]` and `[0, 0, 255]`. WindowServer screen captures independently verified visible red, green and blue regions. Code signature, portable dependencies and DMG integrity checks passed.
- Intel packaging and the same three captured-color playback checks passed for the same source in [run 37865778919](https://github.com/dravani72/Atelier/actions/runs/37865778919). The package retains macOS 15.0+; Apple Silicon retains macOS 14.0+.
- 19 Node model tests and 12 real Rust/SQLite tests passed. Browser checks cover custom card fill/text/label colors, persistence and reset, drawing palettes, exact pixel colors, undo/redo, eraser, reopening an existing sketch and browser video cleanup. Existing editing, timeline, canvas and native-bridge regression suites passed. The playback mock is updated for the new ColorSync status and passes locally.
- Icon PNGs, ICNS, ICO and SVG are regenerated from the bundled Geist sans font as a white A on graphite. The icon and light/dark palette layouts were visually inspected.
- The Obsidian document is a design proposal only: no vault adapter, plugin, file watcher or vault write was implemented.

Physical Mac interaction, long-video performance, every media codec and monitor-specific color accuracy still require user-machine acceptance checks.

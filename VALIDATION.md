# Validation — Atelier 0.1.0

Completed on 2026-10-08 in Linux x86-64.

## Passed

- Six Node.js model/format tests: starter and templates, undo/redo, connection cleanup and duplication, invalid imports, checklist export, and escaped Markdown rendering.
- Six Rust tests against the actual bundled SQLite implementation: save/reopen persistence, invalid-save preservation, revision recovery, invalid hierarchy/version, dangling connectors, and frontend-fixture/backend schema compatibility.
- Main Playwright workflow: note/title/tag/annotation editing, IndexedDB persistence after reload, search, duplication/deletion/undo/redo, pointer drag/resize, task editing, templates, nested board navigation, image upload, JSON download, sketch creation, and persisted sketches.
- Advanced Playwright workflow: escaped note formatting, directed connectors, multi-selection and alignment, file attachment download, invalid-import preservation, valid backup import, moving cards between boards, and preference persistence after reload.
- Native bridge contract test with mocked Tauri calls: load/save/export arguments and final-edit flushing before window destruction. This does not substitute for a native-window test.
- No JavaScript page errors in these browser workflows.
- Rust formatting check and full desktop type checking.
- Complete Tauri desktop executable compilation and Debian package creation. Debug symbols were stripped from the packaged binary to reduce installer size. The resulting package is approximately 4.7 MB.
- Debian package metadata and ELF dependencies inspected; the binary contains no build-workspace RPATH.
- Visual inspection of the initial workspace screenshot, followed by an adjustment to card header spacing and another browser verification.

## Not performed

- Native-window launch, native file dialogs, actual system-browser launch, actual single-instance behavior, and actual native close-event testing. They compiled; bridge behavior was separately tested with mocks. This environment has no desktop display session.
- Installation on a clean Linux machine.
- macOS / Windows builds, signing, notarization, installers, or platform-specific codec checks.
- Production release profiling, long-session performance, very large workspaces, accessibility audits, or multi-platform QA.

## Runtime boundaries

The included Debian installer is an unsigned development build for Ubuntu 24.04 / x86-64. It is not a macOS or Windows installer. The package includes complete sources and a workflow for building on each platform, but that workflow has not been run on hosted CI.

This delivery is a functional local application with broad board-editing features, not full parity with Milanote's hosted collaboration service. See README.md for the explicit feature scope and limitations.

## Apple Silicon build preparation

An explicit ARM64 target, macOS 13 minimum-version overlay, ad-hoc signing, local build launcher, native runner workflow, bundle/signature/DMG checks, and fresh-runner native launch smoke test have been prepared. Shell syntax checks and the existing Rust and model tests pass. The Mac build, packaging validation, and native smoke test have not yet run; no Mac executable is included in the Apple Silicon build kit.

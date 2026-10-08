# Atelier

The native Apple Silicon app and DMG are built and verified for macOS 13+. Download the `Atelier-macOS-AppleSilicon` artifact from [the successful Mac build](https://github.com/dravani72/Atelier/actions/runs/37798399100), or rebuild with `bash scripts/build-macos.sh`. See `APPLE_SILICON.md` for installation and signing details.

A standalone visual workspace for creative projects. Original interface inspired by spatial creative tools such as Milanote. Rust powers the desktop shell, SQLite storage, recovery history, native export dialogs, and safe external link opening. The canvas UI is HTML/CSS/JavaScript inside Tauri's system webview. This is not an all-Rust GUI.

## What works

- Freeform boards with drag, resize, zoom, pan, fit-to-content, and optional grid snapping.
- Notes with Markdown bold, italic, headings, lists, quotes, and inline code; headings, checklists with progress, images, video, files, links, sketches, columns, and nested board cards.
- Columns act as visual containers: dragging a column also moves cards fully inside it.
- Card colors, tags, personal annotations, moving between boards, multi-selection, alignment, and grid arrangement.
- Directed connectors with editable labels; delete and duplication preserve connection integrity.
- Workspace-wide search across board titles, notes, tasks, tags, links, and annotations.
- Undo/redo (60 steps per session), copy/paste within the app, keyboard shortcuts, and light/dark workspace preferences.
- Blank, film pre-production, moodboard, story-development, and creative-campaign templates.
- Offline SQLite autosave with atomic transactions and ten recovery snapshots, taken at most once every five minutes when saving an existing workspace.
- Workspace JSON backups with embedded attachments, import validation, SVG visual exports, and Markdown exports.
- Browser preview with IndexedDB persistence; the same canvas is embedded in the desktop app.

## Included Linux installer

The previous standalone ZIP includes `dist/Atelier_0.1.0_amd64.deb`, an unsigned development build compiled for Ubuntu 24.04 / x86-64. Install it with `sudo apt install ./dist/Atelier_0.1.0_amd64.deb` on a compatible Linux desktop. It requires GTK 3 and WebKitGTK 4.1, which the package manager resolves. This installer was compiled and inspected, but its native window was not launched in the build environment. The current macOS installer is delivered separately; a Windows installer is not included.

## Run the desktop application

Install **Node.js 22 or newer**, **Rust stable**, and the [Tauri platform prerequisites](https://v2.tauri.app/start/prerequisites/).

On macOS, install Xcode Command Line Tools with `xcode-select --install`. On Windows, use the Microsoft C++ Build Tools and WebView2 runtime. On Ubuntu/Debian, install the Tauri Linux packages:

```sh
sudo apt-get update
sudo apt-get install build-essential pkg-config libwebkit2gtk-4.1-dev libssl-dev librsvg2-dev libayatana-appindicator3-dev
```

Then, in this directory:

```sh
npm ci
npm run desktop
```

The desktop app embeds its UI. It needs neither a local server nor an internet connection at runtime. There is no login. A second desktop launch focuses the existing instance. Closing the window flushes pending saves.

## Build an installer

```sh
npm run build
```

Installers are written to `src-tauri/target/release/bundle/` for the operating system where you build. Build macOS installers on macOS, Windows installers on Windows, and Linux installers on Linux. Signing and notarization require your own certificates. The included GitHub Actions workflow builds unsigned macOS, Windows, and Linux artifacts when manually triggered in your own repository; it does not publish releases.

## Try the browser preview

```sh
npm run dev
```

Open `http://localhost:4173`. The preview saves to that browser's IndexedDB; it is a separate workspace from the desktop database. Transfer work with JSON export/import. Keep the same origin and port when returning to the preview.

## Test

```sh
npm test
npm run check
npx playwright install chromium
npm run dev
# In another terminal:
npm run test:ui
npm run test:advanced
npm run test:bridge
```

`npm test` checks board-model invariants. `npm run check` tests the real Rust/SQLite backend without desktop libraries. `npm run test:ui` exercises the UI in Chromium. Desktop checks use `cargo check --manifest-path src-tauri/Cargo.toml` after installing the platform prerequisites. See `VALIDATION.md` for checks actually completed for this delivery.

## Daily use

Use the left toolbar to add cards; drag their headers to move them. Select a card to edit its details. Hold Shift while clicking to select several cards. Drag the bottom-right corner of a selected card to resize it. Use Space + drag or middle mouse drag to pan. Use Ctrl + scroll to zoom, and F to fit the board. Double-click empty space for a note, a board card to enter it, or a connector to edit its label.

Attachments can be uploaded, pasted from the clipboard, or dropped onto the canvas. Links are opened in the system browser; remote pages are not embedded. JSON export includes everything and is the recovery format. SVG exports preserve the board's visual arrangement with plain text and embedded images; video and files appear as labeled cards. Markdown exports preserve written content and checklists, rather than board layout.

## Data and limits

The desktop database is `atelier.sqlite3` in the OS application-data directory for `studio.atelier.boards`: typically `~/Library/Application Support/studio.atelier.boards/` on macOS, `%APPDATA%/studio.atelier.boards/` on Windows, or `~/.local/share/studio.atelier.boards/` on Linux. Close the app before copying database files; prefer the portable JSON backup for transfers.

Each ordinary attachment is limited to 15 MB (3D models: 50 MB); the complete serialized workspace is limited to 100 MB. Files are embedded as base64, so their stored size is larger than their original size. Recovery snapshots also retain embedded media and can occupy additional disk space. Local data is not encrypted. Your OS account and disk encryption protect it. Undo history lasts for the current session; recovery snapshots and backups survive restarts.

## Scope of this release

This is a local single-user application, not full parity with Milanote's hosted service. It does not include cloud synchronization, accounts, real-time collaboration, invitations, web clipping, automatic link previews, a mobile app, a WYSIWYG rich-text editor, or a built-in PDF renderer. Notes store Markdown as plain text. Columns are visual grouping, not automatically reflowing lists. Board copies retain references to existing nested boards. There is no automatic updater, signing setup, or migration beyond workspace format v1. Video support depends on the platform webview's installed codecs. The source includes build configuration for three platforms; only the validation explicitly recorded in `VALIDATION.md` has been performed.

## Architecture

- `ui/model.js`: workspace schema, validation, history, templates, and pure board operations.
- `ui/app.js`: canvas rendering, pointer interaction, inspector, dialogs, and exports.
- `ui/storage.js`: Tauri command bridge with an IndexedDB preview adapter.
- `src-tauri/src/lib.rs`: Rust validation, SQLite transactions and recovery history, native commands.
- `src-tauri/tauri.conf.json`: embedded assets, window configuration, and content-security policy.
- `tests/`: model and browser integration tests.

No remote scripts, fonts, trackers, account service, or media hosts are used. Imported note text is escaped. Active HTML/SVG attachments are rejected, and external links are restricted to HTTP/HTTPS. App commands only access the app's database; native exports use a user-selected save dialog. The frontend never receives unrestricted filesystem access.

## License

MIT. Milanote is a trademark of its owner; this independent application has no affiliation with Milanote.

## 3D reference viewer (0.2.0)

Use **3D model + resources** in the toolbar or drop files onto a board. Select the primary model together with its material libraries and textures in one import. Each model is stored in the workspace along with the selected resources, so viewing and backups work offline. Double-click its card or choose **Explore in 3D**. Orbit by dragging, pan by right-dragging, and zoom with the scroll wheel. Fit, wireframe, grid, animation clip selection, play/pause, timeline scrubbing, and position/rotation/scale controls are available. **Save view** stores transforms, camera, and a board thumbnail. Imported source files are preserved; transformations affect the preview only.

| Format | Preview support |
| --- | --- |
| FBX | ASCII 7+ and binary 6400+, mesh/material preview and supported skeleton/animation clips. Embedded or selected textures. |
| OBJ + MTL | Static geometry with basic materials and selected texture resources. |
| USD / USDA / USDC | ASCII and binary scene geometry and supported USD materials. |
| USDZ | Packaged ASCII or binary USD with bundled resources; preferred for portable USD references. |
| USDT | Accepted as an alias for ASCII USDA content. The standard text USD extension is `.usda`. |

This is a visualization tool, not a full Autodesk FBX SDK or OpenUSD authoring engine. Advanced composition, custom schemas/shaders, some deformation features, and USD animation may not reproduce completely. Package externally composed USD scenes as USDZ or flatten them before importing. Missing or ambiguous resources and scenes with no supported meshes show an explicit message. Resource lookup uses local embedded files and does not fetch remote model dependencies. File names must be unique when models reference textures by basename.

3D source files may be up to 50 MB, accompanying resources up to 15 MB each, and an import up to 100 files. The complete workspace still has a 100 MB serialized limit, including base64 and saved thumbnails. Large scenes require more memory while rendering. The viewer uses bundled Three.js; the desktop application and local persistence remain Rust/Tauri/SQLite. Run `npm run build:ui` before standalone browser tests; native development and packaging build the bundle automatically.

Validation: real WebGL browser tests cover OBJ/MTL, ASCII USD aliases, transforms, saved thumbnails, persistence, malformed files, and existing workspace features. Animated binary FBX and packaged USDZ reference assets are also exercised during release validation. The macOS workflow separately checks native ARM64 packaging, signing, launch, and local persistence.

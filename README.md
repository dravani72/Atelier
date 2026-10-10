# Atelier

**Download for Mac:** [Apple Silicon (M-series)](https://github.com/dravani72/Atelier/releases/latest/download/Atelier-AppleSilicon.dmg) · [Intel](https://github.com/dravani72/Atelier/releases/latest/download/Atelier-Intel.dmg). Open the downloaded file and drag Atelier into Applications. These links always fetch the newest successful build of `main`; the Apple Silicon build needs macOS 14 or newer and the Intel build macOS 15 or newer. To build it yourself, run `bash scripts/build-macos.sh`. See `APPLE_SILICON.md` for installation and signing details.

A standalone visual workspace for creative projects. Original interface inspired by spatial creative tools such as Milanote. Rust powers the desktop shell, SQLite storage, recovery history, native export dialogs, and safe external link opening. The canvas UI is HTML/CSS/JavaScript inside Tauri's system webview. This is not an all-Rust GUI.

## What works

- Freeform boards with drag, resize, zoom, pan, fit-to-content, and optional grid snapping.
- Notes with Markdown bold, italic, headings, lists, quotes, and inline code; headings, checklists with progress, images, video, files, links, sketches, columns, and nested board cards.
- Columns act as visual containers: dragging a column also moves cards fully inside it.
- Every card type has its own color: its toolbar icon, its icon tile, and the shade of the card itself. A card can also be set to plain or a named tint.
- Each board can sit on any backing color, from presets, the system color picker, or a hex value. Cards keep the app's theme, headings and connectors switch to an ink that reads on the backing, and a card type whose shade would sit too close to it deepens.
- Tags, personal annotations, moving between boards, multi-selection, alignment, and grid arrangement.
- Directed connectors with editable labels; delete and duplication preserve connection integrity.
- Timeline cards that run left to right in timecode or calendar dates, with any card on the board connected as a clip or marker.
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
npm run test:timeline
npm run test:bridge
```

`npm test` checks board-model invariants. `npm run check` tests the real Rust/SQLite backend without desktop libraries. `npm run test:ui` exercises the UI in Chromium. Desktop checks use `cargo check --manifest-path src-tauri/Cargo.toml` after installing the platform prerequisites. See `VALIDATION.md` for checks actually completed for this delivery.

## Daily use

Use the left toolbar to add cards; drag their headers to move them. Select a card to edit its details. Hold Shift while clicking to select several cards. Drag the bottom-right corner of a selected card to resize it. Use Space + drag or middle mouse drag to pan. Use Ctrl + scroll to zoom, and F to fit the board. Double-click empty space for a note, a board card to enter it, or a connector to edit its label.

Attachments can be uploaded, pasted from the clipboard, or dropped onto the canvas. Links are opened in the system browser; remote pages are not embedded. JSON export includes boards and embedded previews. Managed originals and large videos remain on this Mac and require a separate copy when migrating. SVG exports preserve the board's visual arrangement with plain text and embedded images; video and files appear as labeled cards. Markdown exports preserve written content and checklists, rather than board layout.

## Data and limits

The desktop database is `atelier.sqlite3` in the OS application-data directory for `studio.atelier.boards`: typically `~/Library/Application Support/studio.atelier.boards/` on macOS, `%APPDATA%/studio.atelier.boards/` on Windows, or `~/.local/share/studio.atelier.boards/` on Linux. Close the app before copying database files; prefer the portable JSON backup for transfers.

Embedded previews are limited to 15 MB each (3D models: 50 MB). Native Finder drops also preserve original files in managed storage; oversized files become downloadable attachment cards. Video drops use managed storage without base64 embedding; the complete serialized workspace is limited to 100 MB. Files are embedded as base64, so their stored size is larger than their original size. Recovery snapshots also retain embedded media and can occupy additional disk space. Local data is not encrypted. Your OS account and disk encryption protect it. Undo history lasts for the current session; recovery snapshots and backups survive restarts.

## Scope of this release

This is a local single-user application, not full parity with Milanote's hosted service. It does not include cloud synchronization, accounts, real-time collaboration, invitations, web clipping, automatic link previews, a mobile app, a WYSIWYG rich-text editor, or a built-in PDF renderer. Notes store Markdown as plain text. Columns are visual grouping, not automatically reflowing lists. Board copies retain references to existing nested boards. There is no automatic updater, signing setup, or migration beyond workspace format v1. The macOS edition bundles libmpv for video playback. The source includes build configuration for three platforms; only the validation explicitly recorded in `VALIDATION.md` has been performed.

## Architecture

- `ui/model.js`: workspace schema, validation, history, templates, and pure board operations.
- `ui/timeline.js`: timecode and calendar arithmetic, ruler ticks, and timeline connection rules. No DOM.
- `ui/app.js`: canvas rendering, pointer interaction, inspector, dialogs, and exports.
- `ui/storage.js`: Tauri command bridge with an IndexedDB preview adapter.
- `src-tauri/src/lib.rs`: Rust validation, SQLite transactions and recovery history, native commands.
- `src-tauri/tauri.conf.json`: embedded assets, window configuration, and content-security policy.
- `tests/`: model and browser integration tests.

No remote scripts, fonts, trackers, account service, or media hosts are used. Imported note text is escaped. HTML/SVG originals can be preserved as inert attachments; active embedded HTML/SVG is rejected, and external links are restricted to HTTP/HTTPS. App commands access the app database and managed media, and import paths provided by native file drops; native exports use a user-selected save dialog. The frontend never receives unrestricted filesystem access.

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


## Native libmpv video (0.3.0)

The Apple Silicon macOS edition renders video in a native OpenGL surface inside the Atelier window using libmpv's render API. The webview contains controls, not decoded video pixels. Use **Video · libmpv** to import MOV, MP4, AVI, MKV, WebM or MXF. Imports are copied into `~/Library/Application Support/studio.atelier.boards/video-media`; large videos are not embedded in JSON. JSON backup contains identifiers only for these videos: preserve this directory or retain original files and re-import when migrating to another Mac. Deleting cards retains their media, preserving undo and recovery snapshots. Missing media produces an error rather than silently substituting another file.

Play/pause, exact seeking, frame stepping, playback speed, volume, and source codec/color metadata are available. Libmpv handles metadata-driven matrix, primaries, transfer and range conversion. The app supplies the active screen's ICC profile to `MPV_RENDER_PARAM_ICC_PROFILE` and refreshes it when the window moves to another screen. The viewer is an SDR display-managed preview: HDR sources may be tone mapped; it does not promise HDR/EDR mastering, calibration, missing-metadata repair, or a match to Resolve's project transforms. VideoToolbox hardware decoding is requested with a copy fallback; reported `hwdec-current` shows the actual decoder. This is not a guarantee of zero-copy or hardware decoding for every codec.

Version 0.3.0 requires macOS 14+ because the bundled Homebrew media dependencies target that version. Users need no separate mpv, FFmpeg or Homebrew installation. Build Macs require Homebrew; `scripts/build-macos.sh` obtains libmpv, relocates its actual dylib dependency closure, signs the result, and creates the DMG. Media license notices, versions, recipes and source archives are shipped separately as `Atelier_0.3.0_MediaSources.zip`. Atelier source remains MIT; the combined binary containing GPL media libraries is distributed under GPL-3.0-or-later (see `COPYING-GPL-3.0`).

The macOS workflow tests real H.264 MP4, HEVC MOV and MPEG-4 AVI decoding, OpenGL output pixels, display ICC availability, native startup and SQLite persistence. Frontend bridge tests cover import references, controls, metadata, resizing, teardown and saved video cards. Source transfer metadata and build records accompany the corresponding media source archive.

## Templates and Finder drag and drop (0.4.0)

The template gallery includes all 44 Starter Pack v1 templates and the four commercial campaign, content series, narrative film and documentary recipes, alongside the original five starting points. Search titles, tags, descriptions or media kinds; filter by discipline or recipes. Every template section becomes a movable column containing editable prompt notes. Project details are editable from the board menu. Each instance pins template ID/version and creates fresh IDs; changes never update earlier instances. Recipes create a project board with linked child boards and a shared project identifier. Their proposed shared production entities are a roadmap, not an implemented relational production system.

Finder drops now use Tauri's native event API, convert physical Retina coordinates to canvas coordinates, and import at the drop location with visible hover feedback. Drop up to 100 regular files together. MOV/MP4/AVI and other recognized video extensions use the existing bundled libmpv player. Drop FBX/OBJ/USD family files with MTL and textures in the same batch for the existing viewer. Mixed batches retain unrelated files as separate cards. Originals are copied unmodified into `video-media` in the application-data directory; duplicated or moved cards retain the same original reference. Use **Save original file** in the inspector to retrieve one. Files without supported previews—including PSD, SVG, audio, and oversized models—remain attachments; no layered PSD editor or audio waveform is implied.

Previews are bounded to 60 MB of raw bytes per native batch and the existing 100 MB serialized workspace limit. If that workspace limit would be exceeded, split the import or export and remove older media first. Large native originals occupy additional local disk space and are not included in JSON exports; when migrating, close Atelier and copy the complete application-data folder, including the database and `video-media` directory. No automatic managed-file garbage collection occurs, so recovery snapshots and duplicated references remain valid.

The starter pack is represented by `ui/template-data.js`; the adapter is in `ui/model.js`. The supplied catalog, implementation brief, example treatment and handoff notes are preserved in `template-pack/`. The templates are editable planning scaffolds. Animatic playback, PDF rendering/export, arbitrary 3D or splat rendering, and executable node graphs are not enabled merely by choosing their template, and a template does not add a Timeline card for you.

## Intel macOS delivery

The same Atelier 0.4.0 app can be built natively for `x86_64-apple-darwin`, with all templates, Finder drops, the 3D viewer and bundled libmpv. Run `bash scripts/build-macos.sh` on an Intel Mac with Xcode Command Line Tools, Node.js 22+, Rust and matching Intel Homebrew libmpv libraries. The architecture settings are shared by the build, package verifier and native launch tests; outputs go to `dist/intel/` as `Atelier_0.4.0_x86_64.dmg` and the Intel application ZIP. The Intel package requires macOS 15.0 or later, matching the minimum found in its bundled media libraries. The verifier rejects any library requiring a higher OS version. The Apple Silicon package retains its macOS 14.0 minimum.

The Intel CI workflow runs on `macos-15-intel`, installs existing Intel bottles from pinned Homebrew core commit `f4288f5dcc2195b4088c2352bc42446ce7c2728f`, and tests actual native video rendering. Its setup helper is restricted to a fresh GitHub Actions runner and must not be run on a personal Mac. Homebrew stopped routine Intel bottle updates; pinning the complete media graph keeps versions and source records consistent. The end-user app needs no Homebrew, mpv or FFmpeg installation. The Intel media-source archive includes its exact formulas, source archives, patches and target build records.

Intel and Apple Silicon installers use the same bundle identifier and local database schema. Choose the installer matching the Mac's processor; these are separate native builds, not a universal binary. Both use local ad-hoc signatures; Developer ID signing and Apple notarization require a separate release-signing setup.

## Timelines (after 0.4.0, not yet in a released installer)

Use **Timeline** in the toolbar to add a timeline card: a ruler that runs left to right with lanes underneath. Choose its scale in the inspector. **Timecode** has a frame rate (23.976, 24, 25, 29.97, 30, 48, 50, 59.94 or 60 fps, with drop-frame for 29.97 and 59.94), a start timecode and a duration. **Calendar dates** has a first and last day, labelled by day, week, month, quarter or year depending on how much room the range has; today is shaded when it falls inside the range.

Connect any card on the same board except a column or another timeline:

- Drag the card by its header and release it over the track. It connects at the time under the pointer and returns to where it was on the board.
- Drop files from Finder or the browser onto the track. Each becomes a card just below the timeline, already connected.
- Choose **Connect ideas**, click the card, then click the timeline (or the other way round).
- Double-click an empty part of the track, or use **Connect a card** in the inspector, to pick from the board's cards.

A connection is a clip with a position, a length and a lane; the card itself stays on the board, and a dashed line joins the two unless you switch lines off for that timeline. The same card can be connected more than once. Drag a clip to retime it, drag either edge to trim it, and drag it up or down to change lane. Dragging snaps to whole days, or to a timecode step fine enough for the current width; the inspector fields take exact values. There, the in point (or first day) moves a clip and the out point (or last day) sets its length; an out point equal to the in point makes a zero-length marker. With a clip highlighted, ← and → nudge it by a frame or a day (Shift: a second or a week), and Backspace/Delete disconnects it without deleting its card. Double-click a clip to select its card. Selecting a card highlights its clips.

Timecode entry accepts `HH:MM:SS:FF`, `HH:MM:SS`, `MM:SS`, plain seconds, or a frame count such as `48f`. Timecode counts at the whole-number base, so 23.976 fps counts 24 frames per second. Drop-frame skips labels, not frames: a label that drop-frame omits, such as `00:01:00;00`, resolves to the next real frame. Changing the frame rate keeps every timecode label where it was and rescales the frame part. Changing the start timecode carries the clips with it; changing a date range leaves clips on their calendar days, and the footer reports any that fall outside the range. Switching between timecode and dates keeps each clip at the same fraction of the way along.

Deleting or moving a card removes its clips; duplicating a timeline together with its cards reconnects the copy to the copied cards. SVG export draws the ruler, clips and lines; Markdown export lists each clip with its time. A timeline is stored on its card as `timeline: {mode, fps: [numerator, denominator], drop, start, end, links, items: [{id, card, at, len, lane}]}`. Positions are whole frames counted from `00:00:00:00`, or whole days since 1970-01-01, and the range is `[start, end)`. The JavaScript and Rust validators both reject connections to missing cards, non-integer positions, unknown frame rates and more than 500 connections or 12 lanes per timeline.

This is a planning ruler, not an editor. Nothing plays back along it, there are no audio tracks, and a video card's real duration is not read: a new clip is about one eighth of the range long (one day on a date timeline) until you trim it. A timeline always shows its whole range across the card's width, so widen the card or zoom the board for more room. Date timelines work in whole days without times of day or time zones. A timecode timeline ends by frame 21,600,000, which is 100 hours at 60 fps.

## Canvas organization (after 0.4.0, not yet in a released installer)

The toolbar now includes **Sticky note**, **Shape**, **Frame**, and **Table**. Use **Frames & layers** for the object outline, layer visibility/locking, and frame order; **Map** for a clickable minimap; and **Present** for static local frame slides. Drag empty canvas to marquee-select cards; use Shift to extend selection. Space/middle drag still pans.

The inspector and right-click menu provide grouping (Cmd/Ctrl G; Shift Cmd/Ctrl G to ungroup), locks, stacking, alignment, equal-gap distribution, framing a selection, and explicit column reflow. Frames move fully enclosed visible, unlocked cards. Tables use plain text cells with an editable header row. Shapes support rectangle, ellipse and diamond. Double-click a connector to choose curved, straight or elbow routing and toggle its arrowhead.

These features use the existing autosave, undo and JSON backup model. Old version-1 workspaces remain compatible. Locked objects are protected from ordinary canvas edits, not secured against workspace imports or file access. Existing installers do not include these additions until a new build is released. See [UI_UX_PARITY.md](UI_UX_PARITY.md) for the audited comparison and remaining gaps; this is not complete Milanote/Miro feature parity.

Run `npm test`, `npm run check`, and `npm run test:canvas` alongside the existing browser suites.

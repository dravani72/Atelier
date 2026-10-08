# Atelier: template and mixed-media workspace handoff

Version 1.0.0 — 8 October 2026

## Purpose and status

Build a producer/director workspace where a creative pitch evolves into production documents without copying assets or losing decisions. This pack supplies 44 original template scaffolds and four project recipes. It is inspired by the workflow categories in Milanote, not copied template content or imagery. No application code has been changed. The JSON format is a proposed interchange model; adapt it to Atelier's existing architecture before importing. No real media is included.

The existing app's language, renderer, persistence layer, and importer are deliberately unspecified. Preserve them where possible. Implement this as a template catalog plus shared document primitives, not a parallel app.

## Core interaction

Create project → choose recipe or individual template → replace prompts and add media → connect references → arrange client presentation → capture reviews → issue production documents → deliver versions.

Each asset is registered once. Board nodes reference a specific asset version and store their own crop, trim, camera bookmark, annotation, and display settings. A storyboard can reference a scene, shot, model, narration clip, and eventual plate. References survive reorganizing a board.

Three representations of one document:

- Canvas: spatial exploration, groups, free arrangement, linked sub-boards, graph connectors.
- Structured view: editable fields, tables, story beats, shots, evidence, and tasks.
- Presentation: ordered frames with explicit visible content, media timing, camera bookmarks, and narration.

Switching views must not silently rearrange creative boards or replace asset references. Client publication creates a selected, versioned presentation snapshot. Working notes, costs, private contacts, and research boundaries stay outside that snapshot unless explicitly selected.

## Template catalog implementation

`templates.json` contains catalog metadata, template-specific field names, ordered sections, initial prompt cards, suggested node kinds, and a proposed presentation order. Seed cards contain no filled-in project facts. Coordinates use logical canvas units and node coordinates are relative to their section. Section groups have their own local origin.

When instantiated:

1. Create a project document with a fresh document ID.
2. Create fresh section and node IDs; remap internal references together.
3. Retain template ID and template version as provenance.
4. Resolve requested node kinds against the app's actual capability registry.
5. Keep unavailable viewers as labeled source attachments with thumbnails where available.
6. Let the user remove prompts, add sections, save a personal preset, and change order.

Template updates affect future instances. Existing work changes only through an explicit migration with a preview and recoverable prior version. Do not duplicate project entities when a recipe adds several boards.

Catalog selection filters: discipline, purpose, project phase, view type, media capability. Offer practical entry points: Pitch a commercial; Plan a content series; Develop a narrative; Develop a documentary; Create a working board.

## Document primitives

Text/rich text; image; video; audio; file attachment; PDF page; SVG; PSD preview; table; checklist; link; sub-board; storyboard frame; timeline; graph; 3D scene; scan; annotation; presentation frame.

Every visual node needs ID, kind, parent/group, bounds, z-order, visibility, content, asset reference, and capability state. Use the app's existing transform model for rotation and nested coordinates. Generic template fields are starter keys: the adapter must define types, requiredness, and editors.

Important specialized records:

- Shot: stable shot ID, scene ID, setup, priority, action, lens, sensor, camera movement, audio, estimated duration, status, source frame references.
- Storyboard frame: shot reference, image/model view, duration, dialogue/VO/SFX, framing, continuity notes, approval.
- Documentary claim: exact claim text, source reference, source locator, corroborating/contradicting sources, confidence, verification state, open question.
- Archive use: source, rights holder, license record, permitted scope, cost, clearance state, expiration, replacement.
- Deliverable: destination, duration, aspect ratio, resolution, frame rate, codec/container, color, audio, language/captions, filename, owner, approval and receipt.
- Review note: asset version, frame/time or spatial anchor, note, author, status, decision, approver. A version change does not automatically carry approval forward.

## Shared asset model

Asset identity is distinct from file version and board node. Keep originals immutable. Edits produce a new version or an explicit derivative.

Asset fields: ID; project; human label; source filename; MIME; byte count; checksum; ingest state; creator/source; capture/import date; source application; rights/consent references; tags; dependency files; versions.

Version fields: version ID; original location; checksum; format profile; technical metadata; derivative IDs; extraction warnings; created timestamp.

Derivative fields: derivative ID; source version ID; role (thumbnail, page preview, video proxy, waveform, transcript, normalized model, point-cloud LOD, splat preview); processing settings; output checksum; status/error. A derivative never overwrites the original.

Ingest states: queued → probing → processing → ready; partial or failed states retain the original and explain the unavailable capability. Cancel and retry must be available. Accepting a file does not mean it can be decoded, edited, or rendered interactively.

## Media capability matrix

| Asset | Baseline behavior | Enhanced behavior | Boundaries and fallback |
|---|---|---|---|
| JPEG/PNG/WebP/TIFF/EXR | Source attachment and supported preview | Crops, annotations, palettes, metadata | High-bit-depth/HDR images require explicit display transforms; proxy if decoder unsupported |
| MP4/MOV/MXF/AVI | Source, metadata and poster; playback for supported streams | Trim views, frame references, time notes, linked transcript | Containers do not imply supported codecs; failed decode retains source |
| WAV/AIFF/MP3/AAC/FLAC | Supported playback and waveform | VO takes, music/SFX cue regions, fades, transcript, gain | Preserve sample rate/channel metadata; transcripts are reviewable derivatives |
| PSD/PSB | Preserve original plus supplied or generated composite | Layer hierarchy, visibility, isolated layer previews when supported | Layer effects, fonts, smart objects and adjustment stacks may not reproduce faithfully; identify preview provenance |
| PDF | Pages, thumbnails, text where available, annotations | Place selected pages into canvas or deck | Preserve original; do not treat imported layout as native editable content |
| SVG | Sanitized vector preview plus original | Supported paths/text/shapes editable through explicit conversion | External resources, scripts, fonts and filters require controlled handling; raster fallback |
| GLB/glTF | Mesh viewer with supported materials and textures | Orbit, camera bookmarks, annotations, lighting variants | Validate dependencies and extensions; unknown extensions retain source and preview |
| OBJ/FBX/USD/USDZ | Attach originals and available previews | Explicit conversion into a supported scene representation | Conversion is format/feature dependent; preserve original and loss report |
| PLY/LAS/E57/XYZ | Inspect source and identify data kind | Dedicated point-cloud viewer with LOD | PLY can encode mesh, points or splats; inspect properties rather than infer from extension |
| Gaussian splats | Source plus poster or recorded flythrough | Dedicated splat renderer and camera bookmarks | Splat radiance is not equivalent to a relightable mesh; support only declared encodings |
| Polycam captures | Import exported files/packages with dependencies | Scan viewer, spatial notes and camera plans | Scan kind, unit scale and export availability vary; integration is separate from file import |
| Project files from NLE/DCC tools | Original attachment, dependency manifest, rendered preview | Explicit adapters for chosen versions and formats | Native live editing is a separate product commitment |
| LUTs, fonts, logos and other references | Source attachment with role metadata | Validated application where supported | Document license, dependencies and color intent |

Polycam currently documents mesh, point-cloud, floorplan and Gaussian-splat exports. Design around imported exports first. A later account/API integration should declare supported capture types and authorization scope. The user must confirm or calibrate real-world scale before dimensions become production measurements.

## Video and color

If Atelier already uses libmpv, retain it as the video playback engine behind a capability interface. Its color-management configuration is part of integration work: the libmpv render API requires the host application to provide the display ICC profile. Accurate results depend on metadata, display configuration, output transforms and the app's compositor.

Record source primaries, transfer, matrix, range, HDR metadata and embedded ICC where relevant. Keep these distinct from presentation/export intent. Aboard conversion must not silently bake a display transform into a source file. Poster frames and proxies record their transform so SDR previews do not imply HDR parity. Do not promise broadcast or cinema mastering accuracy from the canvas viewer.

Visible cards may use posters until selected, with a bounded player pool. Only one audio master should play by default. User actions choose focus, play/pause, scrubbing and mute. Do not spawn a decoder for every card.

Store frame rate as a rational and time as rational ticks or a documented integer timebase. Retain source start timecode and drop-frame convention when known. Variable-frame-rate sources require timestamp-based anchors. Avoid rounded millisecond arithmetic for frame-accurate work.

## 3D and scan scene state

Persist source asset version, scene renderer version, unit declaration, calibrated scale, handedness/up axis, transforms, origin, camera bookmarks, perspective/orthographic mode, focal length/sensor or field of view, annotations, material overrides, lighting preset and ground plane.

Keep source transforms distinct from user staging transforms. A camera bookmark captures the scene version it references. Measurements show whether they are calibrated or estimated. Point clouds use chunking/LOD; meshes can use reduced-preview derivatives. GPU/CPU resource budgets must be configured against the target machines and measured with representative projects.

A client view can present a selected model interactively. Its static fallback is a poster or saved camera view. Splat viewers and point-cloud viewers are separate capabilities from mesh rendering. Video decoding does not provide a 3D renderer.

## Timelines and narration

An animatic is a sequence of frames/clips plus audio tracks. A narrated pitch uses presentation frames and cue regions. Separate those two concepts while sharing media and timing primitives.

Tracks: picture, VO, dialogue, music, effects/ambience. Store clip trim-in/out, timeline start, duration, gain, fades, mute/solo and version references. Manual playback is always available. Autoplay is optional and requires a user gesture in environments that restrict it.

An audio cue can reference a frame transition or absolute sequence time. Editing order triggers a timing review, not an unannounced audio shift. Transcript text and captions link to the source clip and have their own version/approval status.

## Graphs

Provide three explicitly named graph types:

1. Creative relationships: characters, themes, references, influences. Cycles allowed.
2. Production dependencies: tasks, assets, approvals, deliverables. Cycle warnings where scheduling requires an acyclic graph.
3. Technical pipeline specification: inputs, processes, outputs and ownership. Descriptive by default.

Graph edge fields: ID, source node, target node, type, label and optional port IDs. Technical graphs become executable only when a real runtime, typed ports, process isolation, validation and error reporting exist. A Fusion/Nuke-like visual diagram is not automatically a compositor.

## Presentation and export

Client presentation is an ordered set of frames, each referencing selected node IDs or scene camera bookmarks. Presenters can reveal details, play a clip, hear VO, rotate a model or visit a sub-board without exposing the entire workspace.

Required export modes:

- PDF: rendered still pages; clickable links and media poster/QR links; no promise of playable embedded video/3D.
- PPTX: target slide layouts, stills and supported media/link behavior; fallback manifest for unsupported interactivity. Verify in the intended presentation application.
- MP4: rendered presentation/animatic with baked camera moves, timing and mixed narration; captions optional.
- HTML/share view: supported interactive media plus explicit static/offline fallbacks.
- Project package: manifest, documents, assets/dependencies, versions and optional proxies; relative internal references; checksums and missing-file report.
- Production data: shot list, schedule and deliverables to CSV/JSON, preserving IDs and timezone/date semantics.

Exports produce an inclusion report: included, transformed, omitted and externally linked content. A reproducible export pins asset versions. A package with external-only sources clearly identifies what will be unavailable offline.

## Build sequence and acceptance

Phase 1: catalog, instantiation, grouped canvas, text/image/file primitives, shared asset/version registry, presentation order, PDF still export. Acceptance: choose a template, fill and rearrange sections, reuse one asset across documents, recover previous document state, export only selected public content.

Phase 2: supported video/audio playback, waveform/proxies, storyboard fields, version-anchored review, narrated pitch timing, animatic render. Acceptance: change source version without losing old reviews; non-integer frame-rate anchors remain correct; playback respects one audio focus; unsupported streams show clear fallback.

Phase 3: PDF pages, PSD composites, safe SVG viewing, GLB/glTF scenes, exported scan import, calibrated measurements and camera bookmarks. Acceptance: mult-file texture dependencies resolve; missing resources are reported; original PSD is recoverable; scan units are explicit; unsupported splats show preview.

Phase 4: dedicated point-cloud/splat viewers, richer graph types, interactive sharing, PPTX export and specialist app adapters. Acceptance: interactive/static exports report their differences; technical graphs are labeled descriptive unless executable; representative large-board benchmarks meet agreed target-machine budgets.

The product should allow all original files to be retained from Phase 1. Viewer availability grows independently. This avoids treating support for 'everything' as a claim that every proprietary source format can be edited natively.

## Reference sources

Checked 8 October 2026. These inform categories and media boundaries; the proposed product design is original.

- https://milanote.com/templates
- https://milanote.com/templates/filmmaking
- https://milanote.com/templates/content-creation
- https://milanote.com/templates/motion-design
- https://learn.poly.cam/hc/en-us/articles/27756102599572-What-File-Types-Can-Polycam-Export
- https://learn.poly.cam/hc/en-us/articles/29647691255316-How-to-Export-Polycam-Captures
- https://mpv.io/manual/stable/

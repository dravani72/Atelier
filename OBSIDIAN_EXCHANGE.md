# Obsidian vault exchange proposal

Status: design proposal, not an implemented plugin. This change does not read or write an Obsidian vault.

Use Obsidian as the readable information repository and Atelier as the visual workspace. Start with a local vault adapter in Atelier: a user selects a vault folder and previews export/import changes. An Obsidian community plugin can come later if commands inside Obsidian are useful. The file format should work without either app running.

## Ownership and mapping

| Atelier information | Vault representation | Editing authority |
| --- | --- | --- |
| Note, sticky, heading | One Markdown file per information object | Markdown text and properties after connection |
| Tasks | Markdown checkboxes, with stable item IDs in a sidecar | Markdown task text and completion |
| Board | Index Markdown note and optional `.canvas` projection | Atelier membership initially |
| Tags, title, type | YAML properties | Markdown, validated on import |
| Connections | Relative Markdown links with relationship text; `.canvas` edges | Atelier initially; import new text links as suggestions |
| Image or sketch | Relative attachment with a Markdown embed | Original media preserved |
| Video and 3D | Readable description, attachment link, metadata | Atelier playback and resource state |
| Timeline | Readable schedule table plus versioned JSON sidecar | Atelier timecode, lanes and source references |
| Coordinates, layers, locks, styling | JSON Canvas subset plus Atelier sidecar | Atelier initially |
| Personal annotations | Explicit export option | Keep local unless selected |

SQLite remains Atelier's runtime store and recovery history. Once connected, it caches and indexes vault text; it is not a second independently authoritative copy. Sidecars preserve details Markdown and JSON Canvas cannot express. They must be versioned, readable JSON and portable, not opaque database dumps.

## Suggested organization

Within an existing vault, create a user-selected `Atelier/` folder containing `Projects/`, `Notes/`, `Boards/`, `Attachments/` and `Metadata/`. Do not create a nested vault or alter Obsidian configuration. A project note links to board notes; each board note links to its cards. Use readable filenames with a short ID suffix to avoid collisions. Store the full Atelier UUID in properties; identify objects by that ID, never by their title or current path. Renames and moves keep identity.

Example note:

```markdown
---
atelier_id: "c8fa93ca-6882-4f60-b103-b292d610a319"
atelier_schema: 1
atelier_type: note
atelier_project: "4431dcae-8982-4b43-9b68-d36ad89a1bf3"
title: "Opening scene"
tags:
  - story
  - review
---

# Opening scene

A quiet arrival establishes the location.

## Related

[Location reference](Location-reference--725cee.md) — filmed here
```

Use ordinary relative Markdown links by default so the repository also works in text editors and Git viewers. Use file nodes in the optional Obsidian Canvas projection: text-only Canvas cards do not provide note backlinks. JSON Canvas supports nodes, dimensions, file references, links, groups, colors and edges; it is a useful visual exchange subset, not full fidelity for Atelier timelines, native video controls, layers or 3D scenes.

## Exchange behavior

First release: select folder → preview changes → export selected project; then import selected notes with a diff and explicit conflict resolution. It should also offer “Open in Obsidian” using its documented URI scheme. No vault scanning outside the selected scope.

Next release: watch selected files and perform three-way text reconciliation using the last exchanged content and hashes. Atomic writes prevent partial files. Record a per-file baseline and last-seen hash; skip unchanged files and suppress watcher echoes. If both sides changed, show the conflict and preserve both versions. Missing files produce a reviewable deletion proposal, never an automatic cascading delete. New unrelated vault files stay unimported until selected.

Preserve unknown YAML properties and Markdown sections. Treat imported text as text; don't execute embedded scripts or rewrite community-plugin syntax. Detect duplicate IDs, invalid schema versions, unsafe attachment paths and broken references before writes. Handle case-only renames and filename collisions on macOS. Sync services may expose partial changes: debounce events and retry stable reads.

Media defaults to lightweight references. Existing Atelier-managed media IDs are not portable paths: exporting requires a resolved vault-relative copy, or a clearly marked unavailable external reference. Package original videos and 3D resources only on explicit selection; do not silently duplicate large libraries. Track attachment hashes so relinking and migration remain possible.

## Suggested milestones and acceptance checks

1. Export selected boards to Markdown and an optional JSON Canvas projection. Verify links, IDs, attachment packaging, duplicate titles and fresh-vault readability.
2. Import Markdown changes with preview. Verify no-op round trips, renamed files, unsupported properties, checklist IDs and broken paths; preserve Atelier layout and original media.
3. Enable bidirectional text watching with conflict handling and deletion review. Verify simultaneous edits, interrupted writes, cloud-sync duplicates and offline recovery.
4. Consider an Obsidian plugin for “Send to Atelier”, jump-to-card and project commands, after the file contract is stable.

This sequencing gives the user an accessible repository early while protecting the richer Atelier workspace. It also leaves room to replace Obsidian with any Markdown editor.

## Primary references

- [How Obsidian stores data](https://help.obsidian.md/Files+and+folders/How+Obsidian+stores+data)
- [Obsidian Canvas and backlink behavior](https://help.obsidian.md/Plugins/Canvas)
- [JSON Canvas 1.0 specification](https://jsoncanvas.org/spec/1.0/)
- [Obsidian properties](https://help.obsidian.md/Editing+and+formatting/Properties)
- [Obsidian URI](https://help.obsidian.md/Extending+Obsidian/Obsidian+URI)

# Atelier template starter pack

44 original mixed-media template scaffolds, four project recipes, a developer implementation brief and an example treatment. Intended to be handed to the chat or development team building Atelier.

## Contents

- `CATALOG.md`: readable inventory and template sections.
- `templates.json`: versioned catalog, section geometry, editable prompt cards, field keys, view suggestions and presentation order.
- `project-recipes.json`: commercial, content, narrative and documentary bundles.
- `IMPLEMENTATION_BRIEF.md`: shared entities, media capabilities, color/time/spatial handling, graphs, export behavior and acceptance criteria.
- `EXAMPLE_TREATMENT.md`: fictional populated example showing how different media connect.
- `HANDOFF_PROMPT.md`: instructions to paste into the development chat.

## Status

This is a portable starter specification, not a native Atelier plugin or verified importer. It contains no licensed reference media. Templates have contextual section names and starter prompts; the actual app must provide typed fields and viewers. Adapt the proposed format to the existing document model, preserving asset identity and compatibility with existing projects.

Catalog format: `atelier-proposed-template-catalog`, schema version `1.0.0`. Each section has a canvas position; seed nodes use section-relative coordinates. Instantiation must mint new IDs. An asset placeholder has `asset_id: null` until populated. Recipe template IDs resolve into this catalog. Default team visibility never implies publication to a client.

# Atelier canvas UI/UX parity

Audit: 8 October 2026. Baseline: Atelier main at `b2a6503`, including its existing timeline. This change adds local canvas components; it does **not** claim complete Milanote or Miro parity.

## Added in this change

| Component or interaction | Atelier behavior |
| --- | --- |
| Sticky notes | Dedicated square cards with larger text; editable title/body, colors, tags and annotations. |
| Shapes | Rectangle, ellipse and diamond with editable text. Existing connectors can join them. |
| Tables | Editable rectangular grid; first row is the header. Add/remove trailing rows and columns. Up to 100 rows and 20 columns; plain text cells. |
| Frames | Named regions behind content; dragging moves fully enclosed, visible, unlocked objects. Resize to define the slide region. |
| Presentation | Present visible frames in outline order; Previous/Next or arrow keys; Escape to exit. Static, local slides include contained cards and connections. |
| Outline | Frames, layers and objects in a canvas panel. Click an object to select and center it; reorder frames with arrows. |
| Layers | Named layers; assign selected objects, hide/show or lock/unlock content. Removing a layer returns its objects to Default. |
| Object locks | Prevent dragging, resizing, editing and deletion through the standard canvas controls. Annotations remain available. Unlock an object in the inspector; unlock a layer in the outline. This is an editing convenience, not an access permission. |
| Groups | Group/ungroup selected objects; selecting and dragging a group moves its unlocked members. Cmd/Ctrl G groups; Shift Cmd/Ctrl G ungroups. Copies get independent group IDs. |
| Marquee selection | Drag empty canvas to select intersecting visible, unlocked objects. Shift preserves the prior selection. Space/middle drag still pans. |
| Context menu | Right-click selection for organization, duplication and deletion. Arrow keys navigate the menu. |
| Stacking | Bring to front or send to back; frames and columns stay behind content. |
| Arrangement | Left/right/top/bottom/center/middle alignment and horizontal/vertical equal-gap distribution, respecting locks. |
| Column reflow | Explicitly stack enclosed or template-associated cards within a selected column and grow its height. |
| Minimap | Optional board map with viewport outline; click to center the canvas at that position. |
| Connector styles | Curved, straight and elbow paths with optional arrowhead; existing connection labels remain editable. |
| Persistence | Backward-compatible optional canvas fields in workspace v1. JavaScript and Rust validate the new card types, layers, tables, groups and connection style fields. Rust preserves optional board and edge metadata. |

Use the left toolbar for new card types; **Frames & layers**, **Map**, and **Present** are at the upper right of the canvas. Organization actions appear in the inspector and context menu. Existing media viewers, templates and timelines remain available.

## Existing features retained

Freeform canvas; pan/zoom/fit/grid snapping; notes with rendered Markdown; headings; checklists; images, sketches, video/libmpv, original attachments and 3D references; links; columns; nested boards and breadcrumbs; directed connectors; tags; local annotations; workspace search; template gallery and project recipes; timecode/date timelines; undo/redo; app clipboard and file drops; light/dark preferences; autosave; recovery snapshots; JSON, SVG and Markdown exports.

## Remaining gaps

These are real gaps, not buttons backed by placeholders. They require further implementation and verification.

| Area | Missing or partial behavior | Required work |
| --- | --- | --- |
| Rich text and documents | Markdown note editor; no WYSIWYG document editor or contextual text formatting | Sanitized editor, long-form document type, selection-aware formatting and native clipboard handling. |
| Tables | Plain text cells; no formulas, merged cells, sorting/filtering or spreadsheet import | Formula engine, typed cell model, table operations and import/export contracts. |
| Structured planning | Templates/columns are available; no dedicated Kanban, mind-map, user-story-map or dependency engine | Explicit data models, keyboard branch creation, layout rules and task-card semantics. |
| Drawing and image editing | Sketch cards are available; no continuous board pen/highlighter/eraser, image crop or editable image markup | Vector strokes, hit testing, stroke undo and raster export composition. |
| Object styling | Cards take their type's shade, or plain, or one of five named tints; boards take any backing color; three shapes. No arbitrary card color, opacity, rotation or expanded diagram symbol libraries | Style schema, handles and inspector controls with matching export renderers. |
| Advanced layout | Reflow is explicit; no automatic insertion/reordering in columns, smart guides or sticky clustering | Drop-target insertion, live layout and cluster rules. |
| Comments and review | Local annotations only; no threads, resolve/reopen, mentions, notifications or approval status | Review schema and local UI; identity and delivery services for shared reviews. |
| Facilitation | Local frame presentation; no timer, voting, reactions, private brainstorm mode or breakout sessions | Workshop state and facilitator UI; multi-user session service for shared activity. |
| Presentation and export | Static local frames and existing JSON/SVG/Markdown; no recorded narration/Talktrack, slide animations, PNG/PDF/Word export or presentation media playback | Capture/export engines and a native media/presentation lifecycle. SVG approximates shape/table appearance and retains their text; JSON preserves the full editable data. |
| Web collection | Manual links and file drops; no browser clipper, URL metadata cards or stock-media search | Browser extension/local import bridge and bounded network fetch with permissions. |
| Shared workspaces | No accounts, live cursors, presence, chat, follow-me or simultaneous editing | Identity, server persistence, synchronization/conflict handling and presence transport. |
| Sharing | No guest invitations, link sharing, role-based permissions or published boards | Hosted workspace/permission model and audited share controls. |
| Integrations and AI | No plugin marketplace, external task/document sync or AI canvas generation | Provider contracts, credential handling, network configuration and explicit data-sharing controls. |
| Workspace management | Board tree, search and recovery are available; no favorites/recent dashboard, archive/trash or activity feed | Navigation model, retention semantics and activity records. |
| Delivery and accessibility | Desktop local app and browser preview; no mobile experience, complete keyboard canvas editing or service-backed sync | Responsive/touch layouts, accessibility audit and distribution work. |

Do not describe local annotations as team comments, object locks as security controls, or static presentation as animatic playback. Choosing a planning template does not implement a structured planning engine.

## Source references

Official documentation checked for this audit:

- [Miro toolbars](https://help.miro.com/hc/en-us/articles/360017730553-Toolbars) and [simplified interface](https://help.miro.com/hc/en-us/articles/20967864443410-Miro-s-new-simplified-user-interface)
- [Miro frames](https://help.miro.com/hc/en-us/articles/360018261813-Frames), [layers](https://help.miro.com/hc/en-us/articles/20258488000786-Layers), [structuring board content](https://help.miro.com/hc/en-us/articles/360017730973-Structuring-board-content)
- [Miro mind maps](https://help.miro.com/hc/en-us/articles/360017730753-Mind-map), [clustering](https://help.miro.com/hc/en-us/articles/4409706795410-Clustering), [workshops](https://help.miro.com/hc/en-us/articles/360012753200-Miro-for-workshops-meetings)
- [Milanote columns](https://help.milanote.com/en/articles/10478526-columns), [tables](https://help.milanote.com/en/articles/8584584-tables), [drawing](https://help.milanote.com/en/articles/5537688-drawing)
- [Milanote comments](https://help.milanote.com/en/articles/10684379-comments), [sharing](https://help.milanote.com/en/articles/4324593-sharing-a-board)
- [Milanote documents](https://help.milanote.com/en/articles/10458661-documents), [exporting](https://help.milanote.com/en/articles/111395-exporting-your-work), [web clippers](https://help.milanote.com/en/collections/9620036-milanote-web-clippers)

This comparison covers documented interaction families relevant to Atelier, not every paid-plan entitlement, enterprise setting, integration or AI feature in either product.

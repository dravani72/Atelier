# Atelier template library

193 fully worked example boards across 37 categories, modelled on the range of Milanote’s template gallery. Each template is a real example project, not an empty scaffold: written content, tables, checklists, connectors, drawings, colour and type, reference photos, and timeline cards wherever time matters. They appear in the app under **Templates → Worked examples**.

| | |
|---|---|
| Templates | 193 (one board each; hubs add nested boards) |
| Categories | 37, from Filmmaking and Storyboards to Craft & making and Fashion |
| Timelines | 66 calendar timelines (plans, calendars, launches, roadmaps) and 19 timecode timelines (storyboards, beat sheets, scripts, animatics, and clock-time run sheets for call sheets and events) |
| Pictures | 286 drawn by the build (storyboard panels, wireframes, maps, swatches, palettes, type specimens, charts) and 378 photo slots |

## How it works

```
template-library/
  templates/*.mjs        the templates, written in a small layout language (lib/dsl.mjs)
  lib/dsl.mjs            rows → columns, stacks, grids, frames, free placement; measures cards; builds timelines
  lib/assets.mjs         generated pictures: swatches, palettes, type specimens, pencil sketches, charts
  lib/scenes.mjs         storyboard compositions (wide, medium, close, OTS, insert, street, room, aerial…)
  lib/kit.mjs            shared pieces (title row, swatch grid, photo grid)
  images/photos.json     every photo slot: what it should show, and once filled, file, author, licence, source
  categories.json        category order in the gallery
  build.mjs              builds ui/templates/library/
  tools/fetch-photos.py  fills photo slots from Wikimedia Commons (free licences only)
  tools/fetch-fonts.mjs  fetches the OFL fonts the picture renderer uses (@fontsource on npm)
  tools/thumbs.mjs       renders gallery previews of every template
  CREDITS.md             generated: author, licence and source of every photograph
```

`npm run templates:build` writes `ui/templates/library/`: one compact package per template (`<id>.json`), the pictures they use (stored once, referenced from cards as `@image:<key>`), previews and `catalog.js`. Every package is checked with the same reader that checks an imported Atelier package before it is written. `node template-library/build.mjs --standalone` also writes self-contained `.atelier.json` packages to `template-library/dist/` that can be shared or imported directly.

When a template is chosen, `ui/library.js` fetches it, embeds its pictures, checks it, moves every calendar timeline to the current week (by whole weeks, so weekdays stay put), and adds it under fresh IDs — the same path as importing a package, so undo, export and sharing all work. Provenance is kept on the board as `template: {id: "lib-<id>", version}`.

## Writing a template

```js
import {note,task,photo,table,timeline,column,grid,single,row} from '../lib/dsl.mjs';
import {intro,swatches} from '../lib/kit.mjs';

export default [{
 id:'my-template', title:'My template', category:'Filmmaking', also:['Project plans'],
 description:'One sentence that says what this board is for.', tags:['…'],
 rows:[
  intro('Heading on the board','What this example project is.','How to use the template.'),
  row([
   column('The idea',340,[note('Logline','…',{key:'logline'}), photo('ph-my-ref','Commons search words for the photo',{ratio:0.66})]),
   column('Plan',340,[task('Before the shoot',['x Done item','Open item'],{key:'prep'})]),
  ]),
  row([single(1200,timeline('Schedule',{mode:'date',days:28,items:[{ref:'prep',at:0,len:7}]}))]),
 ],
 edges:[['logline','prep','leads to']],
}];
```

- Cards are measured from their content; columns contain their cards (`sectionId`), as in the app.
- `timeline` items point at cards by `key`. Calendar items use day offsets from the template’s anchor Monday; timecode items take `HH:MM:SS:FF`, seconds or `48f`, with `out` or `len`. A timecode ruler can also read as clock time (start `06:00:00:00`).
- `photo(key, want)` declares a photo slot; the build adds it to `images/photos.json` and shows a labelled stand-in until it is filled.
- Generated pictures (`swatch`, `palette`, `typeSpecimen`, `drawing`, `panel`, `chart`) are rendered with headless Chromium the first time they are needed. Run `node template-library/tools/fetch-fonts.mjs` once before rendering new ones.

## Photographs and licences

Photos must be free to ship and to share: CC0, public domain, CC BY or CC BY-SA, sourced from Wikimedia Commons by `tools/fetch-photos.py`. The tool records the title, author, licence and source of each image; the build writes them to `CREDITS.md`, and every photo card carries its own credit line and source link, so attribution travels with a board when it is exported or shared. Everything else in the library — drawings, wireframes, swatches, charts — is drawn by `lib/assets.mjs`; type specimens use fonts under the SIL Open Font License, Apache 2.0 or the GUST Font License.

All projects, people, brands and organisations in the examples are fictional.

```sh
python3 template-library/tools/fetch-photos.py           # fill empty slots (needs commons.wikimedia.org + upload.wikimedia.org)
python3 template-library/tools/fetch-photos.py --sheet   # contact sheet for review
npm run templates:thumbs                                  # rebuild previews (needs npm run dev running)
npm run templates:build
```

## Tests

`npm test` includes `tests/library.test.mjs`: every template loads, passes the package reader, adds to a workspace that validates, uses only pictures that ship, and moves calendar timelines correctly. `npm run test:library` (with `npm run dev` running) exercises the gallery in Chromium.

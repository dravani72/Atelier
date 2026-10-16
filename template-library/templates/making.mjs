import {note,task,photo,link,heading,sticky,shape,table,file,timeline,column,stack,grid,single,place,row,frame} from '../lib/dsl.mjs';
import {drawing,sk,chart,palette,typeSpecimen} from '../lib/assets.mjs';
import {intro,photos,swatches} from '../lib/kit.mjs';

const t=[];

// ── Architecture & interiors ─────────────────────────────────────────────────
const plan=(title)=>drawing(title,sk.rect(140,90,720,470,'stroke-width="6"')+sk.line(520,90,520,380,'stroke-width="5"')+sk.line(140,380,640,380,'stroke-width="5"')+sk.rect(560,120,270,220,'stroke-dasharray="8 10"')+sk.text(600,240,'studio',38)+sk.text(240,250,'store',34)+sk.text(260,480,'wc / sink',30)+sk.text(660,480,'entrance',30)+sk.curve('M640,560 A60,60 0 0 1 700,500','stroke-width="3"')+sk.text(560,70,'north light ↑',30)+sk.line(140,600,860,600,'stroke-width="2"')+sk.text(420,635,'10.5 m',28));
t.push({id:'architectural-design-concept',title:'Architectural design concept',category:'Architecture',
 description:'Present a building concept: site, idea, massing, plan, materials, light, precedents and the numbers — frame by frame for a client review.',tags:['architecture','concept','presentation','materials','plan'],
 rows:[
  intro('Concept — coastal studio','The concept design for review. Five frames: site, idea, plan, materials, numbers. Present it with the Present button.','Lead with the site and the idea; the drawings prove it. Keep each frame to one point. Collect client comments on the cards so they stay with the drawing they refer to.'),
  row([
   frame('1 · The site',[row([stack(560,[photo('ph-ar-coast','Rugged coastline with grasses and dunes',{ratio:0.62,title:'The site, from the lane'})]),column('Reading the site',360,[note('Wind','Prevailing south-westerlies — turn the back to them.'),note('Light','Big north sky over the estuary: perfect for painting.'),note('Neighbours','Fishermen’s huts; keep the scale low.')])])]),
   frame('2 · The idea',[row([stack(560,[drawing('Section sketch',sk.line(80,520,920,520)+sk.curve('M180,520 L180,300 L520,160 L820,300 L820,520')+sk.line(520,160,700,90,'stroke-width="5"')+sk.text(620,70,'north light',30)+sk.arrow(60,250,170,330)+sk.text(30,230,'wind',30)+sk.person(400,360,150),{card:{title:'Section — sheltered back, open north light'}})]),column('Concept',360,[note('A hut that has made peace with the weather','Low and dark on the weather side; one big lantern of north light over the easel.',{color:'sand'})])])]),
  ],{gap:60,after:60}),
  row([
   frame('3 · Plan',[row([stack(560,[plan('Ground floor plan — 1:100 sketch')]),column('Areas',360,[table('Schedule',[['Space','m²'],['Studio','38'],['Store','12'],['WC + sink','6'],['Entrance','4'],['Total','60']])])])]),
   frame('4 · Materials',[row([stack(560,[photos([['ph-ar-charred-timber','Charred timber cladding shou sugi ban texture','Charred larch'],['ph-ar-zinc','Zinc standing seam roof detail','Zinc roof'],['ph-ar-concrete','Board-marked concrete wall','Concrete plinth'],['ph-ar-timber-frame','Exposed timber frame structure under construction','Timber frame']],2,272)]),column('Why',360,[note('Weathering','Every material gets better with salt and wind — nothing to repaint.')])])]),
  ],{gap:60,after:60}),
  row([frame('5 · Numbers & next steps',[row([column('Cost plan',420,[table('Estimate',[['Item','£'],['Construction','168,000'],['Fees','26,000'],['Contingency','17,000'],['Total','211,000']])]),column('Next steps',420,[task('After sign-off',['Pre-application meeting','Engineer: foundations','Developed design'])]),column('Client comments',420,[note('Comments','',{color:'plain',comments:[['Client','Could the store double as a guest bed?']]})])])])]),
 ]});

const productList=(id,title,category,also,description,heading_,purpose,rows,extra=[])=>({id,title,category,also,description,tags:['product list','sourcing','budget','schedule'],
 rows:[
  intro(heading_,purpose,'One row per item with supplier, cost, lead time and status. Photos sit above the table so the client sees what they’re approving. Total the budget column before every client meeting.'),
  row([grid(6,250,rows.slice(1,7).map(r=>photo(r[5],r[6],{ratio:0.8,title:r[0]})),{gap:16})]),
  row([single(1560,table('Schedule',rows.map(r=>r.slice(0,5)))),...extra]),
 ]});
t.push(productList('interior-product-list','Interior design product list','Interior design',['Architecture'],'Track furniture, lighting and finishes to source for a scheme — with photos, suppliers, costs, lead times and status — against the budget.',
 'Product schedule — ground floor, Victorian terrace','Everything we are buying for the living room, kitchen-diner and hall, in one place. Budget £42,000.',
 [['Item','Room','Supplier','Cost','Status'],['Linen sofa, 3-seat','Living','Sofa maker','£2,800','Ordered — 8 wks','ph-pl-sofa','Linen three-seat sofa in a living room'],['Wool bouclé armchair','Living','Vintage dealer','£780','Reserved','ph-in-armchair','Vintage armchair by a window'],['Paper pendant ×2','Kitchen-diner','Lighting shop','£380','Ordered','ph-in-paper-lamp','Paper pendant lamp in a room'],['Oak dining table, 2.4 m','Kitchen-diner','Joiner','£2,200','Drawing approved','ph-ib-kitchen-diner','Kitchen diner with a long wooden table and pendant lights'],['Wool rug 2×3 m','Living','Rug maker','£900','Quote','ph-in-wool-rug','Wool rug on a wooden floor'],['Limewash, 20 L','All','Paint supplier','£420','Ordered','ph-in-limewash','Limewash painted wall texture'],['Hall bench + hooks','Hall','Joiner','£1,100','Drawing','',''],['Total so far','','','£8,580','of £42,000']],
 [column('Lead times',380,[note('Watch','Sofa (8 weeks) and joinery (6 weeks) decide the install date.',{color:'rose'})])]));
t.push(productList('renovation-supplies-list','Renovation supplies list','Home renovation',[],'Track the tools, materials and finishes a renovation needs — quantities, suppliers, costs and what is bought — with photos for the finishes.',
 'Supplies — bungalow, phase 2 (kitchen)','What we need to buy for the kitchen phase. The builder supplies structural materials; everything here is on us.',
 [['Item','Qty','Supplier','Cost','Status'],['Kitchen units (oak veneer)','14','Kitchen supplier','£6,400','Ordered','ph-rs-kitchen-units','Wooden kitchen cabinets in a modern kitchen'],['Worktop (quartz)','6.2 m','Stone yard','£2,100','Templated','ph-rs-worktop','Quartz kitchen worktop close-up'],['Tiles (zellige, 10 cm)','8 m²','Tile shop','£720','Sample','ph-rs-tiles','Handmade zellige tiles on a kitchen wall'],['Tap (brushed brass)','1','Plumbing merchant','£280','Bought','ph-rs-tap','Brass kitchen tap over a sink'],['Pendant lights','3','Lighting shop','£420','Shortlist','ph-rs-pendants','Pendant lights over a kitchen island'],['Paint (eggshell)','10 L','Paint supplier','£140','Bought','ph-rs-paint','Paint tins and brushes for decorating'],['Total','','','£10,060','of £12,000']],
 [column('Tools to hire',380,[task('Hire',['Tile cutter (wet)','Dust extractor','Laser level'])])]));
t.push({id:'renovation-moodboard',title:'Renovation moodboard',category:'Home renovation',also:['Moodboards','Interior design'],
 description:'Gather ideas for a renovation room by room — finishes, colours, fixtures and the details you love — to agree the look before buying.',tags:['renovation','moodboard','finishes','home'],
 rows:[
  intro('Moodboard — bungalow kitchen and bathrooms','Mid-century warmth: oak, terrazzo, brass, plaster pink. Keep the parquet.','Collect by room. Under each image, one line on what you like about it — the colour, the tap, the light. Bring the board to every supplier visit.'),
  row([
   column('Kitchen',560,[photos([['ph-rb-mid-century-kitchen','Mid-century style kitchen with wood cabinets','Oak + simple handles'],['ph-rs-tiles','Handmade zellige tiles on a kitchen wall','Zellige splashback'],['ph-rs-tap','Brass kitchen tap over a sink','Brass tap'],['ph-rs-pendants','Pendant lights over a kitchen island','Pendants']],2,256)]),
   column('Bathrooms',560,[photos([['ph-rm-terrazzo','Terrazzo bathroom floor or vanity','Terrazzo'],['ph-rm-pink-bathroom','Pink plaster bathroom with brass fittings','Plaster pink'],['ph-rm-walk-in-shower','Level-access walk-in shower','Level access'],['ph-rm-wall-light','Bathroom wall light by a mirror','Lighting']],2,256)]),
   column('Colour',360,[swatches([['#d8b4a0','Plaster pink'],['#a67b5b','Oak'],['#2f4f4f','Bottle green'],['#e8e1d5','Chalk'],['#b08d57','Brass'],['#7a7a72','Terrazzo grey']],2,156)]),
   column('Keep',340,[photo('ph-rb-parquet','Original parquet wooden floor',{ratio:0.75,title:'Parquet — keep and restore'}),note('Rules','Warm metals only. No high gloss. Every room has one green thing.')]),
  ]),
 ]});

// ── Visual art ───────────────────────────────────────────────────────────────
t.push({id:'visual-art-brief',title:'Visual art brief',category:'Visual art',also:['Creative briefs'],
 description:'Record the purpose, audience, constraints, materials and outcome for an artwork or commission before you start.',tags:['art brief','commission','artwork','purpose'],
 rows:[
  intro('Brief — mural for the library children’s corner','A 6 × 2.4 m mural on the end wall of the new children’s library. Commissioned; three weeks on site.','Answer the why before the what. The constraints card is where most murals go wrong — wall surface, cleaning, light, who sits beneath it.'),
  row([
   column('Purpose',340,[note('Why','A wall that makes children want to sit down and read — and that every child can see themselves in.',{color:'sand'})]),
   column('Audience',340,[note('Who','Children 3–11 and their grown-ups; seen daily, for ten years.'),photo('ph-va-kids-library','Children reading on cushions in a library corner',{ratio:0.66,title:'The corner'})]),
   column('Constraints',340,[task('Must',['Washable paint (scrubbable)','No text (multilingual area)','Works with shelving in front of the lower 1.2 m','Not too busy: it’s a reading corner'])]),
   column('Materials',340,[note('Plan','Acrylic mural paint, two coats of matt anti-graffiti varnish. Design drawn up digitally, projected, painted by hand.')]),
   column('Outcome & fee',340,[table('Terms',[['Item','Detail'],['Fee','£6,000'],['Materials','£900'],['On site','3 weeks'],['Credit','Plaque by the wall']])]),
  ]),
 ]});
t.push({id:'visual-art-brainstorm',title:'Visual art brainstorming',category:'Visual art',also:['Brainstorming'],
 description:'Capture ideas, sketches and notes for an artwork, and develop an initial concept from them.',tags:['art','brainstorm','sketches','concept'],
 rows:[
  intro('Brainstorm — library mural','Ideas for the children’s corner. Quantity first. Sketch everything as thumbnails.','Write ideas on stickies, then thumbnail the three best. Note what each idea asks of the viewer. The concept is whichever thumbnail a child would point at.'),
  row([
   column('Ideas',380,[sticky('A forest where the trees are bookshelves','',{color:'sand'}),sticky('Animals reading to each other','',{color:'sand'}),sticky('A night sky made of open books','',{color:'sand'}),sticky('A map of every place in the library’s books','',{color:'sand'})]),
   column('Thumbnails',720,[grid(3,212,[drawing('Bookshelf forest',[0.15,0.35,0.55,0.75].map(x=>sk.tree(1000*x,560,380)).join('')+sk.rect(120,380,60,180)),drawing('Animals reading',sk.circle(300,380,90)+sk.circle(640,380,110)+sk.rect(420,420,140,90)+sk.text(440,470,'BOOK',30)),drawing('Sky of books',[...Array(9)].map((_,i)=>sk.curve(`M${100+i*95},${150+(i%3)*90} q30,-20 60,0 q30,-20 60,0`)).join(''))],{gap:16})]),
   column('References',340,[photos([['ph-vab-forest','Sunlit forest with tall trees','Forest light'],['ph-vab-picture-book','Open illustrated children’s picture book','Picture-book scale']],1,308)]),
   column('Concept',340,[note('Chosen','Bookshelf forest with animals hidden in it — a “find the fox” game for the lower half.',{color:'sage'})]),
  ]),
 ]});
t.push({id:'visual-art-research',title:'Visual art research',category:'Visual art',
 description:'Collect background on a subject — history, references, techniques and other artists — to add depth to a piece or series.',tags:['art research','references','technique','history'],
 rows:[
  intro('Research — “Tide Lines” painting series','Background for six estuary paintings: tides, light, painters who worked on the same coast, technique.','Gather in four columns: subject, art history, technique, my notes. Public-domain paintings are fine to keep here as study references.'),
  row([
   column('Subject — tides',360,[link('How tides work','https://en.wikipedia.org/wiki/Tide','Springs and neaps; why the estuary empties.'),photo('ph-va-estuary','Estuary landscape at low tide with reflections',{ratio:0.66,title:'Low water, morning'})]),
   column('Art history',360,[photos([['ph-var-turner-sea','Public domain painting of a stormy sea by J. M. W. Turner','Turner — sea and light (public domain)'],['ph-var-whistler','Public domain nocturne painting of a river at night by Whistler','Whistler — river nocturne (public domain)']],1,328)]),
   column('Technique',360,[note('Plan','Thin underpainting in burnt sienna; wet-in-wet skies; scrape back for wet sand reflections.'),photos([['ph-var-palette-knife','Oil paint on a palette with a palette knife','Palette knife work']],1,328)]),
   column('My notes',360,[note('Thought','The estuary is never the same twice — the series should feel like six moments of one place, not six places.',{color:'sand'}),task('To find out',['Best months for mist','Spring tide dates for plein air'])]),
  ]),
 ]});
t.push({id:'visual-art-moodboard',title:'Visual art moodboard',category:'Visual art',also:['Moodboards'],
 description:'Gather inspiration and reference images and test colours and themes for an artwork or series.',tags:['art','moodboard','palette','inspiration'],
 rows:[
  intro('Moodboard — “Tide Lines”','Six paintings, one estuary. Grey-gold light, mud that shines, birds as punctuation.','Collect images that share a mood, not a subject. Test palettes beside them. Write what each image teaches you about light or mark-making.'),
  row([
   photos([['ph-va-estuary','Estuary landscape at low tide with reflections','Reflections'],['ph-vam-mudflat-birds','Wading birds on mudflats at low tide','Birds as punctuation'],['ph-vam-mist','Morning mist over water and marsh','Mist'],['ph-vam-sunset-mud','Sunset reflected on wet mud and channels','Gold on mud'],['ph-vam-boat','Old wooden boat stranded on mud at low tide','Boats on their sides'],['ph-vam-reeds','Reeds and marsh grasses in the wind','Edges: reeds']],3,280),
   column('Palette',360,[swatches([['#c7b38a','Wet gold'],['#6f7d7b','Estuary grey'],['#3b3f3a','Mud dark'],['#e9e2d0','Mist'],['#a5543a','Rust buoy'],['#8fa6a6','Sky']],2,156)]),
   column('Themes',340,[note('Time','Each painting is a different hour and tide.'),note('Absence','No people — only traces: footprints, a boat, a post.')]),
  ]),
 ]});

// ── Craft ────────────────────────────────────────────────────────────────────
t.push({id:'craft-brainstorm',title:'Craft project brainstorm',category:'Craft & making',also:['Brainstorming'],
 description:'Generate and connect ideas for a craft project or collection — forms, techniques, materials, colours — and choose what to make.',tags:['craft','ideas','making','collection'],
 rows:[
  intro('Brainstorm — winter market collection (ceramics)','What to make for the December market: forms, glazes, gift ideas, price points.','Brainstorm forms and glazes separately, then pair them. Score each pair on time to make, likely sales and joy. Make the top three.'),
  row([
   column('Forms',320,[sticky('Mugs with thumb rests','',{color:'sand'}),sticky('Tiny bud vases','',{color:'sand'}),sticky('Nesting bowls ×3','',{color:'sand'}),sticky('Ornaments','',{color:'sand'})]),
   column('Glazes',320,[sticky('Speckled oatmeal','',{color:'sky'}),sticky('Deep green celadon','',{color:'sky'}),sticky('Rust with white drips','',{color:'sky'})]),
   column('Gift ideas',320,[sticky('Mug + coffee from Hollow Oak','',{color:'sage'}),sticky('Bud vase + dried flowers','',{color:'sage'})]),
   column('Inspiration',340,[photos([['ph-cr-mugs','Handmade ceramic mugs on a shelf','Mugs'],['ph-crb-glaze','Glazed pottery with drips close-up','Glaze drips']],1,308)]),
   column('Pick',380,[table('Score',[['Pair','Time','Sales','Joy'],['Mugs + oatmeal','3','5','4'],['Bud vases + celadon','5','4','5'],['Ornaments + rust','4','3','3']]),note('Making','Mugs, bud vases, ornaments.',{color:'sage'})]),
  ]),
 ]});
t.push({id:'craft-moodboard',title:'Craft project moodboard',category:'Craft & making',also:['Moodboards'],
 description:'Collect visual inspiration, colour palettes, textures and materials for a craft project.',tags:['craft','moodboard','textures','materials'],
 rows:[
  intro('Moodboard — hand-knitted fisherman jumpers','A small run of five jumpers in undyed wool, patterned like old gansey sweaters.','Collect stitches, colours and the feeling you want. Pin real yarn swatches here as photos once they arrive, beside the references they answer.'),
  row([
   photos([['ph-crm-knit','Close-up of cable knit wool texture','Cables'],['ph-crm-yarn','Skeins of natural undyed wool yarn','Undyed wool'],['ph-crm-fisherman','Old fisherman wearing a knitted jumper on a harbour','The tradition'],['ph-crm-harbour','Small fishing harbour with boats','Harbour colours'],['ph-crm-needles','Knitting needles and a work in progress','In progress'],['ph-crm-sheep','Sheep grazing on a hillside','Where the wool comes from']],3,280),
   column('Palette',360,[swatches([['#e8e1d3','Undyed cream'],['#8b7d6b','Moorit brown'],['#3e4a52','Gansey navy'],['#6b705c','Moss']],2,156)]),
   column('Notes',340,[note('Stitches','Moss stitch yoke, cables up the sides, initials knitted at the hem.'),note('Feel','Warm, scratchy in a good way, made to be worn on a boat.')]),
  ]),
 ]});
t.push({id:'craft-materials-list',title:'Craft materials list',category:'Craft & making',
 description:'Track supplies and inventory for a craft business — what you have, what to reorder, costs per piece and finished stock to sell.',tags:['materials','inventory','stock','pricing','craft business'],
 rows:[
  intro('Materials & stock — the pottery','Clay, glazes and packaging on hand; what to reorder; finished pieces ready to sell.','Update after every firing. Anything under its reorder level turns rose. The finished-stock table feeds the shop listings.'),
  row([
   column('Materials',620,[table('On hand',[['Item','Have','Reorder at','Status'],['Stoneware clay','15 kg','10 kg','OK'],['Oatmeal glaze','2 kg','1 kg','OK'],['Celadon glaze','0.5 kg','1 kg','Reorder'],['Kraft boxes','12','20','Reorder'],['Tissue paper','1 pack','1 pack','Reorder']]),note('Reorder','Celadon glaze, boxes, tissue — order Monday.',{color:'rose'})]),
   column('Cost per piece',420,[table('Mug',[['Item','£'],['Clay','0.90'],['Glaze','0.60'],['Firing','2.00'],['Packaging','1.30'],['Total materials','4.80'],['Price','28.00']])]),
   column('Finished stock',620,[table('Ready to sell',[['Piece','Qty','Price','Where'],['Mug — oatmeal','9','£28','Market + online'],['Mug — celadon','6','£30','Market'],['Bud vase','14','£18','Market + online'],['Seconds','6','£12','Studio only']]),photo('ph-cr-mugs','Handmade ceramic mugs on a shelf',{ratio:0.5,title:'This week’s firing'})]),
  ]),
 ]});
t.push({id:'craft-timeline',title:'Craft project timeline',category:'Craft & making',also:['Project plans'],
 description:'Schedule production for a craft business — making, drying, firing, finishing and selling — on a calendar so stock is ready for each market.',tags:['craft','timeline','production','schedule','markets'],
 rows:[
  intro('Production timeline — six weeks to the winter markets','Three batches staggered so every market has fresh stock. Firings are the bottleneck.','Each batch moves throw → dry → bisque → glaze → sell. Put kiln bookings on the calendar first; everything else fits around them.'),
  row([single(1880,timeline('Six weeks',{mode:'date',days:42,items:[
   {ref:'b1t',at:0,len:4,lane:0},{ref:'b1f',at:7,len:2,lane:0},{ref:'b1g',at:11,len:2,lane:0},
   {ref:'b2t',at:7,len:4,lane:1},{ref:'b2f',at:14,len:2,lane:1},{ref:'b2g',at:18,len:2,lane:1},
   {ref:'b3t',at:14,len:4,lane:2},{ref:'b3f',at:21,len:2,lane:2},{ref:'b3g',at:25,len:2,lane:2},
   {ref:'mk1',at:20,len:2,lane:3},{ref:'mk2',at:34,len:2,lane:3}]},{lane:60}))]),
  row([
   column('Batch 1 — mugs',440,[note('Throw','36 mugs.',{key:'b1t'}),note('Bisque firing','',{key:'b1f',color:'rose'}),note('Glaze firing','',{key:'b1g',color:'rose'})]),
   column('Batch 2 — bud vases',440,[note('Throw','30 vases.',{key:'b2t'}),note('Bisque firing','',{key:'b2f',color:'rose'}),note('Glaze firing','',{key:'b2g',color:'rose'})]),
   column('Batch 3 — ornaments',440,[note('Make','60 ornaments.',{key:'b3t'}),note('Bisque firing','',{key:'b3f',color:'rose'}),note('Glaze firing','',{key:'b3g',color:'rose'})]),
   column('Markets',440,[note('Village hall market','Batch 1 + 2.',{key:'mk1',color:'sage'}),note('Winter market','All three.',{key:'mk2',color:'sage'})]),
  ]),
 ]});

// ── Fashion ──────────────────────────────────────────────────────────────────
t.push({id:'fashion-brief',title:'Fashion brief',category:'Fashion',also:['Creative briefs'],
 description:'A visual fashion brief: concept, customer, silhouettes, fabrics, colour, price points, range plan and timeline.',tags:['fashion','brief','range plan','collection'],
 rows:[
  intro('Brief — AW “Fieldwork”','Twelve looks for a small label’s second collection. Wholesale and direct.','Combine words and images: every decision on this board should have a picture next to it. The range plan is the contract — it decides how many pieces get made.'),
  row([
   column('Concept',340,[note('Story','Botanists’ and surveyors’ workwear, rebuilt for a decade of wear.',{color:'sand'}),photo('ph-fa-workwear','Person wearing vintage workwear jacket outdoors in nature',{ratio:0.8,title:'Mood'})]),
   column('Customer',320,[note('Who','28–50, buys less and better, walks a lot, hates logos.')]),
   column('Fabrics & colour',360,[swatches([['#5b6236','Moss'],['#a0522d','Rust'],['#c2b280','Map buff'],['#2f3e46','Slate']],2,156),note('Fabrics','Waxed cotton, wool tweed, heavy linen, merino.')]),
   column('Range plan',420,[table('Pieces',[['Category','Styles','Price'],['Outerwear','4','£280–420'],['Shirts','3','£110–140'],['Knitwear','2','£150–180'],['Trousers / skirts','3','£130–160']])]),
   column('Timeline',340,[table('Key dates',[['Milestone','Week'],['Design lock','3'],['Samples','10'],['Lookbook','13'],['Market','16']])]),
  ]),
 ]});
t.push({id:'fashion-brainstorm',title:'Fashion brainstorm',category:'Fashion',also:['Brainstorming'],
 description:'Capture garment ideas, details, references and quick sketches, and grow them into a collection direction.',tags:['fashion','brainstorm','garments','sketches'],
 rows:[
  intro('Brainstorm — “Fieldwork” garments','Garments and details before silhouettes are fixed. Sketch fast, keep everything.','One idea per sticky; sketch the strong ones as flats. Group into outerwear, tops, bottoms, details. Star details that could appear across several pieces — they make a collection hang together.'),
  row([
   column('Garments',340,[sticky('Survey jacket with map pocket','',{color:'sand'}),sticky('Field skirt with tool loops','',{color:'sand'}),sticky('Collector’s apron-vest','',{color:'sand'})]),
   column('Details ★',340,[sticky('★ Bellows pockets sized for a notebook','',{color:'sky'}),sticky('★ Contour-line topstitching','',{color:'sky'}),sticky('Brass snap “specimen tags”','',{color:'sky'})]),
   column('Flats',720,[grid(3,212,[drawing('Survey jacket — flat',sk.curve('M380,120 L620,120 L700,220 L700,560 L300,560 L300,220 Z')+sk.line(500,120,500,560)+sk.rect(330,330,120,100)+sk.rect(550,330,120,100)+sk.curve('M380,120 L300,220 L240,420')+sk.curve('M620,120 L700,220 L760,420')),drawing('Field skirt — flat',sk.curve('M380,140 L620,140 L700,560 L300,560 Z')+sk.rect(330,300,90,90)+sk.line(600,180,600,260)),drawing('Apron-vest — flat',sk.curve('M400,120 L600,120 L660,560 L340,560 Z')+sk.rect(400,280,200,140)+sk.line(400,350,600,350))],{gap:16})]),
   column('References',340,[photos([['ph-fa-field-notebook','Field notebook with botanical sketches','Notebook sizes'],['ph-fab-workshop-apron','Leather work apron with tools in pockets','Work aprons']],1,308)]),
  ]),
 ]});
t.push({id:'fashion-lookbook',title:'Fashion lookbook',category:'Fashion',
 description:'Compile a collection’s looks — model, pieces, styling notes and prices — into frames you can present or export as a lookbook.',tags:['lookbook','collection','looks','presentation'],
 rows:[
  intro('Lookbook — AW “Fieldwork”','Twelve looks; the first six shown here. Each frame is a page — use Present for buyer appointments.','One frame per look: the photo, the pieces with prices, and a styling note. Keep the order the same as the runway so buyers can follow.'),
  row([
   frame('Look 01',[row([stack(360,[photo('ph-lb-look1','Model in a waxed cotton jacket standing on moorland',{ratio:1.3,title:'Look 01'})]),column('Pieces',300,[table('Look 01',[['Piece','£'],['Survey jacket','420'],['Merino roll-neck','150'],['Linen trousers','140']]),note('Styling','Jacket open, collar up, boots unlaced.')])])]),
   frame('Look 02',[row([stack(360,[photo('ph-lb-look2','Model in a long tweed coat walking outdoors',{ratio:1.3,title:'Look 02'})]),column('Pieces',300,[table('Look 02',[['Piece','£'],['Tweed field coat','380'],['Map-print shirt','130'],['Utility skirt','150']]),note('Styling','Belted coat, shirt cuffs out.')])])]),
   frame('Look 03',[row([stack(360,[photo('ph-lb-look3','Model in a moss green knit sweater in a forest',{ratio:1.3,title:'Look 03'})]),column('Pieces',300,[table('Look 03',[['Piece','£'],['Moss cable knit','180'],['Peat trousers','160']]),note('Styling','Sleeves pushed up; notebook in pocket.')])])]),
  ],{gap:60}),
 ]});

// ── Education ────────────────────────────────────────────────────────────────
t.push({id:'research-proposal',title:'Research proposal',category:'Education',
 description:'Outline research aims, questions, literature, methods, ethics, timeline, budget and expected outcomes to win approval or funding.',tags:['research proposal','academic','methods','funding'],
 rows:[
  intro('Proposal — community gardening and loneliness in later life','A mixed-methods MA study. For supervisor approval and a small departmental grant.','Each column is a section of the written proposal. Keep the aim to one sentence and make sure every method answers a research question.'),
  row([
   column('Aim & questions',360,[note('Aim','To find out whether regular community gardening reduces loneliness among adults over 65.',{color:'sand'}),note('Questions','1. Does loneliness (UCLA scale) fall after 12 weeks of gardening?\n2. Which parts of gardening do participants link to feeling less alone?')]),
   column('Literature',360,[link('Social prescribing (overview)','https://en.wikipedia.org/wiki/Social_prescribing','Context for non-clinical interventions.'),note('Gap','Most studies measure wellbeing generally, not loneliness specifically, and few hear participants’ own explanations.')]),
   column('Methods',360,[table('Design',[['Part','Method'],['Quantitative','Pre/post survey, n≈40'],['Qualitative','10 semi-structured interviews'],['Analysis','Paired t-test; thematic analysis'],['Sites','3 community gardens']])]),
   column('Ethics',340,[task('Ethics',['Informed consent (accessible format)','Right to withdraw','Anonymised data','Safeguarding contact at each site'])]),
   column('Budget & outcomes',360,[table('Budget — £970',[['Item','£'],['Vouchers','400'],['Transcription','350'],['Travel','180'],['Printing','40']]),note('Outcomes','Dissertation; summary for gardens; conference poster.',{color:'sage'})]),
  ]),
  row([single(1880,timeline('Research timeline',{mode:'date',days:270,items:[{ref:'rp1',at:0,len:40},{ref:'rp2',at:30,len:30,lane:1},{ref:'rp3',at:60,len:84},{ref:'rp4',at:144,len:40,lane:1},{ref:'rp5',at:170,len:90,lane:2}]}))]),
  row([grid(5,360,[note('Literature review','',{key:'rp1'}),note('Ethics approval','',{key:'rp2',color:'sand'}),note('Fieldwork — 12 weeks','',{key:'rp3'}),note('Analysis','',{key:'rp4'}),note('Writing up','',{key:'rp5',color:'sage'})],{gap:20})]),
 ]});
t.push({id:'class-notes',title:'Class notes',category:'Education',
 description:'Capture a lesson’s key concepts, examples, diagrams, questions and actions in a layout that’s easy to revise from.',tags:['notes','study','lecture','revision'],
 rows:[
  intro('Notes — Colour theory, week 3: harmony','Lecture notes laid out for revision. Concepts left, examples middle, my questions right.','During class: capture fast in the inbox. After class: move each note to concepts, examples or questions, and write a three-line summary at the top. Revise from the summary first.'),
  row([
   column('Summary',380,[note('In three lines','1. Harmony = colours with a clear relationship on the wheel.\n2. Main schemes: complementary, analogous, triadic, split-complementary.\n3. Value and saturation matter as much as hue.',{color:'sand'})]),
   column('Concepts',380,[note('Complementary','Opposites on the wheel; maximum contrast.'),note('Analogous','Neighbours; calm and unified.'),note('Triadic','Three evenly spaced; lively, needs one dominant.')]),
   column('Examples',420,[swatches([['#2a9d8f','Teal'],['#e76f51','Coral'],['#e9c46a','Saffron'],['#264653','Ink']],2,176),note('Example','Teal + coral = near-complementary; saffron as accent; ink for text.')]),
   column('Questions',360,[note('?','Why do complementary colours vibrate at the same value?',{color:'sky'}),note('?','Is the “60-30-10 rule” real or folklore?',{color:'sky'})]),
   column('To do',320,[task('Actions',['Read chapter 4','Make 3 palettes from photos','Bring questions to seminar'])]),
  ]),
 ]});

export default t;

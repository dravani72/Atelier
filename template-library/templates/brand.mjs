import {note,task,photo,link,heading,sticky,shape,table,file,timeline,column,stack,grid,single,place,row,frame} from '../lib/dsl.mjs';
import {palette,swatch,typeSpecimen,drawing,sk,panel} from '../lib/assets.mjs';
import {intro,photos,swatches} from '../lib/kit.mjs';
import * as S from '../lib/scenes.mjs';

const t=[];
// Logo sketches on paper.
const mark=(title,svg)=>drawing(title,svg,{w:650,h:650});
const star=(cx,cy,r)=>{let d='';for(let i=0;i<8;i++){const a=i*Math.PI/4,rr=i%2?r*0.35:r;d+=`${i?'L':'M'}${cx+Math.cos(a)*rr},${cy+Math.sin(a)*rr} `;}return `<path d="${d}Z" stroke-width="10"/>`;};

t.push({id:'design-concept-presentation',title:'Design concept presentation',category:'Logo design',also:['Graphic design','Branding'],
 description:'Present logo or design concepts with the story and strategy behind them, frame by frame in Present mode, with space for feedback.',tags:['presentation','logo','concepts','client','feedback'],
 rows:[
  intro('Northlight Physio — logo concepts','Three routes, presented in order. Use Present to walk the client through frame by frame; comments on each card collect feedback.','Each frame is a slide. Open with the brief so everyone judges against the same goal. Show each route at small size and in use, not just big on white. End with a clear decision request.'),
  row([frame('1 · What we heard',[row([column('The brief',420,[note('Goal','A mark that feels modern, confident and kind — readable on a cycling jersey and at 16 px.',{color:'sand'}),note('For','Active people over 50 recovering from injury.')]),stack(420,[photo('ph-lg-cyclist','Older cyclist riding on a country road in morning light',{ratio:0.66,title:'Who it is for'})]),column('Must',380,[task('Requirements',['One colour','Works at 16 px','No medical clichés'])])])])]),
  row([frame('2 · Route A — The rising line',[row([stack(420,[mark('Route A — mark',`<path d="M120,470 C240,470 260,260 380,260 S520,170 540,150" stroke-width="22"/>`+sk.circle(540,150,24,'fill="#27272a"'))]),stack(420,[note('Story','Recovery as a line that rises — the north-pointing dot is the goal you are moving towards.'),photo('ph-lg-signage','Clean modern wayfinding signage',{ratio:0.62,title:'In use — signage'})]),column('Feedback',380,[note('Client','',{color:'plain',comments:[['Client','Love the energy. Is it too sporty?']]})])])])]),
  row([frame('3 · Route B — Two arcs',[row([stack(420,[mark('Route B — mark','<path d="M150,470 A170,170 0 0 1 490,470" stroke-width="24"/><path d="M230,470 A90,90 0 0 1 410,470" stroke-width="24"/>'+sk.line(110,470,540,470,'stroke-width="10"'))]),stack(420,[note('Story','Support: a bigger arc holding a smaller one. Also reads as a sunrise — “north light”.'),photo('ph-lg-embroidery','Embroidered logo patch on fabric',{ratio:0.62,title:'In use — embroidery'})]),column('Feedback',380,[note('Client','',{color:'plain'})])])])]),
  row([frame('4 · Route C — North star',[row([stack(420,[mark('Route C — mark',star(325,325,200))]),stack(420,[note('Story','The north star as a joint: eight points, one centre, everything moving in balance.'),typeSpecimen('Poppins','northlight',{role:'Wordmark',weight:600,size:110})]),column('Feedback',380,[note('Client','',{color:'plain'})])])])]),
  row([frame('5 · Decision',[row([column('Our recommendation',560,[note('Route B','Most distinctive at small sizes, warmest story, and the only one that says “support” without a cliché.',{color:'sage'})]),column('Next steps',560,[task('After the decision',['Refine chosen route (2 rounds)','Colour + type system','Application mock-ups','Final files + mini guide'])])])])]),
 ]});

t.push({id:'brand-assets-handover',title:'Brand assets handover',category:'Logo design',also:['Branding','Graphic design'],
 description:'Hand over a finished identity: logos, colours, type, imagery, templates and usage rules in one place the client can keep.',tags:['handover','brand assets','logo files','guidelines'],
 rows:[
  intro('Handover — Saltmarsh Swim Club identity','Everything the club needs to use its new identity without us. Download links, rules and examples.','Group files by what people will look for. Every file card names the format and when to use it. Keep the rules short — a page anyone on the committee can follow.'),
  row([
   column('Logo',360,[mark('Primary logo',`<rect x="125" y="125" width="400" height="400" rx="20" stroke-width="14"/><path d="M125,325 Q225,265 325,325 T525,325" stroke-width="14"/><path d="M125,405 Q225,345 325,405 T525,405" stroke-width="14"/>`+sk.text(170,230,'SALTMARSH',58)),file('Logo files','Saltmarsh_Logo.zip','Primary, symbol only, one-colour, reverse — SVG (print, web), PNG (social), PDF (printers).')]),
   column('Colour',360,[swatches([['#0b4f6c','Deep water'],['#f9a03f','Buoy orange'],['#f4f1ea','Foam'],['#20bf55','Signal green']],2,156),note('Use','Deep water and Foam for almost everything. Buoy orange for caps and highlights.')]),
   column('Type',360,[typeSpecimen('Archivo Black','SALTMARSH',{role:'Headlines',size:100}),typeSpecimen('Inter','Swims daily at 07:00, all year.',{role:'Text',size:52})]),
   column('In use',360,[photos([['ph-lb-swim-cap','Swimmers wearing bright swim caps','Caps'],['ph-lb-beach-hut','Colourful beach huts on a promenade','Beach-hut flag']],1,328)]),
   column('Rules',340,[note('Do','- Keep clear space = the height of the wave\n- One-colour on caps\n- Minimum width 20 mm',{color:'sage'}),note('Don’t','- Stretch, outline or recolour\n- Put the logo on busy photos\n- Add effects',{color:'rose'}),file('Mini guide','Saltmarsh_Guide.pdf','4 pages.')]),
  ]),
 ]});

t.push({id:'logo-brainstorm',title:'Logo brainstorming',category:'Logo design',also:['Brainstorming','Branding'],
 description:'Explore logo ideas through word lists, sketches, references and quick thumbnails before choosing directions to develop.',tags:['logo','brainstorm','sketching','ideas'],
 rows:[
  intro('Logo brainstorm — Saltmarsh Swim Club','Words, shapes and thumbnails. Fifty bad ideas get you to three good ones.','Start with word association, then thumbnail as fast as you can — 30 seconds each. Star the ones that make you smile; three of those become routes.'),
  row([
   column('Words',300,[note('Association','Cold · salt · dawn · wave · cap · flag · buoy · horizon · courage · friends · steam · marsh · tide · splash'),sticky('Favourite idea','The swimming cap as a sun rising over the horizon.',{color:'sand'})]),
   column('Thumbnails',720,[grid(3,212,[mark('Wave in a flag',`<rect x="125" y="160" width="400" height="300" stroke-width="12"/><path d="M125,310 Q225,250 325,310 T525,310" stroke-width="12"/>`),mark('Cap = sun',`<path d="M125,400 L525,400" stroke-width="12"/><path d="M200,400 A125,125 0 0 1 450,400" stroke-width="12"/>`),mark('Buoy',`<circle cx="325" cy="325" r="170" stroke-width="12"/><circle cx="325" cy="325" r="80" stroke-width="12"/>`),mark('S as a wave',`<path d="M440,210 C380,140 230,170 240,260 C250,350 420,330 420,430 C420,510 280,530 210,470" stroke-width="16"/>`),mark('Steam from heads',`<circle cx="250" cy="420" r="45" stroke-width="12"/><circle cx="400" cy="420" r="45" stroke-width="12"/><path d="M250,350 q-20,-40 0,-80 q20,-40 0,-80 M400,350 q-20,-40 0,-80 q20,-40 0,-80" stroke-width="8"/>`),mark('Signal flags',`<rect x="160" y="200" width="140" height="140" stroke-width="12"/><rect x="350" y="200" width="140" height="140" stroke-width="12"/><path d="M160,200 L300,340 M350,340 L490,200" stroke-width="8"/>`)],{gap:16})]),
   column('References',340,[photos([['ph-lbs-signal-flags','Nautical signal flags on a ship','Signal flags'],['ph-lbs-badge','Vintage sports club badge or patch','Old club badges']],1,308)]),
   column('Shortlist',340,[note('★ Cap = sun','Simple, owns the dawn swim, great on caps.',{color:'sage'}),note('★ Wave in a flag','Flag on the beach hut; strong but common.',{color:'sage'}),note('★ Signal flags','Clever; might need explaining.',{color:'sage'})]),
  ]),
 ]});

t.push({id:'brand-personality',title:'Brand personality',category:'Branding',also:['Brand workshops'],
 description:'Define a brand’s character as a small set of traits, each with what it is and isn’t, sliders and examples of how it sounds.',tags:['brand personality','traits','tone of voice','workshop'],
 rows:[
  intro('Brand personality — Fernhill Dental','Four traits chosen in the staff workshop. Each is defined by what it means and what it does not mean.','Pick no more than four traits. A trait is only useful with its boundary (“calm, not sleepy”). Use the sliders to place the brand between opposites, then write how each trait sounds.'),
  row([
   column('Calm',340,[note('Is','Unhurried, reassuring, explains before acting.',{color:'sage'}),note('Is not','Sleepy, vague or slow to respond.',{color:'rose'}),note('Sounds like','> “Here’s what happens next. You can stop me any time.”')]),
   column('Straight-talking',340,[note('Is','Plain words, real prices, honest answers.',{color:'sage'}),note('Is not','Blunt, cold or full of jargon.',{color:'rose'}),note('Sounds like','> “This filling costs £95. Here’s why.”')]),
   column('Kind',340,[note('Is','Notices nerves; never judges.',{color:'sage'}),note('Is not','Patronising or overly cheerful.',{color:'rose'}),note('Sounds like','> “It’s been a while? Lots of people say that. Let’s start gently.”')]),
   column('Quietly confident',340,[note('Is','Expert, assured, no showing off.',{color:'sage'}),note('Is not','Clinical, superior, salesy.',{color:'rose'}),note('Sounds like','> “We do this every day. You’re in good hands.”')]),
   column('Sliders',420,[table('Where we sit (1–5)',[['','1','→','5',''],['Formal','','●','','Casual'],['Serious','','','●','Playful'],['Clinical','','','','● Warm'],['Traditional','','●','','Modern']]),note('Read','We sit a little casual, slightly playful, very warm, mid-modern.')]),
  ]),
 ]});

t.push({id:'brand-naming',title:'Brand naming',category:'Branding',also:['Brand workshops'],
 description:'Develop a name step by step: criteria, territories, long list, short list, checks (domains, trademarks, languages) and the decision.',tags:['naming','brand name','trademark','process'],
 rows:[
  intro('Naming — the lending app (working title “Loop”)','From criteria to a checked shortlist. The name must be short, friendly, ownable and work in five languages.','Agree criteria before anyone suggests a name. Generate by territory, not at random. Cut hard to a shortlist, then check every survivor before falling in love with it.'),
  row([
   column('Criteria',320,[task('A good name is…',['1–2 syllables','Easy to say and spell','Suggests sharing or neighbours','.com or .app available','No bad meanings in EN, ES, FR, DE, PL'])]),
   column('Territories',340,[note('Circles','Loop, Ring, Round'),note('Neighbours','Next Door*, Nabo, Street'),note('Lending','Lend, Borrow, Swap'),note('Made-up','Lendly, Borro, Swapto')]),
   column('Long list (30)',340,[note('Long list','Loop · Ring · Round · Lend · Lendly · Borro · Swapto · Kin · Hob · Porch · Stoop · Gate · Nabo · Share · Pass · Hand · Handy · Keep · Bring · Tote · Crate · Shed · Lodge · Yard · Village · Common · Neighbr · Lendy · Loan · Each')]),
   column('Shortlist',340,[note('Loop','Simple, circular, friendly.',{color:'sand'}),note('Porch','Warm image of a doorstep handover.',{color:'sand'}),note('Common','Shared land; slightly abstract.',{color:'sand'})]),
   column('Checks',420,[table('Checks',[['Name','Domain','Trademark','Languages'],['Loop','.app ✓','Crowded','✓'],['Porch','.app ✓','Clear','✓'],['Common','✗','Clear','✓']]),note('Decision','**Porch.** Clear trademark space, warm image, the handover moment is literally on the porch.',{color:'sage'})]),
  ]),
 ]});

t.push({id:'brand-audit',title:'Brand audit',category:'Branding',
 description:'Assess an existing brand — audience, position, visuals, messaging and touchpoints — to decide what to keep, change or drop.',tags:['brand audit','review','touchpoints','rebrand'],
 rows:[
  intro('Brand audit — Fernhill’s five practices','Every touchpoint gathered in one place and judged against what patients told us. Keep, change or drop.','Collect real examples (photos of signs, screenshots, leaflets). Judge each against the research, not taste. Colour the verdict: sage keep, sand change, rose drop.'),
  row([
   column('Signage',340,[photo('ph-ba-clinic-sign','Dental clinic sign on a building',{ratio:0.62,title:'Practice 2 sign'}),note('Verdict — change','Five different signs, two with tooth clip-art.',{color:'sand'})]),
   column('Website',340,[photo('ph-ba-website-old','Outdated website on a computer screen',{ratio:0.62,title:'Current site'}),note('Verdict — change','Prices hidden; booking takes 7 steps.',{color:'sand'})]),
   column('Reception',340,[photo('ph-ba-reception','Dental reception desk with staff',{ratio:0.62,title:'Practice 4 reception'}),note('Verdict — keep','Staff warmth scores highest in reviews.',{color:'sage'})]),
   column('Leaflets',340,[photo('ph-ba-leaflets','Medical leaflets in a rack',{ratio:0.62,title:'Leaflet rack'}),note('Verdict — drop','Nobody takes them; replace with a pre-visit email.',{color:'rose'})]),
   column('Messaging',340,[note('Today','“Excellence in dentistry since 1987.”'),note('What patients want to hear','“You’re in control.”',{color:'sky'}),note('Verdict — change','Say what we do for nervous patients, not how long we’ve existed.',{color:'sand'})]),
  ]),
  row([column('Summary',1820,[grid(3,580,[note('Keep','The people. The calm treatment rooms at practices 1 and 4. The Fernhill name.',{color:'sage'}),note('Change','One sign system; website booking; messaging about control.',{color:'sand'}),note('Drop','Tooth clip-art; leaflets; “since 1987”.',{color:'rose'})],{gap:20})])]),
 ]});

t.push({id:'brand-strategy',title:'Brand strategy',category:'Branding',also:['Graphic design','Brand workshops'],
 description:'Define a brand’s purpose, vision, positioning, values, personality, proposition and story on one page.',tags:['brand strategy','purpose','values','positioning'],
 rows:[
  intro('Brand strategy — Fernhill Dental','The strategy on one page. Everything the identity, website and staff training will be built on.','Read top to bottom: why we exist, what we stand for, who for, what we promise and how we sound. Each card should be short enough to remember.'),
  row([
   column('Purpose',360,[note('Why we exist','To make sure no one avoids the dentist because they are afraid.',{color:'sand'})]),
   column('Vision',360,[note('Where we’re going','A town where people book a check-up as easily as a haircut.')]),
   column('Positioning',360,[note('Statement','For anxious adults who avoid the dentist, Fernhill is the practice that puts you in control — because every step is explained and you can always stop.',{color:'sand'})]),
   column('Values',360,[note('Honesty','Prices up front, plain answers.'),note('Patience','Nobody is rushed.'),note('Control','The patient decides the pace.')]),
   column('Proposition',360,[note('Promise','**Dentistry that puts you in charge.**',{color:'sage'}),note('Proof','Stop signal in every chair · prices online · 30-minute first visits with no treatment')]),
  ]),
  row([
   column('Personality',560,[note('Traits','Calm · straight-talking · kind · quietly confident')]),
   column('Story (short)',620,[note('Story','Most people who avoid the dentist aren’t afraid of pain — they’re afraid of not knowing what’s coming. So at Fernhill, you’ll always know. We explain before we act, we show you the price before you agree, and you can stop us at any time. Your mouth, your pace.')]),
   column('Audiences',560,[table('Priority',[['Audience','Need'],['Anxious adults','Control'],['Families','Ease, child-friendly'],['Staff','Pride, clarity']])]),
  ]),
 ]});

// ── Motion ───────────────────────────────────────────────────────────────────
t.push({id:'motion-brainstorm',title:'Motion design brainstorming',category:'Motion design',also:['Brainstorming'],
 description:'Generate and sketch motion concepts — metaphors, transitions, techniques and references — and pick the ones that fit the brief.',tags:['motion design','ideas','transitions','concepts'],
 rows:[
  intro('Brainstorm — reforestation explainer','How could “one seed becomes a forest” move? Metaphors first, then techniques, then transitions.','Sketch movement, not pictures: arrows, before/after, the in-between. Tag ideas with the technique they need so the team can judge cost early.'),
  row([
   column('Metaphors',340,[sticky('Growth rings as a clock','',{color:'sand'}),sticky('Seed → city of trees, like a time-lapse map','',{color:'sand'}),sticky('A single leaf that becomes the forest canopy','',{color:'sand'})]),
   column('Techniques',340,[sticky('Paper cut-out, stop-motion feel','',{color:'sky'}),sticky('Line drawing that fills with colour','',{color:'sky'}),sticky('Parallax layers','',{color:'sky'})]),
   column('Transitions',520,[grid(2,236,[panel('Leaf wipe',S.withMove((w,h)=>sk.curve(`M${w*0.2},${h*0.8} Q${w*0.5},${h*0.1} ${w*0.8},${h*0.2} Q${w*0.6},${h*0.6} ${w*0.2},${h*0.8}`),'pan')),panel('Ring zoom',S.withMove((w,h)=>[60,120,180].map(r=>sk.circle(w/2,h/2,r)).join(''),'push'))],{gap:16})]),
   column('References',340,[photos([['ph-mo-paper-leaves','Paper cut leaves craft','Paper cut'],['ph-mo-tree-rings','Close-up of tree growth rings','Rings']],1,308)]),
   column('Pick',340,[note('Chosen','Paper cut-out + leaf-wipe transitions. Rings as the time device in scene 5.',{color:'sage'}),table('Cost check',[['Idea','Effort'],['Paper cut','Medium'],['Leaf wipe','Low'],['Rings zoom','Low']])]),
  ]),
 ]});

t.push({id:'style-frames',title:'Motion design style frames',category:'Motion design',
 description:'Present the look of an animation — key frames with type, colour and texture — for approval before production, in Present mode.',tags:['style frames','motion design','look development','approval'],
 rows:[
  intro('Style frames — reforestation explainer','Five frames that define the look. Approved frames become the reference for every scene.','Each frame is presented on its own. Show final-quality stills, not sketches. Note what is approved and what the client wants changed directly on the frame.'),
  row([frame('Frame 1 — the seed',[row([stack(640,[photo('ph-sf-seed','Seed or seedling held in a cupped hand, soft light',{ratio:0.5625,title:'Style frame 1'})]),column('Notes',360,[note('Look','Warm paper background, grain at 15%, single sun-yellow accent.'),note('Status','Approved',{color:'sage'})])])])]),
  row([frame('Frame 2 — underground',[row([stack(640,[photo('ph-mo-roots','Tree roots exposed in soil',{ratio:0.5625,title:'Style frame 2'})]),column('Notes',360,[note('Look','Roots drawn in white line over deep soil brown.'),note('Status','Change: lighten the soil 10%.',{color:'sand'})])])])]),
  row([frame('Frame 3 — the forest',[row([stack(640,[photo('ph-mo-forest-canopy','Looking up at a forest canopy with sunlight',{ratio:0.5625,title:'Style frame 3'})]),column('System',360,[swatches([['#1b4332','Old growth'],['#52b788','New leaf'],['#f4a261','Sunrise'],['#7f5539','Soil']],2,156),typeSpecimen('Fraunces','One seed.',{role:'Supers',weight:600,size:120})])])])]),
 ]});

// Presentations read better with frames side by side, two (or three) to a row.
for(const id of ['design-concept-presentation','style-frames']){const tp=t.find(x=>x.id===id);const frames=tp.rows.slice(1).map(r=>r.row[0]);const per=id==='style-frames'?3:2;tp.rows=[tp.rows[0]];for(let i=0;i<frames.length;i+=per)tp.rows.push(row(frames.slice(i,i+per),{gap:60,after:60}));}

export default t;

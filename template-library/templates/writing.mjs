import {note,task,photo,link,heading,sticky,shape,table,file,timeline,column,stack,grid,single,place,row} from '../lib/dsl.mjs';
import {palette,typeSpecimen,drawing,sk,chart} from '../lib/assets.mjs';
import {intro,photos,swatches} from '../lib/kit.mjs';

const t=[];
const BOOK='The Glass Orchard';
const premise=`${BOOK} — a novel. On the island of Kesh, where every family blows glass, Ines Varga comes home to bury her grandmother and finds the family furnace still lit, and a ledger of orders that should not exist.`;

// ── Novel plan (date) ─────────────────────────────────────────────────────────
t.push({
 id:'novel-plan',title:'Novel plan',category:'Creative writing',also:['Project plans','Novel outlines'],
 description:'A roadmap from idea to finished manuscript: premise, characters, structure, word-count targets and a drafting calendar.',
 tags:['novel','writing','plan','word count','drafting'],
 rows:[
  intro(`${BOOK} — novel plan`,'Literary mystery, 90,000 words. First draft in sixteen weeks at 6,000 words a week, then two revision passes.','Keep this board as the book’s home. Link out to the character, world and outline boards; use the calendar to protect writing time and see slippage early.'),
  row([
   column('The book',360,[note('Premise',premise),note('Genre & comparables','Literary mystery with a touch of magical realism. Quiet island setting, family secrets, a craft at the centre.'),table('Shape',[['','Target'],['Length','90,000 words'],['Chapters','30 × ~3,000'],['POV','Close third, Ines'],['Tense','Past']])]),
   column('People',340,[note('Ines Varga, 34','Glassblower who left Kesh at 18 and never came back. Precise, impatient, secretly homesick.'),note('Zsófia Varga (dies ch. 1)','Her grandmother. The best glass-maker the island had. Kept the ledger.'),note('Tomas Varga, 29','Ines’s brother. Stayed. Runs the furnace badly and knows it.'),note('Edwin Hale','Collector from the mainland who arrives on the second ferry. Wants the orchard.')]),
   column('Structure',340,[note('Part one — the funeral (ch. 1–9)','Ines returns; finds the ledger; meets Hale.'),note('Part two — the orders (ch. 10–21)','She fulfils the impossible orders one by one and learns who they were for.'),note('Part three — the orchard (ch. 22–30)','The glass orchard: what Zsófia built, and what Ines chooses to do with it.')]),
   column('Writing rules',340,[note('How I work','- 1,200 words a day, five days a week\n- Never edit during the first draft\n- End each session mid-sentence\n- Notes for later go in [brackets]',{color:'sand'}),task('Before drafting',['x Premise and ending fixed','x Main characters on their own board','Chapter-by-chapter outline','Research trip: a glass studio'])]),
   column('Progress',420,[chart('Words written — target vs actual','line',['W1','W2','W3','W4','W5','W6'],[{name:'Target',values:[6,12,18,24,30,36]},{name:'Actual',values:[5,11,19,22,27,31]}],{card:{title:'Words (thousands) — first six weeks'}}),note('Status','Week 6: 31,000 words, 5,000 behind. Add one Saturday session for three weeks.',{color:'rose'})]),
  ]),
  row([single(2000,timeline('Sixteen-week first draft + revisions',{mode:'date',days:182,items:[{ref:'np1',at:0,len:35,lane:0},{ref:'np2',at:35,len:42,lane:0},{ref:'np3',at:77,len:35,lane:0},{ref:'np4',at:112,len:7,lane:1},{ref:'np5',at:119,len:35,lane:1},{ref:'np6',at:154,len:21,lane:2},{ref:'np7',at:175,len:7,lane:3}]}))]),
  row([grid(7,268,[note('Draft — part one','Ch. 1–9 · 27k words',{key:'np1'}),note('Draft — part two','Ch. 10–21 · 36k words',{key:'np2'}),note('Draft — part three','Ch. 22–30 · 27k words',{key:'np3'}),note('Rest','Don’t read it. Not even once.',{key:'np4',color:'sage'}),note('Revision 1 — structure','Big moves; cut ch. 14?',{key:'np5'}),note('Revision 2 — line edit','Sentences, voice, rhythm.',{key:'np6'}),note('To beta readers','Three readers, two weeks.',{key:'np7',color:'sand'})],{gap:14})]),
 ],
});

// ── Story brainstorming ───────────────────────────────────────────────────────
t.push({
 id:'story-brainstorm',title:'Story brainstorming',category:'Creative writing',also:['Brainstorming'],
 description:'Generate plot twists, characters, scenes and images without judging them, then cluster and connect the ones that spark.',
 tags:['brainstorm','plot','ideas','writing'],
 rows:[
  intro('Brainstorm — what is in the ledger?','The ledger Zsófia kept is the engine of the book. What were the orders, who placed them, and why are they impossible?','Fill the board fast — one idea per sticky. Then circle back, cluster the ones that belong together, and connect each cluster to a question it answers.'),
  row([
   column('Orders in the ledger',380,[grid(2,166,[sticky('A glass apple for a child who has never seen one','',{color:'sand'}),sticky('A window for a house that burned down in 1953','',{color:'sand',key:'o2'}),sticky('A bell that rings without being struck','',{color:'sand'}),sticky('A pair of glass shoes — size of a man','',{color:'sand'}),sticky('A vase for flowers that don’t exist yet','',{color:'sand'}),sticky('A fish to put back in the sea','',{color:'sand',key:'o6'})],{gap:12})]),
   column('Who ordered them?',380,[grid(2,166,[sticky('The dead','',{color:'rose',key:'w1'}),sticky('People who haven’t been born','',{color:'rose'}),sticky('Zsófia herself, for Ines','',{color:'rose',key:'w3'}),sticky('The island','',{color:'rose'})],{gap:12})]),
   column('Twists',380,[grid(2,166,[sticky('Hale is Zsófia’s son','',{color:'sky',key:'tw1'}),sticky('The orchard is a grave marker','',{color:'sky',key:'tw2'}),sticky('Tomas has been forging the orders','',{color:'sky'}),sticky('The last order is in Ines’s handwriting','',{color:'sky',key:'tw4'})],{gap:12})]),
   column('Images',380,[photos([['ph-wri-glass-furnace','Glassblower working at a glowing furnace','The furnace that never goes out'],['ph-wri-glass-fruit','Blown glass fruit or glass apples on a table','Glass fruit']],1,348)]),
   column('Keepers',380,[note('Strongest cluster','The orders are for the island’s dead, and the last one is for Ines — written in her own hand, dated the day she left.',{color:'sage',key:'keep'}),task('Questions it raises',['How can her handwriting be in the ledger?','What did Zsófia know?','What does finishing the orders cost?'])]),
  ]),
 ],
 edges:[['o2','w1'],['w3','tw4'],['tw4','keep','strongest'],['tw2','keep']],
});

// ── Novel research ────────────────────────────────────────────────────────────
t.push({
 id:'novel-research',title:'Novel research',category:'Creative writing',
 description:'Keep background research accurate and findable: craft details, places, history, vocabulary and the questions still open.',
 tags:['research','accuracy','setting','history'],
 rows:[
  intro('Research — glassblowing and island life','Everything the book needs to get right. If a detail appears in the manuscript, it should be here with a source.','Organise by topic. Mark each card with the chapter it feeds. Keep a running “still don’t know” list and clear it before revision.'),
  row([
   column('The craft',380,[link('Glassblowing — overview','https://en.wikipedia.org/wiki/Glassblowing','Tools, stages, temperatures.'),note('Vocabulary','*Gather* — molten glass on the pipe. *Glory hole* — reheating furnace. *Marver* — steel table for shaping. *Annealer* — slow-cooling oven.'),photos([['ph-wri-glass-tools','Glassblowing tools: blowpipe, jacks and shears on a bench','Tools on the bench']],1,348)]),
   column('Place',380,[photos([['ph-wri-island-village','Small island village with colourful houses by the sea','Kesh — the harbour'],['ph-wri-island-ferry','Small ferry arriving at an island pier','The ferry']],1,348),note('Notes','Two ferries a day in summer, one in winter. Everyone knows who is on it.')]),
   column('History',380,[note('Island glass traditions','Real lagoon-glass islands kept glassmakers on the island to protect the secrets. Kesh inherits that idea, not the history.'),link('History of glass','https://en.wikipedia.org/wiki/History_of_glass','From Roman core-forming to studio glass.')]),
   column('Sensory details',380,[note('Heat','The furnace runs at ~1,100 °C. Workers drink constantly; forearms have no hair.'),note('Sound','The roar of the glory hole; the *tink* of glass cracking off the punty.'),note('Smell','Hot metal, wet newspaper (used to shape glass), beeswax.')]),
   column('Still don’t know',360,[task('Open questions',['Can a furnace be kept lit for years?','How long does a large piece take to anneal?','What does a glassblower’s hand injury look like?','Visit: a working studio — book a day']),note('Interview','A studio glassblower agreed to a call. Questions ready on the outline board.',{color:'sand'})]),
  ]),
 ],
});

// ── Story map ─────────────────────────────────────────────────────────────────
t.push({
 id:'story-map',title:'Story map',category:'Novel outlines',also:['Creative writing'],
 description:'See the whole story at once: plot threads as lanes, events in order, and connectors where threads cross.',
 tags:['story map','plot threads','structure','novel'],
 rows:[
  intro('Story map — three threads','The book braids three threads: the ledger mystery, Ines and Tomas, and Hale’s bid for the orchard. Where they cross is where the chapters live.','Each row is a thread; read left to right in story order. Connect events that cause each other. A thread with no connections is a subplot that may not earn its place.'),
  row([stack(220,[note('The ledger','The mystery thread.',{color:'sand'})]),grid(6,250,[note('Ch. 2','Ines finds the ledger under the annealer.',{key:'l1'}),note('Ch. 7','The first order: a glass apple.',{key:'l2'}),note('Ch. 12','The window for the burned house.',{key:'l3'}),note('Ch. 18','The orders are for the dead.',{key:'l4'}),note('Ch. 24','The last order is in her handwriting.',{key:'l5'}),note('Ch. 30','She makes it.',{key:'l6'})],{gap:20})],{after:30}),
  row([stack(220,[note('Ines & Tomas','The family thread.',{color:'sky'})]),grid(6,250,[note('Ch. 1','The funeral. They don’t speak.',{key:'f1'}),note('Ch. 5','He lets her into the furnace room.',{key:'f2'}),note('Ch. 11','They work a piece together for the first time.',{key:'f3'}),note('Ch. 19','She learns he forged one order.',{key:'f4'}),note('Ch. 26','The fight in the orchard.',{key:'f5'}),note('Ch. 29','He holds the pipe; she blows.',{key:'f6'})],{gap:20})],{after:30}),
  row([stack(220,[note('Hale','The outside threat.',{color:'rose'})]),grid(6,250,[note('Ch. 3','Hale on the second ferry.',{key:'h1'}),note('Ch. 9','His offer for the orchard.',{key:'h2'}),note('Ch. 15','He knew Zsófia.',{key:'h3'}),note('Ch. 21','He is her son.',{key:'h4'}),note('Ch. 25','He asks for the last order.',{key:'h5'}),note('Ch. 28','He leaves on the morning ferry.',{key:'h6'})],{gap:20})]),
 ],
 edges:[['l1','f2','she needs his key'],['f4','l4','why'],['h3','l4'],['h4','f5','triggers'],['l5','h5'],['f6','l6']],
});

// ── Story outline ─────────────────────────────────────────────────────────────
const chapters=[
 ['1','The funeral','Ines lands on Kesh in the rain. The furnace is still lit.'],['2','Under the annealer','She finds the ledger. Orders, dated, unpaid.'],['3','Second ferry','Hale arrives with flowers and a lawyer.'],['4','The town','Everyone asks when she is leaving.'],['5','The key','Tomas lets her into the furnace room.'],['6','Old hands','She blows glass for the first time in 16 years.'],['7','A glass apple','The first order. A child, a promise.'],['8','The beach','Ines swims where her mother drowned.'],['9','The offer','Hale offers for the orchard. Tomas wants to sell.'],
];
t.push({
 id:'story-outline',title:'Story outline',category:'Novel outlines',also:['Creative writing','Game design'],
 description:'Lay out the book chapter by chapter in a sequence you can rearrange, with the purpose of each scene and what changes.',
 tags:['outline','chapters','scenes','sequence'],
 rows:[
  intro('Outline — part one (chapters 1–9)','One card per chapter: what happens and what changes. Drag cards to reorder; the column is the reading order.','Write each card as “what happens / what changes”. If nothing changes, the chapter is a candidate to cut or merge. Colour: sand = reveal, rose = loss, sky = relationship.'),
  row([
   column('Part one — reading order',420,chapters.map(([n,title,d],i)=>note(`Ch. ${n} — ${title}`,d,{color:[1,6].includes(i)?'sand':i===7?'rose':[4,5].includes(i)?'sky':'paper'}))),
   column('What changes',420,[note('Ch. 1','Ines: visitor → mourner.'),note('Ch. 2','A mystery is opened.'),note('Ch. 5','Tomas: stranger → reluctant ally.'),note('Ch. 7','Ines: doubter → believer (a little).'),note('Ch. 9','Stakes: the orchard can be sold.')]),
   column('Problems to fix',420,[note('Pace','Ch. 3–4 both set up the town. Merge?',{color:'rose'}),note('Missing','We never see Zsófia alive. Add a memory in ch. 6.',{color:'rose'}),task('Outline tasks',['Decide: merge ch. 3–4','Add Zsófia memory','Plant the handwriting clue in ch. 2'])]),
   column('Parts two and three',420,[note('Part two (ch. 10–21)','The orders, one by one; the dead; Tomas’s forgery; Hale’s identity.'),note('Part three (ch. 22–30)','The orchard; the last order; the fight; the morning ferry; the glass apple tree.'),photo('ph-wri-orchard','Apple orchard with old trees in soft morning light',{ratio:0.66,title:'The orchard'})]),
  ]),
 ],
});

// ── Character profile ─────────────────────────────────────────────────────────
t.push({
 id:'character-profile',title:'Character profile',category:'Creative writing',also:['Game design'],
 description:'Build a character from the inside out: want and need, wound, voice, habits, look, relationships and how they change.',
 tags:['character','profile','backstory','arc'],
 rows:[
  intro('Character — Ines Varga','Protagonist. Close third person throughout, so we need to know how she thinks, not just what she does.','Start with want, need and wound — they drive everything else. Add a line of her dialogue for voice. Update the arc card when the outline changes.'),
  row([
   column('Basics',320,[photo('ph-wri-portrait-woman','Portrait of a woman in her thirties, natural light, serious expression',{ratio:1.15,title:'Casting reference'}),table('Facts',[['Item','Detail'],['Age','34'],['Lives','A rented flat on the mainland'],['Work','Glass designer for a lighting firm'],['Family','Brother Tomas; grandmother Zsófia (dies ch. 1)']])]),
   column('Inside',360,[note('Want','To bury Zsófia, sell her share and leave on the Sunday ferry.',{color:'sand'}),note('Need','To forgive herself for leaving — and to make something with her hands that isn’t for sale.',{color:'sage'}),note('Wound','Her mother drowned when she was 12. Ines left the island at 18 and told everyone it was for art school.',{color:'rose'}),note('Lie she believes','“If I don’t need anyone, nobody can leave me.”')]),
   column('Voice & habits',360,[note('How she talks','Short. Exact. Jokes when cornered.\n\n> “I didn’t come back. I came for the funeral. Different verb.”'),note('Habits','Counts things when anxious. Burns the backs of her hands and doesn’t notice. Never sits with her back to a window.')]),
   column('Relationships',360,[note('Tomas','Loves him; resents that he stayed — and that he was right to.'),note('Zsófia','Hero, teacher, the reason she left.'),note('Hale','Recognises in him the same leaving.')]),
   column('Arc',360,[note('Beginning','Visitor. Closed. Competent, careful, cold.'),note('Middle','Hands remember before she does. She starts to want something.'),note('End','Chooses the island — not forever, but on purpose. Makes the last order.'),task('To develop',['One childhood memory with her mother','What she has made in 16 years that she is proud of','A physical tell when she lies'])]),
  ]),
 ],
});

// ── Character relationship map ────────────────────────────────────────────────
const P=(name,body,color,key)=>note(name,body,{color,key,w:240});
t.push({
 id:'character-relationship-map',title:'Character relationship map',category:'Creative writing',also:['Game design'],
 description:'Map how characters are connected — family, loyalty, secrets, debts and rivalries — with labelled connectors you can rearrange.',
 tags:['characters','relationships','map','connections'],
 rows:[
  intro('Who is connected to whom — Kesh','Six characters, the ties between them, and the secrets that change those ties during the book.','Each line is a relationship; its label says what it is now. When a secret is revealed, add a dashed second connector with the new truth.'),
  row([place([
   [700,0,P('Zsófia Varga','The grandmother. Dead from ch. 1, present everywhere.','sand','zs')],
   [260,260,P('Ines Varga','Protagonist. Came back for a week.','sky','in')],
   [1180,260,P('Tomas Varga','Stayed. Keeps the furnace lit.','sky','to')],
   [1000,640,P('Edwin Hale','Mainland collector. Zsófia’s son — hidden.','rose','ha')],
   [0,600,P('Pell','Ferryman. Knows who comes and goes.','paper','pe')],
   [1480,800,P('Dr Mirela Kos','Island doctor. Signed the death certificate.','paper','mk')],
   [260,820,note('Key','Solid line: known relationship. Label after the slash: the truth revealed later.',{color:'plain',w:300})],
  ],{w:1700,h:960})]),
 ],
 edges:[['zs','in','raised / favourite'],['zs','to','raised / heir'],['in','to','siblings — estranged'],['zs','ha','“old friend” / mother',{style:'straight'}],['ha','in','rival / uncle'],['pe','in','old friend'],['mk','zs','doctor / kept her secret'],['to','ha','wants to sell to']],
});

// ── Three-act structure ───────────────────────────────────────────────────────
t.push({
 id:'three-act-structure',title:'Three act structure',category:'Novel outlines',also:['Creative writing','Filmmaking'],
 description:'Plan a story in three parts — setup, confrontation, resolution — with the turning points that hinge them.',
 tags:['three act','structure','turning points','plot'],
 rows:[
  intro('Three acts — The Glass Orchard','The book at its simplest. If this board doesn’t work, no amount of good sentences will save the draft.','Fill the three turning points first (the shapes): they are the hinges. Then fill each act with the three to five events that get you from one hinge to the next.'),
  row([
   column('Act one — setup (25%)',460,[note('Ordinary world','Ines on the mainland, designing lamps she never touches.'),note('Inciting incident','The call: Zsófia is dead.'),note('Setup','Kesh, the furnace, Tomas, the ledger, Hale.'),note('Debate','She plans to leave on Sunday.')]),
   stack(220,[shape('Turning point 1','Ines makes the first order instead of taking the ferry.','diamond',{color:'sand',h:240})]),
   column('Act two — confrontation (50%)',460,[note('Rising action','She fulfils the orders; the island changes around her.'),note('Midpoint','The orders are for the dead — and one is for her mother.'),note('Complications','Tomas’s forgery; Hale’s claim; the furnace begins to fail.'),note('Low point','The fight in the orchard. Tomas signs Hale’s papers.')]),
   stack(220,[shape('Turning point 2','The last order is in Ines’s own handwriting.','diamond',{color:'rose',h:240})]),
   column('Act three — resolution (25%)',460,[note('Climax','Ines and Tomas make the last piece together as the furnace dies.'),note('Resolution','Hale leaves on the morning ferry, without the orchard.'),note('New normal','Ines stays for the winter. She lights the furnace herself.')]),
  ]),
 ],
});

// ── Hero's journey ────────────────────────────────────────────────────────────
const stages=[['Ordinary world','The mainland, the lamp factory, the grey flat.'],['Call to adventure','The phone call at 4 a.m.'],['Refusal','“I’ll be back on Sunday.”'],['Meeting the mentor','Zsófia — through the ledger’s margin notes.'],['Crossing the threshold','She lights the glory hole herself.'],['Tests, allies, enemies','The orders; Tomas; Hale; Pell.'],['Approach','The orders lead to her mother’s order.'],['The ordeal','She swims out to where her mother drowned.'],['Reward','Her hands remember. The apple is perfect.'],['The road back','Hale’s papers; the furnace failing.'],['Resurrection','The last order, made as the fire dies.'],['Return with the elixir','She relights it, and stays.']];
t.push({
 id:'heros-journey',title:'Hero’s journey',category:'Novel outlines',also:['Creative writing','Game design'],
 description:'Map a transformative story onto the twelve stages of the monomyth, arranged as a circle from the ordinary world and back.',
 tags:['hero’s journey','monomyth','structure','stages'],
 rows:[
  intro('The hero’s journey — Ines','Twelve stages around a circle: the top half is the known world, the bottom half the unknown. Not every stage needs a chapter; every stage needs a reason.','Read clockwise from the top. Replace the example events with your story’s. If a stage feels forced, mark it rose and talk about whether your story skips it.'),
  row([place(stages.map(([s,d],i)=>{const a=-Math.PI/2+i*2*Math.PI/12,cx=760,cy=520,r=480;return [Math.round(cx+Math.cos(a)*r*1.25-130),Math.round(cy+Math.sin(a)*r-60),note(`${i+1}. ${s}`,d,{color:i<5||i===11?'sky':'sand',w:260,key:'hj'+i})];}).concat([[620,440,shape('Known / unknown','Top: the island as she remembers it. Bottom: the island as it is.','ellipse',{w:300,h:180,color:'plain'})]]),{w:1800,h:1150})]),
 ],
 edges:stages.map((_,i)=>['hj'+i,'hj'+((i+1)%12),'',{arrow:true}]),
});

// ── Story arc ─────────────────────────────────────────────────────────────────
t.push({
 id:'story-arc',title:'Story arc',category:'Novel outlines',also:['Creative writing'],
 description:'Chart the plot against the classic arc — exposition, rising action, climax, falling action, resolution — with tension plotted chapter by chapter.',
 tags:['story arc','tension','plot','pacing'],
 rows:[
  intro('Story arc — tension by chapter','The line is how tense each chapter should feel (0–10). Flat stretches are where readers put the book down.','Score each chapter as you outline. Aim for a rising line with small dips (breathing room), a peak around 85%, and a short fall.'),
  row([single(1100,chart('Tension by chapter','line',Array.from({length:15},(_,i)=>String(i*2+1)),[{name:'Tension',values:[2,3,3,4,5,5,6,7,6,7,8,9,10,6,3]}],{max:10,card:{title:'Tension (0–10) — odd chapters'}})),
   column('Arc stages',900,[grid(3,272,[note('Exposition','Ch. 1–4. Kesh, the funeral, the ledger.',{color:'sky'}),note('Rising action','Ch. 5–21. The orders; Tomas; Hale.',{color:'sand'}),note('Climax','Ch. 25–27. The last order; the orchard fight.',{color:'rose'}),note('Falling action','Ch. 28. Hale leaves.',{color:'sage'}),note('Resolution','Ch. 29–30. The new furnace.',{color:'sage'}),note('Problem','Ch. 9 dips too early — add Hale’s threat here.',{color:'rose'})],{gap:16})]),
  ]),
 ],
});

// ── World building ────────────────────────────────────────────────────────────
t.push({
 id:'world-building',title:'World building',category:'Creative writing',also:['Game design'],
 description:'Document a setting’s geography, history, culture, economy and rules — including the one rule that makes it different from ours.',
 tags:['world building','setting','lore','culture','rules'],
 rows:[
  intro('Kesh — the island','A small island two hours by ferry from the mainland. Population 900. Everyone blows glass or lives off those who do.','Begin with “the rule” — the one way this world differs from ours — and its cost. Then check every other card against it.'),
  row([
   column('The rule',340,[note('What is different','Glass made on Kesh with a true order remembers who it was made for. It is warm to their touch, cold to everyone else’s.',{color:'sand'}),note('The cost','Every true piece takes a little of the maker’s memory. Zsófia had forgotten her own daughter’s face.',{color:'rose'})]),
   column('Geography',360,[drawing('Map of Kesh',sk.curve('M120,320 C150,120 420,60 620,110 C820,160 900,300 860,440 C820,580 520,610 330,560 C160,520 100,440 120,320 Z')+sk.text(470,330,'the town',34)+sk.circle(450,300,10,'fill="#27272a"')+sk.text(680,230,'orchard',30)+sk.tree(660,280,70)+sk.tree(720,290,60)+sk.text(220,500,'harbour',30)+sk.arrow(220,520,120,600)+sk.text(60,630,'to the mainland — 2 h',28)+sk.text(700,500,'the cliffs',30),{card:{title:'Kesh — rough map'}}),note('Places','The harbour · the furnace street · the chapel of St Clare of the Glass · the orchard on the north slope · the drowning rocks')]),
   column('History',340,[note('Timeline','**1640** — refugees from a glass city settle Kesh.\n**1890** — the first “true order” recorded.\n**1953** — the furnace street fire.\n**1990** — Ines born.\n**2008** — Ines leaves.')]),
   column('Culture',360,[note('Customs','A glass bead is placed in the mouth of the dead. Children receive their first pipe at 12. You never touch another family’s furnace.'),note('Language','Islanders call the mainland “the dry side”. A *gather* is both a lump of hot glass and a family meal.'),photos([['ph-wri-glass-beads','Handmade glass beads in many colours','Funeral beads']],1,328)]),
   column('Economy & power',340,[table('Who holds what',[['Group','Power'],['The six furnace families','Land, guild seats'],['The ferry company','Who comes, who goes'],['The chapel','Records of every order'],['Mainland collectors','Money']])]),
  ]),
 ],
});

// ── Novel moodboard ───────────────────────────────────────────────────────────
t.push({
 id:'novel-moodboard',title:'Novel moodboard',category:'Moodboards',also:['Creative writing'],
 description:'Capture a book’s atmosphere — places, light, textures, objects, faces and music — to return to whenever the draft loses its voice.',
 tags:['moodboard','novel','atmosphere','inspiration'],
 rows:[
  intro(`${BOOK} — mood`,'Salt, heat, glass, rain. A book that smells of wet wool and hot metal.','Collect freely; prune often. Write one sentence under each image about why it belongs. Open this board before every writing session for two minutes.'),
  row([
   photos([['ph-wri-mood-sea-rain','Rain falling on a grey sea, moody weather','The crossing'],['ph-wri-glass-furnace','Glassblower working at a glowing furnace','The furnace'],['ph-wri-mood-glass-light','Light shining through coloured glass bottles or a stained glass window','Glass and light'],['ph-wri-mood-old-hands','Old weathered hands of an elderly person','Zsófia’s hands'],['ph-wri-mood-stone-street','Narrow cobbled street in an old island town','The furnace street'],['ph-wri-orchard','Apple orchard with old trees in soft morning light','The orchard']],3,300),
   column('Words',360,[note('Texture','Salt-crusted. Ember. Annealed. Brittle. Cloudy. Wet wool.'),note('A line to aim for','> The glass was still warm, which was impossible, because it had been made for someone who had been dead for forty years.')]),
   column('Palette & sound',360,[swatches([['#2d3a3a','Wet slate'],['#c8553d','Ember'],['#9cb8b0','Sea glass'],['#efe6d2','Linen']],2,156),note('Playlist','Slow cello, field recordings of rain on tin roofs, a single folk song in a language I don’t speak.')]),
  ]),
 ],
});

// ── Book marketing plan (date) ────────────────────────────────────────────────
t.push({
 id:'novel-marketing-plan',title:'Novel marketing plan',category:'Creative writing',also:['Marketing campaigns'],
 description:'Plan a book launch from cover reveal to six months after publication: readers, positioning, channels, events and a calendar.',
 tags:['book launch','marketing','author','publicity','calendar'],
 rows:[
  intro(`Launch plan — ${BOOK}`,'Debut novel, small independent publisher. Publication day is week 12 on the calendar.','The author’s plan, alongside the publisher’s. Start with readers and the hook; every channel and event should reach that reader.'),
  row([
   column('Readers',340,[note('Who','Readers of literary mysteries with a strong sense of place; book clubs; people who love craft (glass, ceramics, woodwork).'),note('Hook','*Every order in her grandmother’s ledger was for someone who had already died.*',{color:'sand'})]),
   column('Channels',360,[table('Plan',[['Channel','Owner','Action'],['Newsletter','Author','Monthly from week 1'],['Instagram','Author','Studio + island photos'],['Book bloggers','Publisher','40 proofs'],['Bookshops','Publisher','Signed stock, window'],['Craft press','Author','Essay on learning to blow glass']])]),
   column('Events',360,[photos([['ph-wri-bookshop-event','Author reading or book event in an independent bookshop','Launch at the local bookshop']],1,328),task('Events',['Launch at the local bookshop','Glass-studio reading + demo','Two literary festivals','Book-club Zoom visits (8)'])]),
   column('Assets',360,[task('Assets',['Cover reveal graphic','Author photo','Book-club guide (PDF)','Excerpt: chapter 1','Postcards with the hook'])]),
  ]),
  row([single(1520,timeline('Launch calendar',{mode:'date',days:182,items:[{ref:'bm1',at:0,len:7},{ref:'bm2',at:14,len:56,lane:1},{ref:'bm3',at:56,len:21,lane:2},{ref:'bm4',at:84,len:3},{ref:'bm5',at:87,len:60,lane:1},{ref:'bm6',at:120,len:7,lane:2}]}))]),
  row([grid(6,238,[note('Cover reveal','',{key:'bm1',color:'sand'}),note('Proofs out','Bloggers, booksellers, press.',{key:'bm2'}),note('Pre-order push','Signed-copy offer.',{key:'bm3'}),note('Publication day','Launch event, newsletter.',{key:'bm4',color:'sage'}),note('Events & book clubs','',{key:'bm5'}),note('Paperback pitch','Sales review with publisher.',{key:'bm6'})],{gap:18})]),
 ],
});

export default t;

import {note,task,photo,link,heading,sticky,shape,table,timeline,column,stack,grid,single,place,row} from '../lib/dsl.mjs';
import {drawing,sk,chart} from '../lib/assets.mjs';
import {intro,photos,swatches} from '../lib/kit.mjs';

const t=[];

// ── Photography ───────────────────────────────────────────────────────────────
t.push({id:'photoshoot-shot-list',title:'Photoshoot shot list',category:'Photography',
 description:'A checklist of the poses, angles and compositions to capture in a session, with crops, priorities and a reference for each.',tags:['photography','shot list','poses','checklist'],
 rows:[
  intro('Shot list — headshots & team portraits, Northlight Physio','Eight clinicians, one morning, a bright treatment room and the street outside. Forty-five minutes per person.','Tick shots off as you get them. Priority A shots are what the website needs; B and C are for social and press. Every shot has a crop so nothing is framed too tight to use.'),
  row([
   column('Individual — must get (A)',400,[task('Per person',['Headshot, neutral background, 4:5','Headshot, smiling, 4:5','Half-length, arms relaxed, 3:4','At work — with a patient (consented), 3:2']),photo('ph-ps-headshot','Professional headshot portrait against a plain background',{ratio:1.2,title:'Reference — headshot light'})]),
   column('Team (A)',400,[task('Team',['Full team, outside, 16:9 with sky above','Small groups by clinic','Walking towards camera, candid']),photo('ph-ps-team-outdoor','Small team of colleagues photographed outdoors on a street',{ratio:0.62,title:'Reference — relaxed team shot'})]),
   column('Details (B)',360,[task('Details',['Hands taping an ankle','Equipment close-ups','Reception + plants','Signage']),photo('ph-ps-physio-hands','Physiotherapist hands working on a patient’s knee',{ratio:0.7,title:'Reference — hands at work'})]),
   column('Crops',360,[table('Crops needed',[['Use','Ratio'],['Website profile','4:5'],['Website hero','16:9'],['Social','1:1, 9:16'],['Press','3:2, high-res']])]),
   column('Set-up',360,[note('Light','Key: large softbox 45° camera left. Fill: white bounce. Background: light grey paper, 2 m behind.'),task('Before we start',['Release forms signed','Patient consent for “at work”','Mirror + lint roller','Name list in shoot order'])]),
  ]),
 ]});

t.push({id:'photography-workflow',title:'Photography workflow',category:'Photography',
 description:'Step through a shoot from enquiry to archive — pre-production, capture, backup, culling, editing, delivery — with the checklists for each stage.',tags:['workflow','photography','editing','backup','delivery'],
 rows:[
  intro('Studio workflow — every commission','The same eight stages for every job, so nothing is forgotten and every file can be found in five years.','Duplicate the checklist column for each job, or keep this board as the master. Connectors show what each stage hands to the next.'),
  row([
   stack(280,[note('1 · Enquiry','Brief, quote, contract, deposit.',{key:'w1',color:'sky'}),task('Checklist',['Brief call','Quote within 48 h','Contract + 30% deposit'])]),
   stack(280,[note('2 · Pre-production','Moodboard, shot list, call sheet.',{key:'w2',color:'sky'}),task('Checklist',['Moodboard agreed','Shot list','Location + permits','Call sheet out'])]),
   stack(280,[note('3 · Capture','Shoot. Two cards per body.',{key:'w3',color:'sand'}),task('Checklist',['Batteries + cards','Dual-slot recording','Grey card per set-up'])]),
   stack(280,[note('4 · Backup','3-2-1 rule before anything else.',{key:'w4',color:'rose'}),task('Checklist',['Ingest + rename','Drive A + drive B','Cloud backup','Format cards only after'])]),
   stack(280,[note('5 · Cull','First pass picks, second pass flags.',{key:'w5'}),task('Checklist',['Reject pass','Picks pass','Client proof gallery'])]),
   stack(280,[note('6 · Edit','Global grade, then retouch selects.',{key:'w6'}),task('Checklist',['Colour profile','Batch grade','Retouch selects','Export presets'])]),
   stack(280,[note('7 · Deliver','Gallery, invoice, usage note.',{key:'w7',color:'sage'}),task('Checklist',['Delivery gallery','Final invoice','Usage licence'])]),
  ],{gap:30}),
  row([
   column('File naming',620,[note('Pattern','`YYYY-MM-DD_client_job_0001.ext` — dates first so folders sort in time order.'),table('Folders',[['Folder','Contents'],['01_RAW','Untouched originals'],['02_SELECTS','Picks'],['03_EDIT','Masters'],['04_DELIVERY','Client exports']])]),
   column('8 · Archive',620,[note('Archive','After 90 days: masters + RAW selects to cold storage. Rejects deleted after 1 year.',{key:'w8'})]),
   column('Tools',600,[note('Software','Ingest + cull: a photo manager. Edit: RAW editor. Retouch: layered editor. Delivery: online gallery.')]),
  ]),
 ],
 edges:[['w1','w2'],['w2','w3'],['w3','w4','same day'],['w4','w5'],['w5','w6'],['w6','w7'],['w7','w8','90 days']]});

t.push({id:'photoshoot-call-sheet',title:'Photoshoot call sheet',category:'Photography',
 description:'Shoot-day details on one board — location, times, contacts, crew roles, looks and schedule on a clock-time ruler.',tags:['call sheet','photoshoot','schedule','crew'],
 rows:[
  intro('Call sheet — Hollin “Fieldwork” lookbook','Moorland location, one model, twelve looks. The ruler reads as clock time.','Send the board link the evening before. Update the weather card at 06:00; the 1st assistant calls the weather plan.'),
  row([
   column('The day',340,[table('Times',[['','Time'],['Crew call','06:00'],['Model call','06:30'],['Sunrise','07:42'],['First look','07:45'],['Lunch','12:30'],['Wrap','16:30']]),note('Weather','Bright, wind 20 mph, 9 °C. Rain after 15:00 likely.',{color:'sky'})]),
   column('Location',340,[photo('ph-mb-moorland','Moorland landscape with heather and big sky',{ratio:0.6,title:'Location — the ridge'}),note('Meeting point','Car park at the top of the pass. 15-min walk to set. Mobile signal: patchy.')]),
   column('Crew',360,[table('Crew',[['Role','Name','Phone'],['Photographer','Joss','07700 000001'],['Assistant','Rhi','07700 000002'],['Stylist','Lou','07700 000003'],['HMU','Sana','07700 000004'],['Model','Via agency','—']])]),
   column('Looks',340,[table('Order',[['Look','Spot'],['01–04','Ridge, sunrise'],['05–08','Stone wall'],['09–12','Bracken slope']])]),
   column('Safety',340,[note('Risks','Uneven ground, wind, cold. Warm car at base; model breaks every 90 min.',{color:'rose'}),task('Kit',['First aid','Blankets','Head torches','Weights for reflectors'])]),
  ]),
  row([single(1820,timeline('Shoot day — clock time',{mode:'timecode',fps:'25',start:'05:30:00:00',end:'17:30:00:00',items:[{ref:'pc1',at:'06:00:00:00',out:'07:15:00:00'},{ref:'pc2',at:'07:45:00:00',out:'10:00:00:00',lane:1},{ref:'pc3',at:'10:30:00:00',out:'12:30:00:00',lane:1},{ref:'pc4',at:'12:30:00:00',out:'13:15:00:00'},{ref:'pc5',at:'13:30:00:00',out:'15:45:00:00',lane:1},{ref:'pc6',at:'16:00:00:00',out:'16:30:00:00'}]}))]),
  row([grid(6,288,[note('Call + hair & make-up','',{key:'pc1'}),note('Looks 01–04','Ridge, sunrise light.',{key:'pc2',color:'sand'}),note('Looks 05–08','Stone wall.',{key:'pc3',color:'sand'}),note('Lunch','In the cars.',{key:'pc4'}),note('Looks 09–12','Bracken slope.',{key:'pc5',color:'sand'}),note('Wrap','Kit check, cards backed up.',{key:'pc6'})],{gap:18})]),
 ]});

t.push({id:'contact-sheet',title:'Photography contact sheet',category:'Photography',
 description:'View and compare shots side by side, mark picks and rejects, and record why — so the edit is a decision, not a guess.',tags:['contact sheet','selects','editing','photography'],
 rows:[
  intro('Contact sheet — hero table, frames 0412–0423','Twelve frames of the hero set-up. Pick one hero and one alternate.','Colour the card: sage = pick, sand = maybe, rose = reject. Write the reason in a comment. The final choice goes in the right-hand column with the crop.'),
  row([photos([
   ['ph-cs-1','Breakfast table with coffee and ceramics in soft morning window light','0412'],['ph-cs-2','Coffee cup and bread on a wooden table by a window','0413'],['ph-cs-3','Ceramic bowls and linen on a table in morning light','0414'],['ph-cs-4','Pouring coffee from a pot into a cup in morning light','0415'],
   ['ph-cs-5','Hands breaking bread at a breakfast table','0416'],['ph-cs-6','Morning breakfast table with flowers in a vase','0417'],['ph-cs-7','Empty chair at a breakfast table in sunlight','0418'],['ph-cs-8','Cup of coffee with steam in backlight','0419'],
  ],4,300,{ratio:0.8}),
   column('Decision',380,[note('Hero — 0415','The pour gives life; light on the steam. Crop 4:5 and 16:9.',{color:'sage'}),note('Alternate — 0417','Quieter; safe for print.',{color:'sand'}),note('Rejected','0412 (soft focus), 0418 (too empty).',{color:'rose'}),task('Next',['Retouch 0415','Export crops','Send to client'])]),
  ]),
 ]});

t.push({id:'travel-photography-plan',title:'Travel photography plan',category:'Photography',also:['Project plans'],
 description:'Plan a photo trip: destinations, routes, light and weather, shot lists per place, gear checklist and a day-by-day calendar.',tags:['travel','photography','trip','plan','gear'],
 rows:[
  intro('Photo trip — Faroe-style islands, 8 days (fictional itinerary)','Eight days, four islands, one rental car and ferries. Shooting landscapes and small-village life.','Plan around light and ferries, not around sights. Each day has a sunrise and a sunset target and a bad-weather alternative.'),
  row([
   column('Destinations',380,[photos([['ph-tp-cliffs','Dramatic sea cliffs with grass and mist','Day 2 — the cliffs'],['ph-tp-village','Small village with turf-roofed houses by the sea','Day 4 — the village'],['ph-tp-waterfall','Waterfall falling into the sea from a cliff','Day 6 — the waterfall']],1,348)]),
   column('Light',340,[table('Sun',[['','Time'],['Sunrise','05:12'],['Golden hour','05:12–06:10'],['Sunset','21:48'],['Blue hour','21:48–22:30']]),note('Weather','Changes every hour. Always have the next valley as plan B.',{color:'sky'})]),
   column('Gear',340,[task('Pack',['2 bodies','16–35, 24–70, 70–200','Tripod + L-bracket','ND + polariser','Rain covers ×2','3 batteries per body','Microfibre ×5'])]),
   column('Logistics',340,[table('Bookings',[['Item','Status'],['Flights','Booked'],['Car','Booked'],['Ferry day 3','Booked'],['Ferry day 6','To book'],['Guesthouses','4 of 4']])]),
  ]),
  row([single(1520,timeline('Eight days',{mode:'date',days:8,items:[{ref:'tr1',at:0,len:1},{ref:'tr2',at:1,len:2,lane:1},{ref:'tr3',at:3,len:2},{ref:'tr4',at:5,len:2,lane:1},{ref:'tr5',at:7,len:1}]}))]),
  row([grid(5,288,[note('Day 1 — arrive','Harbour at blue hour.',{key:'tr1'}),note('Days 2–3 — west island','Cliffs at sunrise; sea stacks.',{key:'tr2',color:'sand'}),note('Days 4–5 — north','Village life, turf roofs, portraits (ask first).',{key:'tr3',color:'sand'}),note('Days 6–7 — south','Waterfall; drone if wind < 20 mph.',{key:'tr4',color:'sand'}),note('Day 8 — fly home','Backups ×3 before the airport.',{key:'tr5'})],{gap:20})]),
 ]});

// ── Brainstorming ─────────────────────────────────────────────────────────────
t.push({id:'brainstorming',title:'Brainstorming',category:'Brainstorming',also:['Education','Graphic design'],
 description:'Run a structured ideas workshop: a clear question, warm-up, divergent ideas, clustering, voting and next steps.',tags:['brainstorm','workshop','ideas','facilitation'],
 rows:[
  intro('Brainstorm — “How might we get more teenagers into the library?”','A 60-minute session with library staff and four teenagers. Diverge, cluster, vote, decide.','One idea per sticky. No discussion during the diverge round. Cluster by moving stickies into the columns, name each cluster, then everyone gets three votes (use the comment count).'),
  row([
   column('The question',340,[note('How might we…','…make the library the place teenagers choose to be after school?',{color:'sand'}),note('Agenda (60 min)','- 5 min warm-up\n- 15 min ideas (silent)\n- 15 min cluster\n- 10 min vote\n- 15 min next steps')]),
   column('Warm-up',300,[sticky('Worst idea','Ban phones and add a dress code.',{color:'rose'}),sticky('Worst idea','Shush anyone who laughs.',{color:'rose'})]),
   column('Space',340,[sticky('A room with sofas and no adults','',{color:'sand'}),sticky('Open till 9 p.m. in exam season','',{color:'sand'}),sticky('Gaming nights','',{color:'sand'})]),
   column('Stuff to do',340,[sticky('Podcast studio','',{color:'sky'}),sticky('Manga + comic club','',{color:'sky'}),sticky('Free 3D printing','',{color:'sky'}),sticky('Open mic','',{color:'sky'})]),
   column('Help',340,[sticky('Homework help from uni students','',{color:'sage'}),sticky('CV and job workshops','',{color:'sage'})]),
   column('Votes & next steps',380,[table('Votes',[['Idea','Votes'],['Teen room','9'],['Podcast studio','7'],['Late opening','6'],['Gaming nights','5']]),task('Next steps',['Teen room: survey 100 students','Podcast studio: cost it','Pilot late opening in May'])]),
  ]),
 ]});

t.push({id:'mind-map',title:'Mind map',category:'Brainstorming',
 description:'Explore a topic outwards from one central idea, branching into themes and sub-ideas connected by lines.',tags:['mind map','ideas','planning','connections'],
 rows:[
  intro('Mind map — opening a neighbourhood café','Everything to think about, branching out from the centre. Keep adding branches; nothing is decided here.','Start in the middle. Add a main branch for each big theme, then smaller ideas off each. Colour branches so themes are easy to see from a distance.'),
  row([place([
   [700,420,shape('Our café','A neighbourhood café that feels like a second living room.','ellipse',{key:'c',w:320,h:200,color:'sand'})],
   [220,120,note('Food & drink','',{key:'b1',color:'sky',w:240})],[1240,120,note('Space','',{key:'b2',color:'sage',w:240})],[180,760,note('People','',{key:'b3',color:'rose',w:240})],[1280,760,note('Money','',{key:'b4',color:'stone',w:240})],
   [0,0,sticky('Coffee from a local roaster','',{key:'b1a',color:'sky',w:180})],[0,220,sticky('Simple lunch: soup + toastie','',{key:'b1b',color:'sky',w:180})],[300,40,sticky('Cakes from home bakers','',{key:'b1c',color:'sky',w:180})],
   [1500,0,sticky('Big shared table','',{key:'b2a',color:'sage',w:180})],[1500,230,sticky('Kids’ corner','',{key:'b2b',color:'sage',w:180})],[1180,40,sticky('Plants, books, board games','',{key:'b2c',color:'sage',w:180})],
   [0,960,sticky('2 staff + me','',{key:'b3a',color:'rose',w:180})],[300,1000,sticky('Regulars’ noticeboard','',{key:'b3b',color:'rose',w:180})],
   [1500,980,sticky('Rent £1,800/mo','',{key:'b4a',color:'stone',w:180})],[1200,1000,sticky('Break-even: 140 coffees/day','',{key:'b4b',color:'stone',w:180})],
  ],{w:1700,h:1200})]),
 ],
 edges:[['c','b1'],['c','b2'],['c','b3'],['c','b4'],['b1','b1a'],['b1','b1b'],['b1','b1c'],['b2','b2a'],['b2','b2b'],['b2','b2c'],['b3','b3a'],['b3','b3b'],['b4','b4a'],['b4','b4b']].map(e=>[...e,'',{style:'curve',arrow:false}])});

t.push({id:'flow-chart',title:'Flow chart',category:'Brainstorming',also:['Software development'],
 description:'Map a process step by step, with decision points and the paths they lead to, using shapes and labelled connectors.',tags:['flow chart','process','decisions','workflow'],
 rows:[
  intro('Flow chart — handling a customer return','From the customer’s request to refund or replacement. Rectangles are steps, diamonds are decisions, ellipses start and end.','Read left to right. Every diamond needs at least two labelled exits. If a step has no owner, add one in the card body.'),
  row([place([
   [0,200,shape('Start','Customer asks to return an item','ellipse',{key:'f0',w:240,h:150,color:'sage'})],
   [320,200,shape('Check order','Support finds the order and date','rectangle',{key:'f1',w:240,h:150})],
   [640,180,shape('Within 30 days?','','diamond',{key:'f2',w:240,h:190,color:'sand'})],
   [980,440,shape('Offer store credit','Outside policy — goodwill option','rectangle',{key:'f3',w:240,h:150})],
   [980,200,shape('Send returns label','Email label + instructions','rectangle',{key:'f4',w:240,h:150})],
   [1300,180,shape('Item damaged?','On arrival at the warehouse','diamond',{key:'f5',w:240,h:190,color:'sand'})],
   [1640,440,shape('Replace','Send a new one, no charge','rectangle',{key:'f6',w:240,h:150})],
   [1640,200,shape('Refund','To original payment, 5 days','rectangle',{key:'f7',w:240,h:150})],
   [1960,200,shape('End','Close ticket, ask for feedback','ellipse',{key:'f8',w:240,h:150,color:'sage'})],
   [1960,440,shape('End','Close ticket','ellipse',{key:'f9',w:240,h:150,color:'sage'})],
   [0,0,note('Owners','Support: steps 1–3 · Warehouse: inspection · Finance: refunds',{color:'plain',w:560})],
  ],{w:2200,h:620})]),
 ],
 edges:[['f0','f1','',{style:'straight'}],['f1','f2','',{style:'straight'}],['f2','f4','yes',{style:'straight'}],['f2','f3','no',{style:'elbow'}],['f4','f5','',{style:'straight'}],['f5','f6','yes',{style:'elbow'}],['f5','f7','no',{style:'straight'}],['f7','f8','',{style:'straight'}],['f6','f9','',{style:'straight'}],['f3','f9','accepted',{style:'curve'}]]});

t.push({id:'inspiration-library',title:'Inspiration library',category:'Brainstorming',also:['Moodboards'],
 description:'A long-term collection of ideas, links and images, sorted into shelves you can come back to for any project.',tags:['inspiration','library','references','collection'],
 rows:[
  intro('Inspiration library — a designer’s shelves','Not for one project: a place to keep everything worth remembering, sorted so it can be found again.','Add freely; sort monthly. Each shelf is a column. Tag cards with the project they ended up helping, so the library shows what it is useful for.'),
  row([
   column('Type',340,[photos([['ph-il-shop-sign','Vintage shop sign with hand-painted lettering','Shop signs'],['ph-il-ticket','Old printed ticket or label with typography','Ephemera']],1,308),link('Fonts in use (example)','https://en.wikipedia.org/wiki/Typography','Article for later.')]),
   column('Colour',340,[photos([['ph-il-paint-chips','Paint colour chips swatches fanned out','Paint chips'],['ph-il-spices','Colourful spices in a market','Spice market']],1,308)]),
   column('Composition',340,[photos([['ph-il-architecture-lines','Strong geometric lines in modern architecture','Lines'],['ph-il-shadow-stairs','Shadows on stairs in sunlight','Light + shadow']],1,308)]),
   column('Objects',340,[photos([['ph-il-chair','Classic wooden chair design','Chairs'],['ph-il-kitchen-tools','Vintage kitchen tools arranged neatly','Tools']],1,308)]),
   column('Words',340,[note('Quote','> “Design is the conscious effort to impose meaningful order.”\n— attributed to Victor Papanek'),note('Note to self','Look at the back of things. Labels, seams, the underside of chairs.')]),
  ]),
 ]});

t.push({id:'design-exploration',title:'Design exploration',category:'Brainstorming',also:['Graphic design','UX design'],
 description:'Experiment with a design problem in parallel directions — sketches, variations and quick tests — then compare and choose.',tags:['design exploration','iterations','variations','compare'],
 rows:[
  intro('Exploration — Loop app icon','Six directions for an app icon, each pushed to three variations. Judge them small, on a real home screen.','Go wide before going deep. Every direction gets the same three tests: 1) readable at 48 px, 2) distinct on a busy home screen, 3) says “neighbours sharing”.'),
  row([
   column('A — Loop',340,[drawingIcon('A',sk.circle(500,325,170,'stroke-width="18"')+sk.arrow(640,240,620,210,'stroke-width="18"')),note('Notes','Simple, ownable. Might read as “refresh”.',{color:'sand'})]),
   column('B — Two houses',340,[drawingIcon('B',sk.rect(320,280,150,150,'stroke-width="14"')+sk.rect(530,280,150,150,'stroke-width="14"')+sk.curve('M470,350 C500,300 500,300 530,350','stroke-width="14"')),note('Notes','Literal; strong at size; a bit generic.',{color:'sand'})]),
   column('C — Handshake',340,[drawingIcon('C',sk.curve('M300,380 C400,300 600,300 700,380','stroke-width="16"')+sk.curve('M300,300 C400,380 600,380 700,300','stroke-width="16"')),note('Notes','Warm but crowded below 64 px.',{color:'rose'})]),
   column('D — Shared key',340,[drawingIcon('D',sk.circle(400,325,80,'stroke-width="16"')+sk.line(480,325,700,325,'stroke-width="16"')+sk.line(640,325,640,380,'stroke-width="16"')),note('Notes','Trust, access. Strongest concept so far.',{color:'sage'})]),
   column('Compare',420,[table('Scores (1–5)',[['','48 px','Distinct','Meaning'],['A','5','3','3'],['B','4','2','4'],['C','2','3','4'],['D','5','4','5']]),task('Next',['Push D to 3 variations','Test on real home screens','Colour: try terracotta + ink'])]),
  ]),
 ]});
function drawingIcon(id,svg){return drawing(`Direction ${id}`,`<rect x="300" y="105" width="400" height="440" rx="90" stroke-width="5"/>`+svg);}

t.push({id:'five-whys',title:'5 Whys',category:'Brainstorming',also:['Strategy','Software development'],
 description:'Trace a problem back to its root cause by asking “why?” five times, then agree a fix that addresses the cause, not the symptom.',tags:['5 whys','root cause','problem solving','retrospective'],
 rows:[
  intro('5 Whys — the newsletter went out with broken links','A blameless look at one incident. Ask why until the answer is something we can change in the process.','Write the problem as a fact. Each “why” answers the card before it. Stop when you reach a process cause (not a person). The fix goes against the root cause.'),
  row([
   stack(280,[note('Problem','Tuesday’s newsletter went to 12,000 people with three broken links.',{key:'y0',color:'rose'})]),
   stack(280,[note('Why 1','The links pointed to pages that had been renamed.',{key:'y1'})]),
   stack(280,[note('Why 2','The website was restructured on Monday; nobody told the newsletter team.',{key:'y2'})]),
   stack(280,[note('Why 3','Website changes aren’t announced outside the web team.',{key:'y3'})]),
   stack(280,[note('Why 4','There is no shared release calendar for content.',{key:'y4'})]),
   stack(280,[note('Why 5 — root cause','Teams plan content separately, with no step that checks links before sending.',{key:'y5',color:'sand'})]),
   stack(320,[note('Fixes','- Shared content calendar (owner: comms lead)\n- Redirects added automatically when a page is renamed\n- Link check step in the newsletter checklist',{key:'fix',color:'sage'}),task('Actions',['Calendar live — Friday','Redirect rule — web team','Checklist updated — today'])]),
  ],{gap:30}),
 ],
 edges:[['y0','y1','why?',{arrow:true}],['y1','y2','why?',{arrow:true}],['y2','y3','why?',{arrow:true}],['y3','y4','why?',{arrow:true}],['y4','y5','why?',{arrow:true}],['y5','fix','so',{arrow:true}]]});

t.push({id:'concept-map',title:'Concept map',category:'Brainstorming',also:['Education'],
 description:'Show how ideas in a complex topic relate, with labelled links that read as sentences (“photosynthesis — produces → oxygen”).',tags:['concept map','learning','relationships','knowledge'],
 rows:[
  intro('Concept map — how a forest stores carbon','For a school science unit. Every connector reads as a sentence from one concept to the next.','Put the big concept at the top. Link concepts with a verb on the connector. If you can read a chain aloud as a sentence, the map is working.'),
  row([place([
   [640,0,note('Forest','',{key:'k0',color:'sage',w:220})],
   [160,240,note('Trees','',{key:'k1',w:220})],[640,240,note('Soil','',{key:'k2',w:220})],[1120,240,note('Animals & fungi','',{key:'k3',w:220})],
   [0,520,note('Photosynthesis','',{key:'k4',color:'sky',w:220})],[400,520,note('Carbon dioxide (CO₂)','',{key:'k5',color:'sand',w:220})],[820,520,note('Dead leaves & wood','',{key:'k6',w:220})],[1220,520,note('Respiration','',{key:'k7',color:'sky',w:220})],
   [200,800,note('Sugar (stored carbon)','',{key:'k8',color:'sand',w:240})],[700,800,note('Soil carbon','',{key:'k9',color:'sand',w:220})],[1180,800,note('Fire & logging','',{key:'k10',color:'rose',w:220})],
  ],{w:1460,h:920})]),
 ],
 edges:[['k0','k1','contains'],['k0','k2','grows on'],['k0','k3','is home to'],['k1','k4','carry out'],['k4','k5','takes in'],['k4','k8','makes'],['k1','k6','drop'],['k6','k9','becomes'],['k3','k7','release CO₂ by'],['k7','k5','returns'],['k10','k5','releases']].map(e=>[...e,{arrow:true}])});

// ── Productivity ──────────────────────────────────────────────────────────────
t.push({id:'weekly-plan',title:'Weekly plan',category:'Productivity',
 description:'Set the week’s goals, prioritise tasks, block time on a calendar and review what happened on Friday.',tags:['weekly plan','goals','time blocking','review'],
 rows:[
  intro('This week','Three goals, the tasks that serve them, and the time to do them. The calendar moves to the current week when you add the template.','Monday: choose three goals and block time for them first. Each day: tick tasks. Friday: fill the review before you close the laptop.'),
  row([
   column('Three goals',340,[note('1','Ship the Loop icon direction to the founders.',{color:'sand'}),note('2','Finish chapter 6 (3,000 words).',{color:'sky'}),note('3','Run three times.',{color:'sage'})]),
   column('Must do',340,[task('Must',['Icon variations (D)','Send invoice #214','Book dentist','Chapter 6 draft'])]),
   column('Could do',340,[task('Could',['Clean up downloads folder','Read two articles saved for later','Plan the weekend trip'])]),
   column('Waiting on',340,[note('Waiting','- Founders’ feedback (Thu)\n- Accountant’s numbers')]),
   column('Friday review',360,[note('What went well','',{color:'sage'}),note('What didn’t','',{color:'rose'}),note('Next week’s first task','')]),
  ]),
  row([single(1860,timeline('The week',{mode:'date',days:7,items:[{ref:'wk1',at:0,len:2,lane:0},{ref:'wk2',at:1,len:3,lane:1},{ref:'wk3',at:0,len:1,lane:2},{ref:'wk3b',at:2,len:1,lane:2},{ref:'wk3c',at:4,len:1,lane:2},{ref:'wk4',at:4,len:1,lane:0}]}))]),
  row([grid(6,290,[note('Icon work','Mon–Tue mornings.',{key:'wk1',color:'sand'}),note('Writing','Tue–Thu, 7–9 a.m.',{key:'wk2',color:'sky'}),note('Run 1','',{key:'wk3',color:'sage'}),note('Run 2','',{key:'wk3b',color:'sage'}),note('Run 3','',{key:'wk3c',color:'sage'}),note('Admin + review','Fri afternoon.',{key:'wk4'})],{gap:24})]),
 ]});

t.push({id:'team-planner',title:'Team planner',category:'Productivity',also:['Agencies'],
 description:'Assign work across a team, see who is doing what and when on a shared calendar, and keep status visible.',tags:['team','planner','assignments','capacity'],
 rows:[
  intro('Studio planner — next three weeks','Five people, four projects. Each row on the calendar is a person; each clip is their task.','Lanes are people. Keep each person under 100% — if a lane is full end to end, something needs to move. Status lives on the task card.'),
  row([
   column('Team',320,[table('Capacity',[['Person','Days/wk','Load'],['Kemi','5','90%'],['Tom','5','70%'],['Ana','4','100%'],['Joon','5','60%'],['Lars','3','80%']])]),
   column('Projects',320,[note('Jazz festival','Print in week 3.',{color:'sand'}),note('Arden & Moss site','Design phase.',{color:'sky'}),note('Loop app','Icon + onboarding.',{color:'sage'}),note('Kiln & Co. report','Layout.',{color:'rose'})]),
   column('This week’s focus',360,[note('Focus','Get the festival programme to proof by Thursday. Everyone else protects Kemi’s time.')]),
   column('Blockers',360,[note('Blocked','Arden & Moss photos not arrived — Joon is on hold until Wednesday.',{color:'rose'})]),
  ]),
  row([single(1900,timeline('Who is doing what',{mode:'date',days:21,items:[{ref:'tp1',at:0,len:10,lane:0},{ref:'tp2',at:0,len:7,lane:1},{ref:'tp3',at:7,len:7,lane:1},{ref:'tp4',at:0,len:14,lane:2},{ref:'tp5',at:2,len:12,lane:3},{ref:'tp6',at:0,len:5,lane:4},{ref:'tp7',at:7,len:10,lane:4}]},{lane:56}))]),
  row([grid(7,256,[note('Kemi — festival programme','Status: in progress',{key:'tp1',color:'sand'}),note('Tom — festival posters','Status: proofs',{key:'tp2',color:'sand'}),note('Tom — Kiln report layout','Status: next',{key:'tp3',color:'rose'}),note('Ana — Arden & Moss design','Status: in progress',{key:'tp4',color:'sky'}),note('Joon — site wireframes','Status: blocked until Wed',{key:'tp5',color:'sky'}),note('Lars — Loop icon','Status: review',{key:'tp6',color:'sage'}),note('Lars — Loop onboarding','Status: next',{key:'tp7',color:'sage'})],{gap:16})]),
 ]});

t.push({id:'kanban-board',title:'Kanban board',category:'Productivity',also:['Product management','Software development'],
 description:'Visualise work moving through stages — backlog, to do, doing, review, done — with WIP limits to keep flow steady.',tags:['kanban','workflow','tasks','agile'],
 rows:[
  intro('Kanban — Fix & Mend production','Every video and Short moves left to right. WIP limits are in the column titles: if a column is full, finish something before starting something new.','Drag a card to the next column when it moves. Columns are containers, so cards move with them. Add the owner as a tag.'),
  row([
   column('Backlog',320,[note('Glue guide','Tool school.',{tags:['Ruth']}),note('£20 charity basket','Wild card.',{tags:['Ali']}),note('Laptop battery','Worth fixing?',{tags:['Ruth']})]),
   column('To do (max 3)',320,[note('Ep. 16 script','',{tags:['Ruth']}),note('Shorts batch 6','',{tags:['Ali']})]),
   column('Doing (max 2)',320,[note('Ep. 15 edit','First assembly done.',{tags:['Ali'],color:'sand'}),note('Thumbnail tests','A/B for ep. 14.',{tags:['Ruth'],color:'sand'})]),
   column('Review (max 2)',320,[note('Ep. 15 sponsor read','Waiting for sponsor sign-off.',{tags:['Ruth'],color:'sky'})]),
   column('Done',320,[note('Ep. 14 published','',{color:'sage'}),note('Shorts batch 5','',{color:'sage'})]),
   column('Rules',320,[note('Definition of done','Published, captioned, in the right playlist, newsletter sent.'),note('WIP','Doing max 2. If it’s full, help finish, don’t start.')]),
  ]),
 ]});

t.push({id:'eisenhower-matrix',title:'Eisenhower matrix',category:'Productivity',also:['Strategy'],
 description:'Sort tasks by urgency and importance into do, schedule, delegate and delete — and act on each quadrant.',tags:['eisenhower','priorities','urgent important','decisions'],
 rows:[
  intro('Eisenhower matrix — this week','Everything on my list, sorted. The top-left quadrant is today; the bottom-right is permission to stop.','Drop each task into a quadrant. Be honest: “urgent” means a real deadline soon, “important” means it moves a goal. Move cards between columns as things change.'),
  row([stack(160,[heading('Important')]),column('Do — urgent & important',560,[note('Invoice #214','Due Friday; cash flow.',{color:'rose'}),note('Festival proofs','Printer slot is Thursday.',{color:'rose'})],{minH:360}),column('Schedule — important, not urgent',560,[note('Chapter 6','Block Tue–Thu mornings.',{color:'sky'}),note('Pension review','Book an hour next week.',{color:'sky'}),note('Running','Three times.',{color:'sky'})],{minH:360})],{gap:30,after:30}),
  row([stack(160,[heading('Not important')]),column('Delegate — urgent, not important',560,[note('Reply to venue survey','Ask Tom.',{color:'sand'}),note('Order printer ink','Ask the office.',{color:'sand'})],{minH:300}),column('Delete — neither',560,[note('Reorganise fonts folder','',{color:'plain'}),note('Read every unread newsletter','Unsubscribe instead.',{color:'plain'})],{minH:300})],{gap:30}),
 ]});

export default t;

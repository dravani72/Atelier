import {note,task,photo,link,heading,sticky,shape,table,timeline,column,stack,grid,single,place,row} from '../lib/dsl.mjs';
import {drawing,sk,chart,palette} from '../lib/assets.mjs';
import {intro,photos,swatches} from '../lib/kit.mjs';

const t=[];
const G='Tidewater';

t.push({id:'game-design-document',title:'Game design document',category:'Game design',
 description:'A living GDD on one board: concept, pillars, core loop, mechanics, world, characters, art and audio direction, scope and milestones.',tags:['gdd','game design','core loop','pillars','scope'],
 rows:[
  intro(`${G} — game design document`,'A cosy puzzle-adventure: explore tiny islands that appear and vanish with the tide. PC and Switch, 3–4 hours.','Keep this board current — it is the source of truth. Big decisions go in the decisions log with a date. If a card contradicts a pillar, the pillar wins or the pillar changes, on purpose.'),
  row([
   column('Concept',360,[note('Elevator pitch','You are the keeper of a tide clock. Turn the tide to reveal paths, float objects and wake sleeping islands — and learn why the sea is rising.',{color:'sand'}),table('Facts',[['Item','Detail'],['Genre','Puzzle-adventure'],['Platforms','PC, Switch'],['Length','3–4 h'],['Players','1'],['Rating','Everyone']])]),
   column('Pillars',340,[note('1 · The tide is the puzzle','Every puzzle uses the tide; no other mechanic is introduced without it.',{color:'sky'}),note('2 · Every island has a story','Each island has one character and one secret.',{color:'sky'}),note('3 · Never punish curiosity','No fail states, no timers, no lost progress.',{color:'sky'})]),
   column('Core loop',380,[drawing('Core loop',sk.circle(500,325,210,'stroke-dasharray="10 12"')+sk.text(420,130,'EXPLORE',40)+sk.text(690,340,'TURN TIDE',40)+sk.text(420,570,'SOLVE',40)+sk.text(130,340,'DISCOVER',40)+sk.arrow(640,180,700,260)+sk.arrow(690,430,620,500)+sk.arrow(370,500,300,430)+sk.arrow(300,250,360,180),{card:{title:'Core loop'}}),note('Session','15–20 minute sessions; each island is one sitting.')]),
   column('Mechanics',360,[table('Systems',[['Mechanic','Notes'],['Tide clock','3 heights: low, mid, high'],['Floating','Crates, logs, boats rise with water'],['Paths','Sandbars appear at low tide'],['Creatures','Crabs move with the tide'],['Journal','Auto-logs clues']])]),
   column('World & characters',360,[photos([['ph-gm-island','Small island with a lighthouse seen from above','Island 1']],1,328),note('Cast','Wren (player), the lighthouse keeper, a lost fisherman, a gull called Admiral.')]),
  ]),
  row([
   column('Art direction',420,[swatches([['#7bdff2','Shallow'],['#2e86ab','Deep'],['#f7f4ea','Sand'],['#f6bd60','Sunlit']],2,186),note('Style','Hand-painted, isometric, soft shadows. Interactive objects have a warm rim.')]),
   column('Audio',360,[note('Music','Acoustic, sparse, changes key with the tide height.'),note('SFX','Every tide turn has a satisfying wooden clunk.')]),
   column('Scope',400,[table('Content',[['Item','Count'],['Islands','5'],['Puzzles','60'],['Characters','8'],['Cutscenes','6'],['Collectibles','40 sea glass']]),note('Cut list','Fishing minigame; co-op.',{color:'rose'})]),
   column('Decisions log',460,[table('Decisions',[['When','Decision'],['M2','No timers anywhere'],['M3','Switch is a launch platform'],['M4','Cut fishing minigame']])]),
  ]),
  row([single(1760,timeline('Milestones',{mode:'date',days:540,items:[{ref:'gd1',at:0,len:60},{ref:'gd2',at:60,len:90,lane:1},{ref:'gd3',at:150,len:240},{ref:'gd4',at:390,len:90,lane:1},{ref:'gd5',at:480,len:60,lane:2}]}))]),
  row([grid(5,336,[note('Prototype','Tide mechanic + 5 puzzles.',{key:'gd1'}),note('Vertical slice','Island 1 complete.',{key:'gd2',color:'sand'}),note('Production','Islands 2–5.',{key:'gd3'}),note('Alpha / beta','Content complete, testing.',{key:'gd4'}),note('Launch','PC + Switch.',{key:'gd5',color:'sage'})],{gap:20})]),
 ]});

t.push({id:'game-brainstorm',title:'Game design brainstorming',category:'Game design',also:['Brainstorming'],
 description:'Generate and sketch game ideas — fantasies, verbs, settings, twists — then combine the best into concepts worth prototyping.',tags:['game ideas','brainstorm','jam','concepts'],
 rows:[
  intro('Game jam brainstorm — theme: “Rising”','48-hour jam. Generate fast across four lists, then combine one from each into concepts.','Fill each list with at least eight stickies. Then make three concepts by picking one card from each list. Prototype the one the team can explain in a sentence.'),
  row([
   column('Player fantasy',320,[sticky('Keeper of something old','',{color:'sand'}),sticky('A tiny creature in a huge world','',{color:'sand'}),sticky('The last one awake','',{color:'sand'})]),
   column('Verbs',320,[sticky('Turn','',{color:'sky'}),sticky('Float','',{color:'sky'}),sticky('Stack','',{color:'sky'}),sticky('Wake','',{color:'sky'})]),
   column('Settings',320,[sticky('Islands at the tide line','',{color:'sage'}),sticky('A city of balloons','',{color:'sage'}),sticky('Inside a lighthouse lamp','',{color:'sage'})]),
   column('Twists',320,[sticky('The water is the player','',{color:'rose'}),sticky('Rising is bad — keep things low','',{color:'rose'})]),
   column('Concepts',460,[note('A — Tidewater','Keeper + turn + islands: raise and lower the tide to solve puzzles.',{color:'sand'}),note('B — Ballast','Tiny creature + stack + balloon city: keep the city from floating away.',{color:'sand'}),note('C — Lamplight','Last one awake + wake + lighthouse: rekindle the light, room by room.',{color:'sand'}),table('Vote',[['Concept','Votes'],['A','4'],['B','2'],['C','1']])]),
  ]),
 ]});

t.push({id:'game-character-profile',title:'Game character profile',category:'Game design',
 description:'Define a game character — role, personality, motivation, history, abilities, look, voice and how they change the player’s experience.',tags:['game character','profile','abilities','design'],
 rows:[
  intro(`Character — the lighthouse keeper (${G})`,'The first character the player meets. Mentor, comic relief, and the one who knows why the sea is rising.','Fill story fields (want, secret) and gameplay fields (what the character asks the player to do) together — a game character exists to change play.'),
  row([
   column('Who',340,[photo('ph-gc-old-sailor','Elderly sailor or lighthouse keeper with a beard and a knitted hat',{ratio:1.1,title:'Reference — the keeper'}),table('Basics',[['Item','Detail'],['Name','Agathe'],['Age','78'],['Role','Mentor'],['First seen','Island 1']])]),
   column('Personality',340,[note('Traits','Gruff, funny, forgetful about everything except the sea.'),note('Want','For someone to take over the tide clock.',{color:'sand'}),note('Secret','She turned the clock too far, years ago. The rising sea is her fault.',{color:'rose'})]),
   column('In play',360,[table('Gameplay',[['Moment','What she asks'],['Island 1','Fix the clock’s hand'],['Island 3','Find her old logbook'],['Island 5','Choose: forgive or not']]),note('Hints','If the player is stuck for 3 minutes she offers a cryptic hint — never the answer.')]),
   column('Look & voice',340,[swatches([['#2e4057','Navy coat'],['#c96f53','Weathered skin'],['#d9d9d9','Grey braid'],['#f2c14e','Lamp']],2,146),note('Voice','Short sentences, sea words, laughs at her own jokes. Text only — no VO.')]),
   column('Arc',320,[note('Start','Hides the truth; tests the player.'),note('Middle','Opens up after the logbook.'),note('End','Hands over the clock; walks into the sea at low tide to watch the islands she lost.')]),
  ]),
 ]});

t.push({id:'game-level-design',title:'Game level design',category:'Game design',
 description:'Plan a level’s layout, flow, obstacles, teaching moments and difficulty curve, with a top-down sketch and a beat-by-beat breakdown.',tags:['level design','layout','difficulty','flow'],
 rows:[
  intro(`Level design — ${G}, island 2 “The Crab Shallows”`,'Teaches: creatures move with the tide. Three puzzles, one secret, ~15 minutes.','Sketch the layout top-down, mark the critical path, then list beats in order: teach, test, twist. The difficulty column checks the curve against the island before and after.'),
  row([
   stack(700,[drawing('Island 2 — top-down',sk.curve('M120,330 C140,140 420,80 600,110 C820,150 900,280 860,420 C820,560 480,610 300,560 C150,520 100,460 120,330 Z')+sk.circle(260,420,26,'fill="#e4e4e7"')+sk.text(230,480,'start',30)+sk.circle(520,250,30)+sk.text(560,255,'P1',32)+sk.circle(700,380,30)+sk.text(740,385,'P2',32)+sk.circle(480,470,30)+sk.text(520,480,'P3',32)+sk.curve('M260,420 Q380,300 520,250 Q640,300 700,380 Q600,470 480,470','stroke="#b91c1c" stroke-dasharray="12 10"')+sk.text(780,170,'★ secret',30)+sk.text(130,140,'sandbar (low tide)',26),{card:{title:'Layout — critical path in red'}})]),
   column('Beats',420,[note('1 · Teach','Low tide: a crab blocks the sandbar. Raise the tide; it scuttles away. No way to fail.',{color:'sky'}),note('2 · Test','P1: lure two crabs onto pressure plates using tide height.'),note('3 · Twist','P2: a crab must be moved *against* the tide using a floating crate.',{color:'sand'}),note('4 · Master','P3: three crabs, two plates, one crate.'),note('Secret','Sea glass under the wreck, only at mid tide.',{color:'sage'})]),
   column('Difficulty',420,[chart('Difficulty by island','line',['Island 1','Island 2','Island 3','Island 4','Island 5'],[{name:'Difficulty',values:[2,3.5,4.5,6,8]}],{max:10,card:{title:'Difficulty curve (target)'}}),note('Check','Island 2 should feel like 1.5× island 1 — playtest median ≤ 18 min.')]),
  ]),
 ]});

t.push({id:'game-mechanics',title:'Game mechanics',category:'Game design',
 description:'Define and balance the rules and systems of play — inputs, states, rules, feedback and tuning values — so the team builds the same thing.',tags:['mechanics','systems','balancing','rules'],
 rows:[
  intro(`Mechanics — the tide clock (${G})`,'The one mechanic everything depends on. Specified precisely enough to build and tune.','For each mechanic: what the player does, what the game does, what the player sees and hears, and the numbers to tune. Keep tuning values in the table so design and code agree.'),
  row([
   column('Input',320,[note('Player does','Interacts with the tide clock; chooses low, mid or high. Can only turn when standing at the clock.')]),
   column('Rules',380,[note('Game does','- Water animates to the new height over 2.5 s\n- Floating objects rise/fall with it\n- Creatures move to their tide positions\n- The player cannot drown: water pushes them to the nearest dry tile')]),
   column('States',340,[table('Tide states',[['State','Water height','Reveals'],['Low','0.0 m','Sandbars, wrecks'],['Mid','0.8 m','Floating crates usable'],['High','1.6 m','Upper ledges reachable']])]),
   column('Feedback',340,[note('See','Water colour shifts; wet sand darkens.'),note('Hear','Wooden clunk, then the water swell rising in pitch.'),note('Feel','Controller rumble on the clunk (Switch).')]),
   column('Tuning',360,[table('Values',[['Value','Now','Range'],['Tide anim (s)','2.5','1.5–3.5'],['Crate buoyancy','0.7','0.5–0.9'],['Crab speed','1.2','0.8–1.6'],['Hint delay (s)','180','120–300']]),note('Open question','Should the clock have a fourth “spring tide” state on island 5?',{color:'sand'})]),
  ]),
 ]});

t.push({id:'game-flow-diagram',title:'Game design flow diagram',category:'Game design',also:['Brainstorming'],
 description:'Map the game’s structure — screens, systems, player choices and their outcomes — as a connected flow.',tags:['flow','game structure','choices','systems'],
 rows:[
  intro(`Game flow — ${G}`,'From title screen to ending, including the one big choice. Shapes: rectangles are scenes, diamonds are choices, ellipses are endings.','Follow the arrows from the title screen. Every choice needs every outcome drawn. Systems that run in the background (journal, collectibles) sit below with dashed links.'),
  row([place([
   [0,140,shape('Title','New game / continue','ellipse',{key:'g0',w:220,h:140,color:'sage'})],
   [280,140,shape('Island 1','Tutorial','rectangle',{key:'g1',w:220,h:140})],
   [560,140,shape('Islands 2–4','Any order','rectangle',{key:'g2',w:220,h:140})],
   [840,140,shape('Island 5','The truth','rectangle',{key:'g3',w:220,h:140})],
   [1120,120,shape('Forgive Agathe?','','diamond',{key:'g4',w:220,h:180,color:'sand'})],
   [1420,20,shape('Ending A','She stays; the sea calms','ellipse',{key:'g5',w:240,h:140,color:'sage'})],
   [1420,240,shape('Ending B','She leaves; islands sink','ellipse',{key:'g6',w:240,h:140,color:'rose'})],
   [560,380,note('Journal','Logs every clue and character.',{key:'g7',color:'sky',w:220})],
   [840,380,note('Sea glass (40)','All 40 unlock a secret epilogue.',{key:'g8',color:'sky',w:220})],
  ],{w:1680,h:520})]),
 ],
 edges:[['g0','g1'],['g1','g2'],['g2','g3'],['g3','g4'],['g4','g5','yes'],['g4','g6','no'],['g2','g7','updates'],['g2','g8','collect'],['g8','g5','epilogue']].map(e=>[e[0],e[1],e[2]||'',{arrow:true}])});

t.push({id:'game-marketing-plan',title:'Game marketing plan',category:'Game design',also:['Marketing campaigns'],
 description:'Plan a game’s launch from announcement to post-launch: audience, hooks, wishlists, festivals, creators, press and a calendar.',tags:['game marketing','launch','wishlists','festivals','press'],
 rows:[
  intro(`Launch plan — ${G}`,'Indie launch on PC and Switch. Wishlists are the goal before launch; reviews and word of mouth after.','Build around beats (announce, demo, festival, date, launch) with quiet steady content between them. Track wishlists weekly — they predict launch sales.'),
  row([
   column('Audience',340,[note('Players','Cosy-game fans, puzzle lovers, players of short story games. 20–40.'),note('Hook','“Turn the tide to solve puzzles on islands that vanish.”',{color:'sand'})]),
   column('Assets',340,[task('Assets',['Announcement trailer (60 s)','Store page + capsule art','GIFs of every tide puzzle','Demo (island 1)','Press kit']),photo('ph-gm-low-tide','Low tide revealing a path to an island',{ratio:0.62,title:'Key art reference'})]),
   column('Channels',340,[table('Mix',[['Channel','Role'],['Store page','Wishlists'],['Festivals','Demo players'],['Creators','Reach'],['Social GIFs','Steady interest'],['Press','Launch reviews']])]),
   column('Targets',340,[table('Targets',[['Metric','Target'],['Wishlists at launch','40,000'],['Demo players','15,000'],['Creators covering','60'],['Reviews (week 1)','300']]),chart('Wishlists (k)','line',['M1','M2','M3','M4','M5','M6'],[{name:'Wishlists',values:[3,6,9,18,26,40]}],{card:{title:'Wishlist target curve'}})]),
  ]),
  row([single(1460,timeline('Six months to launch',{mode:'date',days:200,items:[{ref:'gm1',at:0,len:7},{ref:'gm2',at:7,len:180,lane:1},{ref:'gm3',at:60,len:14,lane:2},{ref:'gm4',at:100,len:7},{ref:'gm5',at:150,len:7,lane:2},{ref:'gm6',at:183,len:7}]}))]),
  row([grid(6,226,[note('Announce','Trailer + store page.',{key:'gm1',color:'sand'}),note('Weekly GIFs','Every Tuesday.',{key:'gm2'}),note('Demo festival','',{key:'gm3',color:'sand'}),note('Release date','Trailer #2.',{key:'gm4',color:'sand'}),note('Creator keys','Two weeks early.',{key:'gm5'}),note('Launch','PC + Switch.',{key:'gm6',color:'sage'})],{gap:20})]),
 ]});

export default t;

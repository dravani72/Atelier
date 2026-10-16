import {note,task,photo,table,timeline,column,stack,grid,single,row,sticky} from '../lib/dsl.mjs';
import {panel,sk,drawing} from '../lib/assets.mjs';
import {intro,photos} from '../lib/kit.mjs';
import * as S from '../lib/scenes.mjs';

// A storyboard: panels with notes underneath, a timing ruler (timecode, or clock time for live events), then notes.
// frames: [[id, title, note, composition, at, out, lane?], …]
function board(c){
 const cell=c.cell||Math.min(420,Math.floor((2100-(c.frames.length>6?5:c.frames.length-1)*20)/Math.min(c.frames.length,c.cols||6)));
 const cols=c.cols||Math.min(6,c.frames.length);
 return {id:c.id,title:c.title,category:c.category||'Storyboards',also:c.also||[],description:c.description,tags:c.tags,rows:[
  intro(c.heading,c.purpose,c.how||'Each panel is a moment; the note under it says what happens and what we hear. Panels are clips on the ruler at the length they play — drag to retime, and keep the total on target. Double-click a sketch to draw over it, or swap it for a photo.'),
  row([grid(cols,cell,c.frames.map(([id,title,body,comp])=>stack(cell,[comp.photo?photo(comp.photo,comp.want,{ratio:comp.ratio||0.5625,title:`${id} · ${title}`,key:`${c.id}-${id}`}):panel(`${id} · ${title}`,comp,{ratio:c.ratio,card:{key:`${c.id}-${id}`}}),note(`${id} — ${title}`,body,{color:'plain'})],{gap:10})),{gap:20})]),
  row([single(cols*cell+(cols-1)*20,timeline(c.tlTitle,{mode:'timecode',fps:c.fps||'25',start:c.start||'00:00:00:00',end:c.end,items:c.frames.map(([id,,,,at,out,lane])=>({ref:`${c.id}-${id}`,at,out,lane:lane||0}))},{h:c.tlh||240}))]),
  row(c.notes),
 ]};
}

const t=[];
t.push(board({id:'motion-storyboard',title:'Motion design storyboard',category:'Motion design',also:['Storyboards'],description:'Plan an animation’s visual narrative scene by scene — key frames, transitions and VO — timed on a timecode ruler as an animatic.',tags:['motion design','storyboard','animatic','transitions'],
 heading:'Storyboard — “How a seed becomes a forest” (90 s)',purpose:'Eight key frames, each with its transition into the next. The ruler is the animatic: lengths follow the VO.',
 end:'00:01:30:00',tlTitle:'Animatic — 25 fps, locked to VO',frames:[
  ['01','A seed in a hand','VO: “It starts with one seed.” Transition: seed falls, camera follows down.',S.insert('SEED'),'00:00:00:00','00:00:08:00'],
  ['02','Underground','Roots draw themselves outward in white line. VO: “Planted by people like you.”',S.aerial({label:'roots'}),'00:00:08:00','00:00:20:00'],
  ['03','First shoot','Shoot pushes up through soil; paper texture layers.',(w,h)=>sk.line(0,h*0.7,w,h*0.7)+sk.curve(`M${w/2},${h*0.7} Q${w/2-20},${h*0.4} ${w/2},${h*0.25}`)+sk.curve(`M${w/2},${h*0.35} q-60,-40 -90,0 q50,30 90,0`),'00:00:20:00','00:00:32:00'],
  ['04','Seasons','Four quick wipes: spring, summer, autumn, winter. Music lifts.',S.withMove(S.wide({}),'pan'),'00:00:32:00','00:00:44:00'],
  ['05','Ten years','Sapling becomes a young tree; birds arrive.',(w,h)=>sk.line(0,h*0.8,w,h*0.8)+sk.tree(w/2,h*0.8,h*0.7)+sk.curve(`M${w*0.7},${h*0.2} q15,-12 30,0 q15,-12 30,0`),'00:00:44:00','00:00:58:00'],
  ['06','The forest','Camera rises; many trees, layered parallax.',S.withMove((w,h)=>[0.15,0.3,0.45,0.6,0.75,0.9].map((x,i)=>sk.tree(w*x,h*0.85,h*(0.5+(i%2)*0.2))).join(''),'tilt'),'00:00:58:00','00:01:12:00'],
  ['07','Your tree','A tag on one trunk with a name. VO: “And you can follow yours.”',S.insert('YOUR TREE',{hand:false}),'00:01:12:00','00:01:22:00'],
  ['08','End card','Logo, URL, “Give monthly”.',S.titleCard('CANOPY TRUST','give monthly'),'00:01:22:00','00:01:30:00'],
 ],cols:4,cell:500,
 notes:[column('Transitions',520,[note('Rules','Every scene grows out of the last one. No cuts — only morphs and wipes made of leaves.')]),column('VO script',520,[note('Read','Warm, unhurried, ~120 words. Breath before “And you can follow yours.”')]),column('Sound',520,[note('Music','Solo piano that gains strings at frame 04. Birdsong layer from frame 05.')]),column('Review',500,[task('Sign-off',['Animatic timing','Transition plan','VO read'])])]}));

t.push(board({id:'game-storyboard',title:'Game design storyboard',category:'Game design',also:['Storyboards'],description:'Sketch a level’s key moments and gameplay beats in order — challenges, discoveries and cutscenes — with estimated play time.',tags:['game design','storyboard','level','gameplay'],
 heading:'Storyboard — Tidewater, island 1 (first 12 minutes)',purpose:'The opening of the game from boat arrival to the first big tide puzzle. The ruler shows expected minutes of play.',
 how:'One panel per beat a player will remember. Note the verb the player is doing. Times are estimates from playtests; if a beat runs long, it is either too hard or not clear enough.',
 fps:'24',end:'00:12:00:00',tlTitle:'Play time — first session (minutes)',frames:[
  ['A','Arrival','Cutscene: the boat drifts in at low tide. Player learns to walk.',S.wide({water:true,x:0.6}),'00:00:00:00','00:01:00:00'],
  ['B','The rock pools','Explore; pick up first shell. Teaches: interact.',S.aerial({label:'pools'}),'00:01:00:00','00:03:00:00'],
  ['C','Tide clock','Find the carved tide clock. Teaches: advance the tide.',S.insert('TIDE CLOCK',{hand:false}),'00:03:00:00','00:04:30:00'],
  ['D','First puzzle','Raise the tide to float a crate onto a ledge.',(w,h)=>sk.line(0,h*0.65,w,h*0.65)+sk.rect(w*0.3,h*0.5,w*0.12,h*0.15)+sk.rect(w*0.6,h*0.3,w*0.3,h*0.35)+sk.arrow(w*0.36,h*0.45,w*0.6,h*0.3,'stroke="#b91c1c"'),'00:04:30:00','00:07:30:00'],
  ['E','The lighthouse keeper','Meet the first character; dialogue, a request.',S.medium({people:2}),'00:07:30:00','00:09:00:00'],
  ['F','Island 2 revealed','Low tide reveals a sand path to the next island. End of chapter.',S.withMove(S.wide({water:true,x:0.2}),'pan'),'00:09:00:00','00:12:00:00'],
 ],
 notes:[column('Difficulty curve',520,[note('Intent','Beats A–C teach one verb each with no fail state. D is the first real puzzle — two moves, one red herring.')]),column('Playtest notes',520,[note('Test 3','4 of 6 players missed the tide clock. Add a gull that lands on it.',{color:'rose'})]),column('Audio',520,[note('Cues','Tide sound rises with each turn; a soft chime when a puzzle is solved.')]),column('Tasks',500,[task('Next',['Gull hint on the tide clock','Shorten dialogue in E','Test again with 6 players'])])]}));

t.push(board({id:'animation-storyboard',title:'Animation storyboard',category:'Storyboards',also:['Motion design'],description:'Map out an animated sequence — scenes, staging, character action and transitions — and time it as an animatic before animation starts.',tags:['animation','storyboard','animatic','character'],
 heading:'Storyboard — “Bea the Bus”, opening (60 s)',purpose:'The cold open of the pilot. Bea is late on her first day. Six panels, 60 seconds.',
 end:'00:01:00:00',tlTitle:'Animatic — 25 fps',frames:[
  ['1','Depot at dawn','Wide. Buses asleep in a row; Bea’s headlights blink open.',S.wide({figures:0,sun:true}),'00:00:00:00','00:00:08:00'],
  ['2','Bea wakes','Close on Bea’s face (windscreen). Big yawn; wipers stretch.',S.close({}),'00:00:08:00','00:00:16:00'],
  ['3','The clock','Insert: depot clock — 8:59.',S.insert('8:59',{hand:false}),'00:00:16:00','00:00:20:00'],
  ['4','Panic','Bea zooms out; other buses spin in her wake. Comic speed lines.',S.withMove(S.street({people:0,car:true}),'track'),'00:00:20:00','00:00:34:00'],
  ['5','The stop','Medium. A queue of passengers, arms folded. Bea skids to a stop.',S.street({people:3}),'00:00:34:00','00:00:46:00'],
  ['6','Title','Bea grins; title card pops: BEA THE BUS.',S.titleCard('BEA THE BUS'),'00:00:46:00','00:01:00:00'],
 ],
 notes:[column('Staging',520,[note('Rules','Bea always moves left to right (forward in story). Camera at Bea’s headlight height.')]),column('Acting',520,[note('Bea','Expressions through windscreen “eyes” and wipers as eyebrows. Never human hands.')]),column('Music',520,[note('Cue','Ticking percussion in 3, full theme at 6.')]),column('Approvals',500,[task('Sign-off',['Director','Channel exec','Educational advisor'])])]}));

t.push(board({id:'app-storyboard',title:'App storyboard',category:'UX design',also:['Storyboards'],description:'Map the flow and navigation of an app through a real scenario, screen by screen, with the user’s goal and feelings at each step.',tags:['app','storyboard','flow','scenario','ux'],
 heading:'App storyboard — borrowing a drill on Loop',purpose:'Scenario: Sam needs a drill for 20 minutes to put up a shelf. Six moments from need to return. The ruler shows elapsed real-world time.',
 fps:'24',end:'02:00:00:00',tlTitle:'Real-world time — 2 hours',frames:[
  ['1','The need','Sam holds a shelf against the wall. No drill. Annoyed.',S.room({people:1,table:false}),'00:00:00:00','00:05:00:00'],
  ['2','Search','Opens Loop, types “drill”. Three within 200 m.',S.phoneInHand('drill'),'00:05:00:00','00:08:00:00'],
  ['3','Request','Picks Ana (4.9★). Sends request: “20 min, today?”',S.phoneInHand('Request'),'00:08:00:00','00:12:00:00'],
  ['4','Handover','Doorstep handover. Quick photo of the drill’s condition.',S.medium({people:2}),'00:30:00:00','00:35:00:00'],
  ['5','Done','Shelf up. Relief.',S.room({people:1,window:true}),'00:35:00:00','01:00:00:00'],
  ['6','Return + rate','Drill returned; both rate each other. Reminder no longer needed.',S.phoneInHand('Rate'),'01:30:00:00','01:40:00:00'],
 ],
 notes:[column('Pain points',520,[note('Step 3','Waiting for a reply is the anxious moment. Show “usually replies in 10 min”.',{color:'rose'})]),column('Opportunities',520,[note('Step 4','The condition photo protects both people. Make it one tap.',{color:'sage'})]),column('Screens needed',520,[task('Screens',['Search results','Item page','Request sheet','Handover checklist','Rating'])]),column('Questions',500,[note('Open','Should a first-time borrower need ID verification?')])]}));

t.push(board({id:'event-storyboard',title:'Event storyboard',category:'Events',also:['Storyboards'],description:'Plan the sequence of an event — arrival, key moments and transitions — on a clock-time ruler, with the guest’s experience at each step.',tags:['event','run of show','storyboard','guest journey'],
 heading:'Event storyboard — “Long Table” supper club',purpose:'The guest’s evening from arrival to the last song. The ruler reads as clock time, 18:00 to midnight.',
 how:'Draw or drop a photo for each moment a guest will remember. The note says what they see, hear and do. Then check the ruler: are there gaps where nothing is happening? Are two big moments too close?',
 fps:'25',start:'18:00:00:00',end:'24:00:00:00',tlTitle:'Run of show — clock time',frames:[
  ['1','Arrival','Lantern path through the orchard; welcome drink handed over at the gate.',{photo:'ph-ev-festoon',want:'Festoon string lights over an outdoor space at dusk'},'18:30:00:00','19:15:00:00'],
  ['2','Gathering','Drinks and snacks under the trees; folk trio playing.',{photo:'ph-ev-orchard',want:'Orchard at sunset'},'19:15:00:00','20:00:00:00'],
  ['3','To the table','A bell rings; guests find hand-written place cards.',{photo:'ph-ev-long-table',want:'Long outdoor dinner table set under trees with candles'},'20:00:00:00','20:15:00:00'],
  ['4','Supper','Three courses, family-style. Speech from the farmer between courses.',{photo:'ph-ev-harvest-food',want:'Sharing platters of seasonal food'},'20:15:00:00','22:15:00:00'],
  ['5','Fire','Dessert and coffee around the fire pit.',{photo:'ph-ev-fire-pit',want:'People around an outdoor fire pit at night'},'22:15:00:00','23:15:00:00'],
  ['6','Last song','Band plays one last song; lanterns light the way out.',{photo:'ph-ev-candles',want:'Many candles on a dinner table'},'23:15:00:00','23:45:00:00'],
 ],
 notes:[column('Staff cues',520,[table('Cues',[['Time','Cue','Who'],['19:55','Ring the bell','Host'],['21:10','Speech','Farmer'],['22:10','Light fire','Ops'],['23:40','Lanterns on','Ops']])]),column('Weather plan',520,[note('Rain','Table moves into the barn; fire becomes candles. Decide at 15:00.',{color:'rose'})]),column('Accessibility',520,[note('Route','Lantern path is level and lit; golf buggy for anyone who needs it.')]),column('Checklist',500,[task('On the day',['Place cards printed','Fire safety officer','Last bus info at the gate'])])]}));

t.push(board({id:'fashion-storyboard',title:'Fashion storyboard',category:'Fashion',also:['Storyboards'],description:'Present a collection’s looks in show or lookbook order, with styling, music and timing on a runway ruler.',tags:['fashion','runway','lookbook','storyboard','styling'],
 heading:'Runway order — “Fieldwork” (12 looks, 9 minutes)',purpose:'The order models walk, what they wear and when the music changes. The ruler is the show.',
 end:'00:09:00:00',tlTitle:'Show — running time',frames:[
  ['01','Survey jacket','Waxed cotton jacket, merino layer, linen trousers. Opens in silence.',{photo:'ph-fa-workwear',want:'Person wearing vintage workwear jacket outdoors in nature'},'00:00:00:00','00:00:45:00'],
  ['02','Tweed field coat','Long tweed coat, roll-neck. Music in.',{photo:'ph-fa-wool-coat',want:'Wool coat on a hanger, textured fabric'},'00:00:45:00','00:01:30:00'],
  ['03','Map-print shirt','Contour print shirt, utility skirt.',{photo:'ph-fa-old-map',want:'Old topographic map detail'},'00:01:30:00','00:02:15:00'],
  ['04','The moss look','Moss-green layered knit over linen. The colour turn.',{photo:'ph-fa-moss',want:'Moss on rocks close-up in forest'},'00:02:15:00','00:03:00:00'],
  ['05','Rust overshirt','Rust overshirt, peat trousers, boots.',{photo:'ph-fa-boots',want:'Worn leather boots on a trail'},'00:03:00:00','00:03:45:00'],
  ['06','Finale walk','All 12 looks walk together.',{photo:'ph-fs-finale',want:'Fashion show finale with models walking on a runway'},'00:08:00:00','00:09:00:00'],
 ],
 notes:[column('Music',520,[note('Cues','Silence → field recordings (birds, wind) → slow strings at look 04 → full track for the finale.')]),column('Styling',520,[note('Rules','Hair loose, wind-blown. Boots on every look. One bag per three looks.')]),column('Looks 07–11',520,[note('Middle section','Variations on the outerwear — shown in the full lookbook board.')]),column('Backstage',500,[task('Checklist',['Running order on the wall','Changes rehearsed','Dressers × 6'])])]}));

t.push(board({id:'photography-storyboard',title:'Photography storyboard',category:'Photography',also:['Storyboards'],description:'Plan a shoot as a visual sequence — composition, angle, light and order — with a clock-time ruler for the day.',tags:['photography','storyboard','shot order','composition'],
 heading:'Shot order — “Slow Mornings”, day 1',purpose:'Six set-ups in the order the light allows. The ruler is clock time: follow the sun around the flat.',
 fps:'25',start:'07:00:00:00',end:'17:00:00:00',tlTitle:'Day 1 — clock time',frames:[
  ['A','Hero table','Wide, eye level, 35 mm. Window light from left. 4:5 + 16:9.',S.room({people:0,table:true,window:true}),'07:30:00:00','09:00:00:00'],
  ['B','Hands + cup','Close, 85 mm, f/2. Steam backlit.',S.insert('CUP'),'09:00:00:00','09:45:00:00'],
  ['C','Bed linen','Overhead, 35 mm, raking light on linen.',(w,h)=>sk.rect(w*0.15,h*0.15,w*0.7,h*0.7)+sk.curve(`M${w*0.2},${h*0.5} q${w*0.15},-${h*0.1} ${w*0.3},0 t${w*0.3},0`),'10:00:00:00','11:30:00:00'],
  ['D','Ceramics flat-lay','Overhead on oak. Diffused.',(w,h)=>[0.25,0.45,0.65].map(x=>sk.circle(w*x,h*0.5,h*0.12)).join('')+sk.rect(w*0.1,h*0.1,w*0.8,h*0.8,'stroke-dasharray="6 8"'),'12:30:00:00','14:00:00:00'],
  ['E','Window + plant','Vertical cover option. Shadow on wall.',S.room({people:0,table:false}),'14:00:00:00','15:00:00:00'],
  ['F','Model, reading','Medium, 50 mm. Last soft light.',S.medium({bg:'window'}),'15:00:00:00','16:30:00:00'],
 ],
 notes:[column('Light plan',520,[note('Sun path','East windows until 11:00, then the kitchen skylight, then the west bedroom after 14:00.')]),column('Kit per set-up',520,[note('Kit','A–B: reflector + flag. C–D: overhead arm. F: one 1×1 diffusion.')]),column('Crops',520,[note('Deliver','Every hero in 4:5 and 16:9; leave text space top-left on A and E.')]),column('Day check',500,[task('Before wrap',['All SKUs shot','BTS for social','Backups ×2'])])]}));

t.push(board({id:'ux-storyboard',title:'UX storyboard',category:'UX research',also:['Storyboards','UX design'],description:'Tell a user’s story with a product — context, trigger, actions, pain points and outcome — to align stakeholders on the problem.',tags:['ux','storyboard','scenario','pain points'],
 heading:'UX storyboard — an inspector’s afternoon',purpose:'How a building inspector records defects today, with paper. Six frames, one afternoon. Pain points in rose.',
 fps:'24',start:'13:00:00:00',end:'18:00:00:00',tlTitle:'Clock time — today’s process',frames:[
  ['1','On site','Arrives at a new build; clipboard, phone, tape measure. Drizzle.',S.street({people:1}),'13:00:00:00','13:15:00:00'],
  ['2','Find a defect','Crack in a lintel. Photo on phone, note on paper.',S.insert('CRACK'),'13:15:00:00','15:30:00:00'],
  ['3','Wet paper','Form gets wet; writing smudges. Re-writes two entries.',S.insert('FORM'),'14:20:00:00','14:35:00:00',1],
  ['4','Drive back','40 min to the office.',S.street({people:0,car:true}),'15:30:00:00','16:10:00:00'],
  ['5','Retype','Types everything into the system; matches photos to notes by guesswork.',S.room({people:1,table:true}),'16:10:00:00','17:40:00:00'],
  ['6','Missing photo','One defect has no photo. Next site visit needed.',S.close({look:'left'}),'17:40:00:00','17:55:00:00',1],
 ],
 notes:[column('Pain points',520,[note('Double entry','90 minutes a day retyping.',{color:'rose'}),note('Lost evidence','Photos and notes come apart.',{color:'rose'})]),column('Opportunities',520,[note('Capture once','Photo, location and note in one action on site.',{color:'sage'})]),column('How might we…',520,[sticky('HMW','…let inspectors finish the report before they leave the site?',{color:'sky'})]),column('Evidence',500,[note('Source','Shadowed 3 inspectors for a day each.')])]}));

t.push(board({id:'video-storyboard',title:'Video storyboard',category:'Content creation',also:['Storyboards','Filmmaking'],description:'Plan a video scene by scene — characters, props, dialogue, camera angles and effects — with the edit timed on a ruler.',tags:['video','storyboard','youtube','scenes'],
 heading:'Storyboard — “Restore a rusty cast-iron pan”',purpose:'A 9-minute Fix & Mend episode. Six scenes, each with set-up, props, dialogue and effects.',
 end:'00:09:00:00',tlTitle:'Edit — 25 fps',frames:[
  ['1','Cold open','The rustiest pan you have seen, dropped on the bench. Clang.',S.insert('PAN'),'00:00:00:00','00:00:20:00'],
  ['2','The problem','Bench wide. Why cast iron rusts. Props: pan, salt, oil.',S.medium({bg:'shelves'}),'00:00:20:00','00:01:30:00'],
  ['3','Strip','Overhead. Vinegar soak, wire wool. Time-lapse 2 h → 10 s.',S.insert('SOAK',{hand:true}),'00:01:30:00','00:04:00:00'],
  ['4','Season','Oven shot; three coats of oil. Super: 230 °C.',S.product('OVEN'),'00:04:00:00','00:06:30:00'],
  ['5','The test','Fried egg slides across the pan. Slow motion.',S.insert('EGG',{hand:false}),'00:06:30:00','00:08:00:00'],
  ['6','Outro','Ask: send us your pans.',S.medium({}),'00:08:00:00','00:09:00:00'],
 ],
 notes:[column('Props',520,[task('Props',['Rusty pan (hero) + spare','White vinegar 5 L','Wire wool, gloves','Flaxseed oil','Eggs ×6'])]),column('Camera',520,[note('Angles','Bench wide (A), overhead (B), macro (C). Slow motion only in scene 5.')]),column('Effects',520,[note('Post','Time-lapse in 3, temperature super in 4, before/after split in the outro.')]),column('Safety',500,[note('Note','Vinegar soak: gloves on camera. Oven: oven gloves on camera.',{color:'rose'})])]}));

export default t;

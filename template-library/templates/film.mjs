import {note,task,photo,link,heading,sticky,shape,table,file,boardCard,timeline,column,stack,grid,single,place,row,frame} from '../lib/dsl.mjs';
import {palette,swatch,typeSpecimen,panel,sk,drawing,chart} from '../lib/assets.mjs';
import {intro,swatches,photos,notes} from '../lib/kit.mjs';

const film=[];

// ── Film pre-production plan ──────────────────────────────────────────────────
film.push({
 id:'film-preproduction',title:'Film pre-production plan',category:'Filmmaking',also:['Project plans'],
 description:'Take a short film from locked script to first shoot day: story, look, team, locations, budget and an eight-week plan on a calendar timeline.',
 tags:['film','short film','pre-production','schedule','budget','calendar'],
 rows:[
  row([stack(1200,[heading('Low Tide — a 12-minute short','Pre-production hub. Everything the team needs between the locked script and the first day of shooting lives on this board.')]),
       single(380,sticky('How to use this template','Replace the example project with yours. Keep the structure: the film, the look, the people, the places, the money and the plan. Drag clips on the timeline to re-plan; the cards move with them.',{color:'sky'}))]),
  row([
   column('The film',330,[
    note('Logline','A teenage cockle-picker who knows the tides better than anyone has twelve minutes to get her stranded grandfather off the sandbanks before the water comes in — and to admit she left him there.',{key:'logline',tags:['story']}),
    note('Synopsis','**Act one.** Mara (16) works the flats at dawn with her grandfather, Ted. They argue; she walks off with the only radio.\n\n**Act two.** The fog rolls in early. From the sea wall she hears the siren and realises Ted is still out there.\n\n**Act three.** She runs back across the sand against the turning tide, finds him, and the two of them wade home as the channel fills — not speaking, holding on.'),
    table('Key facts',[['Format','Detail'],['Runtime','12 min'],['Shoot','4 days, 2 locations'],['Camera','Super 35, 2.39:1'],['Script','Draft 7 — locked'],['Delivery','Festival DCP + ProRes 4444']]),
    file('Shooting script','LowTide_ShootingScript_v7.pdf','Locked draft. Scene numbers are final; revisions go on coloured pages.'),
   ]),
   column('Look & feel',330,[
    photo('ph-film-tidal-flats','Wide tidal mudflats at low tide, overcast morning light, a lone figure far away',{ratio:0.6,title:'Reference — the flats at dawn'}),
    photo('ph-film-sea-fog','Sea fog rolling over a beach or harbour, muted grey palette',{ratio:0.66,title:'Reference — the fog arrives'}),
    palette('Palette — wet sand to storm grey',[['#c9b99a','Wet sand',2],['#8a9a9b','Estuary',2],['#4f5d63','Storm',1.5],['#e8e2d6','Fog',1.5],['#c2582c','Mara’s coat',0.6]]),
    note('Visual rules','- Handheld only when Mara is moving; locked off when she is still.\n- Horizon always in frame on the flats — the audience must read the distance.\n- Her orange coat is the only saturated colour in the film.'),
   ]),
   column('People',330,[
    table('Key crew',[['Role','Name','Status'],['Director','Ana Ruiz','Confirmed'],['Producer','Tom Okafor','Confirmed'],['DP','Lea Brandt','Confirmed'],['Production designer','Sam Hale','Pencilled'],['Sound recordist','Iris Mendes','Searching'],['Editor','Joon Park','Confirmed']]),
    boardCard({title:'Casting',description:'Shortlists, self-tapes and chemistry-read notes for Mara and Ted.',rows:[
     row([stack(700,[heading('Casting — Mara and Ted','Shortlists and notes. Move a card into “Offered” when the director signs off.')])]),
     row([
      column('Mara (16)',320,[note('What we need','Physical, unsentimental, quick. Must be comfortable on wet sand for long takes — no stunt double.'),note('Shortlist','- **Priya S.** — best self-tape; instinctive with the guilt beat\n- **Holly R.** — strong physically; less vulnerable\n- **Erin M.** — local, knows the coast; first screen role'),task('Next steps',['x Open call posted','x Self-tapes reviewed (38)','Chemistry read with Ted shortlist','Parent consent and chaperone booked'])]),
      column('Ted (70s)',320,[note('What we need','Gruff warmth. Comic timing in the opening, stillness at the end. Water work is waist-deep at most.'),note('Shortlist','- **Malcolm D.** — theatre background, lovely stillness\n- **Bernard O.** — funny, warm; check availability in week 6')]),
      column('Offered',320,[note('Nothing offered yet','Offers go out after the chemistry read in week 3.')]),
     ])],}),
    task('Before we lock the team',['x Director and producer attached','x DP confirmed','Sound recordist with marine experience','Water-safety officer for the flats','Runner with a full licence']),
   ]),
   column('Places',330,[
    photo('ph-film-sea-wall','Old concrete sea wall or promenade above a beach, grey weather',{ratio:0.66,title:'Location 1 — the sea wall'}),
    note('Location 1 — the sea wall','Car park at the north end for unit base. Power from the café by arrangement. Public footpath: we need two marshals to hold walkers for takes.'),
    photo('ph-film-sandbank','Sandbank and shallow channels in an estuary at low tide, aerial or high view',{ratio:0.66,title:'Location 2 — the sandbanks'}),
    note('Location 2 — the sandbanks','Only safe 2 h either side of low water. Tide tables decide the call times on days 2–4. Harbour master must approve the safety plan.'),
    link('Tide tables for the shoot week','https://www.tidetimes.co.uk','Check spring/neap: we want a spring low on days 2 and 3.'),
   ]),
   column('Budget — £18,400',440,[
    table('Top sheet',[['Line','Budget','Notes'],['Cast','£2,800','2 leads, 4 days + rehearsal'],['Crew','£6,900','12 crew, 4 days'],['Camera & grip','£2,600','Package deal, incl. 2 drone hours'],['Locations & permits','£1,100','Council, harbour, café'],['Art & wardrobe','£900','Two coats — one hero, one wet'],['Safety & insurance','£1,450','Water-safety team + PL'],['Catering & travel','£1,250',''],['Post','£1,400','Grade, mix, DCP'],['Contingency (10%)','£1,700','Hold until picture lock'],['Total','£18,400','']]),
    note('Money rules','Spend contingency only with the producer’s sign-off. Anything over £250 gets a quote on the board before it is booked.'),
   ]),
   column('Risks',300,[
    note('Tide and fog','Real fog cannot be scheduled. Plan B is a smoke machine on the sea wall and a grade pass; decide on the morning by 06:00.',{color:'rose'}),
    note('Working in water','Nobody goes deeper than the waist. Safety boat on standby for every take on the sandbanks.',{color:'rose'}),
    note('Minor on set','Chaperone at all times; hours limited by licence. Night pickups are not possible with our lead.',{color:'rose'}),
   ]),
  ]),
  row([single(2160,timeline('Eight weeks to the first shoot day',{mode:'date',days:56,items:[
    {ref:'p-dev',at:0,len:14,lane:0},{ref:'p-cast',at:7,len:16,lane:1},{ref:'p-scout',at:14,len:14,lane:2},{ref:'p-design',at:21,len:21,lane:0},
    {ref:'p-rehearse',at:42,len:7,lane:1},{ref:'m-lock',at:13,len:3,lane:3},{ref:'m-recce',at:34,len:3,lane:3},{ref:'m-shoot',at:52,len:4,lane:2}]}))]),
  row([
   column('Development',400,[task('Development',['x Script locked (draft 7)','x Director’s statement','Lookbook for funders','Final budget sign-off'],{key:'p-dev'})]),
   column('Casting',400,[task('Casting',['x Breakdown released','x Self-tapes in','Chemistry read','Offers out and accepted'],{key:'p-cast'})]),
   column('Scouting',400,[task('Locations',['x Shortlist of 3 sea walls','Tide study on the flats','Permits: council, harbour','Unit base and parking plan'],{key:'p-scout'})]),
   column('Design',400,[task('Art & wardrobe',['Coat tests on camera','Props: cockle rake, radio, bucket','Ted’s boat shed dressing'],{key:'p-design'})]),
   column('Rehearsal & milestones',400,[task('Rehearsals',['Table read','Blocking on the sea wall','Water drill with safety team'],{key:'p-rehearse'}),note('Script lock','Draft 7 frozen. Changes after this point are coloured pages.',{key:'m-lock',color:'sage'}),note('Tech recce','Whole HoD team walks both locations at low water.',{key:'m-recce',color:'sage'}),note('Shoot — 4 days','Days 2 and 3 on the spring low tide.',{key:'m-shoot',color:'sand'})]),
  ]),
 ],
});


import * as S from '../lib/scenes.mjs';

// ── Film moodboard ────────────────────────────────────────────────────────────
film.push({
 id:'film-moodboard',title:'Film moodboard',category:'Filmmaking',also:['Moodboards'],
 description:'Define the visual language of a film — light, colour, framing, texture and movement — and share it with your DP, designer and costume team.',
 tags:['film','moodboard','cinematography','lookbook','colour'],
 rows:[
  intro('Night Shift — visual direction','A neo-noir feature set over one night in a 24-hour laundrette. This board is the single reference for camera, art and costume.','Group references by the decision they inform, not by where you found them. Write one line under each saying what to borrow — and what to ignore.'),
  row([
   column('The feeling in three words',300,[note('Lonely · luminous · humid','The city is asleep; the laundrette is the only warm, lit box on the street. Every frame should feel like 3 a.m. — tired, but strangely tender.'),note('Tone references','- *Night-time photography* of empty shopfronts\n- 1970s colour stock with crushed shadows\n- Fluorescent light on wet pavement')]),
   column('Light',360,[photos([['ph-mood-neon-rain','Neon sign reflected on a wet street at night','Practicals only — borrow'],['ph-mood-laundromat','Laundromat interior at night with fluorescent lights','The set at its emptiest']],1,328),note('Lighting rules','Motivated by practicals only: tubes, signs, the dryer windows. Faces sit half in shadow. Never add a hair light.')]),
   column('Colour',360,[swatches([['#0f2a3a','Midnight'],['#1f6f78','Teal tube'],['#e6b655','Sodium'],['#d9483b','Exit sign'],['#efe9dd','Bleached cotton'],['#2a2a2e','Wet tarmac']],3,98),note('Colour script','Cold teal outside, warm sodium inside. The red exit sign is the only red — save it for the moment she decides to leave.')]),
   column('Framing & lens',360,[photos([['ph-mood-diner-window','Person seen through a diner or shop window at night from outside','Through-glass compositions']],1,328),note('Camera','Anamorphic 40 mm and 75 mm. Static, symmetrical wides through the shop window; handheld only inside, close and breathing.')]),
   column('Texture & costume',360,[photos([['ph-mood-fabric','Close-up of folded laundry or crumpled cotton fabric texture','Fabric — soft, worn'],['ph-mood-tiles','Old tiled wall or floor, worn green or white tiles','Surfaces — tiled, steamy']],2,156),note('Costume','Worn-in cottons and nylon. Nothing new, nothing branded. The lead’s yellow cardigan is the warmest object on screen.')]),
  ]),
  row([
   column('Movement',360,[note('How the camera moves','Slow push-ins when someone is about to speak and doesn’t. One long Steadicam take follows her outside at the end — the only time the camera leaves the shop.'),photos([['ph-mood-street-night','Empty city street at night with a single figure walking','The final walk']],1,328)]),
   column('Use / avoid',360,[note('Use','- Reflections in glass and chrome\n- Condensation and steam\n- Negative space above heads',{color:'sage'}),note('Avoid','- Blue-orange “blockbuster” grading\n- Lens flares as decoration\n- Drone shots',{color:'rose'})]),
   column('Questions for the DP',360,[task('To decide at the camera test',['Diffusion: 1/8 Black Pro-Mist or none?','How far can we push the stock before the shadows break?','Practical tubes: daylight or tungsten-balanced?','Window reflections — polariser or embrace them?'])]),
   column('Sign-off',360,[table('Approvals',[['Department','Who','Status'],['Director','—','Approved'],['DP','—','Approved'],['Production design','—','Notes'],['Costume','—','Pending']]),note('Next step','Bring this board to the camera test on day −10 and shoot every swatch under the practicals.')]),
  ]),
 ],
});

// ── Film brainstorming ────────────────────────────────────────────────────────
film.push({
 id:'film-brainstorm',title:'Film brainstorming',category:'Filmmaking',also:['Brainstorming'],
 description:'Develop a new film idea from a spark: premises, what-ifs, characters, references and the questions that will shape the first draft.',
 tags:['film','ideas','development','premise','what if'],
 rows:[
  intro('Brainstorm: a film about a night-ferry crossing','Development session. Quantity first, judgement later — then vote and pick one premise to take into a treatment.','Add every idea as its own card in “Sparks”. When the session ends, drag the strongest three into “Contenders” and connect them to the references that inspired them.'),
  row([
   column('The spark',320,[note('Where it started','A six-hour overnight ferry. Lorry drivers, a hen party, a family moving country, a man who boarded without a ticket. Nobody can leave until morning.',{key:'spark'}),photos([['ph-brain-ferry','Passenger ferry at sea at night or dusk','The boat']],1,288)]),
   column('Sparks',620,[grid(2,280,[
    sticky('What if…','…the ship’s engine fails mid-crossing and the radio goes quiet?',{color:'sand'}),
    sticky('What if…','…a child goes missing and every passenger is a suspect?',{color:'sand',key:'c1'}),
    sticky('What if…','…two strangers meet every month on the same crossing — and we only see those nights?',{color:'sand',key:'c2'}),
    sticky('What if…','…the night steward is the only person who knows the boat will not arrive?',{color:'sand'}),
    sticky('Image','A dance floor with no one on it, rolling with the sea.',{color:'rose'}),
    sticky('Image','Trucks chained in the hold, their engines ticking as they cool.',{color:'rose'}),
    sticky('Character','A retired captain travelling as a passenger, unable to stop listening to the engines.',{color:'sky',key:'c3'}),
    sticky('Sound','The PA chime that means nothing — and then something.',{color:'sage'}),
   ])]),
   column('References',320,[photos([['ph-brain-ship-corridor','Narrow corridor inside a ship with doors and fluorescent lighting','Corridors that repeat'],['ph-brain-sea-night','Dark sea at night with lights on the horizon','The horizon that never arrives']],1,288,{key:'refs'}),note('Films and books to revisit','- Bottle films set on trains and ships\n- Stories told over a single night\n- Short stories about strangers who only meet in transit',{key:'refnote'})]),
   column('Contenders',320,[note('A — The missing child','Thriller. High concept, clear engine, but familiar.',{key:'k1',color:'sky'}),note('B — Twelve crossings','Romance in fragments. Fresh structure; harder to sell.',{key:'k2',color:'sky'}),note('C — The captain','Character drama with a slow-burn mystery. Strong lead role.',{key:'k3',color:'sky'}),table('Vote',[['Idea','Votes','Gut feel'],['A','2','Commercial'],['B','4','Most original'],['C','3','Best part for an actor']])]),
   column('Questions to answer next',320,[task('Before the treatment',['Who is the protagonist and what do they want tonight?','What is at stake by morning?','Why does it have to be this ship, this night?','What is the final image?','Who would star — and who would produce?'])]),
  ]),
 ],
 edges:[['c1','k1'],['c2','k2'],['c3','k3'],['spark','c1','starts'],['refnote','k2','inspires']],
});

// ── Beat sheet (timecode) ─────────────────────────────────────────────────────
const beats=[
 ['Opening image','Dana sits in her car above the beach she no longer works, engine running, watching the new lifeguards.','A snapshot of the hero’s world before the story changes it.','00:00:00:00',3,0],
 ['Theme stated','Her sister: “You can’t keep everyone out of the water.”','Someone hints at what the hero must learn.','00:05:00:00',3,1],
 ['Set-up','Night shifts at the pool. A town that crosses the street to avoid her. A boy, Sam, who still can’t put his face in the water.','Home, work, flaws, what is missing.','00:01:00:00',10,2],
 ['Catalyst','Sam’s school enters him in the harbour swim. His coach quits. Sam asks for Dana by name.','The event that knocks life off course.','00:12:00:00',3,0],
 ['Debate','She says no twice. His mother says never. Dana watches him fail a length alone.','Should I go? Can I? The last chance to stay safe.','00:15:00:00',10,1],
 ['Break into two','Dawn, the outdoor pool. Dana gets in the water for the first time in four years.','The hero chooses to act and enters a new world.','00:25:00:00',3,0],
 ['B story','Sam’s mother, Leah — the woman who blamed her in court — starts staying to watch.','A new relationship that carries the theme.','00:30:00:00',25,2],
 ['Fun and games','Training montage: breathing drills, cold-water swims, Sam’s first length without stopping.','The promise of the premise — the trailer moments.','00:30:00:00',25,1],
 ['Midpoint','Sam wins the junior heat; the town cheers her for the first time. Leah files a complaint the same night.','A false victory or false defeat; the stakes rise.','00:55:00:00',3,0],
 ['Bad guys close in','Suspended from the pool. Training moves to the sea, in secret, against every rule she taught.','Pressure from outside and doubt from within.','00:58:00:00',17,1],
 ['All is lost','A rip current, a storm, and she freezes — exactly as she did the first time. Sam gets himself out.','The opposite of the midpoint. Something or someone dies.','01:15:00:00',3,0],
 ['Dark night of the soul','At the inquiry transcript, Dana finally reads what really happened four years ago.','The hero sits in the wreckage — and finally understands.','01:18:00:00',7,2],
 ['Break into three','Leah brings Sam to her door: “He won’t swim the harbour without you.”','Theme and B story give the hero the answer.','01:25:00:00',3,0],
 ['Finale','The harbour swim. Dana doesn’t save him — she swims beside him and lets him finish.','The hero applies what they learned; the old world is remade.','01:28:00:00',22,1],
 ['Final image','Dawn on the lifeguard tower, Sam beside her, the car engine off below.','The opposite of the opening image — proof of change.','01:50:00:00',0,0],
];
film.push({
 id:'beat-sheet',title:'Beat sheet',category:'Filmmaking',also:['Creative writing','Novel outlines'],
 description:'Structure a feature screenplay in fifteen beats, placed on a 110-minute timecode ruler so pacing problems are visible at a glance.',
 tags:['screenwriting','structure','beats','pacing','timecode'],
 rows:[
  intro('Beat sheet — “Undertow” (feature, 110 min)','Fifteen story beats, each pinned to the minute it should land. Drag a beat on the timeline to see what it does to the pace of the whole film.','Each card holds what happens at that beat in this story, with the beat’s job in italics underneath. Replace the story, keep the job. Timings are a guide — a page of script is roughly a minute.'),
  row([single(2240,timeline('Running time — beats against the clock',{mode:'timecode',fps:'24',start:'00:00:00:00',end:'01:52:00:00',items:beats.map(([t,,,at,mins,lane],i)=>({ref:'b'+i,at,len:mins?mins*60:0,lane}))}))]),
  row([
   column('Act one — set-up (0–25 min)',540,[grid(2,238,beats.slice(0,6).map(([t,d,def],i)=>note(t,d+'\n\n*'+def+'*',{key:'b'+i})),{even:false})]),
   column('Act two — confrontation (25–85 min)',540,[grid(2,238,beats.slice(6,12).map(([t,d,def],i)=>note(t,d+'\n\n*'+def+'*',{key:'b'+(i+6)})),{even:false})]),
   column('Act three — resolution (85–110 min)',540,[grid(2,238,beats.slice(12).map(([t,d,def],i)=>note(t,d+'\n\n*'+def+'*',{key:'b'+(i+12)})),{even:false})]),
   column('Our story',500,[
    note('Logline','A burned-out lifeguard must win back the trust of the town that blamed her for a drowning — by training the boy who survived it.'),
    note('Opening → final image','**Opening:** she sits in her car above the beach she no longer works, engine running.\n**Final:** she sits on the lifeguard tower at dawn, the boy beside her, the engine off.'),
    note('Midpoint','The boy wins his first open-water race; the town cheers her for the first time in years. False victory: his mother has filed a complaint.'),
    note('All is lost','A rip current, a storm, and she freezes — exactly as she did the first time.'),
   ]),
  ]),
 ],
});

// ── Location scouting ─────────────────────────────────────────────────────────
film.push({
 id:'location-scout',title:'Film location scouting',category:'Filmmaking',also:['Photography'],
 description:'Compare candidate locations side by side — photos, light, sound, access, power, permits and cost — and record the decision.',
 tags:['locations','scouting','recce','permits','logistics'],
 rows:[
  intro('Location scout — “the farmhouse kitchen” (Sc. 4, 9, 22)','Three candidates for the family kitchen. 11 pages, 3 shoot days. We need a working range, a window facing east and room for a dolly.','Give each candidate its own column with the same cards in the same order, so the team can compare across. Score them in the matrix and record the decision with the reason.'),
  row([
   column('Candidate A — Holloway Farm',360,[photos([['ph-loc-farm-kitchen','Rustic farmhouse kitchen interior with a range cooker and window','Kitchen, morning'],['ph-loc-farmhouse','Old stone farmhouse exterior in countryside','Exterior, approach']],2,156),note('What works','East window — real morning light until 10:30. Original range works. 6 m × 5 m: room for a dolly track along the table.'),note('What doesn’t','A-road 200 m away: lorries every few minutes. Only one bathroom for crew.',{color:'rose'}),table('Logistics',[['','Detail'],['Power','3-phase in barn'],['Parking','Field — 12 vehicles'],['Fee','£650/day'],['Contact','Owner, via agent']])]),
   column('Candidate B — Mill Cottage',360,[photos([['ph-loc-cottage-kitchen','Small cottage kitchen with wooden table and old cupboards','Kitchen, midday'],['ph-loc-cottage','Small cottage exterior with garden in the countryside','Exterior']],2,156),note('What works','The look is perfect: low beams, worn floor. Owner very relaxed about set dressing.'),note('What doesn’t','Small — 4 m × 4 m. North-facing: we would have to light every scene. Lane too narrow for the camera truck.',{color:'rose'}),table('Logistics',[['','Detail'],['Power','Domestic only — generator'],['Parking','Village hall, 400 m'],['Fee','£400/day'],['Contact','Owner direct']])]),
   column('Candidate C — studio build',360,[photos([['ph-loc-studio','Empty film studio stage or warehouse interior','Stage 2, empty'],['ph-loc-set-build','Film set construction with wooden flats and scaffolding','Build reference']],2,156),note('What works','Total control: wild walls, silent, any light we want. Three days become two.'),note('What doesn’t','Build cost and four days of construction. Loses the authenticity the director wants.',{color:'rose'}),table('Logistics',[['','Detail'],['Power','Unlimited'],['Parking','On site'],['Fee','£2,900 incl. build'],['Contact','Studio manager']])]),
   column('Compare and decide',420,[table('Scoring (1–5)',[['Criteria','A','B','C'],['Look','4','5','3'],['Light','5','2','5'],['Sound','2','4','5'],['Access','4','2','5'],['Cost','4','5','1'],['Total','19','18','19']]),note('Decision','**Candidate A — Holloway Farm.** Light and space win. Sound: schedule dialogue scenes on the Sunday (no lorries) and wild-track the rest.',{color:'sage'}),task('Next steps',['Tech recce with DP and sound — Tue','Location agreement signed','Neighbours letter-dropped','Risk assessment for the barn generator']),photo('ph-loc-map','Rural road map or aerial view of countryside fields',{ratio:0.66,title:'Unit base and route'})]),
  ]),
 ],
});

// ── Film storyboard (timecode) ────────────────────────────────────────────────
const sb=[
 ['1A','EXT. ESTUARY — DAWN','Extreme wide. Mara, a dot on the flats. The tide is out to the horizon.',S.wide({fog:true,water:true,x:0.62}),'00:00:00:00','00:00:06:00'],
 ['1B','EXT. ESTUARY — DAWN','Medium. Ted rakes; Mara watches him, arms folded.',S.medium({people:2,bg:'horizon'}),'00:00:06:00','00:00:10:00'],
 ['1C','EXT. ESTUARY — DAWN','Insert. The radio clipped to Ted’s bucket.',S.insert('RADIO'),'00:00:10:00','00:00:12:12'],
 ['2A','EXT. SEA WALL — DAY','Wide, push in. Mara climbs the steps, the radio in her hand.',S.withMove(S.wide({x:0.3}),'push'),'00:00:12:12','00:00:18:00'],
 ['2B','EXT. SEA WALL — DAY','Close-up. The siren. She turns towards the sea.',S.close({look:'left'}),'00:00:18:00','00:00:21:00'],
 ['3A','EXT. ESTUARY — DAY','Tracking. She runs back across the sand, water already in the channels.',S.withMove(S.wide({water:true,x:0.4}),'track'),'00:00:21:00','00:00:28:00'],
 ['3B','EXT. ESTUARY — DAY','Over-the-shoulder. She reaches Ted. He doesn’t look up.',S.ots(),'00:00:28:00','00:00:33:00'],
 ['3C','EXT. ESTUARY — DAY','Wide. Two figures wading home, holding on.',S.wide({figures:2,water:true,x:0.45}),'00:00:33:00','00:00:40:00'],
];
film.push({
 id:'film-storyboard',title:'Film storyboard',category:'Storyboards',also:['Filmmaking'],
 description:'Board a sequence shot by shot — framing, action, sound and camera moves — and time it on a timecode ruler to feel the cut before you shoot.',
 tags:['storyboard','shots','animatic','timecode','sequence'],
 rows:[
  intro('Storyboard — Low Tide, scenes 1–3','Eight panels for the opening forty seconds. Every panel is on the timecode ruler at the length we expect it to play.','Draw over any panel (double-click the sketch), or replace it with a photo or frame grab. Keep the shot ID in the title so it matches the shot list. Retime by dragging clips on the ruler.'),
  row([grid(4,500,sb.map(([id,slug,action,comp])=>stack(500,[panel(`${id} · ${slug}`,comp,{card:{key:'sb'+id}}),note(`${id} — action`,action,{color:'plain'})],{gap:10})),{gap:24})]),
  row([single(2072,timeline('Sequence timing — 24 fps',{mode:'timecode',fps:'24',start:'00:00:00:00',end:'00:00:42:00',items:sb.map(([id,,,,at,out],i)=>({ref:'sb'+id,at,out,lane:0}))},{h:240}))]),
  row([
   column('Sound',500,[note('Sound design','Wind and gulls under 1A–1C. The siren in 2B is the first man-made sound — keep everything before it natural. Music only from 3C.')]),
   column('Continuity',500,[note('Watch for','- Radio: in Ted’s bucket in 1C, in Mara’s hand from 2A.\n- Mara’s coat: dry until 3A, wet from 3B.\n- Tide line: further in every shot from 3A.')]),
   column('Approvals',500,[task('Sign-off',['x Director','DP — lens choices per panel','1st AD — timings against the schedule','Editor — coverage check'])]),
   column('Shot list link',500,[note('Shot IDs','Panel titles match the shot list IDs (1A, 1B…). Update both when a shot is added or cut.')]),
  ]),
 ],
});

// ── Call sheet (timecode as clock time) ───────────────────────────────────────
film.push({
 id:'call-sheet',title:'Film call sheet',category:'Filmmaking',also:['Photography'],
 description:'Everything cast and crew need for one shoot day — call times, schedule, locations, contacts, safety and weather — with the day laid out on a clock-time ruler.',
 tags:['call sheet','schedule','shoot day','crew','safety'],
 rows:[
  intro('Call sheet — Day 2 of 4 · Low Tide','Thursday, shooting on the sandbanks at low water (11:42). The ruler reads as clock time, 06:00 to 20:00.','Duplicate this board for every shoot day. Update the times on the ruler and the general call — the cards follow. Send it out by 18:00 the day before.'),
  row([
   column('The day',340,[table('Key times',[['','Time'],['Crew call','06:30'],['Breakfast','06:30–07:00'],['Cast call','07:15'],['First shot','08:00'],['Low water','11:42'],['Lunch','13:00–13:45'],['Wrap (est.)','18:30']]),note('Weather','Overcast, 12 °C, wind SW 15 mph easing. Sea fog possible until 10:00 — the 1st AD calls fog plan B by 06:00.',{color:'sky'})]),
   column('Locations',340,[note('Unit base','North sea-wall car park. Toilets in the café (open 07:00).'),note('Set','The sandbanks — 900 m walk from base. Wellies and waders provided. Nobody walks out without the safety officer.'),photo('ph-call-car-park','Coastal car park by the sea with vans parked',{ratio:0.6,title:'Unit base'}),note('Nearest hospital','St Mary’s A&E, 14 min by car. Postcode and route are pinned in the unit van.',{color:'rose'})]),
   column('Cast',340,[table('Cast',[['Cast','Character','Pick-up','On set'],['Priya S.','Mara','06:45','07:15'],['Malcolm D.','Ted','07:00','07:30'],['—','Chaperone','with Priya','—']])]),
   column('Crew',420,[table('Crew',[['Dept','Name','Call'],['Director','Ana Ruiz','06:30'],['1st AD','Kofi Mensah','06:15'],['DP','Lea Brandt','06:30'],['Gaffer','Sid Patel','06:30'],['Sound','Iris Mendes','06:45'],['Water safety','Coast team ×3','06:00'],['Runner','Ellie Noor','06:00']])]),
   column('Safety',340,[note('Today’s risks','Working on tidal sand. The safety officer calls everyone off the banks 90 min after low water — **13:12** — no exceptions.',{color:'rose'}),task('Safety checklist',['Safety boat in position','Radios checked (channel 4)','Head count out / head count back','Thermal blankets in the van'])]),
  ]),
  row([single(1860,timeline('Shooting schedule — clock time',{mode:'timecode',fps:'24',start:'06:00:00:00',end:'20:00:00:00',items:[
   {ref:'cs-call',at:'06:30:00:00',out:'07:00:00:00',lane:0},{ref:'cs-sc3a',at:'08:00:00:00',out:'10:30:00:00',lane:1},{ref:'cs-sc3b',at:'10:30:00:00',out:'12:45:00:00',lane:1},{ref:'cs-low',at:'11:42:00:00',lane:2},{ref:'cs-lunch',at:'13:00:00:00',out:'13:45:00:00',lane:0},{ref:'cs-sc5',at:'14:00:00:00',out:'17:30:00:00',lane:1},{ref:'cs-wrap',at:'18:30:00:00',lane:0}]}))]),
  row([
   column('Schedule cards',1860,[grid(7,240,[
    note('Crew call & breakfast','Base, north car park.',{key:'cs-call'}),
    note('Sc. 3A — the run','Tracking shots. 4 set-ups. Drone 1 h.',{key:'cs-sc3a',color:'sand'}),
    note('Sc. 3B — the rescue','OTS and close-ups in the water.',{key:'cs-sc3b',color:'sand'}),
    note('Low water 11:42','Last safe time on the banks: 13:12.',{key:'cs-low',color:'rose'}),
    note('Lunch','Hot lunch at base. 45 min.',{key:'cs-lunch'}),
    note('Sc. 5 — sea wall','Mara and Ted, dialogue. 6 set-ups.',{key:'cs-sc5',color:'sand'}),
    note('Wrap','Kit back to base. Rushes to editor by 21:00.',{key:'cs-wrap'}),
   ],{gap:16})]),
  ]),
 ],
});

// ── Shot list ────────────────────────────────────────────────────────────────
film.push({
 id:'shot-list',title:'Film shot list',category:'Filmmaking',also:['Storyboards'],
 description:'Plan every set-up for a scene — size, angle, lens, movement, sound and priority — with estimated times on a clock ruler to check the day fits.',
 tags:['shot list','coverage','camera','lenses','schedule'],
 rows:[
  intro('Shot list — Sc. 5 “The sea wall” (2 ⅜ pages)','Dialogue scene between Mara and Ted. Eight set-ups, must-haves first. Estimated 3 h 30 min including resets.','Keep one row per set-up. Priority A shots must be in the can before we move on; C shots are the first to cut when the day runs late.'),
  row([
   stack(1180,[table('Shots',[
    ['ID','Size / angle','Lens','Move','Action','Sound','Priority','Est.'],
    ['5A','Wide — 2 shot, profile','32 mm','Static','Whole scene, both on the bench','Sync','A','40 min'],
    ['5B','Medium — Mara','50 mm','Slow push','Her side of the argument','Sync','A','30 min'],
    ['5C','Medium — Ted','50 mm','Slow push','His side; he won’t look at her','Sync','A','30 min'],
    ['5D','Close — Mara','85 mm','Static','“I left you out there.”','Sync','A','20 min'],
    ['5E','Close — Ted','85 mm','Static','His reaction — no line','Sync','B','15 min'],
    ['5F','Insert — hands','100 mm macro','Static','Ted’s hand finds hers on the bench','Wild','B','15 min'],
    ['5G','Wide — high angle','24 mm','Crane down','Opening of the scene, from the promenade','MOS','C','25 min'],
    ['5H','Cutaway — sea','135 mm','Static','The tide coming in','Wild','C','10 min'],
   ])]),
   column('Notes',420,[photo('ph-shot-bench','Bench on a seaside promenade facing the sea',{ratio:0.62,title:'The bench — position marked on the plan'}),note('Coverage plan','Shoot wide first while the light is flat, then turn around for Ted’s coverage before the sun swings round. Inserts at the end of the day with a second camera if available.'),note('Continuity','Ted’s cap is **on** throughout. Radio on the bench between them, aerial up.')]),
   column('Day check',360,[task('Before we move on',['All A shots in the can','Wild track: 1 min of sea and wind','Photos of the bench dressing','Script supervisor notes signed off'])]),
  ]),
  row([single(1640,timeline('Does it fit? Estimated set-ups, 14:00–18:00',{mode:'timecode',fps:'25',start:'14:00:00:00',end:'18:00:00:00',items:[
   {ref:'s5a',at:'14:00:00:00',out:'14:40:00:00'},{ref:'s5b',at:'14:40:00:00',out:'15:10:00:00'},{ref:'s5c',at:'15:10:00:00',out:'15:40:00:00',lane:1},{ref:'s5d',at:'15:40:00:00',out:'16:00:00:00'},{ref:'s5e',at:'16:00:00:00',out:'16:15:00:00',lane:1},{ref:'s5f',at:'16:15:00:00',out:'16:30:00:00',lane:2},{ref:'s5g',at:'16:30:00:00',out:'16:55:00:00',lane:2},{ref:'s5h',at:'16:55:00:00',out:'17:05:00:00',lane:2}]}))]),
  row([grid(8,190,[['5A','A','Wide two-shot'],['5B','A','Mara'],['5C','A','Ted'],['5D','A','Close Mara'],['5E','B','Close Ted'],['5F','B','Hands'],['5G','C','Crane'],['5H','C','Sea']].map(([id,p,t])=>note(`${id} · ${t}`,`Priority ${p}`,{key:'s'+id.toLowerCase(),color:p==='A'?'sage':p==='B'?'sand':'stone'})),{gap:16})]),
 ],
});

// ── Equipment checklist ───────────────────────────────────────────────────────
film.push({
 id:'equipment-checklist',title:'Film equipment checklist',category:'Filmmaking',also:['Content creation'],
 description:'Track every piece of kit by department — what is owned, rented or still to source — with check-out and return dates.',
 tags:['equipment','gear','rental','checklist','camera'],
 rows:[
  intro('Kit list — Low Tide (4 shoot days)','One checklist per department. Tick an item when it is in the van; untick it when it comes back.','Owned kit is plain, rented kit is sand. Put the rental return date on the timeline so nothing earns a late fee.'),
  row([
   column('Camera',340,[task('Camera package',['x Body + 2 batteries + charger','x Lens set: 24, 32, 50, 85 mm','100 mm macro (rent)','Matte box + ND 0.3/0.6/0.9','4 × 512 GB media + reader','Monitor 7" + sun hood','Rain cover ×2'])]),
   column('Grip',340,[task('Grip',['Tripod + baby legs','Dolly + 6 m track','Slider 1 m','Sandbags ×12 (essential on the flats)','Apple boxes, full set'])]),
   column('Lighting',340,[task('Lighting',['2 × 1.2 kW LED (rent)','4 × tube lights','Bounce 4×4 + frame','Flags and C-stands ×6','Battery packs for the beach'])]),
   column('Sound',340,[task('Sound',['Mixer-recorder','Boom + blimp + dead cat ×2','2 × radio mics (waterproof)','Timecode boxes ×2','Headphones ×3'])]),
   column('Safety & weather',340,[task('Safety & weather',['Waders ×8','Life jackets ×10','First-aid kit + thermal blankets','Hand warmers','Gazebo for base'])]),
  ]),
  row([
   column('Rental tracker',720,[table('Rentals',[['Item','House','Out','Back','Cost'],['100 mm macro','Lens hire','Day −1','Day 5','£180'],['2 × 1.2 kW LED','Lighting hire','Day −1','Day 5','£420'],['Drone + pilot','Aerial co.','Day 2','Day 2','£650'],['Waders ×8','Marine supply','Day −2','Day 6','£96']]),note('Insurance','Rental kit is covered under our equipment policy up to £50k. Photograph serial numbers when it arrives.',{key:'eq-ins'})]),
   column('Timeline',1060,[timeline('Rental windows',{mode:'date',start:0,days:14,items:[{ref:'eq-rent1',at:3,len:7,lane:0},{ref:'eq-rent2',at:5,len:1,lane:1},{ref:'eq-rent3',at:2,len:9,lane:2},{ref:'eq-shoot',at:4,len:4,lane:3}]}),grid(4,232,[note('Lenses & lights out','Collect on day −1 by 16:00.',{key:'eq-rent1',color:'sand'}),note('Drone day','Pilot + 1 h flight on day 2.',{key:'eq-rent2',color:'sand'}),note('Waders','Return washed, or £8 each.',{key:'eq-rent3',color:'sand'}),note('Shoot days','Four days, two locations.',{key:'eq-shoot',color:'sage'})])]),
  ]),
 ],
});

// ── Film marketing plan (date) ────────────────────────────────────────────────
film.push({
 id:'film-marketing',title:'Film marketing plan',category:'Filmmaking',also:['Marketing campaigns'],
 description:'Launch an independent film: audience, positioning, festival strategy, assets and a 16-week campaign on a calendar timeline.',
 tags:['marketing','festival','release','poster','trailer','social'],
 rows:[
  intro('Release plan — “Undertow”','From festival premiere to digital release over sixteen weeks. Small budget, specific audience, one big moment.','Start with who the film is for and the one line that sells it. Every asset and every date should serve those two cards.'),
  row([
   column('Audience & position',360,[note('Core audience','Women 25–45 who watch character-led dramas and swim outdoors. Sea-swimming clubs are our community partners.',{key:'aud'}),note('The line','*She saved everyone but herself.*',{color:'sand'}),note('Comparable titles','Character dramas with a sporting backdrop and a strong female lead; quiet coastal films that travelled on word of mouth.')]),
   column('Assets',360,[photos([['ph-mkt-poster-wall','Film posters on a wall or billboard in a city','Poster placement reference'],['ph-mkt-cinema','Cinema auditorium with red seats','Premiere screen']],1,328),task('Asset list',['Key art — portrait + landscape','Teaser (45 s) and trailer (2 min)','3 clips for press','Stills pack (20 images)','EPK: director’s statement, bios, Q&A'])]),
   column('Channels',360,[table('Mix',[['Channel','Role','Budget'],['Festivals','Credibility, press','£2,500'],['Social (organic)','Community','£0'],['Paid social','Release weekend','£4,000'],['Partners','Swim clubs, charities','£500'],['PR','Reviews, interviews','£3,000']])]),
   column('Measures',360,[table('Targets',[['Metric','Target'],['Festival selections','5'],['Trailer views (4 wks)','250k'],['Mailing list','8,000'],['Opening weekend screens','40'],['Digital rentals (90 days)','20,000']]),note('Review','Every two weeks, compare against targets and move budget to what works.')]),
  ]),
  row([single(1560,timeline('Sixteen-week campaign',{mode:'date',days:112,items:[{ref:'mk1',at:0,len:21,lane:0},{ref:'mk2',at:14,len:7,lane:1},{ref:'mk3',at:21,len:5,lane:2},{ref:'mk4',at:28,len:42,lane:0},{ref:'mk5',at:56,len:14,lane:1},{ref:'mk6',at:70,len:3,lane:2},{ref:'mk7',at:73,len:39,lane:0}]}))]),
  row([grid(7,208,[
   note('Build-up','Key art, teaser, mailing list sign-ups.',{key:'mk1'}),note('Teaser drops','Release with partner swim clubs.',{key:'mk2'}),note('Festival premiere','Q&A, press junket, first reviews.',{key:'mk3',color:'sand'}),note('Festival run','Five festivals; collect quotes and laurels.',{key:'mk4'}),note('Trailer & tickets','Trailer, cinema bookings open.',{key:'mk5'}),note('Release weekend','Q&A tour, paid social peak.',{key:'mk6',color:'sand'}),note('Digital & long tail','Rentals, community screenings.',{key:'mk7'}),
  ],{gap:16})]),
 ],
});

// ── One-day documentary (timecode as clock time) ──────────────────────────────
film.push({
 id:'one-day-doc',title:'One-day documentary',category:'Filmmaking',also:['Content creation'],
 description:'Plan a short documentary shot in a single day: story question, subject, interview, observational scenes, B-roll and a clock-time schedule.',
 tags:['documentary','interview','b-roll','one day','schedule'],
 rows:[
  intro('One-day doc — “The Last Bakery on Mill Street”','A 6-minute portrait of a baker in her last week before closing. One day, crew of three, from the 4 a.m. bake to closing time.','Write the question the film answers first. Plan the interview and the scenes you must witness, then fit them to the clock — the day will not wait.'),
  row([
   column('Story',340,[note('The question','What do you lose when a neighbourhood loses its bakery?'),note('Subject','**June, 68.** Third generation. Wry, unsentimental, up at 3:30 every day for 41 years.'),note('Shape','Dark to light: the empty street at 4 a.m. → the queue at 8 → the last customer at 5 p.m. → June turning off the ovens.')]),
   column('Interview',340,[task('Questions (in order)',['What does the street sound like at 4 a.m.?','Who was your first customer — do you remember?','What will you miss that nobody would guess?','What happens to the ovens?','What will you do on Monday morning?']),note('Set-up','Back room, flour sacks behind. One camera, 50 mm; second angle on a 85 mm locked off. Lav + boom.')]),
   column('Must-see scenes',340,[photos([['ph-doc-bakery','Small traditional bakery shopfront in the early morning','The shop at dawn'],['ph-doc-bread','Hands shaping bread dough on a floured table','Hands in the dough']],1,308)]),
   column('B-roll',340,[task('B-roll list',['Ovens opening — steam','Regulars in the queue','The till and handwritten price cards','The street waking up','Closing sign in the window'])]),
  ]),
  row([single(1480,timeline('The day — clock time',{mode:'timecode',fps:'25',start:'03:00:00:00',end:'19:00:00:00',items:[{ref:'d1',at:'03:30:00:00',out:'06:00:00:00'},{ref:'d2',at:'07:00:00:00',out:'09:30:00:00',lane:1},{ref:'d3',at:'10:00:00:00',out:'11:30:00:00',lane:2},{ref:'d4',at:'12:00:00:00',out:'13:00:00:00'},{ref:'d5',at:'13:00:00:00',out:'16:30:00:00',lane:1},{ref:'d6',at:'17:00:00:00',out:'18:00:00:00',lane:2}]}))]),
  row([grid(6,232,[note('The bake','Observational, available light only.',{key:'d1',color:'sand'}),note('Morning rush','Queue, regulars, vox pops.',{key:'d2'}),note('Interview','In the back room, 75 min.',{key:'d3',color:'sky'}),note('Crew lunch','Back up the cards.',{key:'d4'}),note('Afternoon','B-roll list, street, details.',{key:'d5'}),note('Closing','Last customer; ovens off.',{key:'d6',color:'sand'})],{gap:16})]),
 ],
});

// ── TVC storyboard (timecode, :30) ────────────────────────────────────────────
const tvc=[
 ['01','Wide: a rainy commuter platform, everyone hunched.',S.wide({figures:3,x:0.3}),'00:00:00:00','00:00:04:00','SFX: rain, train announcement'],
 ['02','Medium: our hero opens a bright yellow umbrella.',S.medium({}),'00:00:04:00','00:00:08:00','SFX: umbrella snaps open'],
 ['03','Track: the umbrella floats along the platform; others look up.',S.withMove(S.street({people:3}),'track'),'00:00:08:00','00:00:15:00','Music in: piano, light'],
 ['04','Close: a stranger smiles back.',S.close({}),'00:00:15:00','00:00:19:00','VO: “Some days need a little colour.”'],
 ['05','Wide: umbrellas open everywhere, one after another.',S.withMove(S.wide({figures:5,x:0.15}),'push'),'00:00:19:00','00:00:25:00','Music swells'],
 ['06','Pack shot and line.',S.product('BRELLA'),'00:00:25:00','00:00:30:00','VO: “Brella. Rain, brighter.”'],
];
film.push({
 id:'tvc-storyboard',title:'TVC advertising storyboard',category:'Storyboards',also:['Agencies','Filmmaking'],
 description:'A 30-second commercial frame by frame, with VO, SFX and music cues, timed on a 25 fps timecode ruler that adds up to exactly :30.',
 tags:['tvc','commercial','advertising','storyboard',':30','timecode'],
 rows:[
  intro('“Rain, brighter” — :30 TVC','Six frames for a fictional umbrella brand. The ruler is the spot: every frame’s length is its screen time, and the whole thing must land on 00:00:30:00.','Keep the board in client-ready order. Audio lives under each frame. When the client asks for a :15, duplicate the board and cut frames on the ruler until it fits.'),
  row([grid(6,340,tvc.map(([n,a,comp,,,snd])=>stack(340,[panel(`Frame ${n}`,comp,{card:{key:'tv'+n}}),note(`${n} — picture & sound`,`${a}\n\n**Audio:** ${snd}`,{color:'plain'})],{gap:10})),{gap:20})]),
  row([single(2140,timeline(':30 — 25 fps',{mode:'timecode',fps:'25',start:'00:00:00:00',end:'00:00:30:00',items:tvc.map(([n,,,at,out])=>({ref:'tv'+n,at,out}))},{h:230}))]),
  row([
   column('Script',520,[note('VO script','*Some days need a little colour.* … *Brella. Rain, brighter.*\n\nRead: warm, amused, unhurried. 12 words in 30 seconds.')]),
   column('Mandatories',520,[task('Client mandatories',['Logo on screen ≥ 3 s','Product visible in 4 of 6 frames','Legal super: “Fictional brand — sample board”','Clearance for station location'])]),
   column('Cut-downs',520,[table('Versions',[['Version','Frames','Use'],[':30','01–06','TV, cinema'],[':15','02, 03, 05, 06','Pre-roll'],[':06','02, 06','Bumper']])]),
   column('Production notes',500,[note('Shoot','One day, one location (heritage railway station). Rain towers + 40 extras. Hero umbrella ×6 identical.')]),
  ]),
 ],
});

export default film;

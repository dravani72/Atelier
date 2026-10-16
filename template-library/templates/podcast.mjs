import {note,task,photo,link,heading,sticky,table,file,timeline,column,stack,grid,single,row} from '../lib/dsl.mjs';
import {palette,typeSpecimen,chart} from '../lib/assets.mjs';
import {intro,photos} from '../lib/kit.mjs';

const t=[];
const SHOW='Small Hours';

// ── Podcast show plan ─────────────────────────────────────────────────────────
t.push({
 id:'podcast-show-plan',title:'Podcast show plan',category:'Podcasting',
 description:'Define a show before episode one: premise, audience, format, segments, hosts, artwork, release rhythm and distribution.',
 tags:['podcast','show','format','audience','launch'],
 rows:[
  intro(`${SHOW} — show plan`,'A weekly interview show with people who work while the rest of us sleep: bakers, nurses, tug pilots, astronomers.','Lock the premise and the format before you book guests. A listener should be able to describe the show in one sentence after one episode.'),
  row([
   column('Premise',340,[note('One line','Conversations with night workers about what the world looks like at 3 a.m.',{color:'sand'}),note('Why now','Night work is invisible and growing. The guests are warm, funny and never asked about their jobs.'),photo('ph-pod-night-city','City skyline at night with few lights on',{ratio:0.6,title:'The world of the show'})]),
   column('Audience',340,[note('For','Insomniacs, shift workers and curious listeners who like slow, human radio. Listens on headphones, late, alone.'),note('Comparable shows','Long-form interview shows with a strong sense of place; late-night radio phone-ins.')]),
   column('Format',360,[table('Running order',[['Segment','Length'],['Cold open — a sound from the guest’s night','1 min'],['Intro','1 min'],['The shift — interview, part 1','18 min'],['3 a.m. — the strangest night','8 min'],['Daylight — what they miss','6 min'],['Outro + next week','2 min']]),note('Length','~36 minutes. Weekly, Tuesdays at 23:00.')]),
   column('Hosts & sound',340,[note('Host','One host, warm and curious, with a radio background. Never interrupts a pause.'),note('Sound','Recorded on location at night where possible. Field ambience under the intro. Theme: solo piano, slow.')]),
   column('Identity',360,[palette('Artwork palette',[['#0b1a2e','Midnight',2],['#f3c969','Lamp light',1],['#e8e4da','Paper',1]]),typeSpecimen('Instrument Serif',SHOW,{role:'Wordmark',size:110,bg:'#0b1a2e',ink:'#f3c969'})]),
  ]),
  row([
   column('Distribution',520,[task('Launch checklist',['Host on a podcast platform with RSS','Submit to Apple, Spotify, YouTube','Trailer episode (2 min) live 2 weeks before','Three episodes at launch','Show notes template','Transcripts for every episode'])]),
   column('First season — 10 guests',700,[table('Guests',[['#','Guest','Status'],['1','Night baker','Recorded'],['2','ICU nurse','Booked'],['3','Tug pilot','Booked'],['4','Observatory astronomer','Approached'],['5','Taxi dispatcher','Approached'],['6','Radio DJ','Idea']])]),
   column('Measures',520,[table('Targets — season 1',[['Metric','Target'],['Downloads / episode (30 days)','1,500'],['Completion rate','60%'],['Ratings','50'],['Newsletter sign-ups','800']])]),
  ]),
 ],
});

// ── Podcast episode plan ──────────────────────────────────────────────────────
t.push({
 id:'podcast-episode-plan',title:'Podcast episode plan',category:'Podcasting',
 description:'Plan one episode from idea to publish: guest, angle, research, outline, recording logistics and release tasks on a two-week calendar.',
 tags:['podcast','episode','guest','planning'],
 rows:[
  intro(`${SHOW} · Ep. 3 — the tug pilot`,'Guest: a harbour tug pilot who guides container ships into port at night. Record on the boat if the harbour allows it.','Fill the angle before the research — it stops the episode becoming a job description. Move cards on the calendar as the recording date firms up.'),
  row([
   column('Guest',320,[note('Who','**Maggie R.**, 52. Tug pilot for 19 years, one of four women doing the job in the port.'),photo('ph-pod-tugboat','Tugboat in a harbour at night or dusk',{ratio:0.62,title:'Her tug'})]),
   column('Angle',320,[note('The episode is about','Steering something 400 times your size by feel — and what that does to how you see the world.',{color:'sand'}),note('Avoid','A list of ship sizes and engine specs. Use one number, the most astonishing one.')]),
   column('Research',320,[link('How tugboats work','https://en.wikipedia.org/wiki/Tugboat','Types, bollard pull, escort work.'),note('Pre-interview notes','Calls the ships “the big girls”. Once spent 11 hours holding a ship off a pier in a storm. Hates the word “brave”.')]),
   column('Outline',340,[task('Outline',['Cold open: the horn, 2 a.m.','How she got here','A normal night, minute by minute','The storm night','What daylight people get wrong','What she’ll do when she stops'])]),
   column('Recording',340,[table('Logistics',[['','Plan'],['Where','On the tug, then the crew room'],['When','Night shift, Thu 22:00'],['Kit','2 lav mics, recorder, deadcats'],['Safety','Lifejackets, harbour approval'],['Backup','Crew room only, if weather']])]),
  ]),
  row([single(1780,timeline('Two weeks to release',{mode:'date',days:14,items:[{ref:'pe1',at:0,len:2},{ref:'pe2',at:3,len:1,lane:1},{ref:'pe3',at:4,len:4},{ref:'pe4',at:8,len:2,lane:1},{ref:'pe5',at:10,len:1,lane:2},{ref:'pe6',at:12,len:1}]}))]),
  row([grid(6,282,[note('Research + pre-interview','',{key:'pe1'}),note('Record on the tug','',{key:'pe2',color:'sand'}),note('Edit','Rough cut 50 min → 36.',{key:'pe3'}),note('Mix + music','',{key:'pe4'}),note('Show notes, transcript, artwork','',{key:'pe5'}),note('Release Tue 23:00','',{key:'pe6',color:'sage'})],{gap:18})]),
 ],
});

// ── Podcast episode research ──────────────────────────────────────────────────
t.push({
 id:'podcast-research',title:'Podcast episode research',category:'Podcasting',also:['Creative writing'],
 description:'Compare sources side by side, collect quotes and facts, and map the connections that will become the episode’s questions.',
 tags:['research','sources','podcast','interview prep'],
 rows:[
  intro('Research — the ICU nurse (Ep. 2)','Background for an interview with a night-shift intensive-care nurse. Sensitive subject: be precise, be kind.','Sources on the left, what we learned in the middle, the questions they lead to on the right. Draw a connector from a fact to the question it inspires.'),
  row([
   column('Sources',360,[link('Night shift work — health research overview','https://en.wikipedia.org/wiki/Shift_work','Circadian disruption, sleep, long-term effects.',{key:'src1'}),link('Intensive care medicine','https://en.wikipedia.org/wiki/Intensive_care_medicine','Ratios, roles, what a night looks like.',{key:'src2'}),note('Pre-interview call','45 minutes with the guest. She’d like to talk about the families more than the patients.',{key:'src3',color:'sand'})]),
   column('What we learned',380,[note('Ratios','One nurse to one or two patients in ICU — every hour is hands-on.',{key:'f1'}),note('The 4 a.m. dip','Staff describe the hour before dawn as the hardest: bodies want sleep, patients often deteriorate.',{key:'f2'}),note('Families','Relatives often arrive at night after a call. Nurses are the first face they see.',{key:'f3'})]),
   column('Questions it leads to',380,[note('Q','What happens to your body at 4 a.m. — and to the ward?',{key:'q1',color:'sky'}),note('Q','What do you say to a family that has just arrived?',{key:'q2',color:'sky'}),note('Q','What does a good night look like?',{key:'q3',color:'sky'})]),
   column('Atmosphere',360,[photos([['ph-pod-hospital-corridor','Empty hospital corridor at night with dim lighting','The corridor at 4 a.m.']],1,328),note('Sound to record','Monitors, the ward door, a kettle in the staff room — with permission and no patient audio.')]),
  ]),
 ],
 edges:[['src1','f2'],['src2','f1'],['src3','f3'],['f2','q1'],['f3','q2'],['f1','q3']],
});

// ── Podcast outline ───────────────────────────────────────────────────────────
t.push({
 id:'podcast-outline',title:'Podcast outline',category:'Podcasting',
 description:'Order talking points into segments with transitions, timings and must-ask questions, ready for the recording.',
 tags:['outline','talking points','segments','podcast'],
 rows:[
  intro('Outline — Ep. 4, the astronomer','Guest runs the night programme at a mountain observatory. Target 36 minutes; record ~60.','Three segments, each with an opening question, follow-ups and a way out. The bold question in each segment must be asked even if the conversation wanders.'),
  row([
   column('Cold open + intro',340,[note('Cold open','Guest describes the moment the dome opens. Use the sound of the motors under it.'),note('Intro script','“Tonight, someone whose working day starts when the sun goes down and ends when it threatens to come back…”')]),
   column('1 · The shift (18 min)',380,[task('Questions',['**Walk me through tonight, from arrival.**','What do you do while the telescope is working?','Who else is awake on the mountain?','What does cloud do to your mood?']),note('Transition','“So when does something strange happen?”',{color:'sand'})]),
   column('2 · 3 a.m. (8 min)',380,[task('Questions',['**Tell me about the strangest night.**','Have you ever seen something you couldn’t explain?','Is it lonely?']),note('Transition','“And when you come down the mountain in daylight…”',{color:'sand'})]),
   column('3 · Daylight (6 min)',380,[task('Questions',['**What do daylight people get wrong about the night?**','What do you miss?','What would you tell someone starting night work?'])]),
   column('Close',340,[note('Outro','Thank the guest, tease next week (taxi dispatcher), ask for a review.'),photo('ph-pod-observatory','Astronomical observatory dome at night with stars',{ratio:0.66,title:'The observatory'})]),
  ]),
 ],
});

// ── Podcast episode script (timecode) ─────────────────────────────────────────
const ps=[
 ['Cold open','SFX: dome motors. GUEST: “The first ten minutes, you just stand there and let your eyes get used to it.”','00:00:00:00','00:01:00:00',0],
 ['Theme + intro','MUSIC: theme, 20 s. HOST intro over the bed.','00:01:00:00','00:02:00:00',1],
 ['Segment 1 — the shift','Interview. Mark the clean answer about the telescope at ~12 min for the trailer.','00:02:00:00','00:20:00:00',0],
 ['Mid-roll','HOST read: newsletter + listener note.','00:20:00:00','00:21:00:00',2],
 ['Segment 2 — 3 a.m.','Interview. Under the ghost story: drop music out completely.','00:21:00:00','00:29:00:00',0],
 ['Segment 3 — daylight','Interview, ends on her advice.','00:29:00:00','00:35:00:00',0],
 ['Outro','MUSIC: theme. HOST: thanks, next week, review ask.','00:35:00:00','00:36:30:00',1],
];
t.push({
 id:'podcast-script',title:'Podcast episode script',category:'Podcasting',also:['Storyboards'],
 description:'A running order for the edit: narration, interview segments, music beds and sound effects, laid out on a timecode ruler.',
 tags:['script','running order','podcast','timecode','edit'],
 rows:[
  intro('Script & running order — Ep. 4','The edit plan. The ruler is the episode; drag segments to rebalance before the mix.','Lane 1 is speech, lane 2 is music, lane 3 is ads and reads. Timings come from the paper edit; tighten the interview until it fits 36:30.'),
  row([single(2000,timeline('Episode — 25 fps',{mode:'timecode',fps:'25',start:'00:00:00:00',end:'00:37:00:00',items:ps.map(([n,,at,out,lane],i)=>({ref:'ps'+i,at,out,lane}))}))]),
  row([grid(7,270,ps.map(([n,d],i)=>note(n,d,{key:'ps'+i,color:i===3?'rose':i===1||i===6?'sand':'paper'})),{gap:18,even:false})]),
  row([
   column('Narration — intro',640,[note('HOST','Tonight on Small Hours: someone whose working day starts when the sun goes down. She has spent eleven winters on a mountain, waiting for clouds to move, listening to a telescope think. She’s seen satellites die and stars be born — or at least, the light from them. Let’s go up the mountain.')]),
   column('Music & SFX cues',640,[table('Cues',[['Time','Cue','Note'],['00:00','SFX dome motors','From the guest’s recording'],['01:00','Theme in','20 s, then under'],['21:00','Bed out','Silence under the story'],['35:00','Theme','Full to the end']])]),
   column('Mix notes',600,[note('Loudness','−16 LUFS integrated, −1 dBTP. Interview levelled; room tone filled between answers.')]),
  ]),
 ],
});

// ── Podcast schedule (date) ───────────────────────────────────────────────────
t.push({
 id:'podcast-schedule',title:'Podcast schedule',category:'Podcasting',
 description:'Manage a season’s production pipeline on a calendar: booking, recording, editing and release for every episode, plus promotion after publish.',
 tags:['schedule','season','pipeline','release','promotion'],
 rows:[
  intro(`${SHOW} — season 1 schedule`,'Six weeks, four episodes in different stages at once. Release every Tuesday.','Each episode is a row of stages. Keep two episodes recorded ahead of release so a cancellation never breaks the schedule.'),
  row([single(2100,timeline('Season pipeline',{mode:'date',days:42,items:[
   {ref:'e1r',at:0,len:2,lane:0},{ref:'e1e',at:2,len:5,lane:0},{ref:'e1p',at:8,len:1,lane:0},
   {ref:'e2r',at:5,len:2,lane:1},{ref:'e2e',at:8,len:5,lane:1},{ref:'e2p',at:15,len:1,lane:1},
   {ref:'e3r',at:12,len:2,lane:2},{ref:'e3e',at:15,len:5,lane:2},{ref:'e3p',at:22,len:1,lane:2},
   {ref:'e4r',at:19,len:2,lane:3},{ref:'e4e',at:22,len:5,lane:3},{ref:'e4p',at:29,len:1,lane:3},{ref:'promo',at:8,len:28,lane:4}]},{lane:58}))]),
  row([
   column('Ep. 1 — night baker',400,[note('Record','Bakery, 03:00.',{key:'e1r'}),note('Edit + mix','',{key:'e1e'}),note('Release','Tue 23:00',{key:'e1p',color:'sage'})]),
   column('Ep. 2 — ICU nurse',400,[note('Record','Her kitchen, after a shift.',{key:'e2r'}),note('Edit + mix','Sensitive — guest hears the cut first.',{key:'e2e'}),note('Release','',{key:'e2p',color:'sage'})]),
   column('Ep. 3 — tug pilot',400,[note('Record','On the tug.',{key:'e3r'}),note('Edit + mix','',{key:'e3e'}),note('Release','',{key:'e3p',color:'sage'})]),
   column('Ep. 4 — astronomer',400,[note('Record','Remote — double-ender.',{key:'e4r'}),note('Edit + mix','',{key:'e4e'}),note('Release','',{key:'e4p',color:'sage'})]),
   column('After publish',380,[note('Promotion window','Clips, newsletter, guest shares.',{key:'promo',color:'rose'}),task('For every episode',['3 audiograms for social','Guest gets share kit + quote card','Transcript published','Newsletter item','Reply to listener mail'])]),
  ]),
 ],
});

export default t;

import {note,task,photo,link,heading,sticky,shape,table,file,boardCard,timeline,column,stack,grid,single,place,row} from '../lib/dsl.mjs';
import {palette,swatch,typeSpecimen,panel,sk,drawing,chart} from '../lib/assets.mjs';
import {intro,swatches,photos,notes} from '../lib/kit.mjs';
import * as S from '../lib/scenes.mjs';

const t=[];
const CH='Fix & Mend';

// ── YouTube channel plan ──────────────────────────────────────────────────────
t.push({
 id:'youtube-channel-plan',title:'YouTube channel plan',category:'Content creation',
 description:'Set a channel’s promise, audience, content pillars, formats, publishing rhythm and goals before the first upload.',
 tags:['youtube','channel','strategy','audience','pillars'],
 rows:[
  intro(`${CH} — channel plan`,'A repair-and-reuse channel: fixing everyday things instead of replacing them. One long video a week, three Shorts.','Fill the promise and the audience first — every other decision on this board should be checked against them. Revisit the goals every quarter.'),
  row([
   column('The promise',340,[note('In one sentence','Every week, we fix one thing you were about to throw away — and show you how to fix it yourself in under an hour.',{color:'sand'}),note('Why us','Twenty years of repair-café experience. Calm, clear, no sponsorship of new products.'),note('Channel name & handle',`**${CH}** · @fixandmend — available on YouTube, Instagram and TikTok.`)]),
   column('Audience',340,[note('Who','Renters and first-time homeowners, 22–40, mildly handy, environmentally minded, short on money and time.'),note('What they search','“how to fix…”, “why does my … keep…”, “is it worth repairing…”'),photo('ph-yt-repair-bench','Workbench with hand tools and an item being repaired',{ratio:0.62,title:'The world of the channel'})]),
   column('Content pillars',360,[grid(1,328,[note('1 · The weekly fix','A full repair start to finish: zip, kettle, chair leg, phone screen. 12–18 min.',{color:'sky'}),note('2 · Worth fixing?','Cost of repair vs replacement, with real numbers. 8–10 min.',{color:'sage'}),note('3 · Tool school','One tool, five uses. 6–8 min, evergreen.',{color:'sand'}),note('Shorts','The satisfying moment from each fix, plus a one-line tip. 3 per week.',{color:'rose'})],{gap:12})]),
   column('Brand',340,[palette('Channel colours',[['#2f4858','Workshop',2],['#f6ae2d','Brass',1],['#f2f0e9','Bench paper',2],['#86bbd8','Blueprint',1]]),typeSpecimen('Archivo Black','FIXED.',{role:'Thumbnail type',size:120}),note('Thumbnails','Before/after split, one object, three words max. Face only when the expression tells the story.')]),
   column('Goals — 12 months',340,[table('Targets',[['Metric','Q1','Q4'],['Subscribers','1,000','25,000'],['Avg view duration','40%','50%'],['Uploads (long)','13','52'],['Email list','300','4,000'],['Monthly revenue','£0','£1,500']]),note('What success feels like','Viewers send us photos of things they fixed. That is the metric we actually care about.',{color:'sage'})]),
  ]),
  row([
   column('Publishing rhythm',720,[table('Week',[['Day','What','Where'],['Mon','Shorts #1','YT, IG, TikTok'],['Wed','Shorts #2','YT, IG, TikTok'],['Thu 17:00','Long video','YouTube'],['Thu','Community post + newsletter','YT, email'],['Sat','Shorts #3','YT, IG, TikTok']])]),
   column('Monetisation',520,[task('Revenue steps',['Partner programme (1k subs, 4k hours)','Affiliate links for tools we actually use','Repair kits — own product, Q3','Workshops at local repair cafés','No sponsorships from fast-fashion or disposable brands'])]),
   column('Risks',520,[note('Burnout','One long video a week is a lot for two people. Batch-film two fixes per shoot day.',{color:'rose'}),note('Safety','Electrical repairs carry a clear warning and we never open mains appliances on camera without an isolation step.',{color:'rose'})]),
  ]),
 ],
});

// ── YouTube video plan ────────────────────────────────────────────────────────
t.push({
 id:'youtube-video-plan',title:'YouTube video plan',category:'Content creation',
 description:'Plan one video end to end — idea, hook, research, script beats, shots, packaging and publishing tasks — with the production week on a calendar.',
 tags:['youtube','video','planning','thumbnail','production'],
 rows:[
  intro('Video plan — “Fixing a zip so it never splits again”','Episode 14 of the weekly fix. Target 14 minutes, publish Thursday 17:00.','Work left to right: idea, research, script, shoot, packaging, publish. Tick tasks as they’re done; the timeline shows the week.'),
  row([
   column('Idea',320,[note('Why this video','Zips are the #1 reason jackets get binned (repair-café data). High search volume, low competition for a *proper* fix.'),note('Viewer payoff','By the end, you can replace a slider in ten minutes with pliers and a £2 part.',{color:'sand'})]),
   column('Hook (first 15 s)',320,[note('Hook','Cold open: a zip splitting open on a £180 coat. “This is the moment most people buy a new coat. Give me ten minutes.”'),panel('Opening frame',S.insert('ZIP'),{label:'00:00 — cold open'})]),
   column('Research',320,[link('Slider sizes explained','https://en.wikipedia.org/wiki/Zipper','Sizes #3, #5, #8 and how to read them.'),note('Facts to check','- Why sliders wear (the jaws spread)\n- Coil vs moulded vs metal teeth\n- When a zip *can’t* be saved'),photos([['ph-yt-zip','Close-up of a metal zipper on a jacket','Zip detail']],1,288)]),
   column('Script beats',360,[task('Beats',['x Cold open — the split','x Why zips fail (30 s, animated)','Diagnose: teeth or slider?','Fix A: squeeze the slider','Fix B: replace the slider','Fix C: when to give up','Outro: send us your fix'])]),
   column('Packaging',340,[note('Title options','1. **Your zip isn’t broken (it’s the slider)**\n2. Fix any zip in 10 minutes\n3. Stop throwing away coats'),note('Thumbnail','Split coat, big hand holding pliers, text: “10 MIN FIX”.'),photo('ph-yt-thumb-ref','Hands holding pliers repairing clothing',{ratio:0.56,title:'Thumbnail reference'})]),
   column('Publish',320,[task('Publish checklist',['Chapters in the description','Parts list with links','End screen → “Worth fixing?” series','Pinned comment question','Shorts cut from Fix A','Newsletter + community post'])]),
  ]),
  row([single(2120,timeline('Production week',{mode:'date',days:7,items:[{ref:'yp1',at:0,len:1},{ref:'yp2',at:1,len:1,lane:1},{ref:'yp3',at:2,len:1},{ref:'yp4',at:2,len:2,lane:1},{ref:'yp5',at:3,len:1,lane:2},{ref:'yp6',at:3,len:1,lane:0}]}))]),
  row([grid(6,338,[note('Mon — script','Final draft + parts ordered.',{key:'yp1'}),note('Tue — shoot','Two set-ups: bench and macro.',{key:'yp2',color:'sand'}),note('Wed — edit','First assembly by 18:00.',{key:'yp3'}),note('Wed–Thu — graphics','Slider animation, captions.',{key:'yp4'}),note('Thu — thumbnail','A/B test two versions.',{key:'yp5',color:'rose'}),note('Thu 17:00 — publish','Schedule + reply to comments for 1 h.',{key:'yp6',color:'sage'})],{gap:18})]),
 ],
});

// ── YouTube video research ────────────────────────────────────────────────────
t.push({
 id:'youtube-video-research',title:'YouTube video research',category:'Content creation',
 description:'Collect facts, sources, quotes, images and competitor videos for one episode, and keep track of what has been verified.',
 tags:['research','sources','fact-check','youtube'],
 rows:[
  intro('Research — “Is it worth repairing a 10-year-old washing machine?”','Episode for the Worth fixing? series. Every number on screen must trace back to a card on this board.','One card per source. Mark a fact sage when it is verified by two sources, rose if it is disputed. Nothing goes in the script without a source card.'),
  row([
   column('Key questions',320,[task('Answer these',['What breaks most often? (bearings, pump, PCB)','Typical repair costs vs a new machine','Energy use: old vs new A-rated','Lifespan of a repaired machine','What the right-to-repair rules require'])]),
   column('Sources',360,[link('Right to repair — background','https://en.wikipedia.org/wiki/Right_to_repair','Overview of laws and spare-part obligations.'),link('Energy labels','https://en.wikipedia.org/wiki/European_Union_energy_label','How the rescaled A–G label works.'),note('Repair-café logbook','Our own data: 214 washing machines seen, 61% repaired, median parts cost £34.',{color:'sage'})]),
   column('Facts',360,[note('Verified','Drum bearing replacement: 2–3 h, parts £25–60.',{color:'sage'}),note('Verified','A new mid-range machine: £350–450.',{color:'sage'}),note('Disputed','“New machines only last 7 years” — anecdotal; two sources disagree.',{color:'rose'}),note('To check','Water use per cycle: old vs new.',{color:'sand'})]),
   column('Visual material',360,[photos([['ph-yt-washing-machine','Front-loading washing machine in a home','B-roll: the machine'],['ph-yt-laundrette','Row of washing machines in a laundromat','Context: lifespan of commercial machines']],1,328)]),
   column('Competitor videos',360,[table('What’s out there',[['Video','Views','Gap we fill'],['Generic “fix your washer”','1.2M','No cost comparison'],['Bearing replacement','430k','Too technical'],['“Should you repair?” vlog','90k','No data']]),note('Our angle','The only video with real repair-café numbers and a decision chart.')]),
  ]),
  row([
   column('Quotes',700,[note('Repair-café volunteer','“Most machines that come in just need a pump filter cleaned. People are shocked.”'),note('Appliance engineer','“If the drum spider is cracked, it’s game over — don’t pay for a bearing job.”')]),
   column('Data for the decision chart',1080,[chart('Repair vs replace — total 5-year cost (£)','bar',['Repair bearing','Repair pump','Replace PCB','New machine'],[{name:'Up-front',values:[160,90,220,420]},{name:'Energy, 5 yrs',values:[310,310,310,240]}],{card:{title:'Draft chart — 5-year cost'}})]),
  ]),
 ],
});

// ── YouTube video brainstorm ──────────────────────────────────────────────────
t.push({
 id:'youtube-video-brainstorm',title:'YouTube video brainstorm',category:'Content creation',also:['Brainstorming'],
 description:'Generate and sort video ideas by pillar, score them on search, effort and fit, and move the winners into production.',
 tags:['ideas','brainstorm','youtube','backlog'],
 rows:[
  intro('Idea bank — Fix & Mend','Every idea goes here first. Once a month we score the backlog and promote the top three into video plans.','Write ideas as titles a viewer would click. Score 1–5 on search demand, effort (5 = easy) and fit with the promise.'),
  row([
   column('The weekly fix',340,[sticky('Fix a wobbly IKEA chair for good','',{color:'sky'}),sticky('Re-sole trainers with £8 of glue','',{color:'sky'}),sticky('Fix a cracked phone screen protector vs screen','',{color:'sky'}),sticky('Restore a rusty cast-iron pan','',{color:'sky'})]),
   column('Worth fixing?',340,[sticky('Is a 5-year-old laptop worth a new battery?','',{color:'sage'}),sticky('Re-upholster or replace a sofa?','',{color:'sage'}),sticky('Phone repair: the honest maths','',{color:'sage'})]),
   column('Tool school',340,[sticky('One multimeter, five fixes','',{color:'sand'}),sticky('The only three screwdrivers you need','',{color:'sand'}),sticky('Glue guide: which glue for what','',{color:'sand'})]),
   column('Wild cards',340,[sticky('Fix everything in a charity-shop basket for £20','',{color:'rose'}),sticky('A viewer sends us their broken thing','',{color:'rose'}),photos([['ph-yt-charity-shop','Second-hand charity shop interior with household items','Charity-shop challenge']],1,308)]),
   column('Scoring',520,[table('Top of the backlog',[['Idea','Search','Effort','Fit','Total'],['Fix a wobbly chair','5','4','5','14'],['Glue guide','4','5','4','13'],['£20 charity-shop basket','3','2','5','10'],['Laptop battery','4','3','4','11']]),task('Promote to production',['Fix a wobbly chair → plan ep. 15','Glue guide → plan ep. 16'])]),
  ]),
 ],
});

// ── YouTube video script (timecode) ───────────────────────────────────────────
const yScript=[
 ['Cold open','A zip splits open on a £180 coat. “This is the moment most people buy a new coat. Give me ten minutes.”','Macro, slow motion','00:00:00:00','00:00:15:00',0],
 ['Title + intro','Logo sting. “I’m Ruth, this is Fix & Mend.” One line on today’s fix.','Bench wide','00:00:15:00','00:00:35:00',0],
 ['Why zips fail','Animated slider: the jaws spread, teeth stop meeting.','Animation','00:00:35:00','00:01:20:00',1],
 ['Diagnose','Teeth missing? Then it’s a new zip. Teeth fine? It’s the slider.','Macro on teeth','00:01:20:00','00:02:30:00',0],
 ['Fix A — squeeze','Pliers, gentle squeeze on both sides of the slider. Test. Repeat.','Overhead + macro','00:02:30:00','00:05:00:00',0],
 ['Fix B — replace slider','Remove top stop, swap slider, crimp new stop.','Overhead + macro','00:05:00:00','00:10:30:00',0],
 ['Fix C — give up gracefully','When teeth are gone: take it to a tailor; what it costs.','Bench wide','00:10:30:00','00:12:00:00',1],
 ['Outro + CTA','“Send us a photo of your fix.” End screen to the next video.','Bench wide','00:12:00:00','00:13:00:00',0],
];
t.push({
 id:'youtube-video-script',title:'YouTube video script',category:'Content creation',
 description:'Script a video section by section with talking points, visual cues and B-roll, timed on a timecode ruler so the edit lands on length.',
 tags:['script','youtube','talking points','timecode','b-roll'],
 rows:[
  intro('Script — “Your zip isn’t broken (it’s the slider)”','Target 13 minutes. Each section is a card with what is said and what is seen; the ruler shows how long each one runs.','Write talking points, not paragraphs — it keeps delivery natural. Put visual cues in italics. If a section grows on the ruler, cut something from the next one.'),
  row([single(2160,timeline('Running order — 25 fps',{mode:'timecode',fps:'25',start:'00:00:00:00',end:'00:13:30:00',items:yScript.map(([n,,,at,out,lane],i)=>({ref:'ys'+i,at,out,lane}))}))]),
  row([grid(8,256,yScript.map(([n,say,see],i)=>note(n,`${say}\n\n*Visual: ${see}*`,{key:'ys'+i,color:i===0||i===7?'sand':'paper'})),{gap:16,even:false})]),
  row([
   column('B-roll list',520,[task('Capture',['Coat zip splitting (slow motion, 3 takes)','Slider close-up, before/after','Parts laid out flat-lay','Hands crimping a top stop','Finished coat on a hanger'])]),
   column('On-screen text',520,[note('Supers','00:00:10 — “£180 coat”\n00:02:35 — “Fix A: 2 minutes”\n00:05:05 — “Fix B: 10 minutes, £2 part”\n00:10:35 — “Tailor: £15–30”')]),
   column('Delivery notes',520,[note('Tone','Calm and certain. Smile on the cold open line. Slow down on the steps; the viewer is following along with pliers in hand.')]),
   column('Links for the description',520,[note('Chapters','00:00 Intro · 00:35 Why zips fail · 01:20 Diagnose · 02:30 Squeeze · 05:00 Replace · 10:30 When to give up')]),
  ]),
 ],
});

// ── YouTube video schedule (date) ─────────────────────────────────────────────
t.push({
 id:'youtube-video-schedule',title:'YouTube video schedule',category:'Content creation',also:['Marketing campaigns'],
 description:'A month of uploads on a calendar timeline: production stages for each video, Shorts, newsletters and the announcement checklist.',
 tags:['schedule','calendar','publishing','youtube','shorts'],
 rows:[
  intro('Upload schedule — next four weeks','Four long videos, twelve Shorts, four newsletters. Each video moves script → shoot → edit → publish.','Drag a video’s bars on the calendar when a shoot slips; everything downstream should move with it. Tick the announcement checklist on publish day.'),
  row([single(2120,timeline('Four weeks',{mode:'date',days:28,items:[
   {ref:'v1',at:0,len:4,lane:0},{ref:'v1p',at:3,len:1,lane:1},{ref:'v2',at:7,len:4,lane:0},{ref:'v2p',at:10,len:1,lane:1},{ref:'v3',at:14,len:4,lane:0},{ref:'v3p',at:17,len:1,lane:1},{ref:'v4',at:21,len:4,lane:0},{ref:'v4p',at:24,len:1,lane:1},
   {ref:'sh',at:0,len:28,lane:2},{ref:'nl',at:3,len:1,lane:3},{ref:'nl2',at:17,len:1,lane:3},{ref:'coll',at:12,len:3,lane:4}]},{lane:56}))]),
  row([
   column('Videos',1060,[grid(4,240,[note('Ep. 15 — Wobbly chair','Script Mon, shoot Tue, edit Wed.',{key:'v1'}),note('Ep. 16 — Glue guide','Tool school. Evergreen.',{key:'v2'}),note('Ep. 17 — Laptop battery','Worth fixing? series.',{key:'v3'}),note('Ep. 18 — Charity basket','Wild card. Needs a second shoot day.',{key:'v4'}),note('Publish ep. 15','Thu 17:00',{key:'v1p',color:'sage'}),note('Publish ep. 16','Thu 17:00',{key:'v2p',color:'sage'}),note('Publish ep. 17','Thu 17:00',{key:'v3p',color:'sage'}),note('Publish ep. 18','Thu 17:00',{key:'v4p',color:'sage'})],{gap:16})]),
   column('Other channels',520,[note('Shorts — 3 per week','Cut from the week’s video. Mon / Wed / Sat.',{key:'sh',color:'rose'}),note('Newsletter','Fortnightly. Fix of the fortnight + a reader’s fix.',{key:'nl',color:'sky'}),note('Newsletter #2','',{key:'nl2',color:'sky'}),note('Collab with a tailor channel','Shoot together, post on both channels.',{key:'coll',color:'sand'})]),
   column('Announce on publish day',520,[task('Checklist',['Community post with a still','Pinned comment question','Newsletter link','Instagram story with link sticker','Reply to the first 50 comments','Add to the right playlist'])]),
  ]),
 ],
});

// ── YouTube studio & equipment ────────────────────────────────────────────────
t.push({
 id:'youtube-equipment',title:'YouTube equipment checklist',category:'Content creation',also:['Filmmaking'],
 description:'Plan a home studio and shoot-day kit: camera, audio, light, backdrop and accessories, with costs, links and what is still to buy.',
 tags:['gear','studio','equipment','home studio','checklist'],
 rows:[
  intro('Studio kit — Fix & Mend bench','A small studio for overhead and bench shots in a spare room. Budget £1,800, most of it already owned.','Owned items are ticked. Anything unticked has a price and a link; buy in the order listed — audio first, it matters more than the camera.'),
  row([
   column('Camera',340,[task('Camera',['x Mirrorless body (owned)','x 24–70 mm zoom','Overhead arm for bench shots — £140','Dummy battery + USB-C power — £35','Spare card ×2 — £40'])]),
   column('Audio',340,[task('Audio',['Shotgun mic on a boom arm — £220','Lav mic for walk-and-talks — £90','Acoustic panels ×6 — £120','x Headphones (owned)']),note('Why audio first','Viewers forgive soft focus. They leave when the sound is bad.',{color:'sand'})]),
   column('Light',340,[task('Light',['Key: 60 W LED + softbox — £160','Fill: bounce board — £20','x Practical lamp on the bench','Blackout blind — £45'])]),
   column('Backdrop & set',360,[photos([['ph-yt-pegboard','Pegboard wall with hand tools hanging','Pegboard backdrop'],['ph-yt-workshop','Small home workshop with a wooden workbench','Bench reference']],1,328),note('Set rules','Warm wood, tools in view, one plant. Nothing branded on screen.')]),
   column('Budget',420,[table('Spend',[['Item','Cost','Status'],['Overhead arm','£140','To buy'],['Shotgun + boom','£220','To buy'],['Lav mic','£90','To buy'],['Acoustic panels','£120','To buy'],['LED + softbox','£160','To buy'],['Small items','£140','To buy'],['Total','£870','of £1,800']]),note('Shoot-day bag','Batteries charged, cards formatted, gaffer tape, pliers, the parts for the fix — and a spare.')]),
  ]),
 ],
});

export default t;

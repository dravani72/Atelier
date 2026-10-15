import {note,task,photo,link,heading,sticky,shape,table,timeline,column,stack,grid,single,place,row,frame} from '../lib/dsl.mjs';
import {drawing,sk,chart} from '../lib/assets.mjs';
import {intro,photos} from '../lib/kit.mjs';

const t=[];
// Wireframe helpers: a phone or browser screen sketched on paper.
const phoneScreen=(title,inner)=>drawing(title,`<g transform="translate(-290,0)">${sk.phone(370,30,260,590)+inner}</g>`,{w:420,h:650});
const browser=(title,inner)=>drawing(title,sk.rect(60,40,880,570)+sk.line(60,90,940,90)+sk.circle(90,65,8)+sk.circle(115,65,8)+sk.circle(140,65,8)+inner);

t.push({id:'usability-test-plan',title:'Usability test plan',category:'UX research',
 description:'Define test objectives, participants, task scenarios, success criteria and logistics for a moderated usability study.',tags:['usability testing','test plan','tasks','scenarios'],
 rows:[
  intro('Usability test — new checkout (prototype v3)','Five moderated sessions, 45 minutes each, testing the redesigned delivery step of a furniture shop’s checkout.','Write tasks as realistic scenarios, never as instructions (“You’ve chosen a sofa…”, not “Click delivery”). Decide success criteria before the first session so results aren’t argued afterwards.'),
  row([
   column('Objectives',340,[note('We want to learn','- Can shoppers choose a delivery slot without help?\n- Do they understand the delivery cost before payment?\n- Where do they hesitate or backtrack?',{color:'sand'})]),
   column('Participants',340,[table('Screener',[['Criterion','Need'],['Bought furniture online','Last 12 months'],['Devices','3 mobile, 2 desktop'],['Age','25–65 spread'],['Excluded','Staff, UX pros']]),note('Incentive','£50 voucher.')]),
   column('Tasks',400,[note('Task 1 — choose delivery','You’ve picked a sofa. You need it before your sister visits on the 20th. Get to the point where you would pay.'),note('Task 2 — change your mind','You realise you’ll be out on that day. Change the delivery.'),note('Task 3 — total cost','How much will you pay in total, including delivery?')]),
   column('Success criteria',340,[table('Measures',[['Task','Success'],['1','Slot chosen < 2 min, no help'],['2','Changed without restarting'],['3','Correct total stated'],['Overall','SUS ≥ 75']])]),
   column('Logistics',340,[task('Before sessions',['x Prototype link','x Consent form','Note-taker for each session','Recording set-up tested','Debrief slot after each']),photo('ph-ut-session','Usability testing session with a participant at a laptop',{ratio:0.62,title:'Set-up'})]),
  ]),
  row([single(1880,timeline('Study week',{mode:'date',days:7,items:[{ref:'ut1',at:0,len:1},{ref:'ut2',at:1,len:2,lane:1},{ref:'ut3',at:3,len:2},{ref:'ut4',at:5,len:1,lane:1}]}))]),
  row([grid(4,455,[note('Pilot','Run with a colleague; fix the script.',{key:'ut1'}),note('Sessions 1–3','',{key:'ut2',color:'sand'}),note('Sessions 4–5 + synthesis','',{key:'ut3',color:'sand'}),note('Playback to team','30 min + clips.',{key:'ut4',color:'sage'})],{gap:20})]),
 ]});

t.push({id:'user-interview-notes',title:'User interview notes',category:'UX research',also:['UX design'],
 description:'Record an interview in a structured way — context, quotes, pain points, needs and observations — ready for synthesis.',tags:['interview','notes','research','quotes'],
 rows:[
  intro('Interview — P4, building inspector (45 min)','Field-inspection app research. Notes from a call; recording and transcript are linked in the last column.','Capture what was said in their words, separately from what you think it means. One note per quote. Colour: rose = pain, sage = need, sky = behaviour.'),
  row([
   column('Context',320,[table('Participant',[['Item','Detail'],['Role','Senior inspector'],['Years','17'],['Region','Rural district'],['Devices','Work phone, own tablet'],['Date','Week 2']]),note('Setting','Called from his van between sites.')]),
   column('Quotes',380,[note('“','“Paper’s fine until it rains. Then I’m writing everything twice.”',{color:'rose'}),note('“','“I take forty photos and by Friday I can’t tell which house they’re from.”',{color:'rose'}),note('“','“If it needs both hands, I won’t use it on a ladder.”',{color:'sage'})]),
   column('Behaviours',340,[note('Observed','Photographs the house number first so he can match photos later — a workaround.',{color:'sky'}),note('Observed','Writes defects as codes (D3, W1) — wants speed over prose.',{color:'sky'})]),
   column('Needs',340,[note('Need','Photos tied to the right defect automatically.',{color:'sage'}),note('Need','One-handed capture.',{color:'sage'}),note('Need','Works without signal.',{color:'sage'})]),
   column('Follow-ups',320,[task('After the call',['Send thank-you + voucher','Ask for a sample paper form','Add quotes to the affinity board']),link('Recording (internal)','https://example.com/recording','Consent given for internal use only.')]),
  ]),
 ]});

t.push({id:'usability-report',title:'Usability report',category:'UX research',also:['UX design'],
 description:'Present usability findings — task success, severity-ranked issues with evidence, and recommendations — so the team can act.',tags:['usability','report','findings','recommendations'],
 rows:[
  intro('Usability report — checkout prototype v3','Five participants, three tasks. What worked, what didn’t, how bad it is and what to do.','Lead with task success. Rank issues by severity (impact × frequency). Every issue has evidence (a quote or a count) and a recommendation with an owner.'),
  row([
   column('Summary',380,[note('Headline','Choosing a slot works well (5/5). Understanding the total cost does not (2/5). Fix the delivery-cost display before launch.',{color:'sand'}),table('Task success',[['Task','Success','Avg time'],['1 · Choose delivery','5/5','1:12'],['2 · Change delivery','4/5','0:48'],['3 · State total','2/5','—']])]),
   stack(640,[chart('Task success (of 5)','bar',['Choose','Change','Total cost'],[{name:'Participants',values:[5,4,2]}],{max:5,values:true,card:{title:'Task success — 5 participants'}})]),
   column('SUS',300,[note('Score','71 / 100 — “good”, below our 75 target.'),note('Range','58–86')]),
  ]),
  row([
   column('Critical',440,[note('Delivery cost appears only on the payment page','3 of 5 thought delivery was free. “Wait — £49? Where did that come from?” (P2)',{color:'rose'}),note('Recommendation','Show delivery cost on the slot cards and in the basket summary. Owner: design.',{color:'sand'})]),
   column('Serious',440,[note('“Change slot” sends users back to the start','1 of 5 abandoned; 3 hesitated.',{color:'rose'}),note('Recommendation','Edit slot inline on the review page. Owner: dev.',{color:'sand'})]),
   column('Minor',440,[note('Calendar shows weekends greyed but clickable','2 tapped Saturday; nothing happened.'),note('Recommendation','Disable or explain weekend slots.',{color:'sand'})]),
   column('What worked',440,[note('Slot picker','“That’s the easiest delivery choice I’ve seen.” (P5)',{color:'sage'})]),
  ]),
 ]});

t.push({id:'user-flow',title:'User flow diagram',category:'UX design',also:['UX research'],
 description:'Map the screens, actions and decision points a user passes through to reach a goal, including error and alternate paths.',tags:['user flow','screens','decisions','ux'],
 rows:[
  intro('User flow — log a defect (inspection app)','From opening the app on site to a defect saved and synced. Screens are wireframes; diamonds are decisions.','Follow the happy path left to right first, then add alternates below it. Every decision needs every outcome drawn. Keep screens rough — the flow is the point.'),
  row([place([
   [0,40,phoneScreen('1 · Job list',sk.text(395,90,'Today',34)+[0,1,2,3].map(i=>sk.rect(390,120+i*90,220,70)).join('')),220],
   [300,40,phoneScreen('2 · Property',sk.imageBox(390,80,220,150)+sk.textLines(390,260,200,3,22)+sk.button(395,520,210,44,'+ Defect')),220],
   [600,60,shape('Signal?','','diamond',{key:'uf-d',w:220,h:200,color:'sand'})],
   [880,40,phoneScreen('3 · Camera',sk.rect(380,70,240,380)+sk.circle(500,520,34)),220],
   [1180,40,phoneScreen('4 · Tag defect',sk.imageBox(390,80,220,140)+[0,1,2].map(i=>sk.button(390+i*76,250,68,40,['D1','D2','W1'][i])).join('')+sk.textLines(390,330,200,2,22)+sk.button(395,520,210,44,'Save')),220],
   [1480,60,shape('Saved','Synced to office','ellipse',{key:'uf-e',w:220,h:160,color:'sage'})],
   [600,380,note('Offline','Saved on device; sync badge shows “waiting”. Syncs automatically when signal returns.',{key:'uf-off',color:'sky',w:240})],
   [1180,380,note('Error: photo unclear','Retake prompt — never blocks saving.',{key:'uf-err',color:'rose',w:240})],
  ],{w:1720,h:560})]),
 ],
 edges:[]});
// Wire up the flow (screens are cards made from drawing specs, so give them keys after creation).
{const f=t.at(-1);const items=f.rows[1].row[0].items;['uf-1','uf-2',null,'uf-3','uf-4'].forEach((k,i)=>{if(k)items[i][2].key=k;});
 f.edges=[['uf-1','uf-2','choose job'],['uf-2','uf-d','+ defect'],['uf-d','uf-3','yes / no'],['uf-3','uf-4','capture'],['uf-4','uf-e','save'],['uf-d','uf-off','no signal'],['uf-4','uf-err','blurry']].map(e=>[...e,{arrow:true}]);}

t.push({id:'sitemap',title:'Sitemap',category:'Website design',also:['UX design','Graphic design'],
 description:'Show a website’s pages and content as a hierarchy to plan navigation and information architecture.',tags:['sitemap','information architecture','navigation','website'],
 rows:[
  intro('Sitemap — Arden & Moss architects','Three levels: home, main sections, and the pages inside them. Colour shows page templates.','One card per page. Connect parent to child. Colour = template (sky: listing, sand: detail, sage: simple page). Pages in the footer go on the bottom row.'),
  row([place([
   [800,0,note('Home','Hero project, approach, latest journal, contact.',{key:'s0',color:'sand',w:240})],
   [0,240,note('Projects','Filterable listing.',{key:'s1',color:'sky',w:220})],[400,240,note('Approach','How we work, in 5 steps.',{key:'s2',color:'sage',w:220})],[800,240,note('Studio','People, values, awards.',{key:'s3',color:'sage',w:220})],[1200,240,note('Journal','Articles + research.',{key:'s4',color:'sky',w:220})],[1600,240,note('Contact','Form, map, enquiry guide.',{key:'s5',color:'sage',w:220})],
   [0,480,note('Project page ×20','Case-study template: story, sketches, photos, facts.',{key:'s1a',color:'sand',w:220})],[0,700,note('Residential / Public / Research','Filters, not pages.',{key:'s1b',color:'plain',w:220})],
   [800,480,note('Person ×8','Bio + projects.',{key:'s3a',color:'sand',w:220})],
   [1200,480,note('Article','Journal template.',{key:'s4a',color:'sand',w:220})],
   [1600,480,note('Enquiry guide','What to expect, costs, process.',{key:'s5a',color:'sage',w:220})],
   [400,880,note('Footer: Privacy · Accessibility · Planning documents · Careers','',{color:'plain',w:900})],
  ],{w:1840,h:980})]),
 ],
 edges:[['s0','s1'],['s0','s2'],['s0','s3'],['s0','s4'],['s0','s5'],['s1','s1a'],['s1','s1b'],['s3','s3a'],['s4','s4a'],['s5','s5a']].map(e=>[...e,'',{arrow:false}])});

t.push({id:'website-content',title:'Website content',category:'Website design',also:['Graphic design','Marketing campaigns'],
 description:'Plan each page’s content — purpose, key messages, copy, images, SEO keywords and status — before design and build.',tags:['website content','copy','seo','pages'],
 rows:[
  intro('Content plan — Arden & Moss: home and one case study','What goes on each page and why. Copy is drafted in the cards; images are placeholders for the shoot.','One column per page. Start each with its purpose and the one thing a visitor should do next. Mark copy status with colour: sand draft, sky reviewed, sage approved.'),
  row([
   column('Home',460,[note('Purpose','Make a homeowner feel understood in 10 seconds, then send them to a project like theirs.',{color:'sand'}),note('Hero copy','# Thoughtful homes, made together.\nWe design extensions and new homes for people who want to be part of the process.',{color:'sky'}),photo('ph-wc-home-hero','Contemporary house extension at dusk with warm interior light',{ratio:0.56,title:'Hero image'}),note('Next action','“See homes like yours” → projects filtered by residential.')]),
   column('Case study — Orchard House',460,[note('Purpose','Show process, not just photos: the client’s problem, our sketches, the result.',{color:'sand'}),note('Story','The Kaurs needed room for three generations without losing the garden. We dug down instead of out.',{color:'sand'}),photos([['ph-wc-sketch','Architect’s hand sketch of a house section','Sketch'],['ph-wc-interior','Bright kitchen extension interior with garden view','Result']],2,206)]),
   column('SEO',360,[table('Keywords',[['Page','Primary keyword'],['Home','residential architect [city]'],['Projects','house extension architect'],['Orchard House','basement extension']]),note('Meta description (home)','Architects for extensions and new homes in [city]. Thoughtful design, made with you.')]),
   column('Status',340,[task('Content',['x Home copy drafted','Home copy approved','6 case studies drafted','Photography shoot','Alt text for all images'])]),
  ]),
 ]});

t.push({id:'website-brainstorm',title:'Website brainstorming',category:'Website design',also:['Brainstorming','UX design'],
 description:'Capture website ideas — content, features and visual inspiration — then prioritise them with collaborators.',tags:['website','ideas','features','prioritise'],
 rows:[
  intro('Website ideas — Hollow Oak Coffee','Everything we could put on the new site. Ideas first; priorities at the end.','Anyone can add a sticky. Group by type, then score each idea on value to customers and effort. Must-haves go into the website brief.'),
  row([
   column('Content',340,[sticky('Farm profiles with maps','',{color:'sage'}),sticky('Brew guides by method','',{color:'sage'}),sticky('Roast calendar','',{color:'sage'})]),
   column('Features',340,[sticky('Pause / skip subscription','',{color:'sky'}),sticky('Flavour quiz','',{color:'sky'}),sticky('Gift a subscription','',{color:'sky'}),sticky('Café menus + hours','',{color:'sky'})]),
   column('Visual inspiration',360,[photos([['ph-wbs-ecommerce','Minimal e-commerce website on a laptop screen','Product pages'],['ph-wbs-coffee-flatlay','Coffee beans and brewing equipment flat lay','Photography style']],1,328)]),
   column('Wild ideas',340,[sticky('Live roast-cam on Tuesdays','',{color:'rose'}),sticky('Swap your empty bags for points','',{color:'rose'})]),
   column('Priorities',400,[table('Value × effort',[['Idea','Value','Effort','Call'],['Pause/skip','5','2','Must'],['Brew guides','4','2','Must'],['Gift subscription','4','3','Should'],['Flavour quiz','3','3','Could'],['Roast-cam','2','4','Later']])]),
  ]),
 ]});

t.push({id:'competitor-analysis',title:'Competitor analysis',category:'Strategy',also:['Website design','Market research'],
 description:'Benchmark competitors’ offer, positioning, strengths, weaknesses, websites and SEO, and decide where to compete.',tags:['competitor analysis','benchmark','strategy','swot'],
 rows:[
  intro('Competitor analysis — coffee subscriptions','Four competitors compared on the same criteria, with screenshots, strengths, weaknesses and what we take from each.','Use the same cards in the same order for every competitor so the board reads across. The final column turns observations into decisions.'),
  row([
   column('Origin Lab',360,[photo('ph-ca-comp1','Premium coffee website product page on a laptop',{ratio:0.62,title:'Homepage'}),note('Offer','Rare micro-lots, £14/bag, no pausing.'),note('Strengths','Beautiful content; strong SEO for “specialty coffee”.',{color:'sage'}),note('Weaknesses','Intimidating jargon; churn complaints in reviews.',{color:'rose'})]),
   column('Third Wave Collective',360,[photo('ph-ca-comp2','Coffee subscription box being unboxed',{ratio:0.62,title:'Unboxing'}),note('Offer','Multi-roaster box, £12/bag, flexible.'),note('Strengths','Flexibility, variety.',{color:'sage'}),note('Weaknesses','No single story; slow delivery.',{color:'rose'})]),
   column('Bean Basics',360,[photo('ph-ca-comp3','Coffee bags on a supermarket shelf',{ratio:0.62,title:'Supermarket range'}),note('Offer','Supermarket “specialty” at £8.'),note('Strengths','Price, availability.',{color:'sage'}),note('Weaknesses','Stale: no roast dates.',{color:'rose'})]),
   column('Comparison',420,[table('Benchmark',[['','Origin','Third Wave','Basics','Us'],['Price/bag','£14','£12','£8','£11'],['Pause/skip','No','Yes','—','Soon'],['Roast date','Yes','Yes','No','Yes'],['Delivery','3 days','5 days','—','2 days'],['Reviews','4.3','4.1','3.6','4.8']])]),
   column('Where we compete',380,[note('Decisions','- Win on freshness + flexibility, not rarity\n- Explain coffee like a friend, not a sommelier\n- Never compete on price',{color:'sand'})]),
  ]),
 ]});

export default t;

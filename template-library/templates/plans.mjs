import {note,task,photo,link,table,timeline,column,stack,grid,single,row,boardCard,heading} from '../lib/dsl.mjs';
import {palette,chart} from '../lib/assets.mjs';
import {intro,photos,swatches} from '../lib/kit.mjs';

// A project plan: the goal, the people, the references and the money on top; the phases on a calendar in the middle;
// each phase's checklist underneath (each checklist is the clip on the timeline). Extra columns go at the end of row 1.
function plan(c){
 const phaseW=Math.max(300,Math.min(400,Math.floor(2000/c.phases.length)-40));
 const days=Math.max(...c.phases.map(p=>p[1]+p[2]))+(c.tail??4);
 return {id:c.id,title:c.title,category:c.category||'Project plans',also:c.also||[],description:c.description,tags:c.tags,rows:[
  intro(c.heading,c.purpose,c.how||'Start with the goal and what “done” looks like. Plan phases on the calendar, then fill each phase’s checklist. Drag a phase on the timeline when dates move; tick tasks as they finish and the progress bars tell the story.'),
  row([
   column('Goal',360,[note('What we are making',c.what,{color:'sand'}),note('Done looks like',c.done),...(c.goalExtra||[])]),
   column('People',340,[table('Team',c.team),...(c.peopleExtra||[])]),
   column('References',360,[photos(c.refs,1,328,{ratio:0.62}),...(c.refExtra||[])]),
   column(c.moneyTitle||'Budget',380,[table(c.moneyTable||'Budget',c.budget),...(c.moneyExtra||[])]),
   ...(c.extra||[]),
  ]),
  row([single(c.tlw||2000,timeline(c.tlTitle||'Plan',{mode:'date',days,items:c.phases.map(([,at,len],i)=>({ref:`${c.id}-p${i}`,at,len:Math.max(len,Math.round(days/24)),lane:c.lanes?c.lanes[i]:i%3}))}))]),
  row(c.phases.map(([name,,,items],i)=>column(name,phaseW,[task(name,items,{key:`${c.id}-p${i}`})]))),
  ...(c.after||[]),
 ]};
}

const t=[];
t.push(plan({id:'graphic-design-project-plan',title:'Graphic design project plan',category:'Graphic design',also:['Project plans'],description:'Track milestones, tasks and deadlines for a design project, from brief to final files, with the schedule on a calendar.',tags:['graphic design','project plan','milestones','deliverables'],
 heading:'Riverside Jazz Festival — design project',purpose:'Festival identity: poster series, programme, wayfinding and social templates. Six weeks to print.',
 what:'A festival identity built on cut-paper instrument shapes: 3 posters, a 32-page programme, 20 signs, social templates.',done:'Everything printed, installed and handed to the comms team with templates they can use without us.',
 team:[['Role','Who'],['Design lead','Kemi'],['Designer','Tom'],['Client lead','Festival director'],['Printer','Riverprint (fictional)']],
 refs:[['ph-gd-poster-wall','Wall covered in colourful printed posters','Posters in the wild']],
 budget:[['Item','Cost'],['Design fee','£9,500'],['Illustration','Included'],['Print','£6,200'],['Install','£800'],['Contingency','£900']],
 phases:[['Discovery',0,5,['x Kick-off with festival team','x Review last year’s materials','Moodboard sign-off']],['Concept',5,8,['Three identity routes','Presentation','Choose route']],['Design',13,14,['Poster series','Programme layout','Wayfinding system','Social templates']],['Production',27,8,['Print-ready files','Proofs approved','Print run']],['Handover',35,4,['Install signage','Template training','Final files archived']]]}));

t.push(plan({id:'campaign-project-plan',title:'Campaign project plan',category:'Marketing campaigns',also:['Project plans','Agencies'],description:'Outline campaign goals, audience, messaging, channels, budget, timeline and performance metrics in one plan.',tags:['campaign','marketing','plan','channels'],
 heading:'Campaign plan — “Take the long way” (spring)',purpose:'Scenic-routes campaign for a fictional rail company: film, out-of-home, social, partnerships. Twelve weeks.',
 what:'An integrated campaign that sells scenic routes as the holiday itself.',done:'20% more scenic-route bookings for April–June, at a cost per booking under £9.',
 team:[['Role','Who'],['Campaign lead','Priya'],['Creative','Agency team'],['Media','Media agency'],['Partnerships','Ollie'],['Analytics','Sam']],
 refs:[['ph-cp-train-window','View from a train window of mountains or countryside','Key visual direction']],
 budget:[['Channel','Budget'],['Production','£120k'],['Out-of-home','£180k'],['Social','£90k'],['Search','£40k'],['Partnerships','£20k'],['Contingency','£30k']],
 extra:[column('Measures',340,[table('KPIs',[['Metric','Target'],['Bookings','+20%'],['Cost per booking','< £9'],['Ad recall','35%'],['Partner bookings','1,500']])])],
 phases:[['Strategy & brief',0,10,['x Audience research','x Brief signed off','Media plan']],['Creative',10,21,['Concepts','Scripts approved','Key visual']],['Production',31,21,['Film shoot','Photography','OOH artwork']],['Launch',52,7,['OOH live','Film on air','Social launch','PR']],['In market',59,28,['Weekly optimisation','Partner pushes','Mid-flight report']],['Wrap',87,7,['Final report','Lessons learned']]]}));

t.push(plan({id:'website-project-plan',title:'Website design project plan',category:'Website design',also:['Project plans','UX design'],description:'Map out a website project: goals, audience, content strategy, structure, design, technical requirements and launch.',tags:['website','project plan','launch','sitemap'],
 heading:'Website plan — Arden & Moss architects',purpose:'A new portfolio site with case studies, editable by the practice. Twelve weeks from kick-off to launch.',
 what:'A 15-template site with six in-depth case studies and a journal.',done:'Live, fast, accessible, and the office manager has added a project without help.',
 team:[['Role','Who'],['Project lead','Ana'],['UX / UI','Joon'],['Developer','Lars'],['Content','Client + copywriter'],['Photography','Client']],
 refs:[['ph-wb-website-laptop','Laptop showing a minimal website on a desk','Tone reference']],
 budget:[['Item','Cost'],['Discovery + UX','£4,000'],['Design','£7,000'],['Build','£11,000'],['Copywriting','£2,000'],['Hosting / year','£720']],
 extra:[column('Technical',340,[note('Stack','Static site with a headless CMS. Images through an image CDN. Analytics without cookies.'),task('Requirements',['WCAG 2.2 AA','< 2 s load on 4G','Redirect map for old URLs','Staff CMS training'])])],
 phases:[['Discovery',0,10,['x Stakeholder interviews','x Analytics review','Content audit']],['Structure',10,10,['Sitemap','User journeys','Wireframes']],['Design',20,15,['Visual design','Case-study template','Mobile layouts']],['Build',35,28,['CMS set-up','Templates','Integrations']],['Content & QA',63,14,['Content entry','Accessibility testing','Browser testing']],['Launch',77,4,['DNS + redirects','Go live','Training']]]}));

t.push(plan({id:'interior-design-project-plan',title:'Interior design project plan',category:'Interior design',also:['Project plans'],description:'Lay out goals, rooms, timeline, palettes, furnishings, budget and trades for an interior design project.',tags:['interior design','project plan','furnishings','trades'],
 heading:'Ground floor — Victorian terrace',purpose:'Living room, kitchen-diner and hall for a family of four. Fourteen weeks, £42k budget.',
 what:'A calm, warm, robust ground floor with new joinery, lighting, furniture and finishes.',done:'Installed, styled and photographed in time for Christmas dinner for twelve.',
 team:[['Role','Who'],['Designer','Studio lead'],['Clients','Both partners'],['Joiner','Local joinery'],['Decorator','Limewash specialist'],['Electrician','For lighting']],
 refs:[['ph-in-living-room','Warm minimal living room with a linen sofa and natural light','Direction']],
 budget:[['Item','Budget'],['Furniture','£16,500'],['Joinery','£9,000'],['Lighting','£4,500'],['Decorating','£5,500'],['Rugs & textiles','£4,000'],['Contingency','£2,500']],
 extra:[column('Palette',340,[swatches([['#e9e1d4','Bone'],['#a67b5b','Oak'],['#7c8363','Olive'],['#5a4636','Walnut']],2,146)])],
 phases:[['Survey & brief',0,7,['x Measured survey','x Brief agreed']],['Concept',7,10,['Moodboards per room','Layouts','Concept presentation']],['Design',17,14,['Product schedule','Lighting plan','Joinery drawings']],['Procurement',31,21,['Orders placed','Lead times tracked','Deliveries booked']],['Works',52,35,['Electrics','Joinery','Decorating']],['Install',90,5,['Furniture in','Styling','Photography']]]}));

t.push(plan({id:'illustration-project-plan',title:'Illustration project plan',category:'Visual art',also:['Project plans'],description:'Organise an illustration commission: objectives, style, media, references, deliverables, schedule and invoicing.',tags:['illustration','commission','plan','deliverables'],
 heading:'Commission — city walking guide (13 illustrations)',purpose:'Cover and twelve spots for a pocket walking guide. Ink line, two spot colours. Five weeks.',
 what:'Thirteen illustrations that make readers want to walk the routes.',done:'Final art delivered at 300 dpi, CMYK, approved by the editor, invoice paid.',
 team:[['Role','Who'],['Illustrator','Me'],['Editor','Little Lanes Press'],['Art director','Publisher'],['Printer','Via publisher']],
 refs:[['ph-ib-courtyard','Hidden courtyard with ivy and old stone in a historic city','Subject research']],
 budget:[['Item','Amount'],['Fee','£3,600'],['50% on roughs','£1,800'],['50% on delivery','£1,800'],['Materials','£80'],['Research travel','£60']],
 extra:[column('Kit',300,[task('Materials',['x Dip pen + nibs','x Indian ink','Hot-pressed paper ×20','Scanner booked'])])],
 phases:[['Research',0,4,['x Walk all 12 routes','x Photo reference','Thumbnails']],['Roughs',4,8,['12 spot roughs','Cover roughs ×3','Send to editor']],['Feedback',12,3,['Notes call','Revise 3 spots']],['Final art',15,18,['Inking batch 1','Inking batch 2','Colour separations']],['Delivery',33,3,['Scans + files','Invoice','Promote on portfolio']]]}));

t.push(plan({id:'motion-design-project-plan',title:'Motion design project plan',category:'Motion design',also:['Project plans'],description:'Set out goals, visual style, animation approach, timing and resources for a motion graphics production.',tags:['motion design','animation','plan','pipeline'],
 heading:'Motion project — reforestation explainer (90 s)',purpose:'2D paper-cut animation for a charity. Seven weeks from brief to delivery.',
 what:'A 90-second explainer and a 15-second social cut, music-led, with VO.',done:'Delivered masters, subtitles and source files; the charity can re-cut the social version themselves.',
 team:[['Role','Who'],['Director / designer','Lead'],['Animator','Freelance ×1'],['Sound','Composer + mix'],['VO','Casting via agency'],['Client','Fundraising director']],
 refs:[['ph-mo-paper-leaves','Paper cut leaves craft','Paper-cut style']],
 budget:[['Item','Cost'],['Design + direction','£6,500'],['Animation','£6,000'],['Music + mix','£2,200'],['VO','£900'],['Contingency','£900']],
 extra:[column('Specs',300,[table('Delivery',[['Spec','Value'],['Resolution','1920×1080'],['Frame rate','25 fps'],['Codec','ProRes 422 HQ'],['Audio','−23 LUFS']])])],
 phases:[['Script & VO',0,8,['x Script approved','VO recorded']],['Style frames',8,7,['5 style frames','Client approval']],['Storyboard',15,7,['Board','Animatic with VO']],['Animation',22,21,['Scenes 1–4','Scenes 5–8','Transitions']],['Finishing',43,5,['Music + mix','Subtitles','Social cut']]]}));

t.push(plan({id:'academic-project-plan',title:'Academic project plan',category:'Education',also:['Project plans'],description:'Structure a research project: questions, methods, milestones, resources, budget, ethics and writing schedule.',tags:['academic','research','thesis','plan','education'],
 heading:'MA dissertation — community gardens and loneliness',purpose:'A mixed-methods study of whether community gardening reduces loneliness among older adults. 15,000 words, nine months.',
 what:'A dissertation answering: does regular community gardening reduce self-reported loneliness in adults over 65?',done:'Submitted on time with ethics approval, 40 survey responses, 10 interviews and a supervisor-approved draft.',
 team:[['Role','Who'],['Researcher','Me'],['Supervisor','Dr Okafor'],['Second reader','Dept.'],['Partners','3 community gardens']],
 refs:[['ph-ac-community-garden','Older adults working together in a community garden','Field site']],
 moneyTitle:'Resources',moneyTable:'Budget',budget:[['Item','Cost'],['Participant vouchers','£400'],['Transcription','£350'],['Travel','£180'],['Printing','£40']],
 extra:[column('Ethics',320,[task('Ethics',['x Application submitted','Approval received','Consent forms','Data management plan'])])],
 phases:[['Literature review',0,40,['x Search strategy','Annotated bibliography','Review chapter draft']],['Ethics',30,30,['Application','Revisions','Approval']],['Data collection',60,60,['Survey (40)','Interviews (10)','Field notes']],['Analysis',120,40,['Survey stats','Thematic coding','Findings chapter']],['Writing',150,90,['Full draft','Supervisor feedback','Final edit']],['Submit',245,5,['Formatting','Submit']]]}));

t.push(plan({id:'photoshoot-plan',title:'Photoshoot plan',category:'Photography',also:['Project plans'],description:'Plan a shoot end to end: concept, shot list, locations, styling, crew, equipment, schedule and post-production.',tags:['photoshoot','plan','shot list','crew'],
 heading:'Shoot plan — “Slow Mornings” (2 days)',purpose:'Lifestyle library for a homeware brand. One flat, natural light, 40 final images.',
 what:'40 retouched images across web, social and print, every product shown.',done:'Selects approved by the brand and retouched files delivered within 10 days of the shoot.',
 team:[['Role','Who'],['Photographer','Lead'],['Assistant','Freelance'],['Stylist','Props + set'],['Model','Via agency'],['Producer','Brand side']],
 refs:[['ph-ph-morning-table','Breakfast table with coffee and ceramics in soft morning window light','Hero light']],
 budget:[['Item','Cost'],['Photographer','£3,200'],['Stylist','£1,600'],['Model','£1,400'],['Location','£1,200'],['Props','£900'],['Retouching','£1,200']],
 extra:[column('Kit',320,[task('Equipment',['x Body ×2 + 35/50/85 mm','x Reflectors + flags','Tethering laptop','Steamer'])])],
 phases:[['Pre-production',0,10,['x Moodboard','Location booked','Casting','Prop sourcing']],['Shoot day 1',14,1,['Living room + bedroom','Hero table']],['Shoot day 2',15,1,['Kitchen','Details + flat-lays']],['Selects',16,3,['Contact sheets','Client selects']],['Retouch',19,7,['Retouch 40','Export crops','Deliver']]]}));

t.push(plan({id:'game-design-project-plan',title:'Game design project plan',category:'Game design',also:['Project plans'],description:'Plan a small game’s development: pillars, scope, team, milestones from prototype to release, and risks.',tags:['game development','plan','milestones','prototype'],
 heading:'“Tidewater” — development plan',purpose:'A cosy puzzle-adventure for PC and Switch. Team of four, eighteen months.',
 what:'Five islands, 60 tide puzzles, 3–4 hours of play.',done:'Released on PC and Switch with an 85% positive rating and no critical bugs.',
 team:[['Role','Who'],['Design / code','Lena'],['Art','Ravi'],['Code','Sol'],['Audio','Contract'],['Publisher','Small indie label']],
 refs:[['ph-gm-rock-pool','Tide pool with seaweed, shells and clear water','Core fantasy']],
 budget:[['Item','Cost'],['Salaries (4 × 18 mo)','£260k'],['Audio','£18k'],['Porting (Switch)','£25k'],['Marketing','£30k'],['Contingency','£25k']],
 extra:[column('Pillars',320,[note('Design pillars','1. The tide is the puzzle\n2. Every island has a story\n3. Never punish curiosity')])],
 phases:[['Prototype',0,60,['x Tide mechanic','x 5 test puzzles','Playtest']],['Vertical slice',60,90,['Island 1 complete','Art style locked','Publisher demo']],['Production',150,240,['Islands 2–5','60 puzzles','Story + dialogue']],['Alpha / beta',390,90,['Content complete','Closed beta','Balancing']],['Launch',480,60,['Certification','Marketing beats','Release']]],tail:10}));

t.push(plan({id:'event-plan',title:'Event planning',category:'Events',also:['Project plans'],description:'A central hub for an event: goals, audience, budget, venue, suppliers, timeline, run of show and logistics.',tags:['event','planning','suppliers','logistics'],
 heading:'Makers’ Market weekend — plan',purpose:'Sixty makers, eight food stalls, 6,000 visitors in a former tram depot. Ten weeks to doors.',
 what:'A two-day market that sells out stalls and keeps visitors longer than last year.',done:'Safe, sold out, seating for 200, no food queue longer than 10 minutes, makers rebook for next year.',
 team:[['Role','Who'],['Event lead','Maya'],['Operations','Jon'],['Programme','Aisha'],['Comms','Lou'],['Volunteers','40']],
 refs:[['ph-eb-craft-market','Indoor craft market with stalls and visitors','Format']],
 budget:[['Item','Cost'],['Venue','£9,000'],['Infrastructure','£11,000'],['Marketing','£6,000'],['Staffing','£7,000'],['Contingency','£5,000'],['Income (stalls)','−£24,000']],
 extra:[column('Suppliers',340,[table('Suppliers',[['Supplier','Status'],['Marquee + seating','Booked'],['Power','Quote'],['Toilets','Booked'],['Security','Pending'],['First aid','Booked']])])],
 phases:[['Planning',0,14,['x Budget approved','x Venue contract','Insurance']],['Makers',7,28,['Applications','Selection','Stall map']],['Marketing',28,40,['Campaign live','Press','Social countdown']],['Operations',35,30,['Site plan + flow','Risk assessment','Volunteer rota']],['Build & event',66,4,['Build','Market weekend','Get-out']]]}));

t.push(plan({id:'architecture-project-plan',title:'Architecture project plan',category:'Architecture',also:['Project plans'],description:'Bring the brief, stages, team, consents, budget and visual references for a building project together on one board.',tags:['architecture','project plan','stages','planning permission'],
 heading:'Coastal studio — project plan',purpose:'A 60 m² artist’s studio on an exposed coastal site. Concept to completion in eleven months.',
 what:'A timber-framed studio with a north-light roof, charred larch cladding and a concrete plinth.',done:'Practical completion signed, building control certificate issued, client painting in it.',
 team:[['Role','Who'],['Architect','Practice lead'],['Structural engineer','Consultant'],['QS','Consultant'],['Contractor','Tendered'],['Client','Artist']],
 refs:[['ph-ar-timber-cabin','Contemporary timber cabin in a coastal or rural landscape','Precedent']],
 budget:[['Item','Cost'],['Construction','£168k'],['Fees','£26k'],['Planning + BC','£2.5k'],['Surveys','£3k'],['Contingency (10%)','£17k']],
 extra:[column('Consents',320,[task('Consents',['x Pre-application advice','Planning application','Building control','Party wall — n/a'])])],
 phases:[['Concept',0,30,['x Site visit + survey','x Brief','Options ×3']],['Developed design',30,40,['Chosen option','Engineer input','Cost plan']],['Planning',70,60,['Application','Consultation','Decision']],['Technical design',100,50,['Construction drawings','Specification','Tender']],['Construction',160,150,['Groundworks','Frame + roof','Cladding','Fit-out']],['Handover',310,14,['Snagging','Completion','Aftercare']]],tail:10}));

t.push(plan({id:'renovation-project-plan',title:'Renovation project plan',category:'Home renovation',also:['Project plans'],description:'A detailed roadmap for a home renovation or DIY makeover: phases, trades, budget, permissions and what to do yourself.',tags:['renovation','diy','home','plan','budget'],
 heading:'Bungalow renovation — four phases',purpose:'Insulation and glazing, open kitchen, second bathroom, finishing — while living in it.',
 what:'A warm, efficient, two-bathroom home with an open kitchen.',done:'Signed off by building control, EPC C, all snags closed, and under budget + 10%.',
 team:[['Role','Who'],['Us','Project managers'],['Builder','Main contractor'],['Electrician','Sub'],['Plumber','Sub'],['Kitchen fitter','Supplier']],
 refs:[['ph-rb-bungalow','Mid-century modern bungalow exterior','The house']],
 budget:[['Phase','Budget'],['Envelope','£24k'],['Kitchen','£28k'],['Bathrooms','£22k'],['Finishing','£11k'],['Contingency','£8.5k']],
 extra:[column('DIY vs trades',320,[note('We do','Strip-out, painting, tiling the utility, garden.'),note('Trades do','Structural, electrics, plumbing, plastering, glazing.')])],
 phases:[['Surveys & design',0,42,['x Asbestos survey','x Structural engineer','Quotes ×3']],['Envelope',60,30,['Loft insulation','Windows + doors','External wall insulation']],['Kitchen',95,42,['Steel beam','Kitchen install','Electrics']],['Bathrooms',140,42,['First fix','Ensuite','Main bathroom']],['Finishing',185,30,['Plastering','Decorating','Snag list']]],tail:6}));

t.push(plan({id:'logo-design-project-plan',title:'Logo design project plan',category:'Logo design',also:['Project plans','Branding'],description:'A hub for a logo project: brief, research, moodboard, concepts, presentation, refinements and handover checklist.',tags:['logo','project plan','identity','handover'],
 heading:'Saltmarsh Swim Club — logo project',purpose:'Logo, symbol and a mini guide for a sea-swimming club. Three weeks.',
 what:'A primary logo, a symbol, one-colour versions and a four-page guide.',done:'Committee approves one route; files delivered; caps ordered.',
 team:[['Role','Who'],['Designer','Me'],['Client lead','Committee chair'],['Decision','Committee vote']],
 refs:[['ph-lb-swim-cap','Swimmers wearing bright swim caps','Main application']],
 budget:[['Item','Fee'],['Research + routes','£800'],['Refinement','£600'],['Files + guide','£400']],
 extra:[column('Workflow',320,[task('Checklist',['x Brief signed','Moodboard agreed','Routes presented','Feedback collected','Final files','Guide delivered'])])],
 phases:[['Research',0,4,['x Interview committee','x Competitor scan','Moodboard']],['Concepts',4,7,['Sketches (50+)','Three routes','Mock-ups on caps + flag']],['Present',11,1,['Presentation','Vote']],['Refine',12,7,['Two rounds','Colour tests','Small-size test']],['Handover',19,3,['File export','Mini guide','Archive']]]}));

t.push(plan({id:'visual-art-plan',title:'Visual art plan',category:'Visual art',also:['Project plans'],description:'Plan a new artwork or series: brief, brainstorming, inspiration, research, materials, making schedule and exhibition.',tags:['art','series','exhibition','plan','studio'],
 heading:'Series — “Tide Lines” (6 paintings)',purpose:'Six large oil paintings of the estuary at different tides for a solo show. Five months.',
 what:'Six oils, 120 × 90 cm, plus studies, for a solo show at a small gallery.',done:'Paintings framed, photographed, hung and the show opened.',
 team:[['Role','Who'],['Artist','Me'],['Gallery','Harbour Gallery (fictional)'],['Framer','Local'],['Photographer','For catalogue']],
 refs:[['ph-va-estuary','Estuary landscape at low tide with reflections','Subject']],
 budget:[['Item','Cost'],['Canvas + stretchers','£480'],['Paint','£350'],['Framing','£1,100'],['Photography','£300'],['Private view','£250']],
 extra:[column('Studio rules',320,[note('Practice','Paint every morning 8–12. Plein-air studies twice a week at different tides. One painting “resting” at all times.')])],
 phases:[['Research & studies',0,30,['x Tide table study','Plein-air sketches ×20','Colour studies']],['Paintings 1–3',30,45,['Painting 1','Painting 2','Painting 3']],['Paintings 4–6',75,45,['Painting 4','Painting 5','Painting 6']],['Finishing',120,20,['Varnish','Framing','Photography']],['Show',145,10,['Hang','Private view','Press']]],tail:5}));

t.push(plan({id:'craft-project-plan',title:'Craft project plan',category:'Craft & making',also:['Project plans'],description:'Plan a craft project or small-batch collection: goals, inspiration, materials, steps, costs and timeline.',tags:['craft','making','small batch','plan','materials'],
 heading:'Small batch — 30 hand-thrown mugs for the winter market',purpose:'A stoneware mug collection in three glazes, made and fired in time for the December market.',
 what:'30 mugs (10 per glaze) plus 6 seconds for the studio.',done:'Mugs priced, photographed, listed online and on the stall by the market weekend.',
 team:[['Role','Who'],['Maker','Me'],['Kiln','Shared studio kiln'],['Photos','Friend, in exchange for a mug']],
 refs:[['ph-cr-mugs','Handmade ceramic mugs on a shelf','Collection reference']],
 budget:[['Item','Cost'],['Clay (25 kg)','£28'],['Glaze materials','£45'],['Kiln firings ×3','£60'],['Packaging','£35'],['Market stall','£40']],
 extra:[column('Pricing',300,[table('Per mug',[['','£'],['Materials','2.80'],['Firing','2.00'],['Time (40 min)','12.00'],['Price','28.00']])])],
 phases:[['Design',0,5,['x Shape tests','x Glaze tests']],['Throwing',5,10,['Throw 36','Trim','Handles']],['Bisque',15,4,['Dry','Bisque fire']],['Glaze',19,6,['Glaze','Glaze fire','Sort seconds']],['Sell',25,10,['Photos','List online','Market weekend']]]}));

t.push(plan({id:'fashion-project-plan',title:'Fashion project plan',category:'Fashion',also:['Project plans'],description:'Map a fashion project from brief and concepts through inspiration, sampling and fittings to final looks.',tags:['fashion','collection','plan','sampling'],
 heading:'AW collection “Fieldwork” — plan',purpose:'Twelve looks from moodboard to lookbook in sixteen weeks.',
 what:'Twelve looks, sampled and fitted, shot for a lookbook, ready for wholesale appointments.',done:'Lookbook out, samples on the rail, line sheet sent to 40 buyers.',
 team:[['Role','Who'],['Designer','Creative director'],['Pattern cutter','Freelance'],['Sample maker','Studio'],['Fabric agent','Mill contact'],['Photographer','Lookbook']],
 refs:[['ph-fa-workwear','Person wearing vintage workwear jacket outdoors in nature','Direction']],
 budget:[['Item','Cost'],['Fabric sampling','£3,500'],['Patterns','£4,800'],['Samples','£6,200'],['Lookbook shoot','£4,000'],['Trade show','£3,000']],
 extra:[column('Fabrics',300,[table('Status',[['Fabric','Status'],['Waxed cotton','Ordered'],['Wool tweed','Swatch'],['Heavy linen','Ordered'],['Merino','Pending']])])],
 phases:[['Research',0,14,['x Moodboard','x Colour story','Fabric sourcing']],['Design',14,21,['Sketches (40)','Edit to 12','Tech packs']],['Sampling',35,35,['Toiles','First samples','Fit 1']],['Refinement',70,21,['Fit 2','Final samples']],['Launch',91,21,['Lookbook shoot','Line sheet','Buyer appointments']]]}));

t.push({id:'brand-strategy-project',title:'Brand strategy project',category:'Branding',also:['Brand workshops','Agencies'],
 description:'A central hub for a brand strategy engagement, with linked boards for research, workshops and the strategy itself, plus the plan on a calendar.',tags:['brand strategy','hub','workshops','research'],
 rows:[
  intro('Fernhill Dental — brand strategy hub','One place for the whole engagement. Each board card opens a working board; the calendar shows where we are.','Work happens on the linked boards; this hub shows status. Update the status notes on Fridays.'),
  row([
   column('Working boards',420,[
    boardCard({title:'Research',description:'Patient interviews, staff survey, competitor scan.',rows:[row([column('Patient interviews',360,[note('Interview 3 — nervous patient','“If I knew I could say stop, I would come.”'),note('Pattern','Control matters more than comfort.',{color:'sand'})]),column('Competitors',360,[table('Scan',[['Practice','Position'],['Chain A','Price'],['Chain B','Cosmetic'],['Independent C','Family']])])])]}),
    boardCard({title:'Workshops',description:'Agendas, outputs and photos from both workshops.',rows:[row([column('Workshop 1 — discovery',380,[task('Agenda',['x Warm-up: best and worst dentist','x Patient journeys','Values card sort']),note('Output','Top values: calm, honesty, control.',{color:'sage'})])])]}),
   ]),
   column('Status',360,[note('This week','Positioning routes drafted. Workshop 2 booked for Tuesday.',{color:'sand'}),table('Workstreams',[['Workstream','Status'],['Research','Done'],['Positioning','In progress'],['Voice','Not started'],['Story','Not started']])]),
   column('Strategy (so far)',400,[note('Positioning (draft)','For anxious adults who avoid the dentist, Fernhill is the practice that puts you in control — because every step is explained and you can always stop.',{color:'sand'}),note('Personality','Calm · straight-talking · kind · quietly confident')]),
   column('Decisions log',380,[table('Decisions',[['Date','Decision'],['Wk 2','Keep the Fernhill name'],['Wk 3','Target anxious adults first'],['Wk 4','No mascot']])]),
  ]),
  row([single(1660,timeline('Engagement plan',{mode:'date',days:45,items:[{ref:'bs1',at:0,len:15},{ref:'bs2',at:15,len:2,lane:1},{ref:'bs3',at:16,len:10},{ref:'bs4',at:26,len:2,lane:1},{ref:'bs5',at:28,len:14},{ref:'bs6',at:42,len:2,lane:1}]}))]),
  row([grid(6,256,[note('Research','',{key:'bs1'}),note('Workshop 1','',{key:'bs2',color:'sand'}),note('Positioning routes','',{key:'bs3'}),note('Workshop 2','',{key:'bs4',color:'sand'}),note('Voice & story','',{key:'bs5'}),note('Final presentation','',{key:'bs6',color:'sage'})],{gap:24})]),
 ]});

export default t;

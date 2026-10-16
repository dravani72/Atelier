import {note,task,photo,link,heading,sticky,shape,table,file,timeline,column,stack,grid,single,place,row,boardCard} from '../lib/dsl.mjs';
import {drawing,sk,chart} from '../lib/assets.mjs';
import {intro,photos} from '../lib/kit.mjs';

const t=[];

// ── Hubs ─────────────────────────────────────────────────────────────────────
t.push({id:'agency-hub',title:'Agency hub',category:'Agencies',
 description:'A shared home for an agency: clients and projects as linked boards, team capacity, pipeline, studio calendar and resources.',tags:['agency','hub','projects','team','pipeline'],
 rows:[
  intro('Studio hub — Northwick & Co. (fictional agency)','Twelve people, eight live projects. Every project has a board; this hub shows what is happening and who is on it.','Open a project from its board card. Keep the status notes current every Friday. The calendar shows deadlines across all projects so clashes are visible.'),
  row([
   column('Live projects',420,[
    boardCard({title:'Brightwell — “Ride to work”',description:'National campaign. Production.',rows:[row([column('Status',360,[note('This week','Shoot day 2; edit starts Monday.',{color:'sand'}),task('Next',['Rough cut to client','OOH artwork to print'])]),column('Team',360,[table('Team',[['Role','Who'],['Account','Priya'],['Creative','Kemi + Tom'],['Producer','Sam']])])])]}),
    boardCard({title:'Hollow Oak — subscription relaunch',description:'Retention campaign. Strategy.',rows:[row([column('Status',360,[note('This week','Strategy approved. Concepts next.',{color:'sand'})])])]}),
    note('More projects','Kiln & Co. report · Arden & Moss site · Saltmarsh identity · Loop app'),
   ]),
   column('Pipeline',380,[table('New business',[['Prospect','Stage','Value'],['Rail co. scenic routes','Pitch','£180k'],['Library reopening','Proposal','£12k'],['Tea brand packaging','Chemistry','£40k']]),note('Win rate (12 mo)','42%',{color:'sage'})]),
   column('Team capacity',380,[chart('Booked this week (%)','bar',['Design','Copy','Strategy','Production','Accounts'],[{name:'Booked',values:[95,70,60,85,75]}],{max:100,values:true,card:{title:'Capacity by team — this week'}}),note('Flag','Design is over 90% — no new design work this week.',{color:'rose'})]),
   column('Studio',360,[photo('ph-ag-studio','Creative agency studio with people working at desks',{ratio:0.62,title:'The studio'}),task('Studio admin',['Friday show-and-tell','Timesheets by Monday 10:00','New starter onboarding — Lou'])]),
  ]),
  row([single(1660,timeline('Deadlines across projects',{mode:'date',days:28,items:[{ref:'ah1',at:3,len:1},{ref:'ah2',at:6,len:2,lane:1},{ref:'ah3',at:10,len:1,lane:2},{ref:'ah4',at:14,len:1},{ref:'ah5',at:20,len:3,lane:1},{ref:'ah6',at:24,len:1,lane:2}]}))]),
  row([grid(6,262,[note('Brightwell rough cut','',{key:'ah1',color:'sand'}),note('Kiln report to print','',{key:'ah2',color:'rose'}),note('Rail pitch','',{key:'ah3',color:'sky'}),note('Hollow Oak concepts','',{key:'ah4',color:'sand'}),note('Arden & Moss design review','',{key:'ah5'}),note('Brightwell OOH live','',{key:'ah6',color:'sage'})],{gap:18})]),
 ]});

t.push({id:'startup-hub',title:'Startup hub',category:'Startups',
 description:'A home for an early-stage startup: mission, metrics, priorities, roadmap, team, investor updates and links to working boards.',tags:['startup','hub','okrs','metrics','team'],
 rows:[
  intro('Startup hub — Porch (neighbourhood lending)','Seed-stage, five people, three neighbourhoods live. This board is where we start every Monday.','Monday: update metrics and choose the week’s top three. Working detail lives on the linked boards. Keep the decision log honest.'),
  row([
   column('Mission',340,[note('Why we exist','Make it normal to borrow from your street instead of buying from a shop.',{color:'sand'}),note('This quarter','Prove that lending sticks: 35% of members active weekly in 3 areas.')]),
   column('Metrics',380,[table('North star + inputs',[['Metric','Now','Goal'],['Weekly active','28%','35%'],['Loans / week','410','600'],['On-time returns','91%','90%'],['New areas','3','5']]),chart('Loans per week','line',['W1','W2','W3','W4','W5','W6'],[{name:'Loans',values:[220,260,300,330,380,410]}],{card:{title:'Loans per week'}})]),
   column('This week',340,[task('Top three',['Launch area 4 (Elm Park)','Ship damage-report flow','Investor update #6']),note('Blocked','Insurance partner contract still with legal.',{color:'rose'})]),
   column('Boards',380,[boardCard({title:'Product',description:'Roadmap, specs, research.',rows:[row([column('Now',360,[note('Damage reports','In build.'),note('Area launch kit','In design.')])])]}),boardCard({title:'Growth',description:'Area launches, partnerships.',rows:[row([column('Area playbook',360,[task('Launch an area',['Recruit 10 founding lenders','Street party pop-up','Local press'])])])]})]),
   column('Team & money',340,[table('Team',[['Who','Role'],['Asha','CEO'],['Ben','CTO'],['Chi','Design'],['Dev','Engineer'],['Eli','Community']]),note('Runway','14 months at current burn.',{color:'sage'})]),
  ]),
  row([column('Decision log',1820,[table('Decisions',[['When','Decision','Why'],['Wk 3','Rename Loop → Porch','Trademark space'],['Wk 6','No deposits on loans','Kills trust; insurance instead'],['Wk 9','Areas launch with a street party','3× sign-ups vs online only']])])]),
 ]});

t.push({id:'aarrr-metrics',title:'AARRR metrics',category:'Startups',also:['Product management','Marketing strategy'],
 description:'Track growth through acquisition, activation, retention, revenue and referral — with a metric, target, current value and experiments for each stage.',tags:['aarrr','pirate metrics','growth','funnel','experiments'],
 rows:[
  intro('Pirate metrics — Porch','Five stages of the funnel, each with one metric, the current number and the experiments running to move it.','One metric per stage — the one that best predicts the next stage. Fix the leakiest stage first; that is usually not acquisition.'),
  row([
   column('Acquisition',340,[note('Metric','Sign-ups per week in live areas.',{color:'sky'}),table('Now',[['','Value'],['Current','180'],['Target','250']]),task('Experiments',['Street-party launches','Flyers on borrowed items'])]),
   column('Activation',340,[note('Metric','% who borrow or lend within 7 days.',{color:'sky'}),table('Now',[['','Value'],['Current','31%'],['Target','45%']]),task('Experiments',['“First borrow” prompt with 3 nearby items','Welcome visit from a street host']),note('Leakiest stage','Focus here first.',{color:'rose'})]),
   column('Retention',340,[note('Metric','Weekly active (week 4).',{color:'sky'}),table('Now',[['','Value'],['Current','28%'],['Target','35%']]),task('Experiments',['Weekly “new on your street” email'])]),
   column('Revenue',340,[note('Metric','Paying members (Porch+).',{color:'sky'}),table('Now',[['','Value'],['Current','4%'],['Target','8%']]),task('Experiments',['Insurance included in Porch+'])]),
   column('Referral',340,[note('Metric','Invites accepted per active member.',{color:'sky'}),table('Now',[['','Value'],['Current','0.3'],['Target','0.6']]),task('Experiments',['“Lend to a neighbour” invite after a 5★ loan'])]),
  ]),
  row([single(1780,chart('Funnel — this month (users)','bar',['Visitors','Sign-ups','Activated','Retained (wk 4)','Paying','Referring'],[{name:'Users',values:[9800,720,223,62,29,22]}],{values:true,card:{title:'Funnel — this month'}}))]),
 ]});

t.push({id:'lean-canvas',title:'Lean canvas',category:'Startups',also:['Strategy'],
 description:'A one-page business plan: problem, customer segments, unique value proposition, solution, channels, revenue, costs, key metrics and unfair advantage.',tags:['lean canvas','business model','startup','one page'],
 rows:[
  intro('Lean canvas — Porch','The business on one page. Fill problem and customers first; the rest follows. Revisit monthly as experiments come back.','Write short, testable statements. Anything you haven’t validated, colour sand. When an experiment confirms it, turn it sage.'),
  row([
   column('Problem',320,[note('Top 3','1. People buy things they use twice\n2. Borrowing from neighbours feels awkward\n3. Things come back broken — and nobody says')],{minH:300}),
   column('Solution',320,[note('Top 3','1. Nearby items in one tap\n2. Request/return flow with reminders\n3. Condition photos + insurance',{color:'sand'})],{minH:300}),
   column('Unique value proposition',340,[note('UVP','**Borrow from your street, not the shop — safely.**',{color:'sand'})],{minH:300}),
   column('Unfair advantage',320,[note('Advantage','Street-by-street community launches that big platforms won’t do.',{color:'sand'})],{minH:300}),
   column('Customer segments',320,[note('Segments','Renters and young families in dense neighbourhoods.',{color:'sage'})],{minH:300}),
  ],{gap:16,after:16}),
  row([
   column('Existing alternatives',320,[note('Today','WhatsApp groups, tool libraries, buying.',{color:'plain'})],{minH:220}),
   column('Key metrics',320,[note('Metrics','Weekly active %, loans/week, on-time returns.')],{minH:220}),
   column('High-level concept',340,[note('Concept','“A library of things, run by your neighbours.”')],{minH:220}),
   column('Channels',320,[note('Channels','Street parties, flyers on borrowed items, local press, referrals.',{color:'sand'})],{minH:220}),
   column('Early adopters',320,[note('Who first','People already in street WhatsApp groups.',{color:'sage'})],{minH:220}),
  ],{gap:16,after:16}),
  row([
   column('Cost structure',832,[note('Costs','Team (5), insurance partner, cloud hosting, area launch events (£800 each).')]),
   column('Revenue streams',832,[note('Revenue','Porch+ £3/month (insurance + priority); later: partnerships with tool brands.',{color:'sand'})]),
  ],{gap:16}),
 ]});

t.push({id:'product-hub',title:'Product hub',category:'Product management',
 description:'A central space for product planning — vision, strategy, roadmap, discovery, specs and launches — with linked working boards.',tags:['product','hub','roadmap','discovery','specs'],
 rows:[
  intro('Product hub — Porch app','Where product decisions live. Vision on the left, what we are building now in the middle, discovery on the right.','Each initiative gets a board card that opens its spec. Move initiatives across Now / Next / Later as priorities change.'),
  row([
   column('Vision & strategy',360,[note('Vision','Every street has a shared shed.',{color:'sand'}),note('Strategy','Win dense neighbourhoods one at a time; make trust the product.'),note('Principles','- Trust before features\n- One-handed, one-minute flows\n- Never shame a borrower')]),
   column('Now',360,[boardCard({title:'Damage reports',description:'Spec + designs. In build.',rows:[row([column('Spec',380,[note('Problem','Things come back broken and nobody knows how to raise it.'),task('Acceptance',['Report in 3 taps','Photo required','Insurance claim auto-created'])])])]}),note('Area launch kit','In design.',{color:'sky'})]),
   column('Next',340,[note('Ratings v2','Ratings for items, not just people.'),note('Waitlist for popular items','')]),
   column('Later',340,[note('Tool brand partnerships',''),note('Neighbourhood events','')]),
   column('Discovery',360,[note('Open questions','- Would people pay to borrow?\n- Do landlords mind shared items in hallways?',{color:'sand'}),photo('ph-ph-research-wall','Research sticky notes on a wall during synthesis',{ratio:0.62,title:'Latest research wall'})]),
  ]),
 ]});

t.push({id:'user-stories',title:'User story map',category:'Product management',also:['Software development','UX design'],
 description:'Capture user needs as stories along the user journey, sliced into releases, so the team builds the smallest thing that works end to end.',tags:['user stories','story map','backlog','mvp'],
 rows:[
  intro('Story map — Porch MVP','The journey across the top; stories under each step; releases as horizontal slices.','Write stories as “As a…, I want…, so that…”. The top slice must let someone complete the whole journey, however basic. Move stories down to later releases freely.'),
  row([grid(5,320,[note('Find an item','',{color:'sand'}),note('Request it','',{color:'sand'}),note('Hand over','',{color:'sand'}),note('Use & return','',{color:'sand'}),note('Rate','',{color:'sand'})],{gap:20})],{after:24}),
  row([stack(1680,[heading('Release 1 — MVP')])],{after:12}),
  row([grid(5,320,[note('Search nearby','As a borrower, I want to search items within 500 m so that I can get one today.'),note('Send request','As a borrower, I want to request dates so the lender knows when.'),note('Confirm handover','As a lender, I want to confirm the item left my hands.'),note('Return reminder','As a borrower, I want a reminder the day before so I’m not late.'),note('Rate the person','As either, I want to rate the other so trust builds.')],{gap:20})],{after:24}),
  row([stack(1680,[heading('Release 2')])],{after:12}),
  row([grid(5,320,[note('Filter by category','',{color:'plain'}),note('Chat with lender','',{color:'plain'}),note('Condition photos','As a lender, I want photos at handover so damage is clear.',{color:'plain'}),note('Report damage','',{color:'plain'}),note('Rate the item','',{color:'plain'})],{gap:20})]),
 ]});

t.push({id:'product-launch-plan',title:'Product launch plan',category:'Product management',also:['Marketing campaigns'],
 description:'Plan a product launch: goals, audience, positioning, readiness checklists per team, go/no-go and a launch calendar.',tags:['launch','go to market','readiness','product'],
 rows:[
  intro('Launch — Porch in Elm Park (area 4)','The fourth neighbourhood launch, using the playbook from the first three. Four weeks to street party.','Every team has a readiness list. The go/no-go meeting checks them all; if any “must” is open, we move the date — not the bar.'),
  row([
   column('Goals',340,[table('Targets (30 days)',[['Metric','Target'],['Sign-ups','400'],['Activated','45%'],['Items listed','600'],['Loans','250']])]),
   column('Positioning',340,[note('Message','“Elm Park has a shared shed now. It’s called Porch.”',{color:'sand'}),photo('ph-pl-street-party','Neighbourhood street party with people and bunting',{ratio:0.62,title:'Launch moment: the street party'})]),
   column('Product',320,[task('Ready?',['Area added to map','Founding lender badges','Elm Park welcome flow'])]),
   column('Community',320,[task('Ready?',['10 founding lenders','Street hosts × 4','Street party permit'])]),
   column('Marketing',320,[task('Ready?',['Flyers (2,000)','Local press release','Instagram countdown'])]),
   column('Support',320,[task('Ready?',['FAQ for Elm Park','On-call rota launch week'])]),
  ]),
  row([single(1700,timeline('Launch calendar',{mode:'date',days:42,items:[{ref:'pl1',at:0,len:14},{ref:'pl2',at:7,len:14,lane:1},{ref:'pl3',at:21,len:1,lane:2},{ref:'pl4',at:22,len:6,lane:1},{ref:'pl5',at:28,len:1},{ref:'pl6',at:29,len:13,lane:2}]}))]),
  row([grid(6,268,[note('Recruit founding lenders','',{key:'pl1'}),note('Flyers + press','',{key:'pl2'}),note('Go / no-go','',{key:'pl3',color:'sand'}),note('Countdown','',{key:'pl4'}),note('Street party — launch','',{key:'pl5',color:'sage'}),note('30-day review','',{key:'pl6'})],{gap:18})]),
 ]});

t.push({id:'product-roadmap',title:'Product roadmap',category:'Product management',
 description:'Show where a product is going — themes, initiatives and milestones across quarters — on a calendar, tied to goals.',tags:['roadmap','product','quarters','themes','planning'],
 rows:[
  intro('Roadmap — Porch, next three quarters','Three themes, nine initiatives. Lanes are themes; clips are initiatives at their planned time.','A roadmap is a statement of intent, not a promise. Keep near-term items precise and later ones fuzzy. Every initiative links to a goal in the left column.'),
  row([
   column('Goals',360,[note('Q1 — Trust','On-time returns ≥ 92%; damage disputes < 1%.',{color:'sky'}),note('Q2 — Growth','10 areas live.',{color:'sage'}),note('Q3 — Revenue','8% paying members.',{color:'sand'})]),
   stack(1440,[timeline('Three quarters',{mode:'date',days:273,items:[{ref:'r1',at:0,len:45,lane:0},{ref:'r2',at:30,len:40,lane:0},{ref:'r3',at:60,len:30,lane:0},{ref:'r4',at:91,len:60,lane:1},{ref:'r5',at:100,len:50,lane:1},{ref:'r6',at:150,len:30,lane:1},{ref:'r7',at:182,len:45,lane:2},{ref:'r8',at:200,len:40,lane:2},{ref:'r9',at:230,len:40,lane:2}]},{lane:66})]),
  ]),
  row([
   column('Trust',580,[grid(3,174,[note('Damage reports','',{key:'r1',color:'sky'}),note('Condition photos','',{key:'r2',color:'sky'}),note('ID verification','',{key:'r3',color:'sky'})],{gap:12})]),
   column('Growth',580,[grid(3,174,[note('Area launch kit','',{key:'r4',color:'sage'}),note('Referral invites','',{key:'r5',color:'sage'}),note('Street hosts app','',{key:'r6',color:'sage'})],{gap:12})]),
   column('Revenue',580,[grid(3,174,[note('Porch+ with insurance','',{key:'r7',color:'sand'}),note('Brand partnerships','',{key:'r8',color:'sand'}),note('Business accounts','',{key:'r9',color:'sand'})],{gap:12})]),
  ]),
 ]});

t.push({id:'retrospective',title:'Project retrospective',category:'Product management',also:['Software development','Agencies'],
 description:'Look back on a project or sprint — what went well, what didn’t, what we learned — and leave with owned actions.',tags:['retrospective','retro','lessons','team'],
 rows:[
  intro('Retro — Brightwell “Ride to work” campaign','Blameless. Everyone adds stickies silently for 10 minutes, then we group and discuss.','Facts and feelings both count. Group similar stickies, vote with comments, and turn the top three into actions with an owner and a date.'),
  row([
   column('Went well',380,[sticky('Client workshops early — no surprises at presentation','',{color:'sage'}),sticky('Shoot came in under budget','',{color:'sage'}),sticky('Search + OOH combo worked','',{color:'sage'})]),
   column('Didn’t go well',380,[sticky('Social creative was cut-downs, not made for social','',{color:'rose'}),sticky('Partners signed too late','',{color:'rose'}),sticky('Two weekend edit days','',{color:'rose'})]),
   column('We learned',380,[sticky('Social needs its own shoot time','',{color:'sky'}),sticky('Partners need 8 weeks of lead time','',{color:'sky'})]),
   column('Actions',420,[table('Owned actions',[['Action','Owner','By'],['Social-first shoot block in every plan','Producer','Next brief'],['Partner contracts at kick-off','Account lead','Next project'],['No weekend edits without a day off back','Studio lead','Now']])]),
  ]),
 ]});

t.push({id:'customer-journey-map',title:'Customer journey map',category:'Product management',also:['UX research','Marketing strategy'],
 description:'Map a customer’s journey across stages — actions, touchpoints, thoughts, emotions and pain points — to find opportunities.',tags:['journey map','customer experience','touchpoints','emotions'],
 rows:[
  intro('Journey map — first loan on Porch','From hearing about Porch to the first return. Built from 12 interviews.','Each stage is a column. Rows read across: what they do, where, what they think, how they feel (chart), what hurts, and what we could do.'),
  row([
   column('Discover',330,[note('Does','Sees a flyer on a borrowed ladder.'),note('Touchpoint','Flyer, street WhatsApp.',{color:'plain'}),note('Thinks','“Is this a scam?”',{color:'sky'})]),
   column('Sign up',330,[note('Does','Downloads; verifies address.'),note('Touchpoint','App store, sign-up.',{color:'plain'}),note('Thinks','“Why do they need my address?”',{color:'sky'}),note('Pain','Address verification letter takes 3 days.',{color:'rose'})]),
   column('First request',330,[note('Does','Requests a drill.'),note('Touchpoint','App, push notification.',{color:'plain'}),note('Thinks','“Will they think I’m cheeky?”',{color:'sky'}),note('Pain','Waiting for a reply.',{color:'rose'})]),
   column('Handover',330,[note('Does','Meets the lender at the door.'),note('Touchpoint','Doorstep.',{color:'plain'}),note('Thinks','“That was nice, actually.”',{color:'sky'})]),
   column('Return',330,[note('Does','Returns it; rates.'),note('Touchpoint','Reminder, doorstep.',{color:'plain'}),note('Thinks','“I’ll lend my tent.”',{color:'sky'})]),
  ]),
  row([single(1730,chart('Emotion across the journey','line',['Discover','Sign up','First request','Handover','Return'],[{name:'Feeling (−5 to +5, shifted +5)',values:[5,3,2,8,9]}],{max:10,card:{title:'Emotion curve (0 = worst, 10 = best)'}}))]),
  row([column('Opportunities',1730,[grid(3,550,[note('Instant address check','Replace the letter with a bank-grade check.',{color:'sand'}),note('Reply-time badge','Show “usually replies in 10 min”.',{color:'sand'}),note('Lend prompt after a great return','“Got something to share?”',{color:'sand'})],{gap:20})])]),
 ]});

t.push({id:'porters-five-forces',title:'Porter’s five forces',category:'Strategy',
 description:'Assess an industry’s competitive pressure — rivals, new entrants, substitutes, buyer power and supplier power — and what it means for strategy.',tags:['porter','five forces','industry','competition'],
 rows:[
  intro('Five forces — specialty coffee subscriptions (UK)','How attractive is the market Hollow Oak is pushing into? Each force rated low / medium / high, with evidence.','Rate each force with evidence, not instinct. The centre card is rivalry; the four around it push on it. Finish with what the forces mean for us.'),
  row([place([
   [620,0,note('Threat of new entrants — HIGH','Low cost to start a roaster brand online; white-label roasting exists.',{color:'rose',w:340})],
   [0,300,note('Supplier power — MEDIUM','Green coffee prices volatile; direct-trade relationships reduce risk.',{color:'sand',w:340})],
   [620,300,note('Competitive rivalry — HIGH','Dozens of roasters online; supermarkets moving into “specialty”.',{color:'rose',w:340})],
   [1240,300,note('Buyer power — HIGH','Switching is one click; price comparisons easy.',{color:'rose',w:340})],
   [620,600,note('Threat of substitutes — MEDIUM','Pods, café coffee, tea. Home brewing habit is sticky once formed.',{color:'sand',w:340})],
   [1240,640,note('So what?','Compete on freshness, flexibility and community — things a white-label brand can’t copy fast. Lock in habit early.',{color:'sage',w:340})],
  ],{w:1580,h:820})]),
 ],
 edges:[]});
{const f=t.at(-1);const it=f.rows[1].row[0].items;['fe','fs','fr','fb','fsub','fso'].forEach((k,i)=>it[i][2].key=k);f.edges=[['fe','fr'],['fs','fr'],['fb','fr'],['fsub','fr'],['fr','fso','so what']].map(e=>[e[0],e[1],e[2]||'',{arrow:true}]);}

t.push({id:'stakeholder-map',title:'Stakeholder mapping',category:'Strategy',
 description:'Map stakeholders by influence and interest, note what each needs and how to engage them, and plan communication.',tags:['stakeholders','influence','interest','engagement'],
 rows:[
  intro('Stakeholders — library reopening','Who can make or break the reopening, and how we keep each of them on side.','Place each person or group on the grid: up = more influence, right = more interest. Top-right: manage closely. Write what they need and who owns the relationship.'),
  row([stack(200,[heading('High influence')]),column('Keep satisfied',620,[note('Council finance committee','Needs: cost certainty. Owner: director. Monthly brief.',{color:'sand'}),note('Local MP','Needs: a good-news story. Owner: comms.',{color:'sand'})],{minH:320}),column('Manage closely',620,[note('Cabinet member for culture','Needs: visible community benefit. Owner: director. Fortnightly.',{color:'rose'}),note('Friends of the Library','Needs: to be consulted, not told. Owner: head librarian.',{color:'rose'})],{minH:320})],{gap:24,after:24}),
  row([stack(200,[heading('Low influence')]),column('Monitor',620,[note('Neighbouring businesses','Needs: notice of noise and deliveries.',{color:'plain'})],{minH:280}),column('Keep informed',620,[note('Library users','Needs: dates, what’s new. Owner: comms. Newsletter.',{color:'sky'}),note('Staff','Needs: training, rotas. Owner: head librarian.',{color:'sky'})],{minH:280})],{gap:24}),
  row([stack(200,[]),stack(620,[heading('Low interest')]),stack(620,[heading('High interest')])],{gap:24}),
 ]});

t.push({id:'empathy-map',title:'Empathy map',category:'Strategy',also:['UX research'],
 description:'Explore what a person says, thinks, does and feels — plus their pains and gains — to build shared understanding of a user.',tags:['empathy map','user','research','says thinks does feels'],
 rows:[
  intro('Empathy map — the nervous dental patient','Built in the Fernhill workshop from 12 patient interviews. Quotes are real (anonymised).','Fill Says from quotes, Does from observation, Thinks and Feels from what lies underneath. Pains and gains at the bottom drive design decisions.'),
  row([
   column('Says',440,[note('“','“I’ll book when this tooth gets really bad.”'),note('“','“Just tell me what you’re going to do before you do it.”')],{color:'sky',minH:300}),
   column('Thinks',440,[note('','They’ll judge me for leaving it so long.'),note('','It’s going to hurt and cost a fortune.')],{color:'sand',minH:300}),
   stack(300,[photo('ph-em-person','Person looking thoughtful sitting in a waiting room',{ratio:1.1,title:'The patient'})]),
  ],{after:24}),
  row([
   column('Does',440,[note('','Cancels appointments the night before.'),note('','Googles every procedure in detail.')],{color:'sage',minH:280}),
   column('Feels',440,[note('','Embarrassed, out of control, anxious days before.'),note('','Huge relief afterwards.')],{color:'rose',minH:280}),
  ],{after:24}),
  row([column('Pains',440,[note('','Not knowing the price · being lectured · loss of control')],{color:'rose'}),column('Gains',440,[note('','Clear steps · a stop signal · no judgement · a calm room')],{color:'sage'})]),
 ]});

t.push({id:'value-proposition-canvas',title:'Value proposition canvas',category:'Strategy',also:['Startups','Product management'],
 description:'Match what customers need — jobs, pains, gains — with what you offer — products, pain relievers, gain creators — to test fit.',tags:['value proposition','canvas','jobs to be done','fit'],
 rows:[
  intro('Value proposition canvas — Porch','Customer profile on the right (what they need), value map on the left (what we offer). Fit is where they meet.','Start with the customer: jobs, pains, gains, ranked. Then design relievers and creators that address the top items. Draw a connector for every fit; anything unconnected is a gap or waste.'),
  row([
   column('Products & services',340,[note('','Porch app — borrow/lend nearby',{key:'v1'}),note('','Porch+ insurance',{key:'v2'}),note('','Street hosts',{key:'v3'})],{color:'stone'}),
   column('Pain relievers',340,[note('','Condition photos at handover',{key:'pr1',color:'sage'}),note('','Automatic return reminders',{key:'pr2',color:'sage'}),note('','Insurance covers breakage',{key:'pr3',color:'sage'})]),
   column('Gain creators',340,[note('','Meet neighbours naturally',{key:'gc1',color:'sky'}),note('','Save money and space',{key:'gc2',color:'sky'})]),
   stack(80,[]),
   column('Customer jobs',340,[note('','Get a one-off task done (put up a shelf)',{key:'j1'}),note('','Avoid clutter',{key:'j2'})]),
   column('Pains',340,[note('','Awkward to ask',{key:'p1',color:'rose'}),note('','Fear of breaking it',{key:'p2',color:'rose'}),note('','Forgetting to return',{key:'p3',color:'rose'})]),
   column('Gains',340,[note('','Feel part of the street',{key:'g1',color:'sand'}),note('','Spend less',{key:'g2',color:'sand'})]),
  ]),
 ],
 edges:[['pr1','p2'],['pr3','p2'],['pr2','p3'],['gc1','g1'],['gc2','g2']].map(e=>[e[0],e[1],'fits',{arrow:false}])});

t.push({id:'team-structure',title:'Team structure',category:'Strategy',also:['Agencies','Startups'],
 description:'An organisation chart with roles, responsibilities and reporting lines, plus open roles and how teams work together.',tags:['org chart','team structure','roles','responsibilities'],
 rows:[
  intro('Team structure — Porch (next 12 months)','Today’s five people and the four hires planned. Lines show who reports to whom.','One card per role, not per person — the person goes in the body. Dashed-style sand cards are open roles. Keep responsibilities to three bullets each.'),
  row([place([
   [700,0,note('CEO — Asha','- Strategy, fundraising\n- Hiring\n- Area partnerships',{key:'o0',color:'sand',w:280})],
   [100,280,note('CTO — Ben','- Architecture\n- Engineering team\n- Security',{key:'o1',w:280})],[700,280,note('Head of Design — Chi','- Product design\n- Research\n- Brand',{key:'o2',w:280})],[1300,280,note('Community lead — Eli','- Area launches\n- Street hosts\n- Support',{key:'o3',w:280})],
   [0,560,note('Engineer — Dev','App + backend',{key:'o4',w:240})],[300,560,note('Engineer (hire Q2)','Mobile',{key:'o5',color:'stone',w:240})],[700,560,note('Researcher (hire Q3)','Part-time',{key:'o6',color:'stone',w:240})],[1200,560,note('Community managers ×2 (hire Q2)','One per 5 areas',{key:'o7',color:'stone',w:280})],
  ],{w:1600,h:720})]),
 ],
 edges:[['o0','o1'],['o0','o2'],['o0','o3'],['o1','o4'],['o1','o5'],['o2','o6'],['o3','o7']].map(e=>[e[0],e[1],'',{arrow:false,style:'elbow'}])});

// ── Software ─────────────────────────────────────────────────────────────────
t.push({id:'technical-architecture',title:'Technical architecture',category:'Software development',
 description:'Document a system’s structure — clients, services, data stores and third parties — with responsibilities, data flows and decisions.',tags:['architecture','system design','services','data flow'],
 rows:[
  intro('Architecture — Porch platform','How the app, API, jobs and third-party services fit together. Arrows are data flows; labels say what moves.','One card per component with its responsibility and tech. Draw a connector for every data flow and label it. Decisions with trade-offs go in the ADR column so new people know why.'),
  row([place([
   [0,40,shape('Mobile app','iOS + Android, React Native','rectangle',{key:'a1',w:240,h:160,color:'sky'})],
   [0,280,shape('Admin web','Internal tools','rectangle',{key:'a2',w:240,h:160,color:'sky'})],
   [380,160,shape('API','Node · REST + webhooks','rectangle',{key:'a3',w:260,h:180,color:'sand'})],
   [760,0,shape('Postgres','Users, items, loans','ellipse',{key:'a4',w:240,h:150})],
   [760,200,shape('Object storage','Photos','ellipse',{key:'a5',w:240,h:150})],
   [760,400,shape('Job queue','Reminders, emails','rectangle',{key:'a6',w:240,h:150})],
   [1140,0,shape('Maps API','Geocoding','rectangle',{key:'a7',w:240,h:150,color:'plain'})],
   [1140,200,shape('Insurance partner','Claims API','rectangle',{key:'a8',w:240,h:150,color:'plain'})],
   [1140,400,shape('Push + email','Notifications','rectangle',{key:'a9',w:240,h:150,color:'plain'})],
  ],{w:1400,h:560}),
   column('Decisions (ADRs)',420,[note('ADR-004 — Monolith API','One service until 10 areas; split when a team owns a domain.'),note('ADR-007 — Photos in object storage','Signed URLs, 30-day retention after return.'),note('ADR-009 — Queue for reminders','Retries and scheduling without cron sprawl.')]),
  ]),
 ],
 edges:[['a1','a3','HTTPS'],['a2','a3','HTTPS'],['a3','a4','SQL'],['a3','a5','upload'],['a3','a6','enqueue'],['a3','a7','geocode'],['a3','a8','claims'],['a6','a9','send']].map(e=>[...e,{arrow:true}])});

t.push({id:'agile-sprint-board',title:'Agile task board',category:'Software development',also:['Productivity'],
 description:'Plan, track and prioritise a sprint: goal, backlog, in progress, review and done, with the sprint on a calendar and a burndown.',tags:['sprint','agile','scrum','burndown','tasks'],
 rows:[
  intro('Sprint 14 — damage reports','Two weeks, four engineers. Goal: a borrower can report damage with a photo and the insurance claim is created.','Stories move left to right; WIP limit 2 per person. Update the burndown at stand-up. Anything not done goes back to the backlog with a note.'),
  row([
   column('Sprint goal',320,[note('Goal','Report damage in 3 taps; claim created automatically.',{color:'sand'}),table('Capacity',[['Who','Points'],['Ben','8'],['Dev','10'],['Fay','10'],['Gus','6']])]),
   column('To do',320,[note('Claim status in app','3 pts',{tags:['Fay']}),note('Email to lender','2 pts',{tags:['Gus']})]),
   column('In progress',320,[note('Damage report flow (UI)','5 pts',{tags:['Dev'],color:'sand'}),note('Insurance API client','5 pts',{tags:['Ben'],color:'sand'})]),
   column('Review',320,[note('Photo upload with compression','3 pts',{tags:['Fay'],color:'sky'})]),
   column('Done',320,[note('Data model for reports','3 pts',{color:'sage'}),note('Design sign-off','2 pts',{color:'sage'})]),
   stack(440,[chart('Burndown (points)','line',['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10'],[{name:'Ideal',values:[34,30,27,23,20,17,13,10,6,0]},{name:'Actual (day 6)',values:[34,34,31,28,26,24]}],{card:{title:'Burndown'}})]),
  ]),
  row([single(1720,timeline('Sprint 14',{mode:'date',days:14,items:[{ref:'sp1',at:0,len:1},{ref:'sp2',at:0,len:12,lane:1},{ref:'sp3',at:12,len:1},{ref:'sp4',at:13,len:1,lane:2}]}))]),
  row([grid(4,415,[note('Planning','',{key:'sp1'}),note('Build','Stand-up 09:30 daily.',{key:'sp2',color:'sand'}),note('Review + demo','',{key:'sp3',color:'sage'}),note('Retro','',{key:'sp4'})],{gap:20})]),
 ]});

export default t;

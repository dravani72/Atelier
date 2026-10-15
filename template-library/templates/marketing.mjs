import {note,task,photo,link,heading,sticky,shape,table,file,timeline,column,stack,grid,single,place,row} from '../lib/dsl.mjs';
import {palette,typeSpecimen,chart,swatch} from '../lib/assets.mjs';
import {intro,photos,swatches} from '../lib/kit.mjs';

const t=[];

t.push({id:'marketing-plan',title:'Marketing plan',category:'Marketing strategy',also:['Startups'],
 description:'A year’s marketing on one board: goals, audience, positioning, channels, budget, quarterly priorities and how success is measured.',tags:['marketing plan','strategy','goals','channels','budget'],
 rows:[
  intro('Marketing plan — Hollow Oak Coffee (next 12 months)','A roastery with two cafés growing its online subscription. One plan for the café, wholesale and online.','Agree the goals first, then work right: who, what we say, where, how much, when. Review the scorecard monthly and the whole board quarterly.'),
  row([
   column('Goals',340,[table('Targets',[['Goal','Now','12 mo'],['Subscribers','420','1,500'],['Wholesale accounts','12','25'],['Café revenue','£410k','£450k'],['Email list','3,100','8,000']]),note('The one that matters most','Subscribers: steady revenue that pays for the third café.',{color:'sand'})]),
   column('Audience',340,[note('Coffee hobbyists','Own a grinder, read tasting notes, buy beans monthly.'),note('Neighbours','Café regulars who don’t know we sell beans.'),note('Offices & cafés','Wholesale buyers who want a local roaster with service.')]),
   column('Positioning',340,[note('Statement','For people who care where their coffee comes from, Hollow Oak is the neighbourhood roaster that roasts on Tuesday and delivers by Saturday — so it’s always fresh.',{color:'sand'}),note('Proof points','Roast dates on every bag · direct-trade farms · café you can visit')]),
   column('Channels',340,[table('Mix',[['Channel','Role'],['Cafés','Convert regulars'],['Email','Retention'],['Instagram','Community'],['Search','Gift buyers'],['Events','Cuppings, wholesale']])]),
   column('Budget',340,[table('£48,000',[['Line','£'],['Content + photo','9,000'],['Paid social','12,000'],['Search','6,000'],['Events','7,000'],['Packaging refresh','8,000'],['Contingency','6,000']])]),
  ]),
  row([single(1860,timeline('The year',{mode:'date',days:364,items:[{ref:'q1',at:0,len:91},{ref:'q2',at:91,len:91},{ref:'q3',at:182,len:91},{ref:'q4',at:273,len:91},{ref:'mx1',at:30,len:14,lane:1},{ref:'mx2',at:150,len:21,lane:1},{ref:'mx3',at:300,len:45,lane:1}]}))]),
  row([grid(7,250,[note('Q1 — foundations','Subscription page rebuild; café-to-beans offer.',{key:'q1'}),note('Q2 — community','Monthly cuppings; Instagram series on farms.',{key:'q2'}),note('Q3 — wholesale','Office trial packs; trade event.',{key:'q3'}),note('Q4 — gifting','Gift subscriptions; Christmas boxes.',{key:'q4'}),note('Subscriber push','“First bag free” for café regulars.',{key:'mx1',color:'sand'}),note('Summer cold brew','Café + online.',{key:'mx2',color:'sand'}),note('Christmas','Gift boxes; biggest month.',{key:'mx3',color:'sand'})],{gap:18})]),
 ]});

t.push({id:'customer-persona',title:'Customer persona',category:'Marketing strategy',also:['UX research','Branding','Market research','Graphic design','Website design'],
 description:'Profile a target customer — goals, behaviours, frustrations, motivations and context — grounded in research, to guide design and marketing.',tags:['persona','customer','ux','research','audience'],
 rows:[
  intro('Persona — “Morning Maya”','One of three personas for Hollow Oak Coffee’s subscription, built from 14 customer interviews and 600 survey answers.','A persona is a summary of real research, not a character sketch. Every card should be traceable to an interview or data. Use a real quote where you can.'),
  row([
   column('Who',320,[photo('ph-pe-maya','Woman in her thirties drinking coffee at home in the morning',{ratio:1.1,title:'Maya, 34'}),table('About',[['Item','Detail'],['Age','34'],['Lives','City flat, with partner'],['Work','Hybrid, product designer'],['Income','£48k']])]),
   column('Goals',340,[note('Wants','- A calm 20 minutes before work\n- Coffee as good as the café’s, at home\n- Never to run out',{color:'sage'}),note('Quote','> “The ritual is the point. I grind, I pour, I don’t look at my phone.”')]),
   column('Frustrations',340,[note('Pain points','- Supermarket beans taste flat\n- Subscriptions that arrive when she’s away\n- Too many choices, too much jargon',{color:'rose'})]),
   column('Behaviour',340,[table('Habits',[['Habit','Detail'],['Brews','Pour-over, weekdays'],['Buys','Monthly, ~£12/bag'],['Discovers','Friends, Instagram, the café'],['Reads','Tasting notes — briefly']])]),
   column('What it means for us',360,[note('Design for Maya','- Pause and skip in one tap\n- Three simple flavour profiles, not twenty origins\n- Roast date on the label, big',{color:'sand'}),note('Message','“Café-fresh beans, on your schedule.”')]),
  ]),
 ]});

t.push({id:'brand-positioning-map',title:'Brand positioning map',category:'Branding',also:['Marketing strategy','Brand workshops','Logo design','Market research'],
 description:'Plot competitors on two axes that matter to customers to find the gap your brand can own.',tags:['positioning','competitors','perceptual map','strategy'],
 rows:[
  intro('Positioning map — UK coffee roasters','Where we sit against eight competitors on the two things customers say matter most: price and how approachable the brand feels.','Choose axes customers actually care about (from research, not assumption). Place competitors as cards, then mark the gap. Debate placements as a team — the conversation is the value.'),
  row([place([
   [0,380,shape('Approachable ←','','rectangle',{w:200,h:120,color:'plain'})],[1500,380,shape('→ Expert','','rectangle',{w:200,h:120,color:'plain'})],
   [760,0,shape('Premium ↑','','rectangle',{w:200,h:110,color:'plain'})],[760,800,shape('↓ Affordable','','rectangle',{w:200,h:110,color:'plain'})],
   [240,120,note('Gift Box Co.','Premium gifting, friendly.',{w:220})],[1180,90,note('Origin Lab','Micro-lots, scientific.',{w:220})],[1240,300,note('Third Wave Collective','Expert, cool.',{w:220})],
   [1080,560,note('Bean Basics','Supermarket specialty.',{w:220})],[300,640,note('High Street Chain','Cheap, friendly, generic.',{w:220})],[660,700,note('Discount Pods','Convenience.',{w:220})],
   [460,220,note('Hollow Oak — target','Premium quality, neighbourly voice.',{color:'sand',w:240})],[1260,620,note('Roastery X','Expert but affordable.',{w:220})],
   [420,380,note('The gap','Expert-quality coffee, explained like a friend would. Nobody owns it.',{color:'sage',w:300})],
  ],{w:1700,h:910})]),
 ]});

t.push({id:'market-research',title:'Market research',category:'Market research',also:['Marketing strategy','Branding'],
 description:'A visual space to collect market size, trends, competitors, customer research, statistics and links — and the insight they add up to.',tags:['market research','trends','competitors','insights'],
 rows:[
  intro('Market research — at-home coffee','Background for the subscription push. Sources on every card; insights on the right.','Gather, then synthesise. Each column is a lens. The last column is what we believe now — every insight should point back to evidence on the board.'),
  row([
   column('Market',340,[chart('UK at-home specialty coffee (index)','line',['2021','2022','2023','2024','2025'],[{name:'Market',values:[100,108,117,124,133]}],{card:{title:'Market growth (illustrative index)'}}),note('Size','Specialty is a small but fast-growing slice of at-home coffee. Use the trade association’s figures in the final deck.')]),
   column('Trends',340,[note('Home brewing kit','Grinder and pour-over sales up since 2020.'),note('Subscriptions fatigue','People cancel subscriptions they can’t pause.',{color:'rose'}),note('Traceability','Shoppers want the farm, not just the country.')]),
   column('Competitors',360,[table('Subscriptions',[['Brand','Price/bag','Pause?'],['Origin Lab','£14','No'],['Third Wave','£12','Yes'],['Bean Basics','£8','N/A'],['Us','£11','Planned']])]),
   column('Customers',340,[photo('ph-mr-pour-over','Pour-over coffee being made at home',{ratio:0.66,title:'Home ritual'}),note('Survey (n=600)','62% would subscribe if they could skip a month. 48% don’t know we sell beans.')]),
   column('Insights',360,[note('1','Flexibility beats discounts: make pause/skip the headline.',{color:'sand'}),note('2','Our cafés are an untapped channel for beans.',{color:'sand'}),note('3','Farm stories differentiate us from the supermarket.',{color:'sand'})]),
  ]),
 ]});

t.push({id:'marketing-calendar',title:'Marketing calendar',category:'Marketing campaigns',also:['Marketing strategy'],
 description:'A visual overview of launches, campaigns, content and key dates for a quarter, on a calendar timeline with one lane per channel.',tags:['marketing calendar','launches','campaigns','dates'],
 rows:[
  intro('Marketing calendar — autumn quarter','Every launch, campaign and moment for thirteen weeks. Lanes: launches, email, social, events, retail.','One card per activity; its clip sits in the channel’s lane. When something moves, drag it — conflicts show up as crowded lanes.'),
  row([single(2060,timeline('Autumn — 13 weeks',{mode:'date',days:91,items:[
   {ref:'mc1',at:7,len:3,lane:0},{ref:'mc2',at:42,len:3,lane:0},{ref:'mc3',at:70,len:14,lane:0},
   {ref:'mc4',at:0,len:91,lane:1},{ref:'mc5',at:7,len:28,lane:2},{ref:'mc6',at:49,len:28,lane:2},
   {ref:'mc7',at:21,len:2,lane:3},{ref:'mc8',at:63,len:2,lane:3},{ref:'mc9',at:56,len:35,lane:4}]},{lane:60}))]),
  row([
   column('Launches',400,[note('New Ethiopian lot','Limited, 300 bags.',{key:'mc1',color:'sand'}),note('Pause & skip feature','Subscription update.',{key:'mc2',color:'sand'}),note('Gift boxes','Christmas range.',{key:'mc3',color:'sand'})]),
   column('Email',400,[note('Weekly newsletter','Every Thursday.',{key:'mc4',color:'sky'})]),
   column('Social',400,[note('Farm stories series','4 weeks, 2 posts/wk.',{key:'mc5',color:'rose'}),note('Gift guide','4 weeks.',{key:'mc6',color:'rose'})]),
   column('Events',400,[note('Public cupping','Saturday, café 1.',{key:'mc7',color:'sage'}),note('Wholesale open day','',{key:'mc8',color:'sage'})]),
   column('Retail',400,[note('In-café gifting display','',{key:'mc9'})]),
  ]),
 ]});

t.push({id:'social-media-calendar',title:'Social media calendar',category:'Marketing campaigns',also:['Content creation'],
 description:'Plan social posts with their copy and imagery, day by day, with platforms, formats and status — the week on a calendar ruler.',tags:['social media','calendar','posts','copy','content'],
 rows:[
  intro('Social calendar — week of the farm stories','Seven posts across Instagram and TikTok. Each card holds the copy; the image sits above it.','Write copy on the card exactly as it will be posted. Colour = status: sand drafting, sky ready, sage scheduled. Clips on the ruler are publish days.'),
  row([grid(5,330,[
   stack(330,[photo('ph-so-coffee-farm','Coffee farm with coffee plants on a hillside',{title:'Mon — farm intro',ratio:1.25}),note('Mon · IG carousel','Meet the farm behind this month’s coffee. 1,900 m up, 14 families, one washing station. Swipe → ☕️',{key:'so1',color:'sage'})],{gap:10}),
   stack(330,[photo('ph-so-coffee-cherries','Ripe red coffee cherries on a branch',{title:'Tue — cherries',ratio:1.25}),note('Tue · TikTok','What coffee looks like before it’s coffee. (It’s a fruit.) #coffeetok',{key:'so2',color:'sky'})],{gap:10}),
   stack(330,[photo('ph-so-roaster','Coffee roasting machine in a roastery',{title:'Thu — roast day',ratio:1.25}),note('Thu · Reel','Roast day. 12 minutes, 210 °C, one very loud crack.',{key:'so3',color:'sky'})],{gap:10}),
   stack(330,[photo('ph-so-cupping','Coffee cupping tasting with spoons and cups',{title:'Fri — cupping',ratio:1.25}),note('Fri · IG story','Join our public cupping on Saturday — link in bio.',{key:'so4',color:'sand'})],{gap:10}),
   stack(330,[photo('ph-so-bag','Coffee bag with a label on a café counter',{title:'Sun — in the café',ratio:1.25}),note('Sun · IG post','On the shelf now. Ask the barista for a taste.',{key:'so5',color:'sand'})],{gap:10}),
  ],{gap:20})]),
  row([single(1730,timeline('Publishing week',{mode:'date',days:7,items:[{ref:'so1',at:0,len:1},{ref:'so2',at:1,len:1,lane:1},{ref:'so3',at:3,len:1},{ref:'so4',at:4,len:1,lane:1},{ref:'so5',at:6,len:1}]},{h:250}))]),
 ]});

t.push({id:'marketing-content-plan',title:'Marketing content plan',category:'Marketing campaigns',also:['Content creation'],
 description:'Organise written and visual content for a campaign — pillars, formats, owners, status and where each piece will live.',tags:['content plan','editorial','marketing','pillars'],
 rows:[
  intro('Content plan — subscription relaunch','Twelve pieces of content across web, email and social, organised by the question each answers for the customer.','Plan from the customer’s questions. Each piece has an owner, a status and a home. Columns are the stages a piece moves through.'),
  row([
   column('Pillars',340,[note('Why fresh matters','Roast dates, flavour, storage.',{color:'sky'}),note('Where it comes from','Farms, people, prices paid.',{color:'sage'}),note('How to brew','Simple guides by method.',{color:'sand'})]),
   column('Ideas',340,[note('Guide: storing beans','Pillar: fresh. Blog + email.',{tags:['Ruth']}),note('Video: the 12-minute roast','Pillar: fresh. Reel.',{tags:['Ali']})]),
   column('In progress',340,[note('Farm profile: Huila','Pillar: origin. Blog + carousel.',{tags:['Sam'],color:'sand'}),note('Pour-over in 4 steps','Pillar: brew. Video + PDF.',{tags:['Ali'],color:'sand'})]),
   column('Ready',340,[note('Landing page copy','“Café-fresh beans on your schedule.”',{color:'sky'}),note('Welcome email series','3 emails.',{color:'sky'})]),
   column('Published',340,[note('Grinder buying guide','Top search traffic page.',{color:'sage'})]),
   column('Measures',340,[table('Per piece',[['Format','Measure'],['Blog','Search clicks'],['Email','Clicks to subscribe'],['Social','Saves + shares'],['Video','Watch-through']])]),
  ]),
 ]});

t.push({id:'campaign-strategy',title:'Campaign strategy',category:'Marketing campaigns',also:['Marketing strategy','Agencies'],
 description:'Define a campaign’s objective, audience, insight, idea, key messages, channel roles and measures before creative work starts.',tags:['campaign strategy','insight','big idea','channels'],
 rows:[
  intro('Campaign strategy — “Pause, don’t cancel”','Retention campaign for Hollow Oak’s subscription: stop people cancelling when life gets busy.','Read left to right as an argument: problem → audience → insight → idea → messages → channels → measures. If one card doesn’t follow from the last, the strategy isn’t finished.'),
  row([
   stack(280,[note('Problem','38% of subscribers cancel within 4 months — mostly “too much coffee” or “away”.',{key:'cs1',color:'rose'})]),
   stack(280,[note('Audience','Subscribers in months 2–4, especially those who skip a delivery.',{key:'cs2'})]),
   stack(280,[note('Insight','Cancelling feels like failing a habit. Pausing feels like a holiday.',{key:'cs3',color:'sky'})]),
   stack(300,[note('Idea','**Pause, don’t cancel.** Make pausing the hero: easy, friendly, guilt-free.',{key:'cs4',color:'sand'})]),
   stack(280,[note('Messages','- Off on holiday? Pause in one tap.\n- Too much coffee? Go monthly.\n- Come back whenever.',{key:'cs5'})]),
   stack(280,[table('Channels',[['Channel','Role'],['App/email','Trigger at skip'],['Packaging','Insert card'],['Café','Staff mention']])]),
   stack(280,[table('Measures',[['Metric','Target'],['4-month churn','38% → 25%'],['Pauses used','1,000'],['Reactivation','60%']])]),
  ],{gap:30}),
 ],
 edges:[['cs1','cs2','',{arrow:true}],['cs2','cs3','',{arrow:true}],['cs3','cs4','',{arrow:true}],['cs4','cs5','',{arrow:true}]]});

t.push({id:'marketing-assets',title:'Marketing assets',category:'Marketing campaigns',also:['Graphic design','Branding'],
 description:'Categorise and share logos, images, videos, templates and brand guidelines so anyone can find the right file fast.',tags:['assets','brand','library','logos','templates'],
 rows:[
  intro('Asset library — Hollow Oak Coffee','The approved files for partners, wholesale customers and the team. If it’s not here, it’s not approved.','One column per asset type. Each card says what it is for and where the master file lives. Replace files in place — never add “final_v2”.'),
  row([
   column('Logos',340,[photo('ph-ma-logo-stamp','Coffee shop logo stamped on a kraft paper cup',{ratio:0.75,title:'Logo in use'}),file('Logo pack','HollowOak_Logos.zip','Wordmark, symbol, one-colour, reverse. SVG + PNG.')]),
   column('Colour & type',340,[swatches([['#3e2c23','Roast'],['#c08552','Crema'],['#f3e9dc','Milk'],['#5e6b3b','Oak leaf']],2,146),file('Fonts licence note','fonts-readme.txt','Display: DM Serif Display (OFL). Text: Inter (OFL).')]),
   column('Photography',340,[photos([['ph-br-latte','Latte art in a ceramic cup on wood','Product'],['ph-br-barista','Barista making coffee','People']],1,308)]),
   column('Video',340,[file('Roast day — 30 s','HollowOak_RoastDay_30s.mp4','9:16 and 16:9.'),file('Brand film — 90 s','HollowOak_Brand_90s.mp4','Subtitled.')]),
   column('Templates',340,[file('Instagram templates','IG_templates.zip','Carousel, story, quote.'),file('Wholesale price list','Wholesale_2026.pdf','Updated quarterly.')]),
   column('Guidelines',340,[file('Brand guidelines','HollowOak_Guidelines.pdf','12 pages.'),note('Rules of use','Don’t stretch, recolour or outline the logo. Minimum width 24 mm.')]),
  ]),
 ]});

t.push({id:'campaign-report',title:'Campaign report',category:'Marketing campaigns',also:['Agencies'],
 description:'Report a campaign’s results — reach, engagement, conversion, ROI — against targets, with what worked, what didn’t and recommendations.',tags:['report','results','roi','metrics','campaign'],
 rows:[
  intro('Campaign report — “Take the long way”','Twelve weeks in market. Results against the targets set in the plan, what we learned and what to do next.','Lead with the answer: did it work? Then show the numbers that prove it, then what to change. Charts carry illustrative data — replace with your own exports.'),
  row([
   column('Headline',380,[note('Verdict','Bookings up 24% against a 20% target, at £7.80 per booking (target < £9). OOH outperformed; paid social underperformed.',{color:'sage'}),table('Scorecard',[['Metric','Target','Result'],['Bookings','+20%','+24%'],['Cost per booking','< £9','£7.80'],['Ad recall','35%','41%'],['Partner bookings','1,500','1,120']])]),
   stack(700,[chart('Weekly bookings vs last year','line',['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'],[{name:'This year',values:[310,340,420,510,560,590,610,640,600,580,560,540]},{name:'Last year',values:[300,310,330,380,420,450,470,480,470,460,440,430]}],{card:{title:'Weekly bookings — campaign vs last year'}})]),
   stack(700,[chart('Cost per booking by channel (£)','bar',['OOH','Film','Social','Search','Partners'],[{name:'£ per booking',values:[6.1,8.4,12.9,5.2,9.8]}],{values:true,card:{title:'Cost per booking by channel'}})]),
  ]),
  row([
   column('What worked',520,[note('Out-of-home at stations','Commuters planning weekends; best recall.',{color:'sage'}),note('Search','Cheapest bookings; captured demand the film created.',{color:'sage'})]),
   column('What didn’t',520,[note('Paid social','Expensive; creative too similar to OOH.',{color:'rose'}),note('Partners','Late start; two partners never went live.',{color:'rose'})]),
   column('Recommendations',520,[task('Next campaign',['Move 30% of social budget to search + OOH','Social-native creative (not cut-downs)','Partners signed 8 weeks before launch'])]),
  ]),
 ]});

t.push({id:'brand-swot',title:'Brand SWOT analysis',category:'Market research',also:['Brand workshops','Strategy'],
 description:'Assess a brand’s internal strengths and weaknesses and external opportunities and threats, then turn them into strategic moves.',tags:['swot','strategy','brand','analysis'],
 rows:[
  intro('SWOT — Hollow Oak Coffee','A workshop output with the founders and café managers. Four quadrants, then the moves they suggest.','Strengths and weaknesses are inside the business; opportunities and threats are outside. Be specific — “great coffee” is not a strength unless customers say it. Finish with strategies that pair quadrants (S+O, W+T…).'),
  row([column('Strengths',520,[note('Roast-to-door in 4 days','Freshness competitors can’t match.'),note('Two loved cafés','4.8★, regulars, a community.'),note('Direct-trade relationships','Real farm stories.')],{color:'sage',minH:380}),column('Weaknesses',520,[note('Website','Slow, subscription can’t be paused.'),note('Founder-dependent','Two people hold all supplier knowledge.'),note('Small marketing budget','')],{color:'rose',minH:380}),
   column('Strategies',560,[note('S+O','Use the cafés to sell subscriptions to regulars who already trust us.',{color:'sand'}),note('W+T','Ship pause/skip before a big competitor does it better.',{color:'sand'}),note('S+T','Lead on traceability as supermarkets copy “specialty” language.',{color:'sand'})])],{gap:30,after:30}),
  row([column('Opportunities',520,[note('Office coffee','Hybrid offices want better coffee.'),note('Gifting','Subscriptions as gifts at Christmas.'),note('Third café site','A vacant unit near the station.')],{color:'sky',minH:360}),column('Threats',520,[note('Green coffee prices','Up 30% this year.'),note('Supermarket “specialty” ranges','Cheaper, everywhere.'),note('Rent increases','Café 1 lease renews next year.')],{color:'stone',minH:360})],{gap:30}),
 ]});

t.push({id:'day-in-the-life',title:'Day in the life',category:'Market research',also:['UX research'],
 description:'Build a visual timeline of a customer’s day — activities, moods, touchpoints and photos — on a clock-time ruler, from research.',tags:['day in the life','customer','research','journey','timeline'],
 rows:[
  intro('A day in the life — Maya (subscription customer)','Reconstructed from a diary study and an interview. The ruler reads as clock time from 06:00 to 23:00.','Each moment is a card with what she does, feels and touches. Rose = friction, sage = delight. Opportunities go in the bottom row, linked to the moment that inspired them.'),
  row([single(2060,timeline('Maya’s Tuesday — clock time',{mode:'timecode',fps:'25',start:'06:00:00:00',end:'23:00:00:00',items:[{ref:'dl1',at:'06:45:00:00',out:'07:15:00:00'},{ref:'dl2',at:'08:00:00:00',out:'08:45:00:00',lane:1},{ref:'dl3',at:'09:00:00:00',out:'12:30:00:00',lane:2},{ref:'dl4',at:'13:00:00:00',out:'13:30:00:00',lane:0},{ref:'dl5',at:'18:30:00:00',out:'19:00:00:00',lane:1},{ref:'dl6',at:'21:30:00:00',out:'22:00:00:00',lane:0}]}))]),
  row([grid(6,330,[
   stack(330,[photo('ph-dl-grinder','Coffee grinder and pour-over set on a kitchen counter in the morning',{title:'06:45 — the ritual',ratio:0.7}),note('06:45 — brewing','Grinds, pours, no phone. The best 20 minutes of her day.',{key:'dl1',color:'sage'})],{gap:10}),
   stack(330,[photo('ph-dl-commute','Person commuting on a train looking at a phone',{title:'08:00 — commute',ratio:0.7}),note('08:00 — commute','Sees a “your coffee ships tomorrow” email. Panics: she’s away this weekend.',{key:'dl2',color:'rose'})],{gap:10}),
   stack(330,[photo('ph-dl-desk','Person working at a desk with a laptop and a coffee mug',{title:'09:00 — work',ratio:0.7}),note('09:00 — work','Forgets about it until lunch.',{key:'dl3'})],{gap:10}),
   stack(330,[photo('ph-dl-phone-lunch','Person using a smartphone in a café at lunchtime',{title:'13:00 — tries to pause',ratio:0.7}),note('13:00 — tries to pause','Can’t find pause. Emails support. Considers cancelling.',{key:'dl4',color:'rose'})],{gap:10}),
   stack(330,[photo('ph-dl-cafe-evening','Small neighbourhood café in the early evening',{title:'18:30 — café',ratio:0.7}),note('18:30 — café','Barista pauses it for her on the till. Relief.',{key:'dl5',color:'sage'})],{gap:10}),
   stack(330,[photo('ph-dl-evening-sofa','Person relaxing on a sofa in the evening with a book',{title:'21:30 — evening',ratio:0.7}),note('21:30 — evening','Orders a bag for a friend as a thank-you gift.',{key:'dl6',color:'sage'})],{gap:10}),
  ],{gap:16})]),
  row([column('Opportunities',2060,[grid(3,656,[note('Pause from the email','One-tap pause link in the shipping email.',{color:'sand'}),note('Café as service desk','Train baristas on subscriptions; give them a tablet.',{color:'sand'}),note('Gift moment','“Send a bag to a friend” after a positive moment.',{color:'sand'})],{gap:20})])]),
 ]});

t.push({id:'diary-study',title:'Diary study',category:'UX research',also:['Market research'],
 description:'Run a multi-day diary study: research questions, participants, prompts and entries over time on a calendar, plus emerging themes.',tags:['diary study','research','longitudinal','entries'],
 rows:[
  intro('Diary study — two weeks of home coffee','Eight subscribers log every brew for 14 days: what, when, how it felt. Entries sit on the calendar by day.','Prompt participants at the same time each day. Paste entries as cards (photo + note) under the day they were made. Every few days, cluster entries into themes on the right.'),
  row([
   column('Study',340,[note('Research questions','- When and why do people brew at home?\n- What makes a “good” coffee day vs a bad one?\n- When does the subscription get in the way?'),table('Set-up',[['Item','Detail'],['Participants','8 subscribers'],['Length','14 days'],['Prompt','Daily, 20:00'],['Incentive','£60 + a bag']])]),
   column('Daily prompt',340,[note('Prompt','1. Photo of today’s coffee.\n2. When and where did you drink it?\n3. How was it, 1–5, and why?\n4. Anything annoying about getting it?'),note('Participants','P1–P8, mix of methods and household sizes.')]),
   column('Emerging themes',380,[note('Weekends are different','Longer brews, shared with others, more experimenting.',{color:'sky'}),note('Running low is stressful','4 of 8 mention rationing beans before delivery.',{color:'rose'}),note('Rituals anchor the day','“If the coffee is right, the day starts right.”',{color:'sage'})]),
   column('Status',320,[task('Progress',['x Recruit 8','x Kick-off calls','Day 1–7 entries','Day 8–14 entries','Exit interviews','Synthesis'])]),
  ]),
  row([single(1460,timeline('Entries by day',{mode:'date',days:14,items:[{ref:'ds1',at:0,len:1},{ref:'ds2',at:1,len:1,lane:1},{ref:'ds3',at:5,len:2},{ref:'ds4',at:9,len:1,lane:1},{ref:'ds5',at:12,len:2}]}))]),
  row([grid(5,276,[note('Day 1 — P3','“First pour-over of the week. 4/5.”',{key:'ds1'}),note('Day 2 — P6','“Ran out. Instant. 1/5.”',{key:'ds2',color:'rose'}),note('Weekend — P1','“Made coffee for friends with the new bag. 5/5.”',{key:'ds3',color:'sage'}),note('Day 10 — P8','“Delivery came while I was away; beans sat on the doorstep.”',{key:'ds4',color:'rose'}),note('Weekend 2 — P5','“Tried the cold brew recipe from the email.”',{key:'ds5',color:'sage'})],{gap:20})]),
 ]});

export default t;

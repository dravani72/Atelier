import {note,task,photo,table,timeline,column,stack,grid,single,row} from '../lib/dsl.mjs';
import {intro,photos} from '../lib/kit.mjs';

// A creative brief: what, why, for whom, what to say, what to make, by when, and who signs it off.
// The schedule is a calendar timeline whose clips are the milestone cards under it.
function brief(c){
 const ms=c.schedule.map(([t,at,len,body],i)=>note(t,body||'',{key:`${c.id}-m${i}`,color:i===c.schedule.length-1?'sage':'paper'}));
 const days=Math.max(...c.schedule.map(([,at,len])=>at+len))+3;
 return {id:c.id,title:c.title,category:c.category||'Creative briefs',also:c.also||[],description:c.description,tags:c.tags,rows:[
  intro(c.heading,c.purpose,c.how||'Fill the brief together with the client in one session, then lock it. Anything not on this board is not in scope. When something changes, change the card and note the date in a comment.'),
  row([
   column('The project',360,[note('Background',c.background),table('At a glance',[['Item','Detail'],...c.facts])]),
   column('Goals',360,[note('Objective',c.objective,{color:'sand'}),table('How we’ll measure it',[['Measure','Target'],...c.kpis])]),
   column('Audience',360,[note('Who',c.audience),...(c.insight?[note('Insight',c.insight,{color:'sky'})]:[]),photo(c.refs[0][0],c.refs[0][1],{ratio:0.66,title:c.refs[0][2]})]),
   column('What to say',360,[note('Key message',c.message,{color:'sand'}),note('Tone',c.tone),task('Mandatories',c.mandatories)]),
   column('References',360,[...c.refs.slice(1).map(([k,w,tt])=>photo(k,w,{ratio:0.7,title:tt})),...(c.refNote?[note('What to take from them',c.refNote)]:[])]),
  ]),
  row([single(1960,timeline(c.scheduleTitle||'Schedule',{mode:'date',days,items:c.schedule.map(([,at,len],i)=>({ref:`${c.id}-m${i}`,at,len:Math.max(len,Math.round(days/22)),lane:i%3}))}))]),
  row([
   column('Deliverables',620,[table('What we make',c.deliverables)]),
   column('Milestones',600,[grid(2,276,ms,{gap:16,even:false})]),
   column('Budget',340,[note('Budget',c.budget)]),
   column('Approvals',320,[task('Sign-off',c.approvals)]),
  ]),
 ]};
}

const t=[];
t.push(brief({id:'advertising-brief',title:'Advertising brief',also:['Agencies','Marketing campaigns'],description:'Brief a creative team on an ad campaign: the business problem, audience insight, single-minded proposition, mandatories, deliverables and timings.',tags:['advertising','brief','campaign','proposition'],
 heading:'Ad brief — Brightwell Bikes “Ride to work”',purpose:'A fictional e-bike brand wants commuters to swap one car journey a week for a bike. National campaign, spring launch.',
 background:'Brightwell sells mid-priced e-bikes online. Awareness is high among cyclists and near zero among drivers — the people who would gain most.',facts:[['Client','Brightwell Bikes (fictional)'],['Budget','£420k working media + £90k production'],['Markets','UK, 6 cities'],['Launch','Week 9']],
 objective:'Get 25–45-year-old car commuters in six cities to book a free two-week trial.',kpis:[['Trial bookings','6,000'],['Consideration (drivers)','+8 pts'],['Cost per booking','< £70']],
 audience:'Car commuters, 5–15 km each way, who say they would cycle “if it weren’t for hills, sweat and rain”.',insight:'People don’t hate cycling; they hate arriving at work looking like they cycled.',
 message:'Arrive fresh, not flustered — Brightwell does the hard part.',tone:'Witty, warm, a bit smug about the traffic. Never preachy about the planet.',mandatories:['Free 2-week trial offer','Logo + URL in every execution','Rider wearing a helmet','No pricing in OOH'],
 refs:[['ph-ad-commuter-bike','Commuter riding a bicycle in a city in business clothes','The audience — cyclists in work clothes'],['ph-ad-traffic','Traffic jam in a city at rush hour','The enemy: traffic'],['ph-ad-cycle-lane','Protected cycle lane in a city','The promise: the empty lane']],refNote:'Contrast the stuck car with the moving bike — but make the driver the hero who chose differently, not the villain.',
 deliverables:[['Item','Format','Qty'],['Hero film','30 s + 15 s','1 + 2'],['Out-of-home','48-sheet, 6-sheet, digital','4 designs'],['Social','9:16 video, 1:1 static','12'],['Radio','30 s','2'],['Landing page','Key visual + copy','1']],
 budget:'Production £90k, including talent buy-outs for 12 months in the UK. Any additional format is quoted separately.',
 schedule:[['Brief sign-off',0,1],['Concepts (3 routes)',1,10,'Tissue session day 10'],['Client presentation',11,1],['Development',12,14],['Pre-production',26,10],['Shoot',36,2],['Post',38,14],['Launch',56,3]],
 approvals:['Brief — marketing director','Concept — CMO','Scripts — legal (claims)','Final — CMO']}));

t.push(brief({id:'design-brief',title:'Design brief',also:['Graphic design'],description:'Agree objectives, audience, style, deliverables, budget and timeline with a design client before work begins.',tags:['design brief','client','scope','graphic design'],
 heading:'Design brief — Kiln & Co. annual report',purpose:'A 24-page annual report for a community pottery studio, printed and as a PDF. It also needs to work as a fundraising pitch.',
 background:'Kiln & Co. is a not-for-profit studio that runs classes for 600 people a year. Last year’s report was a Word document. This year it has to persuade funders.',facts:[['Client','Kiln & Co. (fictional)'],['Contact','Studio director'],['Print run','300 copies'],['Deadline','AGM, week 7']],
 objective:'Make the studio’s impact obvious in two minutes of flicking — and help secure two new funders.',kpis:[['Funder meetings booked','4'],['New funding secured','£30k'],['Report downloads','500']],
 audience:'Local councillors, trusts and arts funders. Busy, sceptical, used to glossy reports.',insight:'Funders remember one person’s story better than a page of numbers.',
 message:'Clay changes lives here — and here is the proof.',tone:'Warm, confident, hand-made but organised. Let the work and the people be the decoration.',mandatories:['Funder logos on the back cover','Charity number','Accessible PDF (tagged)','Photos with consent only'],
 refs:[['ph-db-pottery-class','Pottery class with people at wheels','The people'],['ph-db-ceramics','Handmade ceramics on shelves','The work'],['ph-db-annual-report','Printed booklet or magazine spread on a table','Format reference']],refNote:'Big photos, big numbers, lots of white space. One story per spread.',
 deliverables:[['Item','Spec','Notes'],['Printed report','24 pp, A4, uncoated','Saddle-stitched'],['Interactive PDF','Tagged, < 10 MB','Web + email'],['Social cards','6 × 1:1','Key numbers'],['Funder one-pager','A4 double-sided','From the report']],
 budget:'£4,800 design + £1,350 print. Two rounds of amends included; further rounds at £65/h.',
 schedule:[['Kick-off',0,1],['Content from client',1,7],['Design concepts',8,5],['Layout',13,8],['Proof + amends',21,7],['Print',28,10],['AGM',45,1]],
 approvals:['Brief — director','Concept — director + board chair','Final proof — director','Print sign-off — designer']}));

t.push(brief({id:'brand-strategy-brief',title:'Brand strategy brief',also:['Branding','Brand workshops'],description:'Frame a brand strategy project: the business situation, positioning questions, audience, competitors, voice and the outputs expected.',tags:['brand strategy','positioning','brief','research'],
 heading:'Brand strategy brief — Fernhill Dental',purpose:'A group of five dental practices wants one brand that feels nothing like a dentist. The strategy must come before any logo.',
 background:'Five independent practices merged last year. Each has its own name, website and reputation. Patient anxiety is the biggest barrier to new bookings.',facts:[['Client','Fernhill Dental (fictional)'],['Sites','5 practices'],['Patients','~22,000'],['Scope','Strategy only — identity is phase 2']],
 objective:'Define one positioning, personality and story the five practices can share — that makes nervous patients book.',kpis:[['Staff alignment (survey)','80% agree'],['New patient bookings','+15% in 12 months'],['Review mentions of “calm”','2× baseline']],
 audience:'Adults who avoid the dentist out of fear or embarrassment — and the families they book for.',insight:'Nervous patients don’t want bravery; they want control: to know what will happen and to be able to stop.',
 message:'Dentistry that puts you in charge.',tone:'Calm, plain-speaking, kind. Never clinical, never cutesy.',mandatories:['Keep regulated terms accurate','Workshops with staff at all 5 sites','Patient interviews (min. 12)','No change to clinical services'],
 refs:[['ph-bs-calm-waiting','Calm modern waiting room with plants and natural light','The feeling we want'],['ph-bs-dentist-chair','Modern dental clinic room','Today’s reality'],['ph-bs-hand-hold','Two hands holding reassuringly','The emotional idea']],
 deliverables:[['Output','Format'],['Research summary','Deck'],['Positioning + proposition','1 page'],['Brand personality & voice','Guide, 10 pp'],['Brand story','Short + long version'],['Naming recommendation','If needed']],
 budget:'£28,000 fixed fee, including research, two workshops and all outputs. Travel billed at cost.',
 schedule:[['Kick-off',0,1],['Research & interviews',1,14],['Workshop 1 — discovery',15,1],['Positioning routes',16,10],['Workshop 2 — choose',26,1],['Voice & story',27,14],['Final presentation',42,1]],
 approvals:['Brief — managing partner','Routes — partners board','Final strategy — partners board']}));

t.push(brief({id:'media-planning-brief',title:'Media planning brief',also:['Marketing strategy'],description:'Brief a media planner: campaign goals, audience, channels, budget split, flighting and the measures that decide success.',tags:['media planning','channels','budget','flighting'],
 heading:'Media brief — Tidy Bins launch',purpose:'A fictional subscription bin-cleaning service launching in three cities. Small budget, very local audience.',
 background:'Tidy Bins cleans household wheelie bins every fortnight for £8 a month. Service operates postcode by postcode, so wasted reach outside them is wasted money.',facts:[['Client','Tidy Bins (fictional)'],['Budget','£60,000'],['Area','18 postcode districts'],['Period','8 weeks, spring']],
 objective:'Sign up 2,500 households in the launch postcodes at under £24 each.',kpis:[['Sign-ups','2,500'],['Cost per sign-up','< £24'],['Reach in postcodes','60% of households']],
 audience:'Homeowners 30–65 with gardens and families, in specific postcodes. Bin day is the trigger moment.',insight:'People only think about their bins on bin day — usually in the evening when they put them out.',
 message:'A clean bin every fortnight, without lifting a finger.',tone:'Practical, cheeky, neighbourly.',mandatories:['Geotarget to the 18 districts only','Price shown: £8/month','Promo code for tracking'],
 refs:[['ph-mp-wheelie-bins','Row of wheelie bins on a residential street','The moment: bin day'],['ph-mp-suburb','Suburban street with houses and gardens','The neighbourhoods'],['ph-mp-leaflet','Leaflet through a letterbox','Door-drop']],refNote:'Bin-day-evening timing for paid social; door-drops the week before launch in each area.',
 deliverables:[['Channel','Share','Role'],['Paid social (geo)','40%','Bin-day evening reach'],['Search','20%','Capture intent'],['Door-drops','25%','Postcode coverage'],['Local radio','10%','Fame'],['Bus-stop 6-sheets','5%','Local presence']],
 budget:'£60,000 total. Hold 10% back until week 3, then move it to the best cost-per-sign-up channel.',
 schedule:[['Brief',0,1],['Plan + buy',1,10],['Door-drop wave 1',12,7],['Live — phase 1',14,21],['Optimisation review',35,1],['Live — phase 2',36,21],['Wrap report',60,3]],
 approvals:['Plan — client founder','Creative per channel — agency lead','Final report — client founder']}));

t.push(brief({id:'digital-campaign-brief',title:'Digital campaign brief',also:['Marketing campaigns'],description:'Brief an online advertising campaign: objectives, platforms, audience segments, content plan, budget and metrics.',tags:['digital','paid social','performance','brief'],
 heading:'Digital brief — “First Fix” app launch',purpose:'Launching a fictional app that matches renters with vetted handypeople for small jobs. Performance-led, but it has to build trust.',
 background:'Beta in one city: 4.8 rating, 62% of first-time users book again. Now launching in four more cities.',facts:[['Client','First Fix (fictional)'],['Budget','£150k over 10 weeks'],['Platforms','Meta, TikTok, Google, App stores'],['Goal','Installs + first booking']],
 objective:'Drive 40,000 installs and 8,000 first bookings in the four new cities.',kpis:[['Installs','40,000'],['First bookings','8,000'],['Cost per first booking','< £18'],['Day-30 retention','35%']],
 audience:'Renters aged 22–38 who have a dripping tap and a landlord who won’t reply.',insight:'Renters fix nothing because they don’t trust strangers in their home — and don’t know what a fair price is.',
 message:'Fixed today, fair price, vetted pros.',tone:'Direct, helpful, a little funny about landlords.',mandatories:['Show the vetting badge','Price examples must be real','App store ratings only when ≥ 4.5'],
 refs:[['ph-dc-renter-phone','Young person using a phone in a rented apartment','The renter'],['ph-dc-dripping-tap','Dripping kitchen tap close-up','The trigger'],['ph-dc-handyperson','Handyperson repairing a door in a home','The pro']],
 deliverables:[['Asset','Format','Qty'],['UGC-style videos','9:16, 15–30 s','10'],['Static ads','1:1, 4:5','12'],['Search ads','RSA','4 sets'],['App store screenshots','6.7"','6'],['Landing pages','Per city','4']],
 budget:'£150k media, £25k creative. 70% always-on, 30% for city launch bursts.',
 schedule:[['Brief',0,1],['Creative sprint',1,10],['Test week',11,7],['City 1 + 2 launch',18,3],['City 3 + 4 launch',32,3],['Always-on',18,52],['Report',72,3]],
 approvals:['Brief — head of growth','Creative — brand lead','Weekly budget shifts — growth manager']}));

t.push(brief({id:'illustration-brief',title:'Illustration brief',also:['Visual art'],description:'Commission illustrations clearly: purpose, subject, style, format, usage rights, schedule and fee.',tags:['illustration','commission','brief','usage rights'],
 heading:'Illustration brief — city walking guide',purpose:'Twelve spot illustrations and a cover for a fictional printed walking guide to a historic city’s hidden courtyards.',
 background:'The guide is a pocket book sold in bookshops and museums. Illustrations replace photography so the book feels like a keepsake.',facts:[['Client','Little Lanes Press (fictional)'],['Illustrations','Cover + 12 spots'],['Print','A6, 4-colour'],['Fee','£3,600']],
 objective:'Make readers want to walk the routes — and keep the book afterwards.',kpis:[['Sell-through in 6 months','70%'],['Museum shop stockists','10']],
 audience:'Curious visitors and locals, 30–70, who like walking, history and beautiful objects.',
 message:'Every city has a secret city inside it.',tone:'Charming, observant, slightly whimsical. Architectural accuracy matters.',mandatories:['Cover leaves space for title + author','CMYK, 300 dpi','Spots work at 50 mm wide','Illustrator credited on cover'],
 refs:[['ph-ib-courtyard','Hidden courtyard with ivy and old stone in a historic city','Subject: courtyards'],['ph-ib-pen-ink','Pen and ink architectural drawing','Style: ink line'],['ph-ib-walking-map','Hand-drawn illustrated map','Map treatment']],refNote:'Fine ink line with two flat spot colours. Figures small, buildings the hero.',
 deliverables:[['Item','Size','Notes'],['Cover','A6 + bleed','Wraparound'],['Spot illustrations','12 × ~50 mm','One per walk'],['Route map','Double page','Optional, quote separately']],
 budget:'£3,600 for cover + 12 spots. Licence: print and e-book editions, worldwide, 7 years. Merchandise use negotiated separately.',
 schedule:[['Brief + contract',0,2],['Roughs',2,10],['Feedback',12,3],['Final artwork — batch 1',15,10],['Final artwork — batch 2',25,10],['Delivery',35,1]],
 approvals:['Roughs — editor','Final art — editor + publisher','Colour proof — production']}));

t.push(brief({id:'logo-brief',title:'Logo brief',category:'Logo design',also:['Creative briefs','Branding','Brand workshops'],description:'Give a designer everything needed for a logo: the business, audience, personality, competitors, where it will appear and what to avoid.',tags:['logo','brief','identity','branding'],
 heading:'Logo brief — Saltmarsh Swim Club',purpose:'A year-round open-water swimming club (fictional) needs a logo for caps, towels, a website and a flag on the beach hut.',
 background:'Founded by eight friends; now 340 members aged 18 to 84. Swims every morning at 7 a.m., all year.',facts:[['Client','Saltmarsh Swim Club'],['Applications','Caps, towels, flag, web'],['Colours','Max 2 for printing'],['Budget','£1,800']],
 objective:'A mark members are proud to wear — that reads on a swim cap from 20 m.',kpis:[['Members buying merch','40% in year 1'],['Readable at 16 px','Yes']],
 audience:'Members and the curious people who stop on the promenade to ask what they are doing.',
 message:'Cold water, warm people.',tone:'Bold, friendly, a bit eccentric. Not sporty-aggressive, not twee.',mandatories:['Works in one colour','Readable on a curved swim cap','Includes or pairs with the name','Est. 2019'],
 refs:[['ph-lb-sea-swimmers','Group of sea swimmers in the sea at sunrise','The members'],['ph-lb-beach-hut','Colourful beach huts on a promenade','The beach hut'],['ph-lb-swim-cap','Swimmers wearing bright swim caps','Application: caps']],refNote:'Simple, flag-like shapes. Think of maritime signal flags and old club badges.',
 deliverables:[['File','Formats'],['Primary logo','SVG, PDF, PNG'],['Symbol only','SVG, PNG'],['One-colour + reverse','SVG'],['Mini guide','PDF, 4 pp']],
 budget:'£1,800 for three initial routes, two rounds of refinement and final files.',
 schedule:[['Brief',0,1],['Research',1,4],['Three routes',5,7],['Presentation to committee',12,1],['Refinement',13,7],['Final files',20,2]],
 approvals:['Brief — committee chair','Route — committee vote','Final — committee chair']}));

t.push(brief({id:'marketing-brief',title:'Marketing brief',also:['Marketing strategy'],description:'Align a team on a marketing initiative: objectives, audience, proposition, channels, budget, timing and success metrics.',tags:['marketing','brief','objectives','channels'],
 heading:'Marketing brief — autumn term enrolment',purpose:'A fictional community arts centre needs to fill 40 evening courses for the autumn term.',
 background:'Spring term ran at 71% capacity. Pottery and life drawing sell out; writing and photography struggle. Most students hear about courses from friends.',facts:[['Client','Northgate Arts Centre (fictional)'],['Courses','40'],['Budget','£6,500'],['Term starts','Week 8']],
 objective:'Fill autumn courses to 90% capacity, with the weaker courses at 75% or more.',kpis:[['Overall capacity','90%'],['Writing & photo courses','75%'],['New students','35%']],
 audience:'Working adults 25–60 within 5 miles who want a creative evening out of the house.',insight:'People don’t sign up for a course; they sign up for a Tuesday night that is theirs.',
 message:'Your Tuesday night, made by you.',tone:'Encouraging, local, unpretentious.',mandatories:['Bursary places mentioned','Accessibility info','Book online or at the desk'],
 refs:[['ph-mb-life-drawing','Life drawing class in an art studio','Courses in action'],['ph-mb-arts-centre','Community arts centre building exterior','The building'],['ph-mb-writing-group','Small writing group around a table','The weaker courses — show them warmly']],
 deliverables:[['Item','Channel'],['Term brochure','Print + PDF'],['Course pages','Website'],['Bring-a-friend offer','Email + desk'],['Social posts','Instagram, Facebook (3/week)'],['Posters','Libraries, cafés']],
 budget:'£6,500: print £2,200, paid social £2,500, photography £1,200, contingency £600.',
 schedule:[['Brief',0,1],['Photography',2,3],['Brochure design',5,10],['Print',15,5],['Bookings open',21,1],['Campaign live',21,35],['Term starts',56,1]],
 approvals:['Brief — director','Brochure — programme manager','Spend — finance']}));

t.push(brief({id:'social-media-brief',title:'Social media brief',also:['Marketing campaigns','Content creation'],description:'Brief a social campaign: goals per platform, content pillars, tone of voice, formats, cadence, community rules and KPIs.',tags:['social media','content','platforms','brief'],
 heading:'Social brief — The Green Larder (season 2)',purpose:'A fictional zero-waste grocery shop wants a steady Instagram and TikTok presence that brings people in-store.',
 background:'Season 1 grew Instagram to 6k followers but posts were ad hoc. In-store, customers keep asking for recipes using what is on the shelves.',facts:[['Client','The Green Larder'],['Platforms','Instagram, TikTok'],['Cadence','5 posts/week'],['Period','12 weeks']],
 objective:'Turn followers into weekly shoppers: grow saves and in-store redemptions of a “seen it on Instagram” offer.',kpis:[['Followers (IG)','10k'],['Saves per post','80'],['Offer redemptions','400'],['TikTok avg watch','50%']],
 audience:'Local cooks 25–45 trying to waste less, short on time and ideas.',
 message:'Cook what’s in season, waste nothing, enjoy it.',tone:'Generous, practical, never preachy. Real kitchens, real mess.',mandatories:['Prices shown in captions','Alt text on every image','No influencer gifting without disclosure'],
 refs:[['ph-sm-zero-waste','Zero waste shop with bulk jars and dispensers','The shop'],['ph-sm-cooking-overhead','Overhead shot of cooking vegetables in a pan','Recipe format'],['ph-sm-market-veg','Seasonal vegetables at a market','Season']],
 deliverables:[['Pillar','Format','Per week'],['Recipe in 60 s','Reel / TikTok','2'],['What’s in this week','Carousel','1'],['Behind the counter','Stories','Daily'],['Customer kitchens','Reposts','1'],['Waste tips','Static','1']],
 budget:'£3,000 content production, £1,500 boosting the best recipe each week.',
 schedule:[['Brief',0,1],['Content shoot day 1',3,1],['Weeks 1–4',7,28],['Content shoot day 2',31,1],['Weeks 5–12',35,56],['Review',91,2]],
 approvals:['Brief — owner','Monthly content plan — owner','Boosts — owner']}));

t.push(brief({id:'website-design-brief',title:'Website design brief',category:'Website design',also:['Creative briefs','UX design'],description:'Define a website project: goals, audiences, content, features, look and feel, technical needs, budget and timeline.',tags:['website','brief','ux','scope'],
 heading:'Website brief — Arden & Moss architects',purpose:'A fictional small architecture practice needs a portfolio site that wins residential clients and shows its research work.',
 background:'Current site: a template from 2017 with 6 projects and no case studies. 80% of enquiries come from word of mouth; the site is where they check us out.',facts:[['Client','Arden & Moss (fictional)'],['Pages','~15 templates'],['CMS','Editable by staff'],['Launch','Week 12']],
 objective:'Turn word-of-mouth visitors into enquiries with case studies that show process, not just photos.',kpis:[['Enquiries / month','12 (from 4)'],['Time on case studies','2 min+'],['Lighthouse accessibility','95+']],
 audience:'Homeowners planning a major extension or new build (budget £250k+), plus planners and press.',insight:'Clients choose an architect they trust to listen. Show the conversation, not just the result.',
 message:'Thoughtful homes, made together.',tone:'Calm, precise, generous. Words as carefully designed as the buildings.',mandatories:['Accessible (WCAG 2.2 AA)','Fast on mobile','Staff can add projects','Planning documents downloadable'],
 refs:[['ph-wb-modern-house','Contemporary house extension with large windows and timber','Their work'],['ph-wb-architect-model','Architectural model on a desk','Process imagery'],['ph-wb-website-laptop','Laptop showing a minimal website on a desk','Format']],refNote:'Big images, quiet type, process sketches next to finished photos.',
 deliverables:[['Item','Notes'],['Sitemap + wireframes','All templates'],['Visual design','Desktop + mobile'],['Build','CMS + training'],['Case-study template','With 6 projects migrated'],['SEO basics','Redirects, metadata']],
 budget:'£24,000 design + build, plus £60/month hosting. Photography by the client.',
 schedule:[['Kick-off',0,1],['Discovery & sitemap',1,10],['Wireframes',11,10],['Visual design',21,14],['Build',35,28],['Content entry + QA',63,14],['Launch',80,1]],
 approvals:['Sitemap — partners','Design — partners','Content — office manager','Go-live — partners']}));

t.push(brief({id:'seo-brief',title:'SEO brief',also:['Website design','Marketing strategy'],description:'Brief an SEO project: keyword research, on-page fixes, content, links and the analytics to track it.',tags:['seo','keywords','content','search'],
 heading:'SEO brief — Hearth Stove Shop',purpose:'A fictional independent stove retailer wants to rank locally for wood-burner searches and stop losing them to national chains.',
 background:'Strong reviews (4.9, 300+) and a showroom, but the website ranks on page 3 for “wood burner [town]”. Product pages copy manufacturer text.',facts:[['Client','Hearth Stove Shop'],['Region','40-mile radius'],['Pages','~180 products'],['Period','6 months']],
 objective:'Rank in the top 3 locally for 15 priority keywords and double organic enquiries.',kpis:[['Top-3 priority keywords','15'],['Organic enquiries','2×'],['Google Business Profile calls','+50%']],
 audience:'Homeowners researching wood burners in winter; landlords; installers.',
 message:'The local experts who fit it, service it and answer the phone.',tone:'Helpful, expert, plain English.',mandatories:['No paid links','Keep product URLs','Track enquiries as conversions'],
 refs:[['ph-seo-wood-stove','Wood burning stove in a cosy living room','The product'],['ph-seo-showroom','Stove showroom or fireplace shop interior','The showroom'],['ph-seo-analytics','Laptop showing analytics charts','Reporting']],
 deliverables:[['Workstream','Output'],['Keyword research','Priority list + mapping'],['Technical audit','Fix list (crawl, speed, schema)'],['On-page','Rewrite top 30 product pages'],['Content','6 buying guides'],['Local','GBP optimisation + citations'],['Reporting','Monthly dashboard']],
 budget:'£1,400/month for 6 months, plus a £2,000 one-off technical sprint.',
 schedule:[['Audit',0,14],['Keyword map',7,7],['Technical fixes',14,21],['Product rewrites',21,42],['Guides',35,70],['Local push',14,30],['6-month review',180,1]],
 approvals:['Keyword map — owner','Content — owner','Technical changes — web developer']}));

t.push(brief({id:'press-release-brief',title:'Press release brief',also:['Marketing campaigns'],description:'Plan a press release: the news, key messages, quotes, audiences, target media, assets and embargo timings.',tags:['pr','press release','media','announcement'],
 heading:'Press brief — Harbourside Library reopens',purpose:'A fictional town library reopens after a two-year rebuild with a makerspace, a café and 24-hour access for members.',
 background:'The rebuild was controversial (cost, closure time). Reopening is the chance to reset the story with real users.',facts:[['Organisation','Harbourside Library (fictional)'],['News','Reopening + new services'],['Embargo','Day 21, 00:01'],['Spokesperson','Head librarian']],
 objective:'Land the reopening as a good-news story in regional media, with residents — not officials — as the heroes.',kpis:[['Regional pieces','10'],['Broadcast slots','2'],['Visitors week 1','5,000']],
 audience:'Local residents, families, students, regional journalists and the trade press for libraries and architecture.',
 message:'Open late, open to everyone, built with the town.',tone:'Proud, warm, factual. Acknowledge the wait honestly.',mandatories:['Cost figure stated plainly','Funder credit line','Accessible venue info','Photo consent forms'],
 refs:[['ph-pr-library-modern','Modern public library interior with people reading','The new space'],['ph-pr-makerspace','Makerspace with 3D printers and people working','The makerspace'],['ph-pr-ribbon','Ribbon cutting at an opening ceremony','Opening moment']],
 deliverables:[['Item','Notes'],['Press release','600 words'],['Media pack','Photos, floor plan, facts'],['Spokesperson briefing','Q&A incl. tough questions'],['Photo call','Day 21, 10:00'],['Social versions','Thread + video']],
 budget:'£2,500: photography £900, video £1,200, event £400.',
 schedule:[['Brief',0,1],['Draft release',1,4],['Approvals',5,3],['Embargoed sell-in',8,12],['Reopening day',21,1],['Follow-up',22,10]],
 approvals:['Release — head librarian','Facts & figures — council comms','Quotes — each person quoted']}));

t.push(brief({id:'event-brief',title:'Event brief',category:'Events',also:['Creative briefs'],description:'Record an event’s goals, audience, format, budget, venue, logistics and branding so stakeholders, vendors and team stay aligned.',tags:['event','brief','logistics','venue'],
 heading:'Event brief — Makers’ Market weekend',purpose:'A two-day market for 60 independent makers in a fictional former tram depot. Expected 6,000 visitors.',
 background:'The third year. Last year sold out of stalls in a week but visitors complained about queues for food and nowhere to sit.',facts:[['Organiser','Depot Makers (fictional)'],['Dates','Sat–Sun, week 10'],['Stalls','60 makers + 8 food'],['Budget','£38,000']],
 objective:'A sell-out, comfortable weekend where makers take more money than last year and visitors stay longer.',kpis:[['Visitors','6,000'],['Average maker takings','+15%'],['Dwell time','90 min'],['Visitor satisfaction','4.5/5']],
 audience:'Local families and design lovers, 25–55; makers as a second, equally important audience.',
 message:'Meet the people who make things.',tone:'Warm, crafty, community-first.',mandatories:['Step-free access everywhere','Seating for 200','Card payments for all stalls','Cashless bar'],
 refs:[['ph-eb-craft-market','Indoor craft market with stalls and visitors','The format'],['ph-eb-tram-depot','Industrial warehouse event venue with high ceilings','The venue'],['ph-eb-food-stalls','Street food stalls with people queuing','Food court — fix the queues']],
 deliverables:[['Workstream','Lead'],['Site plan + flow','Ops'],['Maker recruitment','Programme'],['Branding + signage','Design'],['Marketing campaign','Comms'],['Volunteers (40)','Ops']],
 budget:'£38,000: venue £9k, infrastructure £11k, marketing £6k, staffing £7k, contingency £5k. Stall fees return ~£24k.',
 schedule:[['Brief',0,1],['Maker applications',1,21],['Site plan',10,14],['Marketing',30,40],['Volunteer training',63,2],['Build',68,2],['Market weekend',70,2]],
 approvals:['Budget — trustees','Site plan — venue + safety officer','Branding — committee']}));

t.push(brief({id:'ux-research-brief',title:'UX research brief',category:'UX research',also:['Creative briefs','UX design'],description:'Outline a research study: goals, questions, methods, participants, logistics, outputs and timeline.',tags:['ux research','study','participants','methods'],
 heading:'Research brief — checkout drop-off',purpose:'A fictional online furniture shop loses 68% of shoppers between basket and payment. Why?',
 background:'Analytics show the drop happens on the delivery step. Customer service hears complaints about delivery slots and costs “appearing late”.',facts:[['Product','Online furniture shop'],['Method','Interviews + usability tests'],['Participants','10'],['Duration','3 weeks']],
 objective:'Understand why shoppers abandon at delivery, and identify the three changes most likely to fix it.',kpis:[['Sessions completed','10'],['Top issues with evidence','3+'],['Decision made by','Week 4']],
 audience:'People who bought — or nearly bought — a sofa or bed online in the last 6 months.',
 message:'Research questions: What do shoppers expect to know about delivery, and when? What makes them leave? What would make them finish?',tone:'Neutral, non-leading. We are testing the site, not the people.',mandatories:['Informed consent','Recordings stored securely, 90 days','Incentive £50','Mix of mobile and desktop'],
 refs:[['ph-ux-usability-test','Usability testing session with a participant at a laptop','Method'],['ph-ux-sofa-delivery','Sofa being delivered to a home','The real-world stakes'],['ph-ux-notes','Research notes and sticky notes on a wall','Synthesis']],
 deliverables:[['Output','Format'],['Discussion guide','Doc'],['Session notes','Per participant'],['Synthesis','Affinity map'],['Findings','Presentation + clips'],['Recommendations','Prioritised list']],
 budget:'£4,200: incentives £500, recruitment £1,200, researcher time.',
 schedule:[['Brief',0,1],['Recruitment',1,8],['Pilot session',8,1],['Sessions',9,5],['Synthesis',14,4],['Playback',19,1]],
 approvals:['Brief — product manager','Guide — design lead','Findings — product team']}));

t.push(brief({id:'ui-design-brief',title:'UI design brief',category:'UX design',also:['Creative briefs'],description:'Brief interface design: objectives, users, screens, components, interaction and style references, accessibility and handoff.',tags:['ui design','interface','components','brief'],
 heading:'UI brief — field inspection tablet app',purpose:'A fictional app for building inspectors to record defects on site. Used outdoors, in gloves, often in poor signal.',
 background:'Inspectors use paper forms and photos, then retype everything at the office. The new app must be faster than paper on day one.',facts:[['Product','Inspection app (fictional)'],['Device','10" tablet, landscape'],['Users','45 inspectors'],['Screens','~14']],
 objective:'Let an inspector log a defect with photo, location and severity in under 30 seconds, offline.',kpis:[['Time per defect','< 30 s'],['Errors in reports','−50%'],['Adoption at 1 month','90%']],
 audience:'Inspectors aged 30–64, varied tech confidence, working in rain, glare and gloves.',insight:'Speed beats features: anything that needs two hands or reading glasses will be skipped.',
 message:'Design principles: big targets (min 56 px), high contrast, one action per screen, works offline, nothing is ever lost.',tone:'Utilitarian, calm, confident.',mandatories:['WCAG AA contrast outdoors (aim AAA)','Offline-first','Dark mode for basements','Glove-friendly targets'],
 refs:[['ph-ui-inspector','Building inspector with a tablet on a construction site','Context of use'],['ph-ui-tablet-outdoors','Tablet used outdoors in daylight','Glare'],['ph-ui-defect','Crack in a concrete wall close-up','What they record']],
 deliverables:[['Item','Notes'],['User flows','Log defect, review, sync'],['Wireframes','14 screens'],['UI design','Light + dark'],['Component library','In the design tool'],['Prototype','For field tests']],
 budget:'£18,000 design. Two field tests with inspectors included.',
 schedule:[['Kick-off',0,1],['Flows',1,5],['Wireframes',6,8],['Field test 1',14,2],['UI design',16,12],['Field test 2',28,2],['Handoff',31,2]],
 approvals:['Flows — inspection lead','UI — product owner','Accessibility — QA']}));

t.push(brief({id:'app-design-brief',title:'App design brief',category:'UX design',also:['Creative briefs','Product management'],description:'Outline an app’s objectives, audience, features, user flow, platforms, style and launch plan.',tags:['app','mobile','brief','features'],
 heading:'App brief — “Loop” neighbourhood lending',purpose:'A fictional app for borrowing things from neighbours: drills, tents, gazebos, pasta machines.',
 background:'Pilot WhatsApp group in one street: 140 members, 300 loans in 3 months. People want it everywhere but trust and returns are the friction.',facts:[['Product','Loop (fictional)'],['Platforms','iOS + Android'],['MVP features','6'],['Launch','Week 16']],
 objective:'Launch an MVP that makes lending feel safe and simple in 3 neighbourhoods.',kpis:[['Active lenders / area','100'],['Loans returned on time','90%'],['Weekly active','35%']],
 audience:'Neighbours 25–70; renters and homeowners; people who own things they rarely use.',insight:'People are happy to lend — they’re worried about awkwardness when something comes back broken.',
 message:'Borrow from the street, not the shop.',tone:'Neighbourly, trustworthy, light.',mandatories:['Verified addresses','Clear return reminders','Simple damage policy','Accessible type sizes'],
 refs:[['ph-ab-tools-shelf','Shelf of household tools like drills and ladders','What gets lent'],['ph-ab-neighbours','Neighbours chatting on a residential street','The community'],['ph-ab-phone-map','Phone showing a map app','Nearby view']],
 deliverables:[['Feature','Priority'],['Post an item','Must'],['Browse nearby','Must'],['Request + approve','Must'],['Return reminders','Must'],['Ratings','Should'],['Damage reports','Should']],
 budget:'£60,000 for design + MVP build over 16 weeks.',
 schedule:[['Discovery',0,10],['Flows + wireframes',10,14],['Visual design',24,14],['Build',30,70],['Beta in 1 street',100,10],['Launch',112,1]],
 approvals:['Feature list — founders','Design — founders','Beta go/no-go — founders']}));

t.push(brief({id:'video-brief',title:'Video brief',category:'Creative briefs',also:['Filmmaking','Content creation'],description:'Brief a video production: objectives, audience, message, visual style, storyboard ideas, formats, distribution and KPIs.',tags:['video','production','brief','distribution'],
 heading:'Video brief — “A day at Fernhill”',purpose:'A 2-minute brand film for the fictional dental group, plus cut-downs, to calm nervous patients before their first visit.',
 background:'New patients say the waiting is worse than the treatment. Showing the whole visit, step by step, should take the fear out.',facts:[['Client','Fernhill Dental (fictional)'],['Length','2 min + 3 × 20 s'],['Shoot','1 day, 1 practice'],['Budget','£14,000']],
 objective:'Reduce first-visit cancellations by showing exactly what will happen.',kpis:[['Views from booking emails','60%'],['Cancellations','−20%'],['Completion rate','55%']],
 audience:'Anxious adults booking their first appointment.',
 message:'You’ll know every step, and you can stop at any time.',tone:'Calm, honest, gently funny. Real staff, real rooms.',mandatories:['Real patient with consent (not an actor)','Subtitles always','No needles on screen','Accessible audio description version'],
 refs:[['ph-vb-reception','Friendly receptionist at a clinic front desk','Scene: arrival'],['ph-vb-calm-face','Close-up of a calm smiling person','The feeling at the end'],['ph-vb-documentary-crew','Small documentary film crew filming in an office','Shoot style: small and light']],
 deliverables:[['Version','Format','Use'],['Hero film','2 min, 16:9','Booking emails, web'],['Cut-downs','3 × 20 s, 9:16','Social'],['Waiting-room loop','60 s, silent','Screens'],['AD version','2 min','Accessibility']],
 budget:'£14,000 inclusive: crew of 4, one shoot day, edit, grade, mix, captions.',
 schedule:[['Brief',0,1],['Treatment + script',1,7],['Recce',9,1],['Shoot day',16,1],['Edit',17,8],['Review',25,3],['Delivery',30,1]],
 approvals:['Script — clinical lead','Rough cut — practice manager','Final — managing partner']}));

t.push(brief({id:'motion-design-brief',title:'Motion design brief',category:'Motion design',also:['Creative briefs'],description:'Capture a motion project’s goals, scope, visual references, animation preferences, technical specs and schedule.',tags:['motion design','animation','brief','specs'],
 heading:'Motion brief — reforestation explainer',purpose:'A 90-second animated explainer for a fictional reforestation charity: how a donated sapling becomes a forest.',
 background:'Donors give once and never hear back. The film explains where money goes, and anchors a “follow your tree” email series.',facts:[['Client','Canopy Trust (fictional)'],['Length','90 s + 15 s'],['Style','2D, paper-cut texture'],['Budget','£16,500']],
 objective:'Turn one-off donors into monthly givers.',kpis:[['Monthly sign-ups via film','+30%'],['Watch-through','60%']],
 audience:'Existing one-off donors, 35–70, who like nature and want proof of impact.',
 message:'One seed today, a forest for your grandchildren.',tone:'Hopeful, patient, wonder-filled. No guilt, no doom.',mandatories:['Charity number on end card','Real tree numbers from the 2025 report','Subtitled + silent versions'],
 refs:[['ph-mb-forest-light','Sunlight through a young forest','Ending'],['ph-mb-seedling-hand','Hand holding a tree seedling','Opening image'],['ph-mb-paper-craft','Layered paper craft art landscape','Style']],
 deliverables:[['Item','Spec'],['Hero animation','90 s, 1920×1080, 25 fps'],['Social cut','15 s, 1080×1920'],['Style frames','5 key frames'],['Source files','After Effects project']],
 budget:'£16,500 for script support, design, animation, music licence and VO.',
 schedule:[['Brief',0,1],['Script + VO',1,7],['Style frames',8,7],['Storyboard + animatic',15,7],['Animation',22,21],['Sound + mix',43,4],['Delivery',48,1]],
 approvals:['Script — director of fundraising','Style frames — brand lead','Animatic — director','Final — CEO']}));

t.push(brief({id:'animation-brief',title:'Animation brief',category:'Creative briefs',also:['Motion design','Storyboards'],description:'Define an animation’s story, characters, style, technical specs, voice and music, deliverables and schedule.',tags:['animation','character','brief','story'],
 heading:'Animation brief — “Bea the Bus” series pilot',purpose:'A 7-minute pilot for a fictional pre-school series about a small electric bus who learns the city one route at a time.',
 background:'Commissioned by a children’s channel for a pilot, with an option for 26 episodes. Must teach a simple idea per episode — this one: taking turns.',facts:[['Commissioner','Children’s channel (fictional)'],['Length','7 min'],['Audience','Ages 3–5'],['Budget','£85,000']],
 objective:'A pilot that tests well with children and parents and earns the series order.',kpis:[['Child engagement (test)','80% attention'],['Parent rating','4.5/5'],['Series order','Yes']],
 audience:'Children 3–5 and the adults watching with them.',
 message:'Waiting your turn can be the best part of the day.',tone:'Gentle, funny, musical, never frantic. Big feelings, small stakes.',mandatories:['Max 2 new characters per episode','Clear, slow dialogue','No fast flashing','Inclusive cast of passengers'],
 refs:[['ph-an-city-bus','Small city bus in a colourful street','Bea, the character'],['ph-an-toy-town','Toy town or miniature city model','World scale'],['ph-an-kids-watching','Young children watching a screen together','Audience']],
 deliverables:[['Item','Spec'],['Pilot','7 min, 4K, 25 fps'],['Character sheets','6 characters'],['Backgrounds','12'],['Theme song','45 s'],['Script + animatic','For approval']],
 budget:'£85,000 including voice cast, original music and two rounds of child testing.',
 schedule:[['Script',0,14],['Design',10,21],['Animatic',31,14],['Voice record',40,2],['Animation',45,56],['Test screenings',101,4],['Delivery',110,1]],
 approvals:['Script — channel exec','Designs — channel exec','Animatic — channel exec + educational advisor','Final — channel']}));

t.push(brief({id:'photoshoot-brief',title:'Photoshoot brief',category:'Photography',also:['Creative briefs'],description:'Brief a photoshoot: concept, mood, locations, styling, props, lighting, shot list, crew and usage.',tags:['photoshoot','brief','styling','shot list'],
 heading:'Photo brief — “Slow Mornings” homeware',purpose:'Eight-page editorial and e-commerce lifestyle images for a fictional linen and ceramics brand.',
 background:'The brand sells online only; lifestyle photos double conversion compared with packshots. Current library is two years old.',facts:[['Client','Ember & Linen (fictional)'],['Shoot','2 days, one location'],['Images','40 final'],['Budget','£9,500']],
 objective:'A fresh image library that sells the feeling of a slow morning — usable across web, social and print for two years.',kpis:[['Final images','40'],['Product coverage','All 18 SKUs'],['Lifestyle CTR uplift','+20%']],
 audience:'Homeowners 30–55 who buy fewer, better things.',
 message:'Make the morning last.',tone:'Soft, natural, unposed. Light does the work.',mandatories:['Every SKU shown at least once','Both landscape and portrait of hero shots','Space for text on 6 images','Model release forms'],
 refs:[['ph-pb-flat','Bright apartment with large windows and wooden floors','Location'],['ph-pb-ceramic-breakfast','Breakfast with ceramics and linen napkins','Styling'],['ph-pb-model-morning','Person in a linen shirt by a window with coffee','Casting']],
 deliverables:[['Usage','Images','Crop'],['Web hero','6','16:9 + 4:5'],['Product pages','18','1:1'],['Social','12','4:5, 9:16'],['Print editorial','8 spreads','A4']],
 budget:'£9,500: photographer £3,200, stylist £1,600, model £1,400, location £1,200, props £900, retouching £1,200.',
 schedule:[['Brief',0,1],['Location + casting',1,7],['Moodboard sign-off',8,1],['Prop sourcing',9,5],['Shoot',15,2],['Selects',17,3],['Retouch + delivery',20,7]],
 approvals:['Moodboard — brand lead','Casting — brand lead','Selects — brand + e-com','Final — brand lead']}));

t.push(brief({id:'interior-design-brief',title:'Interior design brief',category:'Interior design',also:['Creative briefs','Architecture'],description:'Record a client’s vision, needs, constraints, style and budget for an interior design project.',tags:['interior design','brief','client','budget'],
 heading:'Interior brief — ground floor, Victorian terrace',purpose:'Living room, kitchen-diner and hall for a family of four (and a dog). Calm, warm, robust.',
 background:'The family moved in last year. The kitchen extension is built; the interiors are unfinished. They host often and want one room that stays tidy.',facts:[['Client','Private (fictional)'],['Rooms','Living, kitchen-diner, hall'],['Budget','£42,000'],['Move-in','Week 14']],
 objective:'A ground floor that is calm for adults, practical for kids and dog, and good for a dinner for twelve.',kpis:[['Within budget','±5%'],['On time for Christmas dinner','Yes']],
 audience:'Two adults (one works from home), children 6 and 9, a spaniel. Weekly guests.',
 message:'Style: warm minimal. Natural materials, soft colour, a few vintage pieces with character. Nothing precious at child height.',tone:'Relaxed, tactile, timeless.',mandatories:['Keep the original fireplace and cornicing','Dog-proof fabrics','Storage for 50 board games','Dimmable lighting everywhere'],
 refs:[['ph-ib-kitchen-diner','Kitchen diner with a long wooden table and pendant lights','Kitchen-diner'],['ph-ib-hallway-storage','Hallway with built-in storage bench and coat hooks','Hall storage'],['ph-ib-family-living','Family living room with sofa and toys tidied in baskets','Living room']],
 deliverables:[['Item','Notes'],['Concept + moodboard','Per room'],['Layout plans','Furniture + lighting'],['Product schedule','With prices + lead times'],['Joinery drawings','Alcoves + hall'],['Install day','Styling']],
 budget:'£42,000 for furniture, lighting, joinery and finishes. Design fee separate (£6,500).',
 schedule:[['Survey + brief',0,2],['Concept',2,10],['Presentation',12,1],['Detailed design',13,14],['Ordering',27,7],['Joinery + decorating',40,40],['Install + styling',95,3]],
 approvals:['Concept — both clients','Product schedule — both clients','Joinery drawings — clients + joiner']}));

t.push(brief({id:'model-brief',title:'Model brief',category:'Photography',also:['Fashion','Creative briefs'],description:'Communicate a shoot to a model and their agency: concept, look, wardrobe, poses, expressions, schedule and usage.',tags:['model','casting','brief','fashion','photography'],
 heading:'Model brief — “Fieldwork” lookbook',purpose:'Twelve looks for an AW fashion lookbook, shot outdoors on moorland. One model, one day.',
 background:'A small fictional label’s second collection. The lookbook is used for wholesale buyers, the website and press.',facts:[['Client','Hollin (fictional label)'],['Shoot','1 day, outdoors'],['Looks','12'],['Usage','Web, wholesale, press — 2 years']],
 objective:'Images that show how the clothes move and layer in real weather.',kpis:[['Looks shot','12/12'],['Usable images per look','3+']],
 audience:'Wholesale buyers and customers 28–50 who buy for longevity.',
 message:'Look: natural, weathered, strong. Minimal make-up, hair moving in the wind. Confident walking, not posing.',tone:'Grounded, unsmiling but warm, purposeful.',mandatories:['Comfortable on uneven ground in boots','Sizes 10–12 UK','Natural hair (no extensions)','Breaks every 90 minutes, warm car on standby'],
 refs:[['ph-mb-moorland','Moorland landscape with heather and big sky','Location'],['ph-mb-model-walking','Model walking outdoors in a long coat','Movement'],['ph-mb-natural-makeup','Natural minimal make-up portrait','Make-up']],
 deliverables:[['Item','Detail'],['Call time','06:30, unit base'],['Looks','12 in 3 locations'],['Poses','Walking, layering, detail crops'],['Fittings','Day −3, 1 h, studio']],
 budget:'Day rate and usage agreed via agency. Travel, food and accommodation provided.',
 schedule:[['Casting',0,5],['Option + confirm',5,2],['Fitting',11,1],['Shoot day',14,1],['Image approval',15,7]],
 approvals:['Casting — creative director','Fitting — designer','Selects — creative director']}));

t.push(brief({id:'renovation-brief',title:'Renovation design brief',category:'Home renovation',also:['Creative briefs','Interior design'],description:'Keep every renovation decision tied to your goals: how you live, what must change, budget, constraints and priorities.',tags:['renovation','home','diy','brief','priorities'],
 heading:'Renovation brief — 1960s bungalow',purpose:'Our own brief for renovating a 1960s bungalow: open up the kitchen, add a bathroom, insulate everything. Keep the mid-century character.',
 background:'Bought in spring. Sound structure, tired everything else: single glazing, 1990s kitchen, one bathroom for four people, cold in winter.',facts:[['Home','3-bed bungalow, 1964'],['Budget','£85,000 + 10%'],['Living on site','Yes, phased'],['Finish by','Next autumn']],
 objective:'A warm, light, efficient home with two bathrooms and a kitchen we can cook in together — finished before next winter.',kpis:[['EPC rating','C (from E)'],['Budget overrun','< 10%'],['Bathrooms','2']],
 audience:'Two adults, two teenagers, frequent visiting grandparents (one uses a stick).',insight:'We don’t need more space; we need the space we have to work.',
 message:'Must have: insulation + glazing, second bathroom, open kitchen. Nice to have: underfloor heating, garden room. Won’t do: loft conversion.',tone:'Mid-century, warm, practical.',mandatories:['Level access to one bathroom','Keep the parquet floor','Building regs for all structural work','Asbestos survey first'],
 refs:[['ph-rb-bungalow','Mid-century modern bungalow exterior','The house'],['ph-rb-mid-century-kitchen','Mid-century style kitchen with wood cabinets','Kitchen direction'],['ph-rb-parquet','Original parquet wooden floor','Keep: parquet']],
 deliverables:[['Phase','Scope'],['1 — envelope','Insulation, windows, doors'],['2 — kitchen','Wall out, new kitchen'],['3 — bathrooms','Ensuite + main bathroom'],['4 — finish','Decorating, garden']],
 budget:'£85,000 plus 10% contingency held separately. Biggest risk: hidden asbestos and the steel beam.',
 schedule:[['Surveys',0,14],['Design + quotes',14,42],['Phase 1 — envelope',60,30],['Phase 2 — kitchen',95,42],['Phase 3 — bathrooms',140,42],['Phase 4 — finish',185,30]],
 approvals:['Design — both of us','Structural — engineer + building control','Each phase — snag list signed']}));

t.push(brief({id:'market-research-brief',title:'Market research brief',category:'Market research',also:['Creative briefs','Strategy'],description:'Define research objectives, questions, methods, sample and outputs so a researcher can design the right study.',tags:['market research','brief','survey','methods'],
 heading:'Research brief — plant-based ready meals',purpose:'A fictional food company is deciding whether to launch a plant-based ready-meal range in supermarkets.',
 background:'Chilled vegan meals grew fast then slowed. Our flexitarian customers love our soups but we don’t know if they would pay ready-meal prices.',facts:[['Client','Good Pot Foods (fictional)'],['Method','Survey + focus groups'],['Sample','1,000 + 4 groups'],['Budget','£22,000']],
 objective:'Decide go/no-go on a plant-based range, and if go, which 4 dishes at what price.',kpis:[['Decision by','Week 8'],['Concept scores (top 2 box)','≥ 45% to proceed']],
 audience:'UK supermarket shoppers who buy ready meals weekly; boost of flexitarians and vegans.',
 message:'Key questions: Who buys plant-based ready meals now and why did some stop? Which dishes and price points? What would make ours different?',tone:'Neutral; avoid leading “health” framing.',mandatories:['Nationally representative base','Test 8 dish concepts','Price testing (Van Westendorp)','Raw data supplied'],
 refs:[['ph-mr-ready-meal','Supermarket chilled ready meals aisle','Category'],['ph-mr-focus-group','Focus group discussion around a table','Method'],['ph-mr-plant-food','Plant-based meal in a bowl','Product concept']],
 deliverables:[['Output','Format'],['Questionnaire','For approval'],['Topline','Week 5'],['Full report','Deck + data'],['Focus group video highlights','10 min']],
 budget:'£22,000: online survey £9k, 4 focus groups £10k, analysis £3k.',
 schedule:[['Brief',0,1],['Questionnaire design',1,7],['Fieldwork',8,10],['Focus groups',14,4],['Topline',21,1],['Final report',35,1],['Go/no-go meeting',40,1]],
 approvals:['Questionnaire — marketing director','Concepts — product team','Report — leadership']}));

export default t;

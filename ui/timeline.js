// Timeline cards: time arithmetic, ruler layout and integrity rules. No DOM and no imports, so Node tests run the same code.
// Positions are integers: frames counted from 00:00:00:00 in timecode mode, days since 1970-01-01 in date mode.
// A timeline covers [start, end). Connected cards are items with a position (at), a length (len) and a lane.
export const MAX_ITEMS=500,MAX_LANES=12,TC_MAX=21600000,DATE_MIN=-354285,DATE_MAX=2932896,DAY=864e5;
export const RATES=[
 {id:'23.976',label:'23.976 fps',fps:[24000,1001],drop:false},
 {id:'24',label:'24 fps',fps:[24,1],drop:false},
 {id:'25',label:'25 fps',fps:[25,1],drop:false},
 {id:'29.97df',label:'29.97 fps · drop frame',fps:[30000,1001],drop:true},
 {id:'29.97',label:'29.97 fps · non-drop',fps:[30000,1001],drop:false},
 {id:'30',label:'30 fps',fps:[30,1],drop:false},
 {id:'48',label:'48 fps',fps:[48,1],drop:false},
 {id:'50',label:'50 fps',fps:[50,1],drop:false},
 {id:'59.94df',label:'59.94 fps · drop frame',fps:[60000,1001],drop:true},
 {id:'59.94',label:'59.94 fps · non-drop',fps:[60000,1001],drop:false},
 {id:'60',label:'60 fps',fps:[60,1],drop:false}
];
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],WEEKDAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n)),pad=n=>String(n).padStart(2,'0');
const safeId=id=>typeof id==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(id);

// --- Timecode -------------------------------------------------------------
// Timecode counts at the whole-number base (23.976 counts 24 frames per second). Drop-frame skips labels, never frames:
// 2 labels per minute at 29.97 and 4 at 59.94, except every tenth minute. "Nominal" is the frame count the label implies.
export const base=tl=>Math.round(tl.fps[0]/tl.fps[1]);
const dropped=tl=>tl.drop?base(tl)/15:0;
export function toNominal(f,tl){
 const d=dropped(tl);if(!d)return f;
 const b=base(tl),minute=60*b-d,tenMinutes=600*b-9*d,tens=Math.floor(f/tenMinutes),rest=f-tens*tenMinutes;
 return f+9*d*tens+(rest<60*b?0:d*(1+Math.floor((rest-60*b)/minute)));
}
export function fromNominal(n,tl){
 const d=dropped(tl);if(!d)return n;
 const b=base(tl);let minutes=Math.floor(n/(60*b));const within=n-minutes*60*b;
 if(minutes%10&&within<d)n+=d-within; // a label that drop-frame skips resolves to the next real frame
 minutes=Math.floor(n/(60*b));return n-d*(minutes-Math.floor(minutes/10));
}
export function timecode(f,tl){
 const b=base(tl),n=toNominal(Math.max(0,Math.round(f)),tl);
 return `${pad(Math.floor(n/(3600*b)))}:${pad(Math.floor(n/(60*b))%60)}:${pad(Math.floor(n/b)%60)}${tl.drop?';':':'}${pad(n%b)}`;
}
// Accepts HH:MM:SS:FF, HH:MM:SS, MM:SS, plain seconds (decimals allowed) and frame counts such as 48f. Returns frames or null.
export function parseTimecode(text,tl){
 const b=base(tl),s=String(text??'').trim().toLowerCase().replace(/\s+/g,'');if(!s)return null;
 let n;
 if(/^\d+f$/.test(s))return clamp(Number(s.slice(0,-1)),0,TC_MAX);
 if(/^\d+(\.\d+)?s?$/.test(s))n=Math.round(parseFloat(s)*b);
 else{
  const fields=s.split(/[:;.]/);if(fields.length<2||fields.length>4||!fields.every(p=>/^\d{1,3}$/.test(p)))return null;
  const [h,m,sec,f]=fields.length===4?fields.map(Number):fields.length===3?[...fields.map(Number),0]:[0,...fields.map(Number),0];
  n=((h*60+m)*60+sec)*b+f;
 }
 return Number.isFinite(n)?clamp(fromNominal(n,tl),0,TC_MAX):null;
}
export const rateOf=tl=>RATES.find(r=>r.fps[0]===tl.fps[0]&&r.fps[1]===tl.fps[1]&&r.drop===tl.drop);
export function runtime(frames,tl){
 const b=base(tl);if(frames<b)return `${frames} ${frames===1?'frame':'frames'}`;
 const total=Math.round(frames*tl.fps[1]/tl.fps[0]),h=Math.floor(total/3600),m=Math.floor(total/60)%60,s=total%60;
 return [h&&`${h} h`,m&&`${m} min`,(s||!(h||m))&&`${s} s`].filter(Boolean).join(' ');
}

// --- Dates ----------------------------------------------------------------
export const dayNumber=(year,month,day)=>Math.round(Date.UTC(year,month-1,day)/DAY);
export function today(){const now=new Date();return dayNumber(now.getFullYear(),now.getMonth()+1,now.getDate());}
export const isoDate=n=>new Date(n*DAY).toISOString().slice(0,10);
export function parseDate(text){
 const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text??'').trim());if(!m)return null;
 const n=dayNumber(+m[1],+m[2],+m[3]);return n>=DATE_MIN&&n<=DATE_MAX&&isoDate(n)===m[0]?n:null;
}
const parts=n=>{const d=new Date(n*DAY);return {y:d.getUTCFullYear(),m:d.getUTCMonth(),d:d.getUTCDate(),w:d.getUTCDay()};};
export function dateLabel(n,year=true){const p=parts(n);return `${MONTHS[p.m]} ${p.d}${year?', '+p.y:''}`;}

// --- Labels ---------------------------------------------------------------
export const label=(u,tl)=>tl.mode==='date'?dateLabel(u):timecode(u,tl);
export function span(tl,i){
 if(tl.mode!=='date')return i.len?`${timecode(i.at,tl)} – ${timecode(i.at+i.len,tl)}`:timecode(i.at,tl);
 const last=i.at+i.len-1;if(last<=i.at)return dateLabel(i.at);
 return `${dateLabel(i.at,parts(i.at).y!==parts(last).y)} – ${dateLabel(last)}`;
}
export const when=(tl,i)=>tl.mode==='date'?dateLabel(i.at,false)+(i.len>1?` · ${i.len} days`:''):timecode(i.at,tl);
export function summary(tl){
 if(tl.mode==='date'){const days=tl.end-tl.start;return `${dateLabel(tl.start)} → ${dateLabel(tl.end-1)} · ${days} ${days===1?'day':'days'}`;}
 return `${timecode(tl.start,tl)} → ${timecode(tl.end,tl)} · ${rateOf(tl)?.label||'custom rate'} · ${runtime(tl.end-tl.start,tl)}`;
}

// --- Ruler ----------------------------------------------------------------
function timecodeSteps(b){
 const frames=[];for(let d=1;d<b;d++)if(b%d===0)frames.push(d);
 return [...frames,...[1,2,5,10,15,30,60,120,300,600,900,1800,3600,7200,14400,21600,43200,86400,172800].map(s=>s*b)];
}
function dateTicks(tl,px){
 const {start,end}=tl,first=parts(start),weekday=n=>((n%7)+11)%7;
 const mondays=()=>{const out=[];for(let u=start+(8-weekday(start))%7;u<end;u+=7)out.push(u);return out;};
 const months=every=>{const out=[];let total=first.y*12+first.m;total-=total%every;for(;out.length<600;total+=every){const u=dayNumber(Math.floor(total/12),total%12+1,1);if(u>=end)break;if(u>=start)out.push(u);}return out;};
 const named=(list,text)=>list.map((u,i)=>({u,label:text(parts(u),i)}));
 if(px>=40){const days=[];for(let u=start;u<end;u++)days.push(u);return {major:named(days,p=>px>=74?`${WEEKDAYS[p.w]} ${MONTHS[p.m]} ${p.d}`:`${MONTHS[p.m]} ${p.d}`),minor:[]};}
 if(px*7>=52){const days=[];if(px>=5)for(let u=start;u<end;u++)days.push(u);return {major:named(mondays(),p=>`${MONTHS[p.m]} ${p.d}`),minor:days};}
 if(px*30.44>=58)return {major:named(months(1),(p,i)=>MONTHS[p.m]+(i===0||p.m===0?' '+p.y:'')),minor:px*7>=7?mondays():[]};
 if(px*91.3>=64)return {major:named(months(3),p=>`${MONTHS[p.m]} ${p.y}`),minor:months(1)};
 const years=[1,2,5,10,20,50,100,200,500,1000].find(k=>px*365.25*k>=52)??1000;
 return {major:named(months(12*years),p=>String(p.y)),minor:years===1?months(3):px*365.25>=7?months(12):[]};
}
// Major ticks carry labels; minor ticks are bare positions. `width` is the drawn track width in board pixels.
function timecodeTicks(tl,px){
 const steps=timecodeSteps(base(tl)),major=steps.find(s=>s*px>=96)??steps.at(-1),minor=steps.find(s=>s<major&&major%s===0&&major/s<=10&&s*px>=7);
 const every=step=>{const out=[];for(let n=Math.ceil(toNominal(tl.start,tl)/step)*step;out.length<600;n+=step){const u=fromNominal(n,tl);if(u>tl.end)break;if(u>=tl.start)out.push(u);}return out;};
 return {major:every(major).map(u=>({u,label:timecode(u,tl)})),minor:minor?every(minor):[]};
}
export function ticks(tl,width){
 const px=width/(tl.end-tl.start),t=tl.mode==='date'?dateTicks(tl,px):timecodeTicks(tl,px);
 // Label the left edge too when the first aligned tick sits far enough along to leave room for it.
 const edge=tl.mode==='date'?dateLabel(tl.start,px*7<52):timecode(tl.start,tl),gap=((t.major[0]?.u??tl.end)-tl.start)*px;
 if(gap>=edge.length*6+16)t.major.unshift({u:tl.start,label:edge});
 return t;
}
// Dragging lands on whole days, or on the coarsest timecode step that is still finer than about seven pixels.
export function snap(tl,u,width){
 if(tl.mode==='date')return Math.round(u);
 let step=1;for(const s of timecodeSteps(base(tl))){if(s*width/(tl.end-tl.start)<=7)step=s;else break;}
 return Math.max(0,fromNominal(Math.round(toNominal(Math.max(0,Math.round(u)),tl)/step)*step,tl));
}

// --- Items ----------------------------------------------------------------
export const bounds=tl=>tl.mode==='date'?[DATE_MIN,DATE_MAX]:[0,TC_MAX];
export const connectable=type=>!!type&&type!=='timeline'&&type!=='column';
// A clip shows when part of it lies inside the range; a zero-length marker may also sit exactly on either end.
export const visible=(tl,i)=>i.len?i.at<tl.end&&i.at+i.len>tl.start:i.at>=tl.start&&i.at<=tl.end;
export const laneCount=tl=>clamp(Math.max(-1,...tl.items.map(i=>i.lane))+2,3,MAX_LANES);
export function defaults(mode='timecode',now=today()){
 const tl={mode,fps:[24,1],drop:false,start:0,end:1440,links:true,items:[]};
 if(mode==='date'){tl.start=now;tl.end=now+28;}return tl;
}
export function defaultLength(tl){
 if(tl.mode==='date')return 1;
 const b=base(tl),share=(tl.end-tl.start)/8;return Math.max(1,share>=b?Math.floor(share/b)*b:Math.round(share));
}
export function place(tl,i){
 const [lo,hi]=bounds(tl);
 i.len=clamp(Math.round(i.len),tl.mode==='date'?1:0,hi-lo);i.at=clamp(Math.round(i.at),lo,hi-i.len);i.lane=clamp(Math.round(i.lane),0,MAX_LANES-1);return i;
}
export function freeLane(tl,at,len,prefer=0,ignore=null){
 const room=Math.max(len,(tl.end-tl.start)/10),busy=lane=>tl.items.some(i=>i.id!==ignore&&i.lane===lane&&i.at<at+room&&i.at+Math.max(i.len,room)>at);
 for(let k=0;k<MAX_LANES;k++){const lane=(prefer+k)%MAX_LANES;if(!busy(lane))return lane;}
 return prefer;
}
export function nextFree(tl){
 const len=defaultLength(tl),ends=tl.items.filter(i=>visible(tl,i)).map(i=>i.at+i.len),at=ends.length?Math.max(...ends):tl.start;
 return at+len<=tl.end?at:tl.start;
}
export function connect(tl,id,card,at,len=defaultLength(tl),lane=0){
 if(tl.items.length>=MAX_ITEMS)throw Error(`A timeline holds at most ${MAX_ITEMS} connections.`);
 len=Math.min(len,tl.end-tl.start);
 const item=place(tl,{id,card,at:clamp(Math.round(at),tl.start,tl.end-len),len,lane:0});
 item.lane=freeLane(tl,item.at,item.len,clamp(lane,0,MAX_LANES-1));tl.items.push(item);return item;
}

// --- Settings -------------------------------------------------------------
export function setRange(tl,start,end,shift=false){
 const [lo,hi]=bounds(tl),from=clamp(Math.round(start),lo,hi-1),delta=from-tl.start;
 tl.start=from;tl.end=clamp(Math.round(end),from+1,hi);
 if(shift&&delta)for(const i of tl.items){i.at+=delta;place(tl,i);}
 return tl;
}
// Conforming keeps every timecode label where it was: 01:00:10:12 at 24 fps becomes 01:00:10:15 at 30 fps.
export function setRate(tl,id){
 const rate=RATES.find(r=>r.id===id);if(!rate)throw Error('Unknown frame rate');
 const before={fps:tl.fps,drop:tl.drop},after={fps:[...rate.fps],drop:rate.drop},scale=base(after)/base(before);
 const conform=f=>clamp(fromNominal(Math.round(toNominal(f,before)*scale),after),0,TC_MAX);
 const start=Math.min(conform(tl.start),TC_MAX-1),end=Math.max(start+1,conform(tl.end));
 for(const i of tl.items){const at=conform(i.at),out=conform(i.at+i.len);i.at=at;i.len=Math.max(0,out-at);}
 Object.assign(tl,after,{start,end});tl.items.forEach(i=>place(tl,i));return tl;
}
// Switching scale keeps each item at the same fraction of the way along the new range.
export function setMode(tl,mode,now=today()){
 if(tl.mode===mode||!['timecode','date'].includes(mode))return tl;
 const old={start:tl.start,end:tl.end},start=mode==='date'?now:0,end=mode==='date'?now+28:base(tl)*60,scale=(end-start)/(old.end-old.start);
 Object.assign(tl,{mode,start,end});
 for(const i of tl.items){const at=start+Math.round((i.at-old.start)*scale);i.len=Math.round(i.len*scale);i.at=at;place(tl,i);}
 return tl;
}

// --- Integrity ------------------------------------------------------------
// Drops connections whose card left the board. Run after anything that removes or moves cards.
export function prune(cards){
 const types=new Map(cards.map(c=>[c.id,c.type]));let removed=0;
 for(const c of cards)if(c.type==='timeline'&&c.timeline){const keep=c.timeline.items.filter(i=>i.card!==c.id&&connectable(types.get(i.card)));removed+=c.timeline.items.length-keep.length;c.timeline.items=keep;}
 return removed;
}
// For a copied timeline: fresh connection IDs, pointing at copied cards where they were copied too.
export function recopy(tl,newId,map){for(const i of tl.items){i.id=newId();if(map.has(i.card))i.card=map.get(i.card);}}
export function check(tl,own,types){
 const fail=()=>{throw Error('Invalid timeline');},int=n=>Number.isInteger(n);
 if(!tl||typeof tl!=='object'||Array.isArray(tl)||!['timecode','date'].includes(tl.mode)||typeof tl.drop!=='boolean'||typeof tl.links!=='boolean'||!Array.isArray(tl.fps)||tl.fps.length!==2||!rateOf(tl))fail();
 const [lo,hi]=bounds(tl);
 if(!int(tl.start)||!int(tl.end)||tl.start<lo||tl.end>hi||tl.start>=tl.end||!Array.isArray(tl.items)||tl.items.length>MAX_ITEMS)fail();
 const seen=new Set();
 for(const i of tl.items){
  if(!i||!safeId(i.id)||seen.has(i.id)||i.card===own||!connectable(types.get(i.card))||!int(i.at)||!int(i.len)||!int(i.lane)||i.at<lo||i.at>hi||i.len<(tl.mode==='date'?1:0)||i.len>hi-lo||i.lane<0||i.lane>=MAX_LANES)fail();
  seen.add(i.id);
 }
 return tl;
}
// Plain-text listing for Markdown export, earliest first.
export function describe(tl,cards){
 const title=id=>cards.find(c=>c.id===id)?.title||'Untitled';
 return [summary(tl),...[...tl.items].sort((a,b)=>a.at-b.at||a.lane-b.lane).map(i=>`- ${span(tl,i)} · ${title(i.card)}`)].join('\n');
}

export const uid=()=>{
 if(globalThis.crypto.randomUUID)return globalThis.crypto.randomUUID();
 const bytes=globalThis.crypto.getRandomValues(new Uint8Array(16));
 bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
 const hex=[...bytes].map(b=>b.toString(16).padStart(2,'0')).join('');
 return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
};
export const clone=x=>JSON.parse(JSON.stringify(x));
export const TYPES=['note','task','image','video','file','link','heading','column','board','sketch'];
export function board(name='Untitled board',parent=null){return {id:uid(),name,parent,description:'A place for your next idea.',color:'sage',cards:[],edges:[],view:{x:60,y:50,zoom:1},updated:Date.now()};}
export function card(type,x=80,y=80){return {id:uid(),type,x,y,w:type==='column'?300:250,h:type==='column'?540:type==='heading'?70:200,title:({note:'Untitled note',task:'To do',link:'Website',heading:'New section',column:'Ideas',image:'Image',video:'Video',file:'Attachment',sketch:'Sketch',board:'New board'})[type],body:'',color:type==='column'?'stone':'paper',tags:[],comments:[],items:type==='task'?[{id:uid(),text:'Add your first task',done:false}]:[],url:'',media:'',filename:'',boardId:null};}
export class History{
 constructor(limit=60){this.past=[];this.future=[];this.limit=limit;}
 push(w){this.past.push(clone(w));if(this.past.length>this.limit)this.past.shift();this.future=[];}
 undo(w){if(!this.past.length)return w;this.future.push(clone(w));return this.past.pop();}
 redo(w){if(!this.future.length)return w;this.past.push(clone(w));return this.future.pop();}
}
export function validate(w){
 if(!w||w.version!==1||!Array.isArray(w.boards)||!w.boards.length||w.boards.length>1000)throw Error('Unsupported or empty workspace');
 const safeId=id=>typeof id==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(id);
 const ids=new Set(w.boards.map(b=>b.id)),allCards=new Set();
 if(!w.boards.every(b=>safeId(b.id)))throw Error('Invalid board ID');
 if(ids.size!==w.boards.length||!ids.has(w.active))throw Error('Duplicate boards or missing active board');
 for(const b of w.boards){
  if(typeof b.id!=='string'||typeof b.name!=='string'||b.name.length>1000||typeof b.description!=='string'||typeof b.color!=='string'||!Number.isFinite(b.updated)||!Array.isArray(b.cards)||!Array.isArray(b.edges))throw Error('Invalid board');
  if(!b.view||!['x','y','zoom'].every(k=>Number.isFinite(b.view[k]))||b.view.zoom<.2||b.view.zoom>2)throw Error('Invalid board view');
  const seen=new Set();let current=b;
  while(current){if(seen.has(current.id))throw Error('Board hierarchy contains a cycle');seen.add(current.id);if(current.parent!==null&&!ids.has(current.parent))throw Error('Missing parent board');current=w.boards.find(x=>x.id===current.parent);}
  const cs=new Set();
  for(const c of b.cards){
   if(!safeId(c.id)||allCards.has(c.id)||!TYPES.includes(c.type)||!['x','y','w','h'].every(k=>Number.isFinite(c[k])&&Math.abs(c[k])<=100000)||c.w<20||c.h<20||typeof c.title!=='string'||typeof c.body!=='string'||typeof c.color!=='string'||typeof c.media!=='string'||typeof c.url!=='string'||typeof c.filename!=='string'||!Array.isArray(c.tags)||!c.tags.every(x=>typeof x==='string')||!Array.isArray(c.comments)||!c.comments.every(x=>typeof x.text==='string'&&typeof x.author==='string'&&Number.isFinite(x.date))||!Array.isArray(c.items)||!c.items.every(x=>safeId(x.id)&&typeof x.text==='string'&&typeof x.done==='boolean'))throw Error('Invalid card');
   if(c.type==='board'&&!ids.has(c.boardId))throw Error('Missing linked board');
   if(c.media&&!/^data:(image\/(png|jpeg|webp|gif)|video\/(mp4|webm|ogg)|application\/octet-stream|application\/pdf|text\/plain);base64,[A-Za-z0-9+/=]*$/.test(c.media))throw Error('Unsupported embedded media');
   cs.add(c.id);allCards.add(c.id);
  }
  const es=new Set();for(const e of b.edges){if(!safeId(e.id)||typeof e.label!=='string'||es.has(e.id)||!cs.has(e.from)||!cs.has(e.to)||e.from===e.to)throw Error('Invalid connector');es.add(e.id);}
 }
 return w;
}
export function removeCards(b,ids){b.cards=b.cards.filter(c=>!ids.has(c.id));b.edges=b.edges.filter(e=>!ids.has(e.from)&&!ids.has(e.to));}
export function duplicateCards(b,ids){const map=new Map(),copies=[];for(const c of b.cards.filter(c=>ids.has(c.id))){const n=clone(c);n.id=uid();n.x+=30;n.y+=30;map.set(c.id,n.id);copies.push(n);}b.cards.push(...copies);b.edges.push(...b.edges.filter(e=>map.has(e.from)&&map.has(e.to)).map(e=>({...e,id:uid(),from:map.get(e.from),to:map.get(e.to)})));return copies.map(c=>c.id);}
export function markdown(b){return `# ${b.name}\n\n${b.description}\n\n`+b.cards.filter(c=>c.type!=='column').map(c=>`## ${c.title}\n\n${c.body}${c.url?'\n'+c.url:''}${c.type==='task'?'\n'+c.items.map(i=>`- [${i.done?'x':' '}] ${i.text}`).join('\n'):''}${c.tags.length?'\n\nTags: '+c.tags.join(', '):''}\n`).join('\n');}
export const templates=[
 {id:'blank',name:'Blank canvas',label:'Start with a little space.',icon:'spark'},
 {id:'film',name:'Film pre-production',label:'Story, references, shots, and the plan.',icon:'film'},
 {id:'mood',name:'Moodboard',label:'Find the look. Set the feeling.',icon:'image'},
 {id:'writing',name:'Story development',label:'Characters, world, and structure.',icon:'pen'},
 {id:'campaign',name:'Creative campaign',label:'From the brief to the launch.',icon:'target'}
];
export function applyTemplate(b,id){
 if(id==='blank')return b;
 const sections=({film:['The story','Visual direction','Production'],mood:['The feeling','Color & texture','References'],writing:['The premise','Characters','World & structure'],campaign:['The brief','Creative territory','Delivery']})[id];
 sections.forEach((s,i)=>{let h=card('heading',60+i*320,50);h.title=s;h.w=280;b.cards.push(h);let n=card(i===2?'task':'note',60+i*320,145);n.w=280;n.h=220;n.title=({film:['Logline','Visual language','Before the shoot'],mood:['Three words','Palette notes','Collect inspiration'],writing:['What changes?','The protagonist','Story beats'],campaign:['The challenge','The big idea','Launch checklist']})[id][i];n.body=({film:['One sentence. A character, a desire, and what stands in the way.','Light, lens, movement, contrast. What should the audience feel?',''],mood:['Describe the feeling you want to create.','Gather colors, materials, and lighting references.',''],writing:['Start with the central tension.','Want. Need. Contradiction. Cost.',''],campaign:['Who is this for? What should they think, feel, or do?','A strong idea in a single sentence.','']})[id][i];n.color=i===0?'sage':i===1?'sand':'paper';if(n.type==='task')n.items=['Research & references','First draft','Review & refine'].map(text=>({id:uid(),text,done:false}));b.cards.push(n);});return b;
}
export function initial(){
 const b=board('The next great idea');b.description='Collect the sparks. Give them a shape.';
 const h=card('heading',60,40);h.title='A little room to think';h.w=650;h.body='Your ideas belong somewhere better than an open tab.';
 const n=card('note',60,155);n.title='It starts with a spark.';n.body='A passing thought. A color. A line of dialogue.\n\nBring it all here. Move things around. See what connects.';n.color='sage';n.h=240;n.tags=['inspiration'];
 const k=card('task',370,155);k.title='Make it yours';k.w=270;k.h=240;k.items=['Drop an image onto the canvas','Add a note or a link','Connect two ideas','Create a board for your project'].map((text,i)=>({id:uid(),text,done:i===0}));
 const p=card('note',60,450);p.title='A thought worth keeping';p.body='“Creativity is intelligence having fun.”\n\nOr perhaps it is simply paying attention.';p.color='sand';p.h=195;
 const sub=board('Visual references',b.id);sub.description='A collection of textures, moods, and possibilities.';
 const bc=card('board',370,450);bc.title=sub.name;bc.boardId=sub.id;bc.w=270;bc.h=195;
 b.cards.push(h,n,k,p,bc);b.edges.push({id:uid(),from:n.id,to:k.id,label:'Make it happen'});
 const m=board('Story development');applyTemplate(m,'writing');
 return {version:1,active:b.id,boards:[b,sub,m]};
}

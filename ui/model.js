import * as canvas from './canvas-model.js';
import {catalog,recipes} from './template-data.js';
import * as timeline from './timeline.js';
export {recipes};
export const uid=()=>{
 if(globalThis.crypto.randomUUID)return globalThis.crypto.randomUUID();
 const bytes=globalThis.crypto.getRandomValues(new Uint8Array(16));
 bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
 const hex=[...bytes].map(b=>b.toString(16).padStart(2,'0')).join('');
 return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
};
export const clone=x=>JSON.parse(JSON.stringify(x));
export const TYPES=['note','task','image','video','file','link','heading','column','board','sketch','model','timeline','sticky','shape','frame','table'];
export function board(name='Untitled board',parent=null){return {id:uid(),name,parent,description:'A place for your next idea.',color:'sage',cards:[],edges:[],view:{x:60,y:50,zoom:1},updated:Date.now()};}
export function card(type,x=80,y=80){const c={id:uid(),type,x,y,w:type==='timeline'?900:type==='column'?300:250,h:type==='timeline'?250:type==='column'?540:type==='heading'?70:200,title:({note:'Untitled note',task:'To do',link:'Website',heading:'New section',column:'Ideas',image:'Image',video:'Video',file:'Attachment',model:'3D model',sketch:'Sketch',board:'New board',timeline:'Timeline'})[type],body:'',color:type==='column'?'stone':'paper',tags:[],comments:[],items:type==='task'?[{id:uid(),text:'Add your first task',done:false}]:[],url:'',media:'',filename:'',boardId:null};if(type==='sticky'){c.title='Sticky note';c.color='sand';c.w=220;c.h=220;}if(type==='frame'){c.title='Frame';c.w=900;c.h=560;}if(type==='shape'){c.title='Shape';c.shape='rectangle';}if(type==='table'){c.title='Table';c.w=480;c.h=280;c.cells=[['Column 1','Column 2','Column 3'],['','',''],['','','']];}if(type==='timeline')c.timeline=timeline.defaults();return c;}
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
  if(b.template&&(!safeId(b.template.id)||typeof b.template.version!=='string'))throw Error('Invalid template provenance');
  if(b.projectFields&&(!b.projectFields||Array.isArray(b.projectFields)||Object.entries(b.projectFields).some(([k,v])=>!safeId(k)||typeof v!=='string'||v.length>10000)))throw Error('Invalid project fields');
  if(b.projectId!==undefined&&!safeId(b.projectId))throw Error('Invalid project ID');
  if(b.presentationOrder&&(!Array.isArray(b.presentationOrder)||b.presentationOrder.some(id=>!safeId(id))))throw Error('Invalid presentation order');
  const seen=new Set();let current=b;
  while(current){if(seen.has(current.id))throw Error('Board hierarchy contains a cycle');seen.add(current.id);if(current.parent!==null&&!ids.has(current.parent))throw Error('Missing parent board');current=w.boards.find(x=>x.id===current.parent);}
  const cs=new Set();
  for(const c of b.cards){
   if(!safeId(c.id)||allCards.has(c.id)||!TYPES.includes(c.type)||!['x','y','w','h'].every(k=>Number.isFinite(c[k])&&Math.abs(c[k])<=100000)||c.w<20||c.h<20||typeof c.title!=='string'||typeof c.body!=='string'||typeof c.color!=='string'||typeof c.media!=='string'||typeof c.url!=='string'||typeof c.filename!=='string'||!Array.isArray(c.tags)||!c.tags.every(x=>typeof x==='string')||!Array.isArray(c.comments)||!c.comments.every(x=>typeof x.text==='string'&&typeof x.author==='string'&&Number.isFinite(x.date))||!Array.isArray(c.items)||!c.items.every(x=>safeId(x.id)&&typeof x.text==='string'&&typeof x.done==='boolean'))throw Error('Invalid card');
   if(c.type==='board'&&!ids.has(c.boardId))throw Error('Missing linked board');
   if(c.media&&!/^data:(image\/(png|jpeg|webp|gif)|video\/(mp4|webm|ogg|quicktime|x-msvideo|x-matroska)|application\/octet-stream|application\/pdf|text\/plain);base64,[A-Za-z0-9+/=]*$/.test(c.media))throw Error('Unsupported embedded media');
   if(c.assets!==undefined&&(!Array.isArray(c.assets)||c.assets.length>100||c.assets.some(a=>typeof a.name!=='string'||a.name.length>1024||typeof a.data!=='string'||!/^data:(image\/(png|jpeg|webp|gif)|application\/octet-stream|text\/plain);base64,[A-Za-z0-9+/=]*$/.test(a.data))))throw Error('Invalid model resources');
   if(c.preview&&!/^data:image\/png;base64,[A-Za-z0-9+/=]*$/.test(c.preview))throw Error('Invalid model preview');
   if(c.modelView&&Object.entries(c.modelView).some(([k,v])=>!['position','rotation','scale','camera','target'].includes(k)||!Array.isArray(v)||v.length!==3||v.some(n=>!Number.isFinite(n)||Math.abs(n)>100000000)))throw Error('Invalid model view');
   if(c.localAttachment!==undefined&&!safeId(c.localAttachment))throw Error('Invalid managed attachment');
   if(c.localVideo!==undefined&&!safeId(c.localVideo))throw Error('Invalid managed video');
   if((c.type==='timeline')!==(c.timeline!==undefined))throw Error('Invalid timeline');
   cs.add(c.id);allCards.add(c.id);
  }
  canvas.checkCanvas(b,safeId);
  const types=new Map(b.cards.map(c=>[c.id,c.type]));for(const c of b.cards)if(c.type==='timeline')timeline.check(c.timeline,c.id,types);
  const es=new Set();for(const e of b.edges){if(!safeId(e.id)||typeof e.label!=='string'||es.has(e.id)||!cs.has(e.from)||!cs.has(e.to)||e.from===e.to)throw Error('Invalid connector');es.add(e.id);}
 }
 return w;
}
export function removeCards(b,ids){b.cards=b.cards.filter(c=>!ids.has(c.id));b.edges=b.edges.filter(e=>!ids.has(e.from)&&!ids.has(e.to));for(const c of b.cards)if(ids.has(c.sectionId))delete c.sectionId;if(b.presentationOrder)b.presentationOrder=b.presentationOrder.filter(id=>!ids.has(id));timeline.prune(b.cards);}
export function duplicateCards(b,ids){const map=new Map(),copies=[];for(const c of b.cards.filter(c=>ids.has(c.id))){const n=clone(c);n.id=uid();n.x+=30;n.y+=30;map.set(c.id,n.id);copies.push(n);}canvas.remap(copies,map,uid);for(const n of copies)if(n.timeline)timeline.recopy(n.timeline,uid,map);b.cards.push(...copies);b.edges.push(...b.edges.filter(e=>map.has(e.from)&&map.has(e.to)).map(e=>({...e,id:uid(),from:map.get(e.from),to:map.get(e.to)})));return copies.map(c=>c.id);}
export function markdown(b){return `# ${b.name}\n\n${b.description}\n\n`+b.cards.filter(c=>c.type!=='column').map(c=>`## ${c.title}\n\n${c.body}${c.type==='table'?'\n'+c.cells.map(row=>'| '+row.map(v=>v.replaceAll('|','\\|').replaceAll('\n',' ')).join(' | ')+' |').join('\n'):''}${c.url?'\n'+c.url:''}${c.type==='task'?'\n'+c.items.map(i=>`- [${i.done?'x':' '}] ${i.text}`).join('\n'):''}${c.type==='timeline'?'\n'+timeline.describe(c.timeline,b.cards):''}${c.tags.length?'\n\nTags: '+c.tags.join(', '):''}\n`).join('\n');}
export const templates=[
 {id:'blank',name:'Blank canvas',label:'Start with a little space.',icon:'spark'},
 {id:'film',name:'Film pre-production',label:'Story, references, shots, and the plan.',icon:'film'},
 {id:'mood',name:'Moodboard',label:'Find the look. Set the feeling.',icon:'image'},
 {id:'writing',name:'Story development',label:'Characters, world, and structure.',icon:'pen'},
 {id:'campaign',name:'Creative campaign',label:'From the brief to the launch.',icon:'target'}
,...catalog.templates.map(t=>({id:t.id,name:t.title,label:t.description,icon:'board',family:t.family,tags:t.tags,media:t.suggested_node_kinds}))
];
export function applyTemplate(b,id){
 const source=catalog.templates.find(t=>t.id===id);
 if(source){
  b.description=source.description;b.template={id:source.id,version:source.version};
  b.projectFields=Object.fromEntries(source.project_fields.map(key=>[key,'']));
  const map=new Map();
  for(const section of source.sections){const c=card('column',section.x+60,section.y+50);c.title=section.label;c.w=section.width;c.h=section.height;c.color='stone';map.set(section.id,c.id);b.cards.push(c);}
  for(const node of source.nodes){const section=source.sections.find(s=>s.id===node.section_id);const c=card('note',section.x+node.x+60,section.y+node.y+50);c.w=node.width;c.h=node.height;c.title=node.content.title;c.body=node.content.value||node.content.prompt;c.prompt=node.content.prompt;c.sectionId=map.get(node.section_id);map.set(node.id,c.id);b.cards.push(c);}
  b.presentationOrder=source.presentation.order.map(id=>map.get(id));
  b.edges.push(...source.edges.map(e=>({...e,id:uid(),from:map.get(e.from),to:map.get(e.to)})));
  return b;
 }
 if(id==='blank')return b;
 if(!templates.some(t=>t.id===id))throw Error('Unknown template');
 const sections=({film:['The story','Visual direction','Production'],mood:['The feeling','Color & texture','References'],writing:['The premise','Characters','World & structure'],campaign:['The brief','Creative territory','Delivery']})[id];
 sections.forEach((s,i)=>{let h=card('heading',60+i*320,50);h.title=s;h.w=280;b.cards.push(h);let n=card(i===2?'task':'note',60+i*320,145);n.w=280;n.h=220;n.title=({film:['Logline','Visual language','Before the shoot'],mood:['Three words','Palette notes','Collect inspiration'],writing:['What changes?','The protagonist','Story beats'],campaign:['The challenge','The big idea','Launch checklist']})[id][i];n.body=({film:['One sentence. A character, a desire, and what stands in the way.','Light, lens, movement, contrast. What should the audience feel?',''],mood:['Describe the feeling you want to create.','Gather colors, materials, and lighting references.',''],writing:['Start with the central tension.','Want. Need. Contradiction. Cost.',''],campaign:['Who is this for? What should they think, feel, or do?','A strong idea in a single sentence.','']})[id][i];if(n.type==='task')n.items=['Research & references','First draft','Review & refine'].map(text=>({id:uid(),text,done:false}));b.cards.push(n);});return b;
}
export function initial(){
 const b=board('The next great idea');b.description='Collect the sparks. Give them a shape.';
 const h=card('heading',60,40);h.title='A little room to think';h.w=650;h.body='Your ideas belong somewhere better than an open tab.';
 const n=card('note',60,155);n.title='It starts with a spark.';n.body='A passing thought. A color. A line of dialogue.\n\nBring it all here. Move things around. See what connects.';n.h=240;n.tags=['inspiration'];
 const k=card('task',370,155);k.title='Make it yours';k.w=270;k.h=240;k.items=['Drop an image onto the canvas','Add a note or a link','Connect two ideas','Create a board for your project'].map((text,i)=>({id:uid(),text,done:i===0}));
 const p=card('note',60,450);p.title='A thought worth keeping';p.body='“Creativity is intelligence having fun.”\n\nOr perhaps it is simply paying attention.';p.h=195;
 const sub=board('Visual references',b.id);sub.description='A collection of textures, moods, and possibilities.';
 const bc=card('board',370,450);bc.title=sub.name;bc.boardId=sub.id;bc.w=270;bc.h=195;
 b.cards.push(h,n,k,p,bc);b.edges.push({id:uid(),from:n.id,to:k.id,label:'Make it happen'});
 const m=board('Story development');applyTemplate(m,'writing');
 return {version:1,active:b.id,boards:[b,sub,m]};
}

export function applyRecipe(w,id){
 const recipe=recipes.find(r=>r.id===id);if(!recipe)throw Error('Unknown project recipe');
 if(w.boards.length+recipe.template_ids.length+1>1000)throw Error('Too many boards');
 const root=board(id.split('_').map(s=>s[0].toUpperCase()+s.slice(1)).join(' '));root.recipe={id,version:'1.0.0'};root.projectId=root.id;root.projectFields={project_title:root.name,owner:'',due_date:'',status:''};
 w.boards.push(root);
 recipe.template_ids.forEach((id,i)=>{const t=templates.find(t=>t.id===id),b=applyTemplate(board(t.name,root.id),id);b.projectId=root.id;w.boards.push(b);const c=card('board',60+(i%3)*300,60+Math.floor(i/3)*240);c.title=t.name;c.body=t.label;c.boardId=b.id;root.cards.push(c);});
 w.active=root.id;return root;
}

// A small layout language for library templates. A template is written as rows of blocks (columns, stacks, grids,
// single cards); this file measures every card, places it, and turns the result into an ordinary Atelier board, so a
// template reads like its content rather than a list of coordinates.
//
// Card specs are plain objects made by the helpers below (note, task, image, …). Any spec may carry `key`, which edges
// and timeline items use to point at it. Nothing here touches the DOM; build.mjs runs it in Node.

import * as T from '../../ui/timeline.js';

// ── Measuring ─────────────────────────────────────────────────────────────────
// Matches style.css: card body 13px/1.55 (≈20px a line) with 16px side padding, a 48px header, and Geist at roughly
// 6.6px per character. Slightly generous, so text sits comfortably rather than scrolling.
const LINE=20.2,CHAR=6.75,HEAD=50,FOOT=16;
const wrap=(text,width,char=CHAR)=>Math.max(1,Math.ceil(text.replace(/\*\*|`/g,'').length*char/Math.max(40,width)));
export function textHeight(body,w,{line:LINE_=LINE,char=CHAR}={}){const LINE=LINE_;const wrap_=wrap;const wrapC=(t,width)=>wrap_(t,width,char);
 const inner=w-32;let h=0;
 for(const line of String(body).split('\n')){
  if(!line.trim()){h+=12;continue;}
  const item=line.match(/^\s*[-*] (.*)$/),head=line.match(/^#{1,3} (.*)$/);
  if(item)h+=wrapC(item[1],inner-18)*LINE+2;
  else if(head)h+=wrapC(head[1],inner)*LINE+16;
  else if(line.startsWith('> '))h+=wrapC(line.slice(2),inner-14)*LINE+16;
  else h+=wrapC(line,inner)*LINE;
 }
 // A list opening or closing adds its own margin.
 const lists=(String(body).match(/(^|\n)(?![-*] )[^\n]*\n[-*] /g)||[]).length;
 return Math.ceil(h+lists*12);
}

// ── Card specs ────────────────────────────────────────────────────────────────
const spec=(type,o)=>({type,...o});
/** A note. Body is light Markdown: **bold**, *italic*, `code`, # headings, - lists, > quotes. */
export const note=(title,body='',o={})=>spec('note',{title,body,...o});
/** A checklist. Items are strings; a leading "x " marks one done. */
export const task=(title,items,o={})=>spec('task',{title,items,...o});
/** An image from the library's image registry (images/manifest.json), by key. */
export const image=(img,o={})=>spec('image',{img,...o});
/** A photograph from images/photos.json, by key. `want` describes the picture to source (kept in the manifest);
 *  `ratio` is height/width until the real file sets it. */
export const wanted=new Map();
export const photo=(img,want,o={})=>{if(typeof o!=='object')throw Error(`photo(${img}): options must be an object`);if(want&&!wanted.has(img))wanted.set(img,{want,ratio:o.ratio});const {ratio,...rest}=o;return spec('image',{img,...rest});};
/** A drawing on white paper, stored as a sketch card (generated PNG in images/, by key). */
export const sketch=(img,o={})=>spec('sketch',{img,...o});
export const link=(title,url,body='',o={})=>spec('link',{title,url,body,...o});
export const heading=(title,body='',o={})=>spec('heading',{title,body,...o});
export const sticky=(title,body='',o={})=>spec('sticky',{title,body,color:'sand',...o});
export const shape=(title,body='',shapeName='rectangle',o={})=>spec('shape',{title,body,shape:shapeName,...o});
export const table=(title,rows,o={})=>spec('table',{title,rows,...o});
export const file=(title,filename,body='',o={})=>spec('file',{title,filename,body,...o});
/** A board card that opens a nested board. `board` is a nested template body: {title, description, rows, …}. */
export const boardCard=(board,o={})=>spec('board',{board,title:board.title,body:board.description||'',...o});
/** A timeline. mode 'date': start is a day offset (0 = the template's anchor Monday), length in days; items use
 *  day offsets too. mode 'timecode': fps id from timeline.js RATES, start/length and item at/len as timecode strings,
 *  seconds, or `n f` frame counts. Items: {ref, at, len, lane}. */
export const timeline=(title,tl,o={})=>spec('timeline',{title,tl,...o});

// ── Blocks ────────────────────────────────────────────────────────────────────
/** A column card that contains its cards, as columns do in Atelier. */
export const column=(title,w,cards,o={})=>({block:'column',title,w,cards,...o});
/** Cards stacked vertically with no container. */
export const stack=(w,cards,o={})=>({block:'stack',w,cards,...o});
/** Cards in a grid of `cols` columns, each `cell` wide. */
export const grid=(cols,cell,cards,o={})=>({block:'grid',cols,cell,cards,...o});
/** One card at a given width. */
export const single=(w,card)=>({block:'stack',w,cards:[card]});
/** Cards at explicit positions relative to the block's corner: [[x, y, card, w?], …]. */
export const place=(items,o={})=>({block:'place',items,...o});
/** Blocks side by side. */
export const row=(blocks,o={})=>({row:blocks,...o});
/** Rows wrapped in a presentation frame. */
export const frame=(title,rows,o={})=>({frame:title,rows,...o});

// ── Builder ───────────────────────────────────────────────────────────────────
export const ANCHOR=T.dayNumber(2026,1,5); // a Monday. The gallery moves date timelines to the current week.
export function frames(tl,text){
 if(typeof text==='number')return Math.round(text*T.base(tl));
 const s=String(text).trim();if(/^\d+f$/.test(s))return Number(s.slice(0,-1));
 const f=T.parseTimecode(s,tl);if(f===null)throw Error(`Bad timecode "${s}"`);return f;
}

export class Builder{
 constructor(prefix,images){this.prefix=prefix;this.images=images;this.n=0;this.boards=[];}
 id(kind='c'){return `${this.prefix}-${kind}${(++this.n).toString(36)}`;}
 // Builds a board from its body and returns it; nested boards are added to this.boards before their parent.
 board(body,parent=null){
  const b={id:this.id('b'),name:body.title,parent,description:body.description||'',color:body.backing||'theme',cards:[],edges:[],view:{x:60,y:50,zoom:body.zoom||0.8},updated:0};
  this.boards.push(b);this.keys=this.keys||[];const keys=new Map();this.keys.push(keys);
  const ctx={b,keys,builder:this};
  let y=body.top??40;const x0=body.left??40;
  for(const r of body.rows){y=this.layoutRow(ctx,r,x0,y)+(r.after??48);}
  for(const e of body.edges||[]){
   const [from,to,label='',opt={}]=e;const a=keys.get(from),c=keys.get(to);if(!a||!c)throw Error(`Edge ${from}→${to}: unknown key in ${body.title}`);
   b.edges.push({id:this.id('e'),from:a.id,to:c.id,label,...opt});
  }
  // Timelines resolve their items once every card exists.
  for(const c of b.cards)if(c._tl){const spec=c._tl;delete c._tl;c.timeline=this.timeline(spec,keys,body.title);}
  const framesIn=b.cards.filter(c=>c.type==='frame');if(framesIn.length)b.presentationOrder=framesIn.map(c=>c.id);
  for(const c of b.cards)delete c._key;
  return b;
 }
 timeline(spec,keys,where){
  const mode=spec.mode||'date';
  if(mode==='date'){
   const tl={mode:'date',fps:[24,1],drop:false,start:ANCHOR+(spec.start||0),end:ANCHOR+(spec.start||0)+spec.days,links:spec.links??false,items:[]};
   for(const it of spec.items){const c=keys.get(it.ref);if(!c)throw Error(`Timeline item ${it.ref} unknown in ${where}`);tl.items.push({id:this.id('t'),card:c.id,at:ANCHOR+it.at,len:Math.max(1,it.len??1),lane:it.lane??0});}
   return tl;
  }
  const rate=T.RATES.find(r=>r.id===(spec.fps||'24'));if(!rate)throw Error('Unknown rate '+spec.fps);
  const tl={mode:'timecode',fps:[...rate.fps],drop:rate.drop,start:0,end:1,links:spec.links??false,items:[]};
  tl.start=frames(tl,spec.start??0);tl.end=frames(tl,spec.end);
  for(const it of spec.items){const c=keys.get(it.ref);if(!c)throw Error(`Timeline item ${it.ref} unknown in ${where}`);const at=frames(tl,it.at),len=it.out!==undefined?frames(tl,it.out)-at:it.len===undefined?0:frames(tl,it.len);tl.items.push({id:this.id('t'),card:c.id,at,len,lane:it.lane??0});}
  return tl;
 }
 // Returns the bottom edge of the row.
 layoutRow(ctx,r,x,y){
  if(r.frame){
   const f=this.card(ctx,{type:'frame',title:r.frame,body:''},x,y,100,100);let yy=y+70;let right=x;
   for(const rr of r.rows){const box=this.measureRow(rr);yy=this.layoutRow(ctx,rr,x+40,yy)+(rr.after??40);right=Math.max(right,x+40+box);}
   f.w=Math.max(r.w||0,right-x+40);f.h=yy-y;return y+f.h;
  }
  const gap=r.gap??40;let bottom=y;
  for(const blk of r.row){const {w,h}=this.layoutBlock(ctx,blk,x,y);x+=w+gap;bottom=Math.max(bottom,y+h);}
  return bottom;
 }
 measureRow(r){if(r.frame)return 0;const gap=r.gap??40;return r.row.reduce((s,b)=>s+this.blockWidth(b)+gap,-gap);}
 blockWidth(b){return b.block==='grid'?b.cols*b.cell+(b.cols-1)*(b.gap??16):b.block==='place'?Math.max(...b.items.map(([x,,c,w])=>x+(w||c.w||260))):b.w;}
 layoutBlock(ctx,blk,x,y){
  if(blk.frame){const before=ctx.b.cards.length;const bottom=this.layoutRow(ctx,blk,x,y);return {w:ctx.b.cards[before].w,h:bottom-y};}
  if(blk.block==='column'){
   const col=this.card(ctx,{type:'column',title:blk.title,body:'',color:blk.color||'stone',key:blk.key},x,y,blk.w,100);
   let yy=y+55;for(const c of blk.cards){
    if(c.block){const before=ctx.b.cards.length;const {h}=this.layoutBlock(ctx,c,x+16,yy,blk.w-32);for(const m of ctx.b.cards.slice(before))if(m.type!=='column')m.sectionId=col.id;yy+=h+16;continue;}
    const made=this.card(ctx,c,x+16,yy,blk.w-32);made.sectionId=col.id;yy+=made.h+16;}
   col.h=Math.max(blk.minH||0,yy-y+8);return {w:blk.w,h:col.h};
  }
  if(blk.block==='stack'){let yy=y;for(const c of blk.cards){if(c.block){const {h}=this.layoutBlock(ctx,c,x,yy);yy+=h+(blk.gap??20);continue;}const made=this.card(ctx,c,x,yy,c.w||blk.w);yy+=made.h+(blk.gap??20);}return {w:blk.w,h:yy-y-(blk.gap??20)};}
  if(blk.block==='grid'){
   const g=blk.gap??16,heights=[];
   blk.cards.forEach((c,i)=>{const col=i%blk.cols,rowI=Math.floor(i/blk.cols);heights[rowI]=heights[rowI]||[];heights[rowI].push(c);});
   let yy=y;for(const rowCards of heights){let hmax=0;const before=ctx.b.cards.length;rowCards.forEach((c,i)=>{if(c.block){const {h}=this.layoutBlock(ctx,{...c,w:c.w||blk.cell},x+i*(blk.cell+g),yy);hmax=Math.max(hmax,h);return;}const made=this.card(ctx,c,x+i*(blk.cell+g),yy,blk.cell);hmax=Math.max(hmax,made.h);});
    // Equalise heights in a grid row so it reads as a clean grid.
    if(blk.even!==false&&!rowCards.some(c=>c.block))for(const c of ctx.b.cards.slice(before))if(c.type!=='image'&&c.type!=='sketch')c.h=hmax;
    yy+=hmax+g;}
   return {w:this.blockWidth(blk),h:yy-y-g};
  }
  if(blk.block==='place'){let w=0,h=0;for(const [px,py,c,cw] of blk.items){const made=this.card(ctx,c,x+px,y+py,cw||c.w||260);w=Math.max(w,px+made.w);h=Math.max(h,py+made.h);}return {w:blk.w||w,h:blk.h||h};}
  throw Error('Unknown block');
 }
 // Makes one card. Its height comes from the spec, or is measured from its content.
 card(ctx,s,x,y,w,h){
  const c={id:this.id(),type:s.type,x:Math.round(x),y:Math.round(y),w:Math.round(s.w||w),h:0,title:s.title||'',body:s.body||'',color:s.color||'paper',tags:s.tags||[],comments:(s.comments||[]).map(([author,text],i)=>({author,text,date:Date.UTC(2026,0,5+i,10)})),items:[],url:s.url||'',media:'',filename:s.filename||'',boardId:null};
  w=c.w;
  const foot=(c.tags.length||c.comments.length)?36:0;
  if(s.type==='note')h=HEAD+textHeight(c.body,w)+FOOT+foot;
  if(s.type==='sticky')h=Math.max(Math.min(w,200),HEAD+textHeight(c.body,w,{line:25.5,char:8.6})+FOOT+foot);
  if(s.type==='task'){c.items=s.items.map(t=>({id:this.id('i'),text:t.replace(/^x /,''),done:t.startsWith('x ')}));h=HEAD+12+c.items.reduce((n,i)=>n+wrap(i.text,w-64)*19+10,0)+26+foot;}
  if(s.type==='heading'){h=c.body?40+textHeight(c.body,w)+6:52;}
  if(s.type==='link')h=HEAD+22+(c.body?textHeight(c.body,w):0)+44;
  if(s.type==='file')h=HEAD+22+(c.body?textHeight(c.body,w):0)+22;
  if(s.type==='table'){c.cells=s.rows.map(r=>r.map(String));const cols=c.cells[0].length,cw=(w-32)/cols;h=HEAD+12+c.cells.reduce((n,r)=>n+Math.max(...r.map(v=>wrap(v||' ',cw-24)))*19+14,0)+14;}
  if(s.type==='shape'){c.shape=s.shape;h=Math.max(s.h||0,HEAD+textHeight(c.body,w*0.62)+40);}
  if(s.type==='image'||s.type==='sketch'){
   const img=this.images[s.img];if(!img)throw Error(`Unknown image "${s.img}"`);
   c.media=`@image:${s.img}`;c.filename=img.file;if(!s.title)c.title=img.title;
   // Openly licensed photos carry their credit with them, so it survives export and sharing.
   if(img.kind==='photo'&&img.license){c.body=`Photo: ${img.title} — ${img.author}. ${img.license}, via Wikimedia Commons.`;c.url=img.source||'';}
   const crop=s.ratio??img.height/img.width;h=Math.round(w*crop)+40;
   this.used.add(s.img);
  }
  if(s.type==='board'){const nested=this.board(s.board,ctx.b.id);c.boardId=nested.id;c.title=nested.name;c.body=s.body;h=200;}
  if(s.type==='timeline'){c._tl=s.tl;const lanes=Math.min(12,Math.max(3,Math.max(-1,...s.tl.items.map(i=>i.lane??0))+2));h=s.h||(132+lanes*(s.lane||62));}
  if(s.type==='frame'){h=h||100;}
  c.h=Math.round(s.h||h||120);
  if(s.locked)c.locked=true;
  ctx.b.cards.push(c);if(s.key){if(ctx.keys.has(s.key))throw Error(`Duplicate key ${s.key}`);ctx.keys.set(s.key,c);}
  return c;
 }
}

/** Builds a template into package boards. Returns {boards, used} where used is the set of image keys. */
export function build(t,images){
 const bld=new Builder(t.id.replace(/[^a-zA-Z0-9]/g,'').slice(0,24),images);bld.used=new Set();
 const top=bld.board(t);
 top.template={id:'lib-'+t.id,version:t.version||'1.0.0'};
 // Frames draw behind everything; containers before the cards they hold.
 for(const b of bld.boards){const rank=c=>c.type==='frame'?0:c.type==='column'?1:2;b.cards.sort((a,c)=>rank(a)-rank(c));}
 // The top board first, then its nested boards.
 const boards=[top,...bld.boards.filter(b=>b!==top)];
 return {boards,used:bld.used};
}

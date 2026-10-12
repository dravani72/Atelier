// Atelier packages: boards, with every board nested in them, as one file another person can add to their own workspace.
// A backup is a whole workspace and replaces one; a package is a part of a workspace and is added to one. The file layout
// is specified in INTERCHANGE.md and schema/atelier-package.schema.json. Pure functions over plain objects, so they run
// in Node tests too; the app (ui/app.js) only adds the dialogs.
import {validate,clone} from './model.js';
import * as C from './canvas-model.js';
import * as T from './timeline.js';

export const FORMAT='atelier-package',VERSION=1,EXTENSION='.atelier.json',MAX_BOARDS=1000;
// Originals this computer keeps outside the workspace. The reference means nothing anywhere else, so a package leaves it
// out and the card travels with its embedded preview.
const LOCAL=['localAttachment','localVideo'];

export const fileName=name=>(String(name).replace(/[^a-z0-9_-]+/gi,'-').replace(/^-+|-+$/g,'')||'board')+EXTENSION;
export const count=boards=>({boards:boards.length,cards:boards.reduce((n,b)=>n+b.cards.length,0)});

// The boards a package of `ids` has to carry: those boards, everything nested in them, and any board one of their cards opens.
export function closure(workspace,ids){
 const keep=new Set(ids.filter(id=>workspace.boards.some(b=>b.id===id)));
 for(let grew=true;grew;){
  grew=false;
  for(const b of workspace.boards){
   if(!keep.has(b.id)&&keep.has(b.parent)){keep.add(b.id);grew=true;}
   if(keep.has(b.id))for(const c of b.cards)if(c.type==='board'&&!keep.has(c.boardId)&&workspace.boards.some(x=>x.id===c.boardId)){keep.add(c.boardId);grew=true;}
  }
 }
 return keep;
}

// Builds a package from boards of a workspace. Returns it with the number of cards whose original stayed on this computer.
export function pack(workspace,ids,{name,now=new Date(),generator='Atelier'}={}){
 ids=[].concat(ids);const keep=closure(workspace,ids);if(!keep.size)throw Error('Choose a board to export.');
 let omitted=0;
 const order=b=>{const at=ids.indexOf(b.id);return at<0?ids.length:at;};
 const boards=workspace.boards.filter(b=>keep.has(b.id)).sort((a,b)=>order(a)-order(b)).map(b=>{
  const copy=clone(b);
  // A board whose parent stays behind becomes a top-level board of the package.
  if(!keep.has(copy.parent))copy.parent=null;
  if(copy.projectId!==undefined&&!keep.has(copy.projectId))delete copy.projectId;
  for(const c of copy.cards)if(LOCAL.some(key=>key in c)){for(const key of LOCAL)delete c[key];omitted++;}
  return copy;
 });
 return {package:{format:FORMAT,version:VERSION,name:name??boards[0].name,exported:now.toISOString(),generator,boards},omitted};
}

// Reads parsed JSON as a package or as a workspace backup, checked by the same rules as a saved workspace.
// Returns {kind:'package'|'backup', name, boards} and, for a backup, the validated `workspace`.
export function read(data){
 if(data&&typeof data==='object'&&data.format===FORMAT){
  if(!Number.isInteger(data.version)||data.version<1)throw Error('This package has no readable format version.');
  if(data.version>VERSION)throw Error(`This package was made by a newer Atelier (format ${data.version}). Update Atelier to open it.`);
  if(!Array.isArray(data.boards)||!data.boards.length)throw Error('This package has no boards.');
  if(data.name!==undefined&&(typeof data.name!=='string'||data.name.length>1000))throw Error('Invalid package name');
  const top=data.boards.find(b=>b&&b.parent===null);if(!top)throw Error('This package has no top-level board.');
  const boards=validate({version:1,active:top.id,boards:data.boards}).boards;
  return {kind:'package',name:data.name??top.name,boards};
 }
 const workspace=validate(data);
 return {kind:'backup',name:workspace.boards.find(b=>b.id===workspace.active).name,boards:workspace.boards,workspace};
}

// Adds boards to a workspace under fresh IDs, so the same file can be added twice and never collides with what is there.
// `strip` drops references to another computer's managed files (always, for a package). Returns the new top-level board IDs.
export function graft(workspace,incoming,uid,{strip=false,now=Date.now()}={}){
 if(workspace.boards.length+incoming.length>MAX_BOARDS)throw Error(`A workspace holds at most ${MAX_BOARDS} boards.`);
 const boards=clone(incoming),boardIds=new Map(boards.map(b=>[b.id,uid()])),cardIds=new Map();
 for(const b of boards)for(const c of b.cards)cardIds.set(c.id,uid());
 for(const b of boards){
  b.id=boardIds.get(b.id);b.parent=b.parent===null?null:boardIds.get(b.parent);b.updated=now;
  if(b.projectId!==undefined){if(boardIds.has(b.projectId))b.projectId=boardIds.get(b.projectId);else delete b.projectId;}
  for(const c of b.cards){
   c.id=cardIds.get(c.id);
   if(c.type==='board')c.boardId=boardIds.get(c.boardId);
   for(const item of c.items)item.id=uid();
   if(strip)for(const key of LOCAL)delete c[key];
  }
  // Groups and column membership, then timeline connections, then connectors and the presentation order.
  C.remap(b.cards,cardIds,uid);
  for(const c of b.cards)if(c.timeline)T.recopy(c.timeline,uid,cardIds);
  b.edges=b.edges.map(e=>({...e,id:uid(),from:cardIds.get(e.from),to:cardIds.get(e.to)}));
  if(b.presentationOrder)b.presentationOrder=b.presentationOrder.map(id=>cardIds.get(id)).filter(Boolean);
 }
 workspace.boards.push(...boards);
 return boards.filter(b=>b.parent===null).map(b=>b.id);
}

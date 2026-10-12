import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initial,validate,board,card,clone,uid,applyRecipe,recipes,TYPES} from '../ui/model.js';
import {SHAPES} from '../ui/canvas-model.js';
import * as I from '../ui/interchange.js';

const fixture=()=>JSON.parse(readFileSync(new URL('./fixtures/package.json',import.meta.url),'utf8'));
const ids=boards=>{const out=new Set();for(const b of boards){out.add(b.id);for(const c of b.cards){out.add(c.id);for(const i of c.items)out.add(i.id);if(c.groupId)out.add(c.groupId);if(c.timeline)for(const i of c.timeline.items)out.add(i.id);}for(const e of b.edges)out.add(e.id);}return out;};
// A board with the IDs taken out, so two copies can be compared for everything else.
const shape=b=>({name:b.name,description:b.description,color:b.color,view:b.view,cards:b.cards.map(c=>{const {id,boardId,groupId,sectionId,items,timeline,...rest}=c;return {...rest,items:items.map(i=>[i.text,i.done]),clips:timeline?timeline.items.map(i=>[i.at,i.len,i.lane]):null};}),edges:b.edges.map(({id,from,to,...rest})=>rest)});

test('the fixture is a valid package and reads back as its boards',()=>{
 const p=fixture(),read=I.read(p);
 assert.equal(p.format,I.FORMAT);assert.equal(p.version,I.VERSION);assert.equal(read.kind,'package');assert.equal(read.name,'Shot plan');assert.deepEqual(read.boards.map(b=>b.name),['Shot plan','References']);
});

test('packing a board carries what is nested in it and leaves the workspace alone',()=>{
 const w=initial(),top=w.boards[0],nested=w.boards.find(b=>b.parent===top.id),other=board('Elsewhere');w.boards.push(other);validate(w);
 const before=clone(w),{package:pkg,omitted}=I.pack(w,[top.id],{now:new Date('2026-10-11T00:00:00Z')});
 assert.deepEqual(w,before);assert.equal(omitted,0);assert.equal(pkg.name,top.name);assert.equal(pkg.exported,'2026-10-11T00:00:00.000Z');
 assert.deepEqual(pkg.boards.map(b=>b.id),[top.id,nested.id]);assert.equal(I.read(clone(pkg)).boards.length,2);
 // A nested board packed on its own becomes the top of its package.
 const alone=I.pack(w,[nested.id]).package;assert.equal(alone.boards.length,1);assert.equal(alone.boards[0].parent,null);assert.equal(w.boards.find(b=>b.id===nested.id).parent,top.id);I.read(alone);
 // A board that a card opens travels too, even when it is not nested under the packed board.
 const opener=card('board');opener.boardId=other.id;nested.cards.push(opener);assert.deepEqual(I.pack(w,[nested.id]).package.boards.map(b=>b.name),[nested.name,'Elsewhere']);
 assert.throws(()=>I.pack(w,['missing']),/Choose a board/);
});

test('a package leaves out files that only this computer holds',()=>{
 const w=initial(),c=card('image');c.media='data:image/png;base64,AAAA';c.localAttachment='file-1';const v=card('video');v.localVideo='video-1';w.boards[0].cards.push(c,v);validate(w);
 const {package:pkg,omitted}=I.pack(w,[w.boards[0].id]),packed=pkg.boards[0].cards;
 assert.equal(omitted,2);assert.ok(!packed.some(c=>'localAttachment' in c||'localVideo' in c));assert.equal(packed.find(c=>c.type==='image').media,'data:image/png;base64,AAAA');
 assert.equal(w.boards[0].cards.find(c=>c.type==='video').localVideo,'video-1');
 // Read liberally: a hand-made package that still carries one is accepted, and the reference is dropped when it is added.
 pkg.boards[0].cards[0].localVideo='video-9';const target=initial();I.graft(target,I.read(pkg).boards,uid,{strip:true});assert.ok(!target.boards.some(b=>b.cards.some(c=>'localVideo' in c)));
});

test('reading rejects newer formats, empty or broken packages, and anything that is not Atelier',()=>{
 const p=fixture();
 assert.throws(()=>I.read({...p,version:2}),/newer Atelier \(format 2\)/);assert.throws(()=>I.read({...p,version:'1'}),/format version/);assert.throws(()=>I.read({...p,version:0}),/format version/);
 assert.throws(()=>I.read({...p,boards:[]}),/no boards/);assert.throws(()=>I.read({...p,name:7}),/package name/);
 assert.throws(()=>I.read({...p,boards:[p.boards[1]]}),/top-level board/);
 const dangling=fixture();dangling.boards[1].parent='board-gone';assert.throws(()=>I.read(dangling),/Missing parent board/);
 const outside=fixture();outside.boards.pop();assert.throws(()=>I.read(outside),/Missing linked board/);
 const unsafe=fixture();unsafe.boards[0].cards[2].media='data:text/html;base64,AAAA';assert.throws(()=>I.read(unsafe),/Unsupported embedded media/);
 for(const junk of [null,[],'text',{},{version:1,boards:[]},{format:'something-else',version:1,boards:[]}])assert.throws(()=>I.read(junk),/Unsupported or empty workspace/);
 const backup=initial(),read=I.read(backup);assert.equal(read.kind,'backup');assert.equal(read.workspace,backup);assert.equal(read.boards.length,backup.boards.length);
});

test('adding a package gives every board, card and connection a fresh ID and keeps them wired together',()=>{
 const w=initial(),before=clone(w),incoming=I.read(fixture()).boards,old=ids(incoming);
 const roots=I.graft(w,incoming,uid,{strip:true,now:5});validate(w);
 assert.deepEqual(w.boards.slice(0,before.boards.length),before.boards,'boards already there are untouched');assert.equal(w.boards.length,before.boards.length+2);assert.equal(roots.length,1);
 const added=w.boards.slice(before.boards.length),[plan,refs]=added,fresh=ids(added);
 assert.equal(plan.id,roots[0]);assert.equal(plan.parent,null);assert.equal(refs.parent,plan.id);assert.equal(plan.updated,5);
 for(const id of fresh){assert.ok(!old.has(id),'no ID is reused: '+id);assert.ok(!ids(before.boards).has(id));}
 assert.equal(fresh.size,old.size);assert.deepEqual(added.map(shape),incoming.map(shape),'nothing but IDs changed');
 const by=title=>plan.cards.find(c=>c.title===title);
 assert.equal(by('References').boardId,refs.id);assert.equal(by('Fog machine').sectionId,by('Ideas').id);assert.equal(by('Logline').groupId,by('Before the shoot').groupId);assert.notEqual(by('Logline').groupId,'group-story');
 assert.deepEqual(plan.edges.map(e=>[e.from,e.to,e.label]),[[by('Logline').id,by('Before the shoot').id,'then'],[by('Before the shoot').id,by('Decision').id,'decide']]);
 assert.deepEqual(by('Edit').timeline.items.map(i=>i.card),[by('Logline').id,by('Shot list').id,by('Before the shoot').id]);assert.deepEqual(plan.presentationOrder,[by('1 · The opening').id]);
 assert.deepEqual(by('Fog machine').comments,[{text:'Check the budget first.',author:'Dana',date:1760000000000}]);
 // The same file can be added again.
 I.graft(w,incoming,uid);validate(w);assert.equal(w.boards.length,before.boards.length+4);assert.equal(incoming[0].id,'board-plan','the incoming boards are not modified');
});

test('a board survives the trip out of one workspace and into another',()=>{
 const sender=initial(),root=applyRecipe(sender,recipes[0].id),{package:pkg}=I.pack(sender,[root.id]),wire=JSON.stringify(pkg);
 assert.ok(pkg.boards.length>1);assert.ok(pkg.boards.every(b=>b.projectId===undefined||pkg.boards.some(x=>x.id===b.projectId)));
 const receiver=initial(),roots=I.graft(receiver,I.read(JSON.parse(wire)).boards,uid,{strip:true});validate(receiver);
 const arrived=receiver.boards.slice(-pkg.boards.length);assert.deepEqual(arrived.map(shape),pkg.boards.map(shape));
 assert.ok(arrived.every(b=>b.projectId===undefined||b.projectId===roots[0]),'project membership follows the new root');
 // Packing what arrived gives the same package again, apart from IDs.
 assert.deepEqual(I.pack(receiver,roots).package.boards.map(shape),pkg.boards.map(shape));
});

test('a workspace never grows past its board limit',()=>{
 const w=initial(),many=Array.from({length:I.MAX_BOARDS},()=>board('x'));
 assert.throws(()=>I.graft(w,many,uid),/at most 1000 boards/);assert.equal(w.boards.length,initial().boards.length);
});

test('file names are safe and carry the package extension',()=>{
 assert.equal(I.fileName('Code 2600 — a breakdown'),'Code-2600-a-breakdown.atelier.json');assert.equal(I.fileName('../../etc/passwd'),'etc-passwd.atelier.json');assert.equal(I.fileName('映画'),'board.atelier.json');
 assert.deepEqual(I.count(fixture().boards),{boards:2,cards:11});
});

test('the published schema names the same format, card types and shapes as the app',()=>{
 const schema=JSON.parse(readFileSync(new URL('../schema/atelier-package.schema.json',import.meta.url),'utf8'));
 assert.equal(schema.properties.format.const,I.FORMAT);assert.equal(schema.properties.version.const,I.VERSION);
 assert.deepEqual(schema.$defs.card.properties.type.enum,TYPES);assert.deepEqual(schema.$defs.card.properties.shape.enum,SHAPES);
 assert.deepEqual(schema.required,['format','version','boards']);
});

// The template library: every example loads, passes the package reader, adds cleanly to a workspace, and uses only
// pictures that ship with the app. Runs the same ui/library.js the gallery uses, with fetch reading from disk.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {library,categories,load,add,toCurrentWeek,filter} from '../ui/library.js';
import {initial,uid,validate} from '../ui/model.js';
import * as T from '../ui/timeline.js';

const root=new URL('../ui/',import.meta.url);
const fetchDisk=async path=>{try{const bytes=await readFile(new URL(path,root));return {ok:true,json:async()=>JSON.parse(bytes.toString('utf8')),arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)};}catch{return {ok:false};}};

test('catalog is consistent',async()=>{
 assert.ok(library.length>=150,'the library is comprehensive');
 assert.equal(new Set(library.map(t=>t.id)).size,library.length,'ids are unique');
 for(const t of library){
  assert.ok(categories.includes(t.category),`${t.id}: category listed`);
  for(const c of t.also)assert.ok(categories.includes(c),`${t.id}: extra category ${c} listed`);
  assert.ok(t.title&&t.description.length>40,`${t.id}: has a real description`);
  await access(new URL(`templates/library/${t.id}.json`,root));
  for(const file of Object.values(t.images))await access(new URL(`templates/library/images/${file}`,root));
  if(t.thumb)await access(new URL(`templates/library/${t.thumb}`,root));
 }
});

test('every template loads, reads as a package and adds to a workspace',async()=>{
 const workspace=initial();let timelines={date:0,timecode:0};
 for(const t of library){
  const pkg=await load(t,{fetch:fetchDisk,base:'templates/library/'});
  for(const b of pkg.boards)for(const c of b.cards){assert.ok(!c.media.startsWith('@image:'),`${t.id}: picture swapped in`);if(c.timeline)timelines[c.timeline.mode]++;}
  const before=workspace.boards.length,top=add(workspace,pkg,uid);
  assert.equal(workspace.boards.length,before+pkg.boards.length,`${t.id}: all boards added`);
  const b=workspace.boards.find(x=>x.id===top);assert.equal(b.name,t.title);assert.equal(b.template.id,'lib-'+t.id,'provenance kept');
 }
 workspace.active=workspace.boards[0].id;validate(workspace);
 assert.ok(timelines.date>=40&&timelines.timecode>=15,`uses both timeline modes (${timelines.date} date, ${timelines.timecode} timecode)`);
});

test('date timelines move to the current week and keep their weekdays',()=>{
 const tl={mode:'date',fps:[24,1],drop:false,start:T.dayNumber(2026,1,5),end:T.dayNumber(2026,2,2),links:false,items:[{id:'a',card:'c',at:T.dayNumber(2026,1,7),len:2,lane:0}]};
 const boards=[{cards:[{timeline:structuredClone(tl)},{timeline:{...structuredClone(tl),mode:'timecode',start:0,end:100}}]}];
 const today=T.dayNumber(2027,3,18);toCurrentWeek(boards,today);
 const moved=boards[0].cards[0].timeline;
 assert.ok(moved.start<=today&&today-moved.start<7,'starts this week');
 assert.equal((moved.start-tl.start)%7,0,'moved by whole weeks');
 assert.equal(moved.items[0].at-moved.start,tl.items[0].at-tl.start,'clips keep their offsets');
 assert.equal(boards[0].cards[1].timeline.start,0,'timecode timelines are untouched');
});

test('search and category filters',()=>{
 assert.ok(filter('','Filmmaking').length>=10);
 assert.ok(filter('call sheet').some(t=>t.id==='call-sheet'));
 assert.ok(filter('storyboard').length>=10,'searches tags and descriptions');assert.ok(filter('timecode ruler').length>=3,'every word must match');
 assert.equal(filter('zzzz-nothing').length,0);
});

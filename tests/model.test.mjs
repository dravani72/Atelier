import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,validate,History,card,board,removeCards,duplicateCards,applyTemplate,markdown,uid,clone} from '../ui/model.js';
test('starter workspace and every template validate',()=>{validate(initial());for(const t of ['blank','film','mood','writing','campaign']){const b=applyTemplate(board(t),t);validate({version:1,active:b.id,boards:[b]});}});
test('undo and redo retain changes',()=>{let w=initial();const h=new History();h.push(w);w.boards[0].cards[1].body='changed';w=h.undo(w);assert.notEqual(w.boards[0].cards[1].body,'changed');w=h.redo(w);assert.equal(w.boards[0].cards[1].body,'changed');});
test('delete cleans connections; duplicate remaps edges',()=>{const b=initial().boards[0],ids=new Set(b.cards.slice(1,3).map(c=>c.id)),copies=duplicateCards(b,ids);assert.equal(copies.length,2);assert.equal(b.edges.length,2);assert.ok(copies.includes(b.edges[1].from));removeCards(b,new Set(copies));assert.equal(b.edges.length,1);removeCards(b,ids);assert.equal(b.edges.length,0);});
test('imports reject cycles, unsafe media, geometry, dangling edges',()=>{const w=initial();w.boards[0].parent=w.boards[1].id;assert.throws(()=>validate(w),/cycle/);w.boards[0].parent=null;const c=w.boards[0].cards[1];c.media='data:image/svg+xml;base64,abcd';assert.throws(()=>validate(w),/media/);c.media='';c.x=Infinity;assert.throws(()=>validate(w),/card/);c.x=0;w.boards[0].edges[0].from='missing';assert.throws(()=>validate(w),/connector/);});
test('Markdown includes checklist status',()=>{const b=board(),c=card('task');c.items[0].done=true;b.cards.push(c);assert.match(markdown(b),/- \[x\]/);});
import {renderMarkdown} from '../ui/format.js';
test('note formatting renders safely without executing imported HTML',()=>{const html=renderMarkdown('**Bold** and *italic*\n- list\n> quote\n<script>alert(1)</script>');assert.match(html,/<strong>Bold<\/strong>/);assert.match(html,/<em>italic<\/em>/);assert.match(html,/<li>list<\/li>/);assert.doesNotMatch(html,/<script>/);assert.match(html,/&lt;script&gt;/);});

test('UUID generation falls back to WebKit-compatible cryptographic bytes',()=>{const original=globalThis.crypto.randomUUID;try{globalThis.crypto.randomUUID=undefined;const id=uid();assert.match(id,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);}finally{globalThis.crypto.randomUUID=original;}});

import {templates,recipes,applyRecipe} from '../ui/model.js';
test('all 44 pack templates adapt relative section coordinates and instantiate independent IDs',()=>{
 assert.equal(templates.filter(t=>t.id.startsWith('at-')).length,44);
 const ids=new Set();for(const t of templates){const b=applyTemplate(board(t.name),t.id);validate({version:1,active:b.id,boards:[b]});for(const c of b.cards){assert.ok(!ids.has(c.id));ids.add(c.id);if(c.sectionId){const section=b.cards.find(s=>s.id===c.sectionId);assert.ok(section);assert.ok(c.x>=section.x&&c.y>=section.y&&c.x+c.w<=section.x+section.w&&c.y+c.h<=section.y+section.h);}}if(t.id.startsWith('at-')){assert.deepEqual(b.template,{id:t.id,version:'1.0.0'});assert.equal(b.presentationOrder.length,b.cards.filter(c=>c.type==='column').length);}}
});
test('four recipes create linked board hierarchies with pinned provenance and stable save/reload',()=>{
 assert.equal(recipes.length,4);for(const recipe of recipes){const w=initial(),root=applyRecipe(w,recipe.id);assert.equal(root.cards.length,recipe.template_ids.length);assert.equal(w.active,root.id);for(const c of root.cards){const child=w.boards.find(b=>b.id===c.boardId);assert.equal(child.parent,root.id);assert.equal(child.projectId,root.id);assert.ok(recipe.template_ids.includes(child.template.id));}assert.deepEqual(validate(JSON.parse(JSON.stringify(w))),w);}
});
test('managed attachment identifiers cannot traverse directories',()=>{const w=initial();w.boards[0].cards[1].localAttachment='../private';assert.throws(()=>validate(w),/managed attachment/);});

import {readFileSync} from 'node:fs';
import * as T from '../ui/timeline.js';
const rate=id=>{const r=T.RATES.find(r=>r.id===id);return {...T.defaults(),fps:r.fps,drop:r.drop};};
test('timecode counts drop-frame and non-drop rates without losing frames',()=>{
 const df=rate('29.97df'),df60=rate('59.94df'),film=rate('23.976');
 assert.equal(T.timecode(1799,df),'00:00:59;29');assert.equal(T.timecode(1800,df),'00:01:00;02');assert.equal(T.timecode(17982,df),'00:10:00;00');assert.equal(T.timecode(107892,df),'01:00:00;00');
 assert.equal(T.timecode(3600,df60),'00:01:00;04');assert.equal(T.timecode(86400,film),'01:00:00:00');assert.equal(T.timecode(107892,rate('29.97')),'00:59:56:12');
 for(const tl of T.RATES.map(r=>rate(r.id)))for(let f=0;f<400000;f+=tl.drop?1:997){assert.equal(T.fromNominal(T.toNominal(f,tl),tl),f);if(f%61===0)assert.equal(T.parseTimecode(T.timecode(f,tl),tl),f);}
 assert.equal(T.parseTimecode('00:01:00;00',df),1800,'a skipped drop-frame label resolves to the next real frame');
 const tl=T.defaults();assert.equal(T.parseTimecode('1:30',tl),2160);assert.equal(T.parseTimecode('00:01:30',tl),2160);assert.equal(T.parseTimecode('2.5',tl),60);assert.equal(T.parseTimecode('48f',tl),48);assert.equal(T.parseTimecode('01:00:10:12',tl),86652);
 for(const bad of ['','abc','1:2:3:4:5','-4','12:xx'])assert.equal(T.parseTimecode(bad,tl),null);
 assert.equal(T.summary(tl),'00:00:00:00 → 00:01:00:00 · 24 fps · 1 min');
});
test('date timelines use whole calendar days and Monday-aligned weeks',()=>{
 const start=T.dayNumber(2026,10,8),tl=T.defaults('date',start);
 assert.equal(T.isoDate(start),'2026-10-08');assert.equal(T.parseDate('2026-10-08'),start);assert.equal(T.parseDate('2026-02-30'),null);assert.equal(T.parseDate('10/08/2026'),null);
 assert.equal(T.summary(tl),'Oct 8, 2026 → Nov 4, 2026 · 28 days');
 assert.deepEqual(T.ticks(tl,868).major.map(t=>t.label),['Oct 8','Oct 12','Oct 19','Oct 26','Nov 2']);assert.equal(T.ticks(tl,868).minor.length,28);
 assert.deepEqual(T.ticks(tl,1400).major.slice(0,3).map(t=>t.label),['Oct 8','Oct 9','Oct 10']);
 assert.deepEqual(T.ticks({...tl,end:start+200},868).major.slice(0,4).map(t=>t.label),['Oct 8, 2026','Nov 2026','Dec','Jan 2027']);
 assert.equal(T.span(tl,{at:start,len:1}),'Oct 8, 2026');assert.equal(T.span(tl,{at:start,len:5}),'Oct 8 – Oct 12, 2026');assert.equal(T.span(tl,{at:T.dayNumber(2026,12,30),len:4}),'Dec 30, 2026 – Jan 2, 2027');
 const spot=T.defaults();assert.deepEqual(T.ticks(spot,868).major.map(t=>t.label),['00:00:00:00','00:00:10:00','00:00:20:00','00:00:30:00','00:00:40:00','00:00:50:00','00:01:00:00']);
});
test('timeline connections follow their cards through delete, duplicate and validation',()=>{
 const b=board(),tl=card('timeline'),a=card('image'),n=card('note'),col=card('column');b.cards.push(tl,a,n,col);const w={version:1,active:b.id,boards:[b]};
 const first=T.connect(tl.timeline,uid(),a.id,0),second=T.connect(tl.timeline,uid(),n.id,0);
 assert.equal(first.lane,0);assert.equal(second.lane,1,'overlapping connections take the next lane');assert.equal(first.len,168);validate(w);
 assert.equal(T.connect(tl.timeline,uid(),n.id,5000).at,1440-168,'new connections stay inside the range');
 assert.match(markdown(b),/- 00:00:00:00 – 00:00:07:00 · Image/);
 const copies=duplicateCards(b,new Set([tl.id,a.id])),copy=b.cards.find(c=>copies.includes(c.id)&&c.type==='timeline'),image=b.cards.find(c=>copies.includes(c.id)&&c.type==='image');
 assert.equal(copy.timeline.items[0].card,image.id,'a card copied with its timeline is reconnected to the copy');assert.equal(copy.timeline.items[1].card,n.id);assert.notEqual(copy.timeline.items[0].id,first.id);validate(w);
 removeCards(b,new Set([n.id]));assert.equal(tl.timeline.items.length,1);assert.equal(copy.timeline.items.length,1);validate(w);
 for(const target of [tl.id,copy.id,col.id,'missing']){const broken=clone(w);broken.boards[0].cards[0].timeline.items[0].card=target;assert.throws(()=>validate(broken),/timeline/);}
 const stray=clone(w);stray.boards[0].cards[1].timeline=T.defaults();assert.throws(()=>validate(stray),/timeline/);
 const bare=clone(w);delete bare.boards[0].cards[0].timeline;assert.throws(()=>validate(bare),/timeline/);
 const fixture=JSON.parse(readFileSync(new URL('./fixtures/timeline.json',import.meta.url),'utf8'));validate(fixture);
 for(const edit of [t=>t.items[0].lane=12,t=>t.items[0].at=1.5,t=>t.end=t.start,t=>t.fps=[23,1],t=>t.fps=[24,1],t=>t.mode='weeks',t=>t.links='yes',t=>t.items[1].id='item-a']){const broken=clone(fixture);edit(broken.boards[0].cards[0].timeline);assert.throws(()=>validate(broken),/timeline/);}
});
test('changing rate, start or scale keeps connected cards where they belong',()=>{
 const tl=T.defaults();tl.start=86400;tl.end=86400+1440;tl.items.push({id:'a',card:'x',at:86400+252,len:48,lane:0});
 T.setRate(tl,'30');assert.equal(T.timecode(tl.start,tl),'01:00:00:00');assert.equal(T.timecode(tl.end,tl),'01:01:00:00');assert.equal(T.timecode(tl.items[0].at,tl),'01:00:10:15');assert.equal(tl.items[0].len,60);
 T.setRate(tl,'29.97df');assert.equal(T.timecode(tl.start,tl),'01:00:00;00');assert.equal(T.timecode(tl.items[0].at,tl),'01:00:10;15');
 T.setRange(tl,0,900,true);assert.equal(T.timecode(tl.items[0].at,tl),'00:00:10;15','moving the start timecode carries connections with it');
 const today=T.dayNumber(2026,10,8);T.setMode(tl,'date',today);assert.equal(tl.start,today);assert.equal(tl.end,today+28);assert.equal(tl.items[0].at,today+10,'a third of the way along stays a third of the way along');assert.ok(tl.items[0].len>=1);
 T.setRange(tl,today+7,today+35);assert.equal(tl.items[0].at,today+10,'dated connections keep their calendar day');
 T.check(tl,'self',new Map([['x','note']]));
 const spot=T.defaults(),at=(at,len)=>T.visible(spot,{at,len});
 assert.ok(at(0,24)&&at(1416,48)&&at(1440,0)&&at(0,0));assert.ok(!at(1440,24)&&!at(-24,24)&&!at(1441,0),'clips beyond the range are reported as outside it');
});

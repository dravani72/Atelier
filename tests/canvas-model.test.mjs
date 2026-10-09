import test from 'node:test';
import assert from 'node:assert/strict';
import {board,card,validate,clone,uid,duplicateCards,removeCards,markdown} from '../ui/model.js';
import * as C from '../ui/canvas-model.js';
function workspace(){const b=board('Canvas');return {version:1,active:b.id,boards:[b]};}
test('custom card colors survive JSON and reject CSS injection',()=>{
 const w=workspace();w.boards[0].cards=[card('note')];w.boards[0].cards[0].style={fill:'#18181b',ink:'#ffffff',label:'#2563eb'};
 assert.deepEqual(validate(clone(w)).boards[0].cards[0].style,w.boards[0].cards[0].style);
 for(const style of [null,[],{fill:'red'},{fill:'#fff;position:fixed'},{unknown:'#ffffff'}]){const bad=clone(w);bad.boards[0].cards[0].style=style;assert.throws(()=>validate(bad));}
});
test('new canvas objects validate and malformed imports fail',()=>{
 const w=workspace(),b=w.boards[0];b.layers=[{id:uid(),name:'References',hidden:false,locked:false}];
 b.cards=['sticky','shape','frame','table'].map(t=>({...card(t),layerId:b.layers[0].id}));assert.equal(validate(w),w);
 for(const mutate of [w=>w.boards[0].layers.push(w.boards[0].layers[0]),w=>w.boards[0].cards[0].locked='yes',w=>w.boards[0].cards[1].shape='script',w=>w.boards[0].cards[3].cells=[['a'],['b','c']],w=>w.boards[0].cards[0].layerId='missing']){const bad=clone(w);mutate(bad);assert.throws(()=>validate(bad));}
 assert.match(markdown(b),/Column 1/);
});
test('group operations preserve locks and container movement includes children',()=>{
 const b=board(),f=card('frame',0,0),x=card('sticky',70,80),y=card('shape',350,80),z=card('note',600,80);x.groupId=y.groupId=uid();z.locked=true;b.cards=[f,x,y,z];
 assert.deepEqual(C.members(b,new Set([x.id])).map(c=>c.id),[x.id,y.id]);assert.deepEqual(C.movable(b,new Set([f.id])).map(c=>c.id),[f.id,x.id,y.id]);
 b.layers=[{id:uid(),name:'Hidden',hidden:true,locked:false}];y.layerId=b.layers[0].id;assert.deepEqual(C.members(b,new Set([x.id])).map(c=>c.id),[x.id]);
 const original=z.x;C.align(b,new Set([x.id,z.id]),'right');assert.equal(z.x,original);
});
test('duplicate remaps groups and sections; deletion clears container references',()=>{
 const b=board(),col=card('column'),x=card('sticky'),y=card('shape');x.groupId=y.groupId=uid();x.sectionId=y.sectionId=col.id;b.cards=[col,x,y];
 const copies=duplicateCards(b,new Set(b.cards.map(c=>c.id))).map(id=>b.cards.find(c=>c.id===id));assert.notEqual(copies[1].groupId,x.groupId);assert.equal(copies[1].groupId,copies[2].groupId);assert.equal(copies[1].sectionId,copies[0].id);
 removeCards(b,new Set([col.id]));assert.equal(x.sectionId,undefined);
});
test('distribution uses equal gaps and reflow lays out editable column children',()=>{
 const b=board(),cs=[0,300,850].map(x=>card('note',x,100));b.cards=cs;C.distribute(b,new Set(cs.map(c=>c.id)),'x');assert.equal(cs[1].x-cs[0].x-cs[0].w,cs[2].x-cs[1].x-cs[1].w);
 const col=card('column',0,0);col.h=1500;cs.forEach(c=>{c.sectionId=col.id;c.x=20;});b.cards.push(col);C.reflow(b,col);assert.equal(cs[0].x,col.x+16);assert.equal(cs[1].y,cs[0].y+cs[0].h+16);
});

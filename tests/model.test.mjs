import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,validate,History,card,board,removeCards,duplicateCards,applyTemplate,markdown,uid} from '../ui/model.js';
test('starter workspace and every template validate',()=>{validate(initial());for(const t of ['blank','film','mood','writing','campaign']){const b=applyTemplate(board(t),t);validate({version:1,active:b.id,boards:[b]});}});
test('undo and redo retain changes',()=>{let w=initial();const h=new History();h.push(w);w.boards[0].cards[1].body='changed';w=h.undo(w);assert.notEqual(w.boards[0].cards[1].body,'changed');w=h.redo(w);assert.equal(w.boards[0].cards[1].body,'changed');});
test('delete cleans connections; duplicate remaps edges',()=>{const b=initial().boards[0],ids=new Set(b.cards.slice(1,3).map(c=>c.id)),copies=duplicateCards(b,ids);assert.equal(copies.length,2);assert.equal(b.edges.length,2);assert.ok(copies.includes(b.edges[1].from));removeCards(b,new Set(copies));assert.equal(b.edges.length,1);removeCards(b,ids);assert.equal(b.edges.length,0);});
test('imports reject cycles, unsafe media, geometry, dangling edges',()=>{const w=initial();w.boards[0].parent=w.boards[1].id;assert.throws(()=>validate(w),/cycle/);w.boards[0].parent=null;const c=w.boards[0].cards[1];c.media='data:image/svg+xml;base64,abcd';assert.throws(()=>validate(w),/media/);c.media='';c.x=Infinity;assert.throws(()=>validate(w),/card/);c.x=0;w.boards[0].edges[0].from='missing';assert.throws(()=>validate(w),/connector/);});
test('Markdown includes checklist status',()=>{const b=board(),c=card('task');c.items[0].done=true;b.cards.push(c);assert.match(markdown(b),/- \[x\]/);});
import {renderMarkdown} from '../ui/format.js';
test('note formatting renders safely without executing imported HTML',()=>{const html=renderMarkdown('**Bold** and *italic*\n- list\n> quote\n<script>alert(1)</script>');assert.match(html,/<strong>Bold<\/strong>/);assert.match(html,/<em>italic<\/em>/);assert.match(html,/<li>list<\/li>/);assert.doesNotMatch(html,/<script>/);assert.match(html,/&lt;script&gt;/);});

test('UUID generation falls back to WebKit-compatible cryptographic bytes',()=>{const original=globalThis.crypto.randomUUID;try{globalThis.crypto.randomUUID=undefined;const id=uid();assert.match(id,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);}finally{globalThis.crypto.randomUUID=original;}});

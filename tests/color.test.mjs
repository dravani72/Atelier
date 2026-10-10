import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as K from '../ui/color.js';
import {kinds} from '../ui/icons.js';

// The two token sets, read from the stylesheet so these checks follow the real colors.
const css=readFileSync(new URL('../ui/style.css',import.meta.url),'utf8');
const block=selector=>{const start=css.indexOf(selector+'{'),end=css.indexOf('\n}',start);assert.ok(start>=0&&end>start,selector);return Object.fromEntries([...css.slice(start,end).matchAll(/(--[\w-]+):([^;]+);/g)].map(m=>[m[1],m[2].trim()]));};
const light=block(':root'),themes={light,dark:{...light,...block('.dark')}};
const cardTypes=kinds.filter(k=>k!=='connect');
const usual=(t,k)=>parseFloat(t[k==='sticky'?'--k-shade-bright':'--k-shade']);
// The preset backings offered in the Board color picker (BACKINGS in ui/app.js).
const BACKINGS=['#ffffff','#f1ebe0','#f8e1e4','#faf0c8','#dff2e2','#dbeafb','#e9e3fa','#a8502f','#4d6b3c','#0f5c5c','#1b2a5c','#4a2550','#3a4352','#111113'];

test('hex mixing, contrast and validation',()=>{
 assert.equal(K.mix('#000000','#ffffff',.5),'#808080');assert.equal(K.mix('#2563eb','#ffffff',1),'#2563eb');assert.equal(K.mix('#2563eb','#ffffff',0),'#ffffff');
 assert.equal(Math.round(K.contrast('#000000','#ffffff')),21);assert.equal(K.distance('#336699','#336699'),0);
 for(const bad of ['red','#fff','#12345g','#1234567','url(javascript:alert(1))','',null,123456])assert.equal(K.isHex(bad),false,String(bad));
 assert.ok(K.isHex('#1B2a5c'));
});

test('the ink chosen for a backing always reads on it',()=>{
 assert.equal(K.inkOn('#1b2a5c'),'#ededea');assert.equal(K.inkOn('#faf0c8'),'#18181b');assert.equal(K.inkOn('#ffffff'),themes.light['--ink']);assert.equal(K.inkOn('#000000'),themes.dark['--ink']);
 // Mid-greys are the hardest case for either ink; even there the better one clears 4:1.
 for(let v=0;v<256;v+=5){const grey=K.hex([v/255,v/255,v/255]);assert.ok(K.contrast(grey,K.inkOn(grey))>=4,grey);}
});

test('a shade keeps its usual strength until the backing crowds it, then deepens within the cap',()=>{
 const pigment='#2563eb',surface='#ffffff',resting=K.mix(pigment,surface,.15);
 assert.equal(K.shadeStrength(pigment,surface,'#1b2a5c',15),15);
 const crowded=K.shadeStrength(pigment,surface,resting,15);assert.ok(crowded>15&&crowded<=K.MOST);assert.ok(K.distance(K.mix(pigment,surface,crowded/100),resting)>=K.CLEAR);
 assert.equal(K.shadeStrength('#facc15',surface,'#fdf0b0',45),45);
 assert.equal(K.shadeStrength(pigment,surface,resting,15,{most:15}),15);
});

test('every card type has a pigment in both themes',()=>{
 for(const [name,t] of Object.entries(themes))for(const k of cardTypes){assert.ok(K.isHex(t['--k-'+k]),`${name} ${k}`);assert.match(css,new RegExp(`\\.kind-${k}\\{--k:var\\(--k-${k}\\)`));}
});

test('card shades stay readable and apart from the board on the default and every preset backing',()=>{
 for(const [name,t] of Object.entries(themes))for(const backing of [t['--canvas'],...BACKINGS]){
  const shades={};
  for(const k of cardTypes){
   const strength=K.shadeStrength(t['--k-'+k],t['--surface'],backing,usual(t,k)),shade=shades[k]=K.mix(t['--k-'+k],t['--surface'],strength/100),where=`${name} ${k} on ${backing} at ${strength}%`;
   assert.ok(K.contrast(t['--ink'],shade)>=7,'title '+where);assert.ok(K.contrast(t['--ink-2'],shade)>=4.5,'body '+where);
   // Deepening stops at the cap, so a backing that shares a pigment's hue can still sit near it; the card's edge and shadow carry it then.
   if(strength<K.MOST)assert.ok(K.distance(shade,backing)>=K.CLEAR,'apart '+where);
  }
  // The point of shading by type: no two types end up the same color. Headings have no fill of their own, so they sit this out.
  const filled=cardTypes.filter(k=>k!=='heading');
  for(const a of filled)for(const b of filled)if(a<b)assert.ok(K.distance(shades[a],shades[b])>=.015,`${name} ${a}/${b} on ${backing}`);
 }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {TOOLS,INKS,constrain,arrowHead,floodFill} from '../ui/sketch.js';
import {icon} from '../ui/icons.js';

// A blank white picture in the shape floodFill expects, with helpers to draw on it and read it back.
function picture(width,height){
 const data=new Uint8ClampedArray(width*height*4).fill(255),image={data,width,height};
 return {image,set:(x,y,[r,g,b])=>data.set([r,g,b,255],(y*width+x)*4),get:(x,y)=>[...data.slice((y*width+x)*4,(y*width+x)*4+3)]};
}
const near=(a,b)=>a.every((v,i)=>Math.abs(v-b[i])<1e-9);

test('every tool has its own shortcut and its own drawn icon',()=>{
 assert.equal(new Set(TOOLS.map(t=>t.id)).size,TOOLS.length);assert.equal(new Set(TOOLS.map(t=>t.key)).size,TOOLS.length);
 const fallback=icon('no-such-icon'),drawn=TOOLS.map(t=>icon(t.icon));for(const svg of drawn)assert.notEqual(svg,fallback);assert.equal(new Set(drawn).size,TOOLS.length);
 for(const [name,color] of INKS){assert.ok(name);assert.match(color,/^#[0-9a-f]{6}$/);}
});

test('Shift snaps lines to 45° steps and shapes to equal sides',()=>{
 assert.ok(near(constrain('line',[10,10],[110,14]),[10+Math.hypot(100,4),10]));
 const diagonal=constrain('arrow',[0,0],[100,90]);assert.ok(Math.abs(diagonal[0]-diagonal[1])<1e-9);assert.ok(Math.abs(Math.hypot(...diagonal)-Math.hypot(100,90))<1e-9);
 assert.ok(near(constrain('line',[50,50],[52,-40]),[50,50-Math.hypot(2,90)]));
 assert.deepEqual(constrain('rect',[10,10],[70,40]),[70,70]);assert.deepEqual(constrain('ellipse',[100,100],[60,130]),[60,140]);assert.deepEqual(constrain('rect',[100,100],[80,30]),[30,30]);
 assert.deepEqual(constrain('pen',[0,0],[7,3]),[7,3]);
});

test('an arrowhead points at the end of the line and never outgrows it',()=>{
 const [left,tip,right]=arrowHead([0,0],[100,0],3);assert.deepEqual(tip,[100,0]);assert.ok(left[0]<100&&right[0]<100);assert.ok(Math.abs(left[0]-right[0])<1e-9);assert.ok(Math.abs(left[1]+right[1])<1e-9);assert.ok(Math.abs(left[1])>3);
 assert.ok(Math.abs(Math.hypot(left[0]-100,left[1])-12)<1e-9,'thin lines still get a visible head');
 assert.ok(Math.abs(Math.hypot(...arrowHead([0,0],[0,300],20)[0].map((v,i)=>v-[0,300][i]))-80)<1e-9,'the head grows with the line');
 const short=arrowHead([0,0],[5,0],40);assert.ok(Math.hypot(short[0][0]-5,short[0][1])<=5+1e-9);
});

test('fill stops at lines, stays inside closed shapes and reports what it filled',()=>{
 const p=picture(40,30),black=[0,0,0],red=[220,38,38];
 for(let x=10;x<=30;x++){p.set(x,5,black);p.set(x,25,black);}for(let y=5;y<=25;y++){p.set(10,y,black);p.set(30,y,black);}
 assert.equal(floodFill(p.image,20,15,red),19*19);
 assert.deepEqual(p.get(20,15),red);assert.deepEqual(p.get(11,6),red);assert.deepEqual(p.get(10,15),black,'the outline is untouched');assert.deepEqual(p.get(5,15),[255,255,255],'nothing leaks outside');
 assert.equal(floodFill(p.image,20,15,red),0,'filling with the same colour is a no-op');
 assert.equal(floodFill(p.image,-1,5,red),0);assert.equal(floodFill(p.image,40,5,red),0);
 assert.equal(floodFill(p.image,0,0,[37,99,235]),40*30-21*21,'the outside fills around the shape');assert.deepEqual(p.get(20,15),red);
});

test('fill pulls the soft edge of a line toward the new colour instead of leaving a pale fringe',()=>{
 const p=picture(20,5),blue=[37,99,235];
 // A dark line with an anti-aliased half-tone pixel on each side, as a canvas draws it.
 for(let y=0;y<5;y++){p.set(9,y,[128,128,128]);p.set(10,y,[0,0,0]);p.set(11,y,[128,128,128]);}
 assert.equal(floodFill(p.image,2,2,blue),9*5);assert.deepEqual(p.get(8,2),blue);
 const fringe=p.get(9,2);assert.ok(fringe[2]>fringe[0]+20,'the half-tone pixel is tinted blue: '+fringe);assert.ok(fringe[0]<128,'and no lighter than it was');
 assert.deepEqual(p.get(10,2),[0,0,0],'the line itself is unchanged');assert.deepEqual(p.get(11,2),[128,128,128]);assert.deepEqual(p.get(15,2),[255,255,255],'the far side is not filled');
 // A light grey guide line is still a boundary.
 const q=picture(20,5);for(let y=0;y<5;y++)q.set(10,y,[212,212,216]);assert.equal(floodFill(q.image,2,2,blue),10*5);assert.deepEqual(q.get(15,2),[255,255,255]);
});

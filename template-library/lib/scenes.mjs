// Storyboard compositions drawn with the sketch primitives. Each returns a function (w, h) => SVG for panel().
import {sk} from './assets.mjs';
const red='stroke="#b91c1c"';

/** Extreme wide: horizon, sky, a small figure, optional sun/fog. */
export const wide=({figures=1,x=0.5,sun=false,fog=false,water=false,arrow}={})=>(w,h)=>{
 const hy=h*0.52;let s=sk.line(0,hy,w,hy);
 if(water)for(let i=0;i<5;i++)s+=sk.curve(`M${w*0.05+i*w*0.19},${hy+30+i*14} q30,-10 60,0 t60,0`,'stroke-width="2"');
 if(fog)for(let i=0;i<4;i++)s+=sk.curve(`M${-40+i*w*0.28},${hy-30-i*8} q80,-24 160,0 t160,0`,'stroke-width="2" stroke="#a1a1aa"');
 if(sun)s+=sk.sun(w*0.8,h*0.22,30);
 for(let i=0;i<figures;i++)s+=sk.person(w*x+i*40,hy-70,80,{});
 if(arrow)s+=arrow(w,h);return s;
};
/** Medium shot of one or two people from the waist up. */
export const medium=({people=1,bg='',facing}={})=>(w,h)=>{
 let s=bg==='window'?sk.rect(w*0.6,h*0.12,w*0.3,h*0.5)+sk.line(w*0.75,h*0.12,w*0.75,h*0.62):bg==='horizon'?sk.line(0,h*0.45,w,h*0.45):bg==='shelves'?[0,1,2].map(i=>sk.line(w*0.05,h*(0.2+i*0.2),w*0.4,h*(0.2+i*0.2))).join(''):'';
 const xs=people===1?[w*0.5]:[w*0.32,w*0.68];
 xs.forEach((x,i)=>s+=sk.bust(x,h*0.42,0.95,{eyes:people===1||facing!=='profile'}));
 return s;
};
/** Close-up of a face filling the frame. */
export const close=({look='camera',tear=false}={})=>(w,h)=>{
 let s=`<ellipse cx="${w/2}" cy="${h*0.5}" rx="${w*0.2}" ry="${h*0.52}"/>`;
 const ex=look==='left'?-14:look==='right'?14:0;
 s+=`<path d="M${w/2-70+ex},${h*0.42} l34,0 M${w/2+36+ex},${h*0.42} l34,0"/><path d="M${w/2-26},${h*0.72} q26,12 52,0"/><path d="M${w/2},${h*0.48} l-8,40 l14,0"/>`;
 if(tear)s+=sk.curve(`M${w/2-50},${h*0.48} q-4,22 0,34`,'stroke="#2563eb"');
 return s;
};
/** Over-the-shoulder: foreground shoulder and head on the left, subject facing us on the right. */
export const ots=()=>(w,h)=>`<path d="M-20,${h} Q0,${h*0.55} ${w*0.22},${h*0.5} Q${w*0.34},${h*0.3} ${w*0.3},${h*0.1}" stroke-width="4"/>`+`<path d="M${w*0.05},${h*0.1} q${w*0.12},-${h*0.15} ${w*0.25},0" />`+sk.bust(w*0.66,h*0.4,0.85);
/** An object shot close: a hand and a thing. */
export const insert=(label='OBJECT',{hand=true}={})=>(w,h)=>sk.rect(w*0.36,h*0.3,w*0.28,h*0.42)+sk.text(w*0.4,h*0.54,label,38)+(hand?sk.curve(`M${w*0.1},${h} Q${w*0.2},${h*0.62} ${w*0.36},${h*0.58} l${w*0.03},0 M${w*0.2},${h} Q${w*0.28},${h*0.78} ${w*0.36},${h*0.7}`):'');
/** A product on a plinth with soft light. */
export const product=(label='PRODUCT')=>(w,h)=>sk.line(0,h*0.78,w,h*0.78)+sk.rect(w*0.38,h*0.6,w*0.24,h*0.18)+sk.rect(w*0.43,h*0.22,w*0.14,h*0.38)+sk.text(w*0.44,h*0.44,label,30)+sk.curve(`M${w*0.15},0 L${w*0.4},${h*0.5}`,'stroke="#a1a1aa" stroke-dasharray="8 10"')+sk.curve(`M${w*0.85},0 L${w*0.6},${h*0.5}`,'stroke="#a1a1aa" stroke-dasharray="8 10"');
/** A street: buildings, a road vanishing to a point, figures. */
export const street=({people=2,car=false}={})=>(w,h)=>{
 let s=sk.building(w*0.02,h*0.8,w*0.18,h*0.6)+sk.building(w*0.22,h*0.7,w*0.12,h*0.45,2)+sk.building(w*0.66,h*0.7,w*0.12,h*0.5,2)+sk.building(w*0.8,h*0.8,w*0.18,h*0.66);
 s+=sk.line(w*0.36,h*0.7,w*0.1,h)+sk.line(w*0.64,h*0.7,w*0.9,h);
 for(let i=0;i<people;i++)s+=sk.person(w*(0.42+i*0.1),h*0.55,120);
 if(car)s+=sk.rect(w*0.55,h*0.8,w*0.18,h*0.1)+sk.circle(w*0.59,h*0.91,14)+sk.circle(w*0.69,h*0.91,14);
 return s;
};
/** An interior: back wall, floor line, a window, a table, people. */
export const room=({people=1,table=true,window=true,door=false}={})=>(w,h)=>{
 let s=sk.line(0,h*0.72,w,h*0.72);
 if(window)s+=sk.rect(w*0.08,h*0.12,w*0.22,h*0.36)+sk.line(w*0.19,h*0.12,w*0.19,h*0.48);
 if(door)s+=sk.rect(w*0.78,h*0.14,w*0.14,h*0.58);
 if(table)s+=sk.line(w*0.38,h*0.66,w*0.72,h*0.66)+sk.line(w*0.42,h*0.66,w*0.42,h*0.84)+sk.line(w*0.68,h*0.66,w*0.68,h*0.84);
 for(let i=0;i<people;i++)s+=sk.person(w*(0.45+i*0.18),h*0.28,h*0.5);
 return s;
};
/** Top-down view: shapes and a path, for aerials, maps and plans. */
export const aerial=({path=true,label=''}={})=>(w,h)=>sk.curve(`M0,${h*0.7} C${w*0.3},${h*0.5} ${w*0.5},${h*0.9} ${w},${h*0.6}`,'stroke-width="2"')+sk.curve(`M0,${h*0.3} C${w*0.25},${h*0.2} ${w*0.6},${h*0.45} ${w},${h*0.25}`,'stroke-width="2"')+(path?sk.curve(`M${w*0.1},${h*0.9} Q${w*0.4},${h*0.4} ${w*0.7},${h*0.45}`,`stroke-dasharray="10 10" ${red}`):'')+sk.circle(w*0.7,h*0.45,8,'fill="#27272a"')+(label?sk.text(w*0.72,h*0.42,label,34):'');
/** Title card / end card: a lockup in the middle. */
export const titleCard=(line1,line2='')=>(w,h)=>sk.text(w*0.5,h*0.48,line1,64,'text-anchor="middle"')+(line2?sk.text(w*0.5,h*0.62,line2,34,'text-anchor="middle"'):'')+sk.line(w*0.35,h*0.53,w*0.65,h*0.53,'stroke-width="2"');
/** A phone held in a hand, with a simple screen. */
export const phoneInHand=(screen='')=>(w,h)=>sk.phone(w*0.4,h*0.08,w*0.2,h*0.84)+sk.textLines(w*0.43,h*0.3,w*0.14,3,22)+(screen?sk.text(w*0.42,h*0.22,screen,26):'')+sk.button(w*0.43,h*0.66,w*0.14,30,'Go')+sk.curve(`M${w*0.25},${h} Q${w*0.33},${h*0.7} ${w*0.42},${h*0.62}`);
/** A crowd/audience facing a stage. */
export const stage=({speaker=true}={})=>(w,h)=>sk.rect(w*0.2,h*0.15,w*0.6,h*0.35)+(speaker?sk.person(w*0.5,h*0.2,h*0.3):'')+Array.from({length:9},(_,i)=>sk.circle(w*(0.08+i*0.105),h*0.82,20)+sk.curve(`M${w*(0.08+i*0.105)-34},${h} q34,-60 68,0`)).join('');
/** Adds a camera move arrow (pan or push) on top of another composition. */
export const withMove=(comp,move)=>(w,h)=>comp(w,h)+(move==='pan'?sk.pan(w*0.15,h*0.12,w*0.6):move==='push'?sk.push(w*0.5,h*0.5,90):move==='tilt'?`<path d="M${w*0.9},${h*0.75} L${w*0.9},${h*0.2}" marker-end="url(#ah)" ${red} stroke-width="4"/><text x="${w*0.8}" y="${h*0.85}" font-size="30" fill="#b91c1c" stroke="none">TILT UP</text>`:move==='track'?`<path d="M${w*0.1},${h*0.92} L${w*0.7},${h*0.92}" marker-end="url(#ah)" ${red} stroke-width="4"/><text x="${w*0.12}" y="${h*0.88}" font-size="30" fill="#b91c1c" stroke="none">TRACK WITH</text>`:'');

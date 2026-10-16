// Generated pictures for library templates: colour swatches and palettes, type specimens, rough sketches (storyboard
// panels, wireframes, floor plans, thumbnails) and simple charts. Each helper returns an image card spec and registers
// the picture it needs; build.mjs renders whatever is missing with headless Chromium and stores it in images/generated.
// Every picture here is drawn by this code, so it carries no third-party rights. Fonts used are OFL/GUST licensed.

import {createHash} from 'node:crypto';
export const registry=new Map();
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const hash=s=>createHash('sha1').update(s).digest('hex').slice(0,10);
// Registers an HTML page of the given size and returns its key.
export function asset(kind,title,width,height,html,{format='png',slug}={}){
 const key=`gen-${kind}-${slug||hash(html)}`;
 if(!registry.has(key))registry.set(key,{key,kind,title,width,height,format,html,hash:hash(html)});
 return key;
}
const page=(w,h,body,{bg='#ffffff',css=''}={})=>`<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Caveat;src:url(caveat.woff2)}
@font-face{font-family:Hand;src:url(caveat.woff2)}
html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:${bg}}
body{font-family:Inter,'Inter Display',sans-serif;-webkit-font-smoothing:antialiased}${css}</style></head><body>${body}</body></html>`;

// ── Colour ────────────────────────────────────────────────────────────────────
const lum=hex=>{const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*r+.7152*g+.0722*b;};
const inkFor=hex=>lum(hex)>.36?'#1c1917':'#fafaf9';
/** One colour chip with its name and hex value. */
export function swatch(hex,name,o={}){
 const w=400,h=o.tall?520:300,ink=inkFor(hex);
 const key=asset('swatch',`${name} ${hex}`,w,h,page(w,h,`<div style="position:absolute;inset:0;background:${hex}"></div><div style="position:absolute;left:26px;bottom:22px;color:${ink};font:500 34px Inter;letter-spacing:-.01em">${esc(name)}<div style="font:400 24px 'IBM Plex Mono',monospace;opacity:.75;margin-top:4px">${hex.toUpperCase()}</div></div>`),{slug:`${hex.slice(1).toLowerCase()}-${esc(name).replace(/[^a-z0-9]/gi,'').toLowerCase().slice(0,16)}-${o.tall?'t':'s'}`});
 return {type:'image',img:key,title:o.title||`${name} · ${hex.toUpperCase()}`,...o.card};
}
/** A row of colours in proportion, labelled underneath: [[hex, name, weight?], …]. */
export function palette(title,colors,o={}){
 const w=800,h=o.h||400,total=colors.reduce((s,c)=>s+(c[2]||1),0);let x=0;
 const bands=colors.map(([hex,name,weight=1])=>{const bw=Math.round(w*weight/total),ink=inkFor(hex),cell=`<div style="position:absolute;left:${x}px;top:0;width:${bw}px;height:${h}px;background:${hex}"><div style="position:absolute;left:14px;right:6px;bottom:16px;color:${ink};font:600 26px Inter;line-height:1.15;letter-spacing:-.01em">${esc(name)}<br><span style="font:400 19px 'IBM Plex Mono',monospace;opacity:.75">${hex.toUpperCase()}</span></div></div>`;x+=bw;return cell;}).join('');
 const key=asset('palette',title,w,h,page(w,h,bands),{slug:hash(colors.map(c=>c[0]+c[1]+(c[2]||1)).join())});
 return {type:'image',img:key,title,...o.card};
}

// ── Type ──────────────────────────────────────────────────────────────────────
// Fonts the renderer can load. Local system fonts by family name, the rest from @fontsource packages (see README).
export const FONTS={
 'Inter':{css:"'Inter'",note:'Inter · SIL OFL'},
 'Lora':{css:"'Lora'",note:'Lora · SIL OFL'},
 'Poppins':{css:"'Poppins'",note:'Poppins · SIL OFL'},
 'Playfair Display':{css:"'Playfair Display'",pkg:'playfair-display',note:'Playfair Display · SIL OFL'},
 'Fraunces':{css:"'Fraunces'",pkg:'fraunces',note:'Fraunces · SIL OFL'},
 'Space Grotesk':{css:"'Space Grotesk'",pkg:'space-grotesk',note:'Space Grotesk · SIL OFL'},
 'DM Serif Display':{css:"'DM Serif Display'",pkg:'dm-serif-display',note:'DM Serif Display · SIL OFL'},
 'Bebas Neue':{css:"'Bebas Neue'",pkg:'bebas-neue',note:'Bebas Neue · SIL OFL'},
 'IBM Plex Mono':{css:"'IBM Plex Mono'",pkg:'ibm-plex-mono',note:'IBM Plex Mono · SIL OFL'},
 'Syne':{css:"'Syne'",pkg:'syne',note:'Syne · SIL OFL'},
 'Cormorant Garamond':{css:"'Cormorant Garamond'",pkg:'cormorant-garamond',note:'Cormorant Garamond · SIL OFL'},
 'Archivo Black':{css:"'Archivo Black'",pkg:'archivo-black',note:'Archivo Black · SIL OFL'},
 'Permanent Marker':{css:"'Permanent Marker'",pkg:'permanent-marker',note:'Permanent Marker · Apache 2.0'},
 'Instrument Serif':{css:"'Instrument Serif'",pkg:'instrument-serif',note:'Instrument Serif · SIL OFL'},
 'Caveat':{css:"'Caveat'",pkg:'caveat',note:'Caveat · SIL OFL'},
 'TeX Gyre Pagella':{css:"'TeX Gyre Pagella'",note:'TeX Gyre Pagella · GUST Font License'},
};
/** A type specimen: the face's name, a display line and a paragraph. */
export function typeSpecimen(font,display,o={}){
 const f=FONTS[font];if(!f)throw Error('Unknown font '+font);
 const w=1000,h=o.h||620,bg=o.bg||'#f5f2ec',ink=o.ink||'#1c1917';
 const body=`<div style="position:absolute;inset:48px 56px;color:${ink}">
 <div style="font:500 20px Inter;opacity:.55;letter-spacing:.04em;text-transform:uppercase">${esc(o.role||'Typeface')} — ${esc(font)}</div>
 <div style="font-family:${f.css};font-size:${o.size||96}px;font-weight:${o.weight||400};line-height:1.02;margin-top:28px;letter-spacing:${o.tracking||'-0.01em'}${o.italic?';font-style:italic':''}">${esc(display)}</div>
 <div style="font-family:${f.css};font-size:28px;line-height:1.45;margin-top:30px;max-width:820px;opacity:.85">${esc(o.sample||'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0123456789')}</div>
 <div style="position:absolute;bottom:0;font:400 18px 'IBM Plex Mono',monospace;opacity:.5">${esc(f.note)}</div></div>`;
 const key=asset('type',`${font} specimen`,w,h,page(w,h,body,{bg}));
 return {type:'image',img:key,title:o.title||`${o.role||'Typeface'}: ${font}`,...o.card};
}

// ── Sketches ──────────────────────────────────────────────────────────────────
// Rough pencil drawings on white paper. A seeded wobble filter keeps every stroke slightly hand-made.
const PAPER_W=1000,PAPER_H=650;
const pencil=(seed=3)=>`<filter id="w" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter>`;
/** A drawing on the sketch card's paper (1000 × 650). `svg` is the inner SVG markup; helpers below draw common things. */
export function drawing(title,svg,o={}){
 const w=o.w||PAPER_W,h=o.h||PAPER_H;
 const html=page(w,h,`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><defs>${pencil(o.seed)}<marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#3f3f46"/></marker></defs><g filter="url(#w)" fill="none" stroke="#27272a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" font-family="Caveat" >${svg}</g></svg>`);
 const key=asset('sketch',title,w,h,html);
 return {type:'sketch',img:key,title,...o.card};
}
// Primitives return SVG markup. Coordinates are in paper units.
export const sk={
 line:(x1,y1,x2,y2,o='')=>`<path d="M${x1},${y1} L${x2},${y2}" ${o}/>`,
 arrow:(x1,y1,x2,y2,o='')=>`<path d="M${x1},${y1} L${x2},${y2}" marker-end="url(#ah)" ${o}/>`,
 curve:(d,o='')=>`<path d="${d}" ${o}/>`,
 rect:(x,y,w,h,o='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" ${o}/>`,
 fill:(x,y,w,h,c='#e4e4e7',o='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${c}" stroke="none" ${o}/>`,
 circle:(x,y,r,o='')=>`<circle cx="${x}" cy="${y}" r="${r}" ${o}/>`,
 text:(x,y,t,size=34,o='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="#27272a" stroke="none" ${o}>${esc(t)}</text>`,
 hatch:(x,y,w,h,step=14,o='')=>{let d='';for(let i=-h;i<w;i+=step)d+=`M${x+Math.max(0,i)},${y+Math.max(0,-i)} L${x+Math.min(w,i+h)},${y+Math.min(h,h-(i+h-w>0?i+h-w:0))} `;return `<path d="${d}" stroke-width="1.5" stroke="#a1a1aa" ${o}/>`;},
 // A person: head and body, facing left/right/front, scale ~ height in px.
 person:(x,y,h=200,o={})=>{const r=h*0.12,b=y+r*2;const dir=o.facing==='left'?-1:o.facing==='right'?1:0;return `<g ${o.attr||''}><circle cx="${x}" cy="${y+r}" r="${r}" ${o.fill?`fill="${o.fill}"`:''}/>${dir?`<path d="M${x+dir*r*0.9},${y+r*0.9} l${dir*r*0.35},${r*0.25}"/>`:''}<path d="M${x-h*0.17},${y+h} L${x-h*0.15},${b+h*0.05} Q${x},${b-h*0.04} ${x+h*0.15},${b+h*0.05} L${x+h*0.17},${y+h}" ${o.fill?`fill="${o.fill}"`:''}/>${o.arms?`<path d="${o.arms}"/>`:''}</g>`;},
 // Head-and-shoulders close-up.
 bust:(x,y,s=1,o={})=>`<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="70" ry="88" ${o.fill?`fill="${o.fill}"`:''}/><path d="M-160,240 Q-150,110 -40,95 L40,95 Q150,110 160,240"/>${o.eyes===false?'':'<path d="M-30,-8 l14,0 M18,-8 l14,0"/><path d="M-10,38 q12,6 22,0"/>'}</g>`,
 tree:(x,y,h=180)=>{const r=h*0.2,cy=y-h*0.68;return `<path d="M${x},${y} L${x},${y-h*0.4} M${x},${y-h*0.5} l${-h*0.08},${-h*0.1} M${x},${y-h*0.48} l${h*0.07},${-h*0.12}"/><path d="M${x-r*1.5},${cy+r*0.6} a${r*0.8},${r*0.8} 0 0 1 ${r*0.2},${-r*1.3} a${r},${r} 0 0 1 ${r*1.4},${-r*0.8} a${r},${r} 0 0 1 ${r*1.5},${r*0.4} a${r*0.8},${r*0.8} 0 0 1 ${r*0.1},${r*1.4} a${r*0.9},${r*0.9} 0 0 1 ${-r*1.2},${r*0.5} a${r},${r} 0 0 1 ${-r*1.8},${-r*0.2} Z"/>`;},
 building:(x,y,w,h,rows=3)=>{let s=`<rect x="${x}" y="${y-h}" width="${w}" height="${h}"/>`;const cw=w/4,rh=h/(rows+1);for(let r=0;r<rows;r++)for(let c=0;c<3;c++)s+=`<rect x="${x+cw*0.5+c*cw*1.05}" y="${y-h+rh*0.5+r*rh}" width="${cw*0.55}" height="${rh*0.5}" stroke-width="2"/>`;return s;},
 sun:(x,y,r=40)=>`<circle cx="${x}" cy="${y}" r="${r}"/>`+[0,45,90,135,180,225,270,315].map(a=>{const c=Math.cos(a*Math.PI/180),s=Math.sin(a*Math.PI/180);return `<path d="M${x+c*r*1.4},${y+s*r*1.4} L${x+c*r*1.9},${y+s*r*1.9}" stroke-width="2"/>`;}).join(''),
 // Camera move notation inside a panel.
 pan:(x1,y,x2,label='PAN')=>`<path d="M${x1},${y} L${x2},${y}" marker-end="url(#ah)" stroke="#b91c1c" stroke-width="4"/><text x="${(x1+x2)/2-30}" y="${y-12}" font-size="30" fill="#b91c1c" stroke="none">${label}</text>`,
 push:(x,y,s=80,label='PUSH IN')=>`<g stroke="#b91c1c" stroke-width="4"><path d="M${x-s},${y-s*0.6} L${x-s*0.4},${y-s*0.25}" marker-end="url(#ah)"/><path d="M${x+s},${y-s*0.6} L${x+s*0.4},${y-s*0.25}" marker-end="url(#ah)"/><path d="M${x-s},${y+s*0.6} L${x-s*0.4},${y+s*0.25}" marker-end="url(#ah)"/><path d="M${x+s},${y+s*0.6} L${x+s*0.4},${y+s*0.25}" marker-end="url(#ah)"/></g><text x="${x-s}" y="${y+s+30}" font-size="30" fill="#b91c1c" stroke="none">${label}</text>`,
 // UI wireframe bits.
 textLines:(x,y,w,n=3,gap=18)=>Array.from({length:n},(_,i)=>`<path d="M${x},${y+i*gap} L${x+(i===n-1?w*0.6:w)},${y+i*gap}" stroke-width="2.5" stroke="#71717a"/>`).join(''),
 imageBox:(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/><path d="M${x},${y} L${x+w},${y+h} M${x+w},${y} L${x},${y+h}" stroke-width="1.5" stroke="#a1a1aa"/>`,
 button:(x,y,w,h,t)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h/2}" fill="#27272a"/><text x="${x+w/2}" y="${y+h*0.68}" font-size="${h*0.55}" fill="#ffffff" stroke="none" text-anchor="middle">${esc(t)}</text>`,
 phone:(x,y,w=260,h=520)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="34" stroke-width="4"/><path d="M${x+w*0.38},${y+16} L${x+w*0.62},${y+16}" stroke-width="5"/>`,
};
/** A storyboard panel: a 16:9 (or given ratio) frame with the drawing inside and a shot label. */
export function panel(title,inner,o={}){
 const ratio=o.ratio||16/9,w=PAPER_W,h=PAPER_H,fw=900,fh=Math.round(fw/ratio),fx=50,fy=Math.round((h-fh)/2);
 const svg=`<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" stroke-width="4"/><g transform="translate(${fx},${fy})"><clipPath id="c"><rect width="${fw}" height="${fh}"/></clipPath><g clip-path="url(#c)">${inner(fw,fh)}</g></g>${o.label?`<text x="${fx}" y="${fy-14}" font-size="34" fill="#52525b" stroke="none">${esc(o.label)}</text>`:''}`;
 return drawing(title,svg,{...o,seed:o.seed||title.length});
}

// ── Charts ────────────────────────────────────────────────────────────────────
// Plain, quiet charts in one accent colour: bars or lines with labelled axes. Data is illustrative sample data.
export function chart(title,kind,labels,series,o={}){
 const w=1000,h=o.h||560,pad={l:80,r:40,t:70,b:70},cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;
 const max=o.max||Math.max(...series.flatMap(s=>s.values))*1.12,colors=['#2563eb','#d97706','#16a34a','#9333ea'];
 const yv=v=>pad.t+ch-ch*v/max,step=cw/labels.length;let marks='';
 if(kind==='bar'){const n=series.length,bw=step*0.7/n;series.forEach((s,si)=>s.values.forEach((v,i)=>{const x=pad.l+i*step+step*0.15+si*bw;marks+=`<rect x="${x}" y="${yv(v)}" width="${bw-4}" height="${pad.t+ch-yv(v)}" rx="3" fill="${s.color||colors[si]}"/>`;if(o.values)marks+=`<text x="${x+bw/2-2}" y="${yv(v)-8}" font-size="17" text-anchor="middle" fill="#3f3f46">${o.fmt?o.fmt(v):v}</text>`;}));}
 else series.forEach((s,si)=>{const pts=s.values.map((v,i)=>`${pad.l+i*step+step/2},${yv(v)}`);marks+=`<polyline points="${pts.join(' ')}" fill="none" stroke="${s.color||colors[si]}" stroke-width="4" stroke-linejoin="round"/>`+s.values.map((v,i)=>`<circle cx="${pad.l+i*step+step/2}" cy="${yv(v)}" r="5" fill="${s.color||colors[si]}"/>`).join('');});
 const ticks=[0,.25,.5,.75,1].map(t=>{const v=max*t;return `<path d="M${pad.l},${yv(v)} H${w-pad.r}" stroke="#e4e4e7"/><text x="${pad.l-12}" y="${yv(v)+6}" font-size="16" text-anchor="end" fill="#71717a">${o.fmt?o.fmt(Math.round(v)):Math.round(v)}</text>`;}).join('');
 const xl=labels.map((l,i)=>`<text x="${pad.l+i*step+step/2}" y="${h-pad.b+30}" font-size="17" text-anchor="middle" fill="#52525b">${esc(l)}</text>`).join('');
 const legend=series.length>1?series.map((s,i)=>`<rect x="${pad.l+i*190}" y="24" width="16" height="16" rx="3" fill="${s.color||colors[i]}"/><text x="${pad.l+i*190+24}" y="38" font-size="18" fill="#3f3f46">${esc(s.name)}</text>`).join(''):`<text x="${pad.l}" y="40" font-size="20" font-weight="600" fill="#27272a">${esc(o.caption||title)}</text>`;
 const html=page(w,h,`<svg width="${w}" height="${h}" font-family="Inter">${ticks}${marks}${xl}${legend}</svg>`);
 const key=asset('chart',title,w,h,html);
 return {type:'image',img:key,title,...o.card};
}

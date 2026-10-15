// The sketch editor: a small drawing pad whose picture becomes a sketch card.
// A drawing is its paper (blank, or the picture being edited) plus a list of marks. Every tool adds one mark, so undo
// and redo only drop or restore the last mark and repaint. The geometry and the fill are plain functions with no DOM,
// so they are tested in Node; sketchPad() at the bottom is the only part that touches the page.
import {icon} from './icons.js';

export const WIDTH=1000,HEIGHT=650,PAPER='#ffffff';
export const TOOLS=[
 {id:'pen',label:'Pen',key:'p',icon:'pen'},
 {id:'marker',label:'Highlighter',key:'h',icon:'marker'},
 {id:'eraser',label:'Eraser',key:'e',icon:'eraser'},
 {id:'line',label:'Line',key:'l',icon:'line'},
 {id:'arrow',label:'Arrow',key:'a',icon:'arrow-line'},
 {id:'rect',label:'Rectangle',key:'r',icon:'rect'},
 {id:'ellipse',label:'Ellipse',key:'o',icon:'ellipse'},
 {id:'fill',label:'Fill',key:'f',icon:'bucket'}
];
export const INKS=[['Black','#18181b'],['Grey','#71717a'],['Red','#dc2626'],['Orange','#ea580c'],['Yellow','#eab308'],['Green','#16a34a'],['Blue','#2563eb'],['Violet','#9333ea']];
const FREEHAND=['pen','marker','eraser'],SHAPES=['line','arrow','rect','ellipse'];

// Shift held: lines and arrows snap to the nearest 45°, rectangles and ellipses to equal width and height.
export function constrain(tool,from,to){
 const dx=to[0]-from[0],dy=to[1]-from[1];
 if(tool==='line'||tool==='arrow'){const step=Math.PI/4,angle=Math.round(Math.atan2(dy,dx)/step)*step,length=Math.hypot(dx,dy);return [from[0]+Math.cos(angle)*length,from[1]+Math.sin(angle)*length];}
 if(tool==='rect'||tool==='ellipse'){const side=Math.max(Math.abs(dx),Math.abs(dy));return [from[0]+(dx<0?-side:side),from[1]+(dy<0?-side:side)];}
 return to;
}
// The three corners of an arrowhead at `to`, sized with the line so thin and thick arrows both read, and never longer
// than the arrow itself.
export function arrowHead(from,to,size){
 const length=Math.min(Math.max(12,size*4),Math.hypot(to[0]-from[0],to[1]-from[1])||1),angle=Math.atan2(to[1]-from[1],to[0]-from[0]),spread=.45;
 return [[to[0]-length*Math.cos(angle-spread),to[1]-length*Math.sin(angle-spread)],to,[to[0]-length*Math.cos(angle+spread),to[1]-length*Math.sin(angle+spread)]];
}
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
// Flood fill on ImageData-shaped pixels ({data,width,height}), from (x,y) across everything within `tolerance` of the
// colour found there. Lines are anti-aliased, so stopping dead at the tolerance would leave a pale fringe beside
// every stroke; the ring of pixels just outside the filled area is therefore shifted toward the new colour by however
// much of it was still the old one. Returns the number of pixels filled.
export function floodFill(image,x,y,color,tolerance=32){
 const {data,width,height}=image;if(x<0||y<0||x>=width||y>=height)return 0;
 const start=(y*width+x)*4,target=[data[start],data[start+1],data[start+2]];
 if(target.every((v,i)=>v===color[i]))return 0;
 const away=p=>Math.max(Math.abs(data[p*4]-target[0]),Math.abs(data[p*4+1]-target[1]),Math.abs(data[p*4+2]-target[2]));
 const state=new Uint8Array(width*height),stack=[x,y],open=p=>!state[p]&&away(p)<=tolerance;let count=0;
 while(stack.length){
  const sy=stack.pop(),sx=stack.pop();if(!open(sy*width+sx))continue;
  let left=sx,right=sx;while(left>0&&open(sy*width+left-1))left--;while(right<width-1&&open(sy*width+right+1))right++;
  for(let i=left;i<=right;i++)state[sy*width+i]=1;count+=right-left+1;
  for(const ny of [sy-1,sy+1]){if(ny<0||ny>=height)continue;let run=false;for(let i=left;i<=right;i++){if(open(ny*width+i)){if(!run)stack.push(i,ny);run=true;}else run=false;}}
 }
 const soften=p=>{if(state[p])return;state[p]=2;const share=Math.max(0,1-away(p)/200);for(let c=0;c<3;c++)data[p*4+c]=Math.max(0,Math.min(255,Math.round(data[p*4+c]+(color[c]-target[c])*share)));};
 for(let p=0;p<state.length;p++){if(state[p]!==1)continue;const px=p%width;if(px>0)soften(p-1);if(px<width-1)soften(p+1);if(p>=width)soften(p-width);if(p<state.length-width)soften(p+width);}
 for(let p=0;p<state.length;p++)if(state[p]===1){data[p*4]=color[0];data[p*4+1]=color[1];data[p*4+2]=color[2];data[p*4+3]=255;}
 return count;
}

// A freehand path, smoothed by curving through the midpoints between samples. A single sample is a dot.
function trace(ctx,points){
 ctx.beginPath();
 if(points.length===1){ctx.arc(points[0][0],points[0][1],ctx.lineWidth/2,0,Math.PI*2);ctx.fill();return;}
 ctx.moveTo(points[0][0],points[0][1]);
 for(let i=1;i<points.length-1;i++)ctx.quadraticCurveTo(points[i][0],points[i][1],(points[i][0]+points[i+1][0])/2,(points[i][1]+points[i+1][1])/2);
 const last=points[points.length-1];ctx.lineTo(last[0],last[1]);ctx.stroke();
}
// Draw one mark. Marks are plain data: {tool,color,size} with `points` for freehand tools, `from` and `to` for
// shapes, `at` for a fill, and nothing more for a clear.
export function paint(ctx,mark){
 ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=ctx.fillStyle=mark.color||PAPER;ctx.lineWidth=mark.size||1;
 if(mark.tool==='clear'){ctx.fillStyle=PAPER;ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);}
 else if(mark.tool==='fill'){const image=ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);if(floodFill(image,Math.round(mark.at[0]),Math.round(mark.at[1]),rgb(mark.color)))ctx.putImageData(image,0,0);}
 else if(mark.points){
  // A highlighter is wide and see-through, and multiplies so lines under it stay dark. An eraser is paper-colored ink.
  if(mark.tool==='marker'){ctx.globalAlpha=.4;ctx.globalCompositeOperation='multiply';ctx.lineWidth=Math.max(10,mark.size*4);}
  if(mark.tool==='eraser'){ctx.strokeStyle=ctx.fillStyle=PAPER;ctx.lineWidth=Math.max(8,mark.size*3);}
  trace(ctx,mark.points);
 }else{
  const [x1,y1]=mark.from,[x2,y2]=mark.to;ctx.beginPath();
  if(mark.tool==='rect')ctx.rect(Math.min(x1,x2),Math.min(y1,y2),Math.abs(x2-x1),Math.abs(y2-y1));
  else if(mark.tool==='ellipse')ctx.ellipse((x1+x2)/2,(y1+y2)/2,Math.abs(x2-x1)/2,Math.abs(y2-y1)/2,0,0,Math.PI*2);
  else{
   ctx.moveTo(x1,y1);
   if(mark.tool==='arrow'){
    // Stop the shaft inside the head so its round end does not blunt the tip.
    const head=arrowHead(mark.from,mark.to,mark.size),back=[(head[0][0]+head[2][0])/2,(head[0][1]+head[2][1])/2];
    ctx.lineTo(back[0],back[1]);ctx.stroke();ctx.beginPath();ctx.moveTo(head[0][0],head[0][1]);ctx.lineTo(head[1][0],head[1][1]);ctx.lineTo(head[2][0],head[2][1]);ctx.closePath();ctx.fill();
   }else ctx.lineTo(x2,y2);
  }
  ctx.stroke();
 }
 ctx.restore();
}

// Builds the editor inside `root`, the open dialog. `existing` is the sketch card being edited, if any; its picture becomes
// the paper. `onSave` receives the finished drawing as a PNG data URL.
export function sketchPad(root,{existing,onSave}){
 root.insertAdjacentHTML('beforeend',`<div class="sketch-bar"><div class="sketch-group" role="toolbar" aria-label="Drawing tools">${TOOLS.map(t=>`<button class="sketch-tool" data-tool="${t.id}" title="${t.label} · ${t.key.toUpperCase()}" aria-label="${t.label}" aria-pressed="false">${icon(t.icon)}</button>`).join('')}</div><div class="sketch-group"><button class="sketch-tool" id="sketch-undo" title="Undo · ⌘Z" aria-label="Undo">${icon('undo')}</button><button class="sketch-tool" id="sketch-redo" title="Redo · ⌘⇧Z" aria-label="Redo">${icon('redo')}</button><button class="sketch-tool" id="sketch-clear" title="Clear the drawing" aria-label="Clear">${icon('trash')}</button></div></div>
<div class="sketch-options"><div class="sketch-inks" role="group" aria-label="Ink color">${INKS.map(([name,color])=>`<button class="sketch-ink" data-ink="${color}" style="--chip:${color}" title="${name}" aria-label="${name}" aria-pressed="false"></button>`).join('')}<input type="color" id="sketch-color" value="${INKS[0][1]}" title="Any color" aria-label="Any color"></div><label class="sketch-size">Size <input type="range" id="sketch-size" min="1" max="40" value="3"><output id="sketch-size-value">3</output></label></div>
<canvas id="sketch-canvas" width="${WIDTH}" height="${HEIGHT}" aria-label="Sketch"></canvas>
<div class="modal-footer"><span class="inline-note">Hold Shift for straight lines, squares and circles.</span><button id="save-sketch" class="button primary">${existing?'Save sketch':'Add to board'}</button></div>`);
 const q=s=>root.querySelector(s),canvas=q('#sketch-canvas'),ctx=canvas.getContext('2d');
 // `paper` is what the drawing starts from; `inked` is the paper with every finished mark on it, kept so that a mark
 // still being drawn can be previewed over it without repainting the whole history on each pointer move.
 const layer=()=>{const c=document.createElement('canvas');c.width=WIDTH;c.height=HEIGHT;return c;},paper=layer(),inked=layer(),paperCtx=paper.getContext('2d'),inkedCtx=inked.getContext('2d',{willReadFrequently:true});
 const marks=[],undone=[];let tool='pen',color=INKS[0][1],size=3,active=null,ready=false;
 const show=()=>{ctx.drawImage(inked,0,0);if(active)paint(ctx,active);};
 const rebuild=()=>{inkedCtx.drawImage(paper,0,0);for(const mark of marks)paint(inkedCtx,mark);show();};
 function sync(){
  root.querySelectorAll('[data-tool]').forEach(el=>el.setAttribute('aria-pressed',el.dataset.tool===tool));
  root.querySelectorAll('[data-ink]').forEach(el=>el.setAttribute('aria-pressed',el.dataset.ink===color));
  q('#sketch-color').value=color;q('#sketch-size').value=size;q('#sketch-size-value').textContent=size;
  q('#sketch-undo').disabled=!marks.length;q('#sketch-redo').disabled=!undone.length;q('#sketch-clear').disabled=!ready;q('#save-sketch').disabled=!ready;
 }
 const commit=mark=>{marks.push(mark);undone.length=0;paint(inkedCtx,mark);show();sync();};
 const undo=()=>{if(!marks.length||active)return;undone.push(marks.pop());rebuild();sync();};
 const redo=()=>{if(!undone.length||active)return;const mark=undone.pop();marks.push(mark);paint(inkedCtx,mark);show();sync();};
 const pick=id=>{if(TOOLS.some(t=>t.id===id)){tool=id;sync();}};
 const resize=next=>{size=Math.max(1,Math.min(40,Math.round(next)));sync();};
 paperCtx.fillStyle=PAPER;paperCtx.fillRect(0,0,WIDTH,HEIGHT);
 const begin=()=>{ready=true;rebuild();sync();};
 if(existing?.media){const image=new Image();image.onload=()=>{paperCtx.drawImage(image,0,0,WIDTH,HEIGHT);begin();};image.onerror=begin;image.src=existing.media;rebuild();sync();}else begin();

 const point=e=>{const r=canvas.getBoundingClientRect();return [(e.clientX-r.left)*WIDTH/r.width,(e.clientY-r.top)*HEIGHT/r.height];};
 canvas.onpointerdown=e=>{
  if(!ready||e.button!==0)return;e.preventDefault();const p=point(e);
  if(tool==='fill'){commit({tool,color,at:p});return;}
  canvas.setPointerCapture(e.pointerId);active=FREEHAND.includes(tool)?{tool,color,size,points:[p]}:{tool,color,size,from:p,to:p};show();
 };
 canvas.onpointermove=e=>{
  if(!active)return;
  if(active.points)for(const sample of e.getCoalescedEvents?.().length?e.getCoalescedEvents():[e]){const p=point(sample),last=active.points[active.points.length-1];if(Math.hypot(p[0]-last[0],p[1]-last[1])>=.75)active.points.push(p);}
  else active.to=e.shiftKey?constrain(active.tool,active.from,point(e)):point(e);
  show();
 };
 canvas.onpointerup=()=>{
  if(!active)return;const mark=active;active=null;
  // A click with a shape tool has no size to draw; a click with a freehand tool is a dot.
  if(SHAPES.includes(mark.tool)&&Math.hypot(mark.to[0]-mark.from[0],mark.to[1]-mark.from[1])<2){show();return;}
  commit(mark);
 };
 canvas.onpointercancel=()=>{active=null;show();};

 root.querySelectorAll('[data-tool]').forEach(el=>el.onclick=()=>pick(el.dataset.tool));
 // Choosing an ink while erasing means "draw with this", so it goes back to the pen.
 const ink=value=>{color=value;if(tool==='eraser')tool='pen';sync();};
 root.querySelectorAll('[data-ink]').forEach(el=>el.onclick=()=>ink(el.dataset.ink));
 q('#sketch-color').oninput=e=>ink(e.target.value);
 q('#sketch-size').oninput=e=>resize(Number(e.target.value));
 q('#sketch-undo').onclick=undo;q('#sketch-redo').onclick=redo;
 q('#sketch-clear').onclick=()=>{if(ready)commit({tool:'clear'});};
 q('#save-sketch').onclick=()=>{if(!ready)return;active=null;show();onSave(canvas.toDataURL('image/png'));};
 // Shortcuts listen on the document, not the dialog: a button that disables itself when clicked (the last undo, say)
 // drops focus to the page, and keys pressed after that never reach the dialog. They retire once the editor closes.
 const keys=e=>{
  if(!canvas.isConnected||!root.open){document.removeEventListener('keydown',keys);return;}
  if(e.metaKey||e.ctrlKey){const k=e.key.toLowerCase();if(k==='z'){e.preventDefault();e.shiftKey?redo():undo();}else if(k==='y'){e.preventDefault();redo();}return;}
  if(e.altKey||e.target.closest('input[type=text],textarea'))return;
  const hit=TOOLS.find(t=>t.key===e.key.toLowerCase());
  if(hit){e.preventDefault();pick(hit.id);}else if(e.key==='['){e.preventDefault();resize(size-1);}else if(e.key===']'){e.preventDefault();resize(size+1);}
 };
 document.addEventListener('keydown',keys);
}

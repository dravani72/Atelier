import {paletteHTML,bindPalette,remember} from './palette.js';
export function drawing(root,existing,onSave){
 root.insertAdjacentHTML('beforeend',`${paletteHTML('draw-palette')}<div class="sketch-tools"><label>Ink <input type="color" id="sketch-color" value="#18181b"></label><label>Paper <input type="color" id="sketch-paper" value="#ffffff"></label><label>Size <input type="range" id="sketch-size" min="1" max="40" value="3"></label><button class="button" id="sketch-eraser" aria-pressed="false">Eraser</button><button class="button" id="sketch-undo">Undo stroke</button><button class="button" id="sketch-redo">Redo stroke</button><button class="button" id="sketch-clear">Clear</button></div><canvas id="sketch-canvas" width="1000" height="650"></canvas><div class="modal-footer"><button id="save-sketch" class="button primary">${existing?'Save sketch':'Add to board'}</button></div>`);
 const q=s=>root.querySelector(s),canvas=q('#sketch-canvas'),ctx=canvas.getContext('2d'),past=[],future=[];let down=false,eraser=false,loading=false;
 function controls(){q('#sketch-undo').disabled=!past.length||loading;q('#sketch-redo').disabled=!future.length||loading;q('#save-sketch').disabled=loading;}
 function snapshot(){return {pixels:ctx.getImageData(0,0,canvas.width,canvas.height),paper:q('#sketch-paper').value};}
 function restore(state){ctx.putImageData(state.pixels,0,0);q('#sketch-paper').value=state.paper;}
 function checkpoint(){past.push(snapshot());if(past.length>10)past.shift();future.length=0;controls();}
 function paper(){ctx.fillStyle=q('#sketch-paper').value;ctx.fillRect(0,0,canvas.width,canvas.height);}
 paper();controls();
 if(existing?.media){loading=true;controls();const image=new Image();image.onload=()=>{ctx.drawImage(image,0,0,canvas.width,canvas.height);loading=false;controls();};image.onerror=()=>{loading=false;controls();};image.src=existing.media;}
 bindPalette(root,'draw-palette',color=>{q('#sketch-color').value=color;eraser=false;q('#sketch-eraser').setAttribute('aria-pressed','false');});
 q('#sketch-color').onchange=e=>remember(e.target.value);
 let lastPaper=q('#sketch-paper').value;
 q('#sketch-paper').onchange=()=>{const next=q('#sketch-paper').value;q('#sketch-paper').value=lastPaper;checkpoint();q('#sketch-paper').value=next;lastPaper=next;paper();};
 const pos=e=>{const r=canvas.getBoundingClientRect();return [(e.clientX-r.left)*canvas.width/r.width,(e.clientY-r.top)*canvas.height/r.height];};let previous;
 canvas.onpointerdown=e=>{if(loading||e.button!==0)return;e.preventDefault();checkpoint();down=true;canvas.setPointerCapture(e.pointerId);previous=pos(e);ctx.fillStyle=eraser?q('#sketch-paper').value:q('#sketch-color').value;ctx.beginPath();ctx.arc(...previous,Number(q('#sketch-size').value)/2,0,Math.PI*2);ctx.fill();};
 canvas.onpointermove=e=>{if(!down)return;const point=pos(e);ctx.strokeStyle=eraser?q('#sketch-paper').value:q('#sketch-color').value;ctx.lineWidth=Number(q('#sketch-size').value);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(...previous);ctx.lineTo(...point);ctx.stroke();previous=point;};
 canvas.onpointerup=canvas.onpointercancel=()=>{down=false;controls();};
 q('#sketch-eraser').onclick=()=>{eraser=!eraser;q('#sketch-eraser').setAttribute('aria-pressed',String(eraser));};
 q('#sketch-clear').onclick=()=>{checkpoint();paper();};
 q('#sketch-undo').onclick=()=>{if(!past.length)return;future.push(snapshot());restore(past.pop());lastPaper=q('#sketch-paper').value;controls();};
 q('#sketch-redo').onclick=()=>{if(!future.length)return;past.push(snapshot());restore(future.pop());lastPaper=q('#sketch-paper').value;controls();};
 q('#save-sketch').onclick=()=>{remember(q('#sketch-color').value);onSave(canvas.toDataURL('image/png'));};
}

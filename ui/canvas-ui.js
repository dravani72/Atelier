import {uid,clone,card} from './model.js';
import * as C from './canvas-model.js';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function content(c){
 if(c.type==='table')return `<div class="canvas-table"><table><tbody>${c.cells.map((row,i)=>`<tr>${row.map(v=>`<${i?'td':'th'}>${esc(v)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 if(c.type==='shape')return `<div class="shape-body shape-${c.shape}"><span>${esc(c.body||c.title)}</span></div>`;
 if(c.type==='frame')return '<div class="frame-caption">Presentation frame</div>';
 if(c.type==='sticky')return `<div class="card-body sticky-body">${esc(c.body)}</div>`;
 return null;
}
export function createCanvasUX(a){
 let panelOpen=false,mapOpen=false,presentation=null;
 const selectedCards=()=>a.board().cards.filter(c=>a.selected().has(c.id));
 const editable=()=>C.members(a.board(),a.selected());
 function select(ids){a.select(new Set(ids));a.render();}
 const actions={
  group:()=>a.change(()=>{const cs=editable();if(cs.length<2)return;const id=uid();cs.forEach(c=>c.groupId=id);}),
  ungroup:()=>a.change(()=>{const groups=new Set(selectedCards().map(c=>c.groupId));a.board().cards.filter(c=>groups.has(c.groupId)&&!C.locked(a.board(),c)).forEach(c=>delete c.groupId);}),
  lock:()=>a.change(()=>selectedCards().forEach(c=>c.locked=true)),
  unlock:()=>a.change(()=>selectedCards().forEach(c=>c.locked=false)),
  front:()=>a.change(()=>{const b=a.board(),cs=editable(),set=new Set(cs);b.cards=[...b.cards.filter(c=>!set.has(c)),...cs];}),
  back:()=>a.change(()=>{const b=a.board(),cs=editable(),set=new Set(cs);b.cards=[...cs,...b.cards.filter(c=>!set.has(c))];}),
  frame:()=>a.change(()=>{const cs=editable();if(!cs.length)return;const x=Math.min(...cs.map(c=>c.x))-24,y=Math.min(...cs.map(c=>c.y))-60,f=card('frame',x,y);f.w=Math.max(...cs.map(c=>c.x+c.w))-x+24;f.h=Math.max(...cs.map(c=>c.y+c.h))-y+24;a.board().cards.unshift(f);a.select(new Set([f.id]));}),
  reflow:()=>a.change(()=>selectedCards().filter(c=>c.type==='column'&&!C.locked(a.board(),c)).forEach(c=>C.reflow(a.board(),c))),
  duplicate:()=>a.duplicate(),delete:()=>a.remove()
 };
 function perform(name){if(name.startsWith('align-'))a.change(()=>C.align(a.board(),a.selected(),name.slice(6)));else if(name.startsWith('distribute-'))a.change(()=>C.distribute(a.board(),a.selected(),name.slice(11)));else actions[name]?.();}
 const controls=[['group','Group'],['ungroup','Ungroup'],['lock','Lock'],['unlock','Unlock'],['front','Bring to front'],['back','Send to back'],['frame','Frame selection'],['align-center','Align centers'],['align-right','Align right'],['align-middle','Align middles'],['align-bottom','Align bottom'],['distribute-x','Distribute horizontally'],['distribute-y','Distribute vertically'],['reflow','Reflow column']];
 function bindActions(root){root.querySelectorAll('[data-canvas-action]').forEach(btn=>btn.onclick=()=>perform(btn.dataset.canvasAction));}
 function inspector(){
  const cs=selectedCards();if(!cs.length)return;
  const root=$('#inspector'),section=document.createElement('section');section.className='canvas-inspector';
  section.innerHTML=`<div class="label">ORGANIZE</div><div class="object-actions">${controls.filter(([id])=>cs.length>1||!id.startsWith('align-')&&!id.startsWith('distribute-')&&id!=='group').map(([id,label])=>`<button class="button" data-canvas-action="${id}">${label}</button>`).join('')}</div><div class="field"><label for="object-layer">Layer</label><select id="object-layer"><option value="">Default</option>${(a.board().layers||[]).map(l=>`<option value="${l.id}" ${cs.every(c=>c.layerId===l.id)?'selected':''}>${esc(l.name)}</option>`).join('')}</select></div>`;
  root.append(section);bindActions(section);
  $('#object-layer').onchange=e=>{const id=e.target.value;a.change(()=>editable().forEach(c=>{if(id)c.layerId=id;else delete c.layerId;}));};
  const c=cs.length===1?cs[0]:null;
  if(c?.type==='shape'){
   section.insertAdjacentHTML('afterbegin',`<div class="field"><label for="shape-kind">Shape</label><select id="shape-kind">${C.SHAPES.map(s=>`<option ${s===c.shape?'selected':''}>${s}</option>`).join('')}</select></div>`);
   $('#shape-kind').onchange=e=>{const shape=e.target.value;a.change(()=>c.shape=shape);};
  }
  if(c?.type==='table'){
   section.insertAdjacentHTML('afterbegin',`<div class="label">TABLE CELLS · FIRST ROW IS THE HEADER</div><div class="table-editor">${c.cells.map((row,r)=>row.map((v,k)=>`<input aria-label="Row ${r+1}, column ${k+1}" data-cell="${r},${k}" value="${esc(v)}" maxlength="10000">`).join('')).join('')}</div><div class="object-actions"><button class="button" id="table-row">Add row</button><button class="button" id="table-column">Add column</button><button class="button" id="table-remove-row">Remove last row</button><button class="button" id="table-remove-column">Remove last column</button></div>`);
   section.querySelector('.table-editor').style.gridTemplateColumns=`repeat(${c.cells[0].length},minmax(60px,1fr))`;
   section.querySelectorAll('[data-cell]').forEach(input=>input.onchange=()=>{const [r,k]=input.dataset.cell.split(',').map(Number),v=input.value;a.change(()=>c.cells[r][k]=v);});
   $('#table-row').onclick=()=>a.change(()=>{if(c.cells.length<100)c.cells.push(c.cells[0].map(()=>''));});
   $('#table-column').onclick=()=>a.change(()=>{if(c.cells[0].length<20)c.cells.forEach(row=>row.push(''));});
   $('#table-remove-row').onclick=()=>a.change(()=>{if(c.cells.length>1)c.cells.pop();});
   $('#table-remove-column').onclick=()=>a.change(()=>{if(c.cells[0].length>1)c.cells.forEach(row=>row.pop());});
  }
  // Lock protects mutations while keeping annotations and unlock controls available.
  if(cs.some(c=>C.locked(a.board(),c))){root.querySelectorAll('input,textarea,select,button').forEach(el=>{if(!el.closest('.comments')&&!['inspector-close'].includes(el.id)&&el.dataset.canvasAction!=='unlock')el.disabled=true;});}
 }
 function layers(){
  panelOpen=!panelOpen;render();
 }
 function render(){
  let panel=$('#canvas-outline');if(!panel){panel=document.createElement('aside');panel.id='canvas-outline';panel.setAttribute('aria-label','Frames, layers and objects');$('#canvas').append(panel);}
  panel.hidden=!panelOpen;
  if(panelOpen){
   const b=a.board();panel.innerHTML=`<div class="outline-head"><strong>Frames & layers</strong><button id="outline-close" aria-label="Close outline">×</button></div><div class="outline-section"><button id="present-board" class="button">Present frames</button><button id="add-layer" class="button">Add layer</button></div>${(b.layers||[]).map(l=>`<div class="layer-row" data-layer="${l.id}"><input aria-label="Layer name" value="${esc(l.name)}" maxlength="1000"><button data-layer-hide aria-label="${l.hidden?'Show':'Hide'} ${esc(l.name)}">${l.hidden?'Show':'Hide'}</button><button data-layer-lock aria-label="${l.locked?'Unlock':'Lock'} ${esc(l.name)}">${l.locked?'Unlock':'Lock'}</button><button data-layer-delete aria-label="Delete ${esc(l.name)}">×</button></div>`).join('')}<div class="label">FRAMES</div>${b.cards.filter(c=>c.type==='frame').map(c=>`<div class="frame-row"><button data-focus="${c.id}">${esc(c.title)}</button><button data-frame-up="${c.id}" aria-label="Move ${esc(c.title)} earlier">↑</button><button data-frame-down="${c.id}" aria-label="Move ${esc(c.title)} later">↓</button></div>`).join('')}<div class="label">OBJECTS · ${b.cards.length}</div>${b.cards.slice().reverse().map(c=>`<button class="outline-object" data-focus="${c.id}" ${C.visible(b,c)?'':'disabled'}>${esc(c.title)} <small>${c.type}${C.locked(b,c)?' · locked':''}${C.visible(b,c)?'':' · hidden'}</small></button>`).join('')}`;
   $('#outline-close').onclick=layers;$('#present-board').onclick=present;
   $('#add-layer').onclick=()=>a.change(()=>{b.layers??=[];if(b.layers.length<100)b.layers.push({id:uid(),name:`Layer ${b.layers.length+1}`,hidden:false,locked:false});});
   panel.querySelectorAll('[data-layer]').forEach(row=>{const l=b.layers.find(l=>l.id===row.dataset.layer);row.querySelector('input').onchange=e=>{const name=e.target.value;a.change(()=>l.name=name||'Layer');};row.querySelector('[data-layer-hide]').onclick=()=>a.change(()=>{l.hidden=!l.hidden;a.select(new Set());});row.querySelector('[data-layer-lock]').onclick=()=>a.change(()=>l.locked=!l.locked);row.querySelector('[data-layer-delete]').onclick=()=>a.change(()=>{b.layers=b.layers.filter(x=>x!==l);b.cards.forEach(c=>{if(c.layerId===l.id)delete c.layerId;});});});
   panel.querySelectorAll('[data-focus]').forEach(btn=>btn.onclick=()=>{const c=b.cards.find(c=>c.id===btn.dataset.focus);a.focus(c);select([c.id]);});
   for(const dir of ['up','down'])panel.querySelectorAll(`[data-frame-${dir}]`).forEach(btn=>btn.onclick=()=>a.change(()=>{const frames=b.cards.filter(c=>c.type==='frame'),c=frames.find(c=>c.id===btn.getAttribute(`data-frame-${dir}`)),i=frames.indexOf(c),other=frames[i+(dir==='up'?-1:1)];if(other){const x=b.cards.indexOf(c),y=b.cards.indexOf(other);[b.cards[x],b.cards[y]]=[b.cards[y],b.cards[x]];}}));
  }
  drawMap();
 }
 function drawMap(){
  let map=$('#canvas-minimap');if(!map){map=document.createElement('div');map.id='canvas-minimap';$('#canvas').append(map);}
  map.hidden=!mapOpen;if(!mapOpen)return;
  const b=a.board(),cs=b.cards.filter(c=>C.visible(b,c)),v=b.view,r=$('#canvas').getBoundingClientRect(),vx=-v.x/v.zoom,vy=-v.y/v.zoom,vw=r.width/v.zoom,vh=r.height/v.zoom;
  const x=Math.min(vx,...cs.map(c=>c.x))-30,y=Math.min(vy,...cs.map(c=>c.y))-30,w=Math.max(vx+vw,...cs.map(c=>c.x+c.w))-x+30,h=Math.max(vy+vh,...cs.map(c=>c.y+c.h))-y+30;
  map.innerHTML=`<svg role="img" aria-label="Board minimap; click to navigate" viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMid meet">${cs.map(c=>`<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" fill="${C.container(c)?'#e4e9dd':'#9fb48b'}" stroke="#6d8758"/>`).join('')}<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="none" stroke="#be783e" stroke-width="${Math.max(w,h)/130}"/></svg>`;
  map.querySelector('svg').onclick=e=>{const svg=e.currentTarget,point=svg.createSVGPoint();point.x=e.clientX;point.y=e.clientY;const p=point.matrixTransform(svg.getScreenCTM().inverse());v.x=r.width/2-p.x*v.zoom;v.y=r.height/2-p.y*v.zoom;a.view();a.dirty();};
 }
 function present(){
  const frames=a.board().cards.filter(c=>c.type==='frame'&&C.visible(a.board(),c));if(!frames.length){a.toast('Add a frame, or use Frame selection, to present.');return;}
  presentation={frames,index:0,view:clone(a.board().view),focus:document.activeElement};
  const overlay=document.createElement('div');overlay.id='canvas-presentation';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Frame presentation');
  // Present on the board's own backing: carry over the color variables the app set on the canvas.
  const canvas=$('#canvas');overlay.classList.toggle('has-backing',canvas.classList.contains('has-backing'));for(const name of canvas.style)if(name.startsWith('--'))overlay.style.setProperty(name,canvas.style.getPropertyValue(name));
  overlay.innerHTML='<div id="presentation-stage"></div><div class="presentation-controls"><button id="presentation-prev" class="button">Previous</button><span id="presentation-title"></span><button id="presentation-next" class="button">Next</button><button id="presentation-close" class="button">Exit presentation · Esc</button></div>';document.body.append(overlay);
  $('#presentation-prev').onclick=()=>slide(-1);$('#presentation-next').onclick=()=>slide(1);$('#presentation-close').onclick=exit;$('#presentation-close').focus();paintSlide();
 }
 function paintSlide(){
  const f=presentation.frames[presentation.index],stage=$('#presentation-stage');stage.innerHTML='';const copy=$('#world').cloneNode(true);copy.removeAttribute('id');copy.querySelectorAll('[id]').forEach(el=>el.id='presentation-'+el.id);copy.querySelectorAll('[marker-end]').forEach(el=>el.setAttribute('marker-end',el.getAttribute('marker-end').replace('#arrowhead','#presentation-arrowhead')));copy.querySelectorAll('button,input,video').forEach(el=>el.disabled=true);copy.querySelectorAll('.card').forEach(el=>{const c=a.board().cards.find(c=>c.id===el.dataset.id);if(c?.id===f.id||!C.inside(c,f))el.remove();});const included=new Set(a.board().cards.filter(c=>C.visible(a.board(),c)&&C.inside(c,f)).map(c=>c.id));copy.querySelectorAll('[data-edge]').forEach(el=>{const edge=a.board().edges.find(e=>e.id===el.dataset.edge);if(!included.has(edge?.from)||!included.has(edge?.to))el.remove();});copy.querySelectorAll('[data-link]').forEach(el=>{if(!included.has(el.dataset.source))el.remove();});
  const r=stage.getBoundingClientRect(),z=Math.min((r.width-64)/f.w,(r.height-40)/f.h);copy.style.transform=`translate(${(r.width-f.w*z)/2-f.x*z}px,${(r.height-f.h*z)/2-f.y*z}px) scale(${z})`;copy.className='presentation-world';stage.append(copy);
  $('#presentation-title').textContent=`${presentation.index+1} / ${presentation.frames.length} · ${f.title}`;$('#presentation-prev').disabled=!presentation.index;$('#presentation-next').disabled=presentation.index===presentation.frames.length-1;
 }
 function slide(n){if(!presentation)return;presentation.index=Math.max(0,Math.min(presentation.frames.length-1,presentation.index+n));paintSlide();}
 function exit(){const focus=presentation?.focus;$('#canvas-presentation')?.remove();presentation=null;focus?.focus();}
 function key(e){
  if(presentation){if(e.key==='Escape')exit();else if(e.key==='ArrowRight')slide(1);else if(e.key==='ArrowLeft')slide(-1);else if(e.key==='Tab'){const buttons=[...$('#canvas-presentation').querySelectorAll('button:not(:disabled)')],i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();}e.preventDefault();e.stopImmediatePropagation();return;}
  if(e.target.closest('input,textarea,select,[contenteditable]')||$('#modal').open)return;
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='g'){e.preventDefault();e.stopImmediatePropagation();perform(e.shiftKey?'ungroup':'group');}
 }
 document.addEventListener('keydown',key,true);window.addEventListener('resize',()=>{drawMap();if(presentation)paintSlide();});
 const bar=document.createElement('div');bar.className='canvas-navigation';bar.innerHTML='<button class="button" id="outline-open">Frames & layers</button><button class="button" id="minimap-open">Map</button><button class="button" id="presentation-open">Present</button>';$('#canvas').append(bar);$('#outline-open').onclick=layers;$('#minimap-open').onclick=()=>{mapOpen=!mapOpen;drawMap();};$('#presentation-open').onclick=present;
 $('#canvas').addEventListener('contextmenu',e=>{
  if(e.target.closest('#tools,.canvas-navigation,#canvas-outline,#canvas-minimap,.canvas-bottom'))return;e.preventDefault();const el=e.target.closest('.card');if(el&&!a.selected().has(el.dataset.id))select([el.dataset.id]);if(!a.selected().size)return;
  $('#canvas-context')?.remove();const menu=document.createElement('div');menu.id='canvas-context';menu.setAttribute('role','menu');menu.innerHTML=[...controls,['duplicate','Duplicate'],['delete','Delete']].map(([id,label])=>`<button role="menuitem" data-canvas-action="${id}">${label}</button>`).join('');document.body.append(menu);menu.style.left=Math.min(e.clientX,window.innerWidth-230)+'px';menu.style.top=Math.min(e.clientY,window.innerHeight-430)+'px';bindActions(menu);menu.querySelector('button').focus();menu.addEventListener('click',()=>menu.remove());menu.onkeydown=e=>{const cs=[...menu.querySelectorAll('button')],i=cs.indexOf(document.activeElement);if(e.key==='Escape'){menu.remove();$('#canvas').focus();}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();cs[(i+(e.key==='ArrowDown'?1:-1)+cs.length)%cs.length].focus();}};
 });document.addEventListener('pointerdown',e=>{if(!e.target.closest('#canvas-context'))$('#canvas-context')?.remove();});
 // Marquee selection leaves Space/middle-button panning to the existing canvas handler.
 $('#canvas').addEventListener('pointerdown',e=>{
  const target=e.target.closest('.card');if(e.button!==0||a.space()||e.target.closest('button,input,#tools,.canvas-bottom,.canvas-navigation,#canvas-outline,#canvas-minimap')||(target&&(!target.classList.contains('frame')||e.target.closest('.card-header,.resize-handle'))))return;
  const canvas=$('#canvas'),start=a.position(e),base=e.shiftKey?new Set(a.selected()):new Set(),box=document.createElement('div');box.className='canvas-marquee';$('#world').append(box);canvas.setPointerCapture(e.pointerId);
  const move=ev=>{const p=a.position(ev),x=Math.min(start.x,p.x),y=Math.min(start.y,p.y),w=Math.abs(p.x-start.x),h=Math.abs(p.y-start.y);Object.assign(box.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});a.select(new Set([...base,...a.board().cards.filter(c=>!C.container(c)&&C.visible(a.board(),c)&&!C.locked(a.board(),c)&&c.x<x+w&&c.x+c.w>x&&c.y<y+h&&c.y+c.h>y).map(c=>c.id)]));a.mark();};
  const end=()=>{canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',end);canvas.removeEventListener('pointercancel',end);box.remove();a.render();};canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
 });
 return {render,inspector,drawMap};
}

export const hex=value=>typeof value==='string'&&/^#[0-9a-f]{6}$/i.test(value);
export const palettes=[
 {name:'Graphite',colors:['#18181b','#52525b','#a1a1aa','#d4d4d8','#f4f4f5','#ffffff']},
 {name:'Signal',colors:['#dc2626','#ea580c','#eab308','#16a34a','#2563eb','#9333ea']},
 {name:'Soft',colors:['#fecaca','#fed7aa','#fef08a','#bbf7d0','#bfdbfe','#e9d5ff']},
 {name:'Earth',colors:['#78350f','#a16207','#4d7c0f','#0f766e','#475569','#f5f5f4']}
];
export function customColors(){try{const colors=JSON.parse(localStorage.getItem('atelier-custom-colors')||'[]');return Array.isArray(colors)?colors.filter(hex).slice(0,12):[];}catch{return [];}}
export function remember(color){if(!hex(color))return;localStorage.setItem('atelier-custom-colors',JSON.stringify([color,...customColors().filter(c=>c!==color)].slice(0,12)));}
export function contrast(color){if(!hex(color))return '#18181b';const rgb=[1,3,5].map(i=>{const c=parseInt(color.slice(i,i+2),16)/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722>.179?'#18181b':'#ffffff';}
export function styleVars(c){const s=c.style||{};return `${s.fill?`--card-fill:${s.fill};background:${s.fill};`:''}${s.ink?`--card-ink:${s.ink};`:''}${s.label?`--label-fill:${s.label};--label-ink:${contrast(s.label)};`:''}`;}
export function paletteHTML(id='palette'){const extra=customColors();return `<div class="palette-picker"><label for="${id}-family">Palette</label><select id="${id}-family" aria-label="Color palette">${palettes.map((p,i)=>`<option value="${i}">${p.name}</option>`).join('')}${extra.length?'<option value="custom">Recent custom colors</option>':''}</select><div id="${id}-swatches" class="palette-swatches"></div></div>`;}
export function bindPalette(root,id,onChoose){const select=root.querySelector(`#${id}-family`),swatches=root.querySelector(`#${id}-swatches`);const draw=()=>{const colors=select.value==='custom'?customColors():palettes[Number(select.value)].colors;swatches.innerHTML=colors.map(c=>`<button type="button" class="palette-chip" data-hex="${c}" style="background:${c}" title="${c}" aria-label="Use ${c}"></button>`).join('');swatches.querySelectorAll('[data-hex]').forEach(btn=>btn.onclick=()=>onChoose(btn.dataset.hex));};select.onchange=draw;draw();}

export let colorTarget='fill';
export function setColorTarget(value){if(['fill','ink','label'].includes(value))colorTarget=value;}

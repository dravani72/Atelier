// Local canvas organization. Optional fields keep version-1 workspaces compatible.
export const SHAPES=['rectangle','ellipse','diamond'];
export const layerOf=(b,c)=>b.layers?.find(l=>l.id===c.layerId);
export const visible=(b,c)=>!layerOf(b,c)?.hidden;
export const locked=(b,c)=>!!(c.locked||layerOf(b,c)?.locked);
export const container=c=>c.type==='column'||c.type==='frame';
export const inside=(c,g)=>c.id!==g.id&&c.x>=g.x&&c.y>=g.y&&c.x+c.w<=g.x+g.w&&c.y+c.h<=g.y+g.h;
export function members(b,ids){const groups=new Set(b.cards.filter(c=>ids.has(c.id)&&c.groupId).map(c=>c.groupId));return b.cards.filter(c=>visible(b,c)&&!locked(b,c)&&(ids.has(c.id)||groups.has(c.groupId)));}
export function movable(b,ids){const roots=members(b,ids);return b.cards.filter(c=>visible(b,c)&&!locked(b,c)&&(roots.includes(c)||roots.some(g=>container(g)&&inside(c,g))));}
export function align(b,ids,mode){const cs=members(b,ids);if(cs.length<2)return;const loX=Math.min(...cs.map(c=>c.x)),hiX=Math.max(...cs.map(c=>c.x+c.w)),loY=Math.min(...cs.map(c=>c.y)),hiY=Math.max(...cs.map(c=>c.y+c.h));for(const c of cs){if(mode==='left')c.x=loX;if(mode==='right')c.x=hiX-c.w;if(mode==='center')c.x=(loX+hiX-c.w)/2;if(mode==='top')c.y=loY;if(mode==='bottom')c.y=hiY-c.h;if(mode==='middle')c.y=(loY+hiY-c.h)/2;}}
export function distribute(b,ids,axis){const cs=members(b,ids).sort((a,b)=>a[axis]-b[axis]);if(cs.length<3)return;const size=axis==='x'?'w':'h',start=cs[0][axis],end=cs.at(-1)[axis]+cs.at(-1)[size],gap=(end-start-cs.reduce((n,c)=>n+c[size],0))/(cs.length-1);let p=start;for(const c of cs){c[axis]=p;p+=c[size]+gap;}}
export function reflow(b,col){const cs=b.cards.filter(c=>!container(c)&&visible(b,c)&&!locked(b,c)&&(c.sectionId===col.id||inside(c,col))).sort((a,b)=>a.y-b.y);let y=col.y+55;for(const c of cs){c.sectionId=col.id;c.x=col.x+16;c.y=y;c.w=Math.max(140,col.w-32);y+=c.h+16;}col.h=Math.max(100,y-col.y+8);}
export function remap(copies,map,uid){const groups=new Map();for(const c of copies){if(c.groupId){if(!groups.has(c.groupId))groups.set(c.groupId,uid());c.groupId=groups.get(c.groupId);}if(c.sectionId)c.sectionId=map.get(c.sectionId)||c.sectionId;}}
export function checkCanvas(b,safeId){
 if(b.layers!==undefined&&(!Array.isArray(b.layers)||b.layers.length>100||new Set(b.layers.map(l=>l.id)).size!==b.layers.length||b.layers.some(l=>!safeId(l.id)||typeof l.name!=='string'||l.name.length>1000||typeof l.hidden!=='boolean'||typeof l.locked!=='boolean')))throw Error('Invalid layers');
 for(const c of b.cards){
  if(c.style!==undefined&&(!c.style||typeof c.style!=='object'||Array.isArray(c.style)||Object.entries(c.style).some(([k,v])=>!['fill','ink','label'].includes(k)||typeof v!=='string'||!/^#[0-9a-f]{6}$/i.test(v))))throw Error('Invalid card colors');
  if(c.locked!==undefined&&typeof c.locked!=='boolean')throw Error('Invalid lock');
  if(c.groupId!==undefined&&!safeId(c.groupId))throw Error('Invalid group');
  if(c.layerId!==undefined&&!b.layers?.some(l=>l.id===c.layerId))throw Error('Missing layer');
  if(c.type==='shape'&&!SHAPES.includes(c.shape))throw Error('Invalid shape');
  if(c.type==='table'&&(!Array.isArray(c.cells)||!c.cells.length||c.cells.length>100||!Array.isArray(c.cells[0])||!c.cells[0].length||c.cells[0].length>20||c.cells.some(row=>!Array.isArray(row)||row.length!==c.cells[0].length||row.some(v=>typeof v!=='string'||v.length>10000))))throw Error('Invalid table');
 }
 for(const e of b.edges){if(e.style!==undefined&&!['curve','straight','elbow'].includes(e.style))throw Error('Invalid connector style');if(e.arrow!==undefined&&typeof e.arrow!=='boolean')throw Error('Invalid connector arrow');}
}

// The template library: fully worked example boards (see template-library/). Each template ships as a compact package in
// ui/templates/library/<id>.json whose pictures are stored once in ui/templates/library/images and referenced from cards as
// "@image:<key>". Choosing a template fetches it, swaps the pictures in, checks it with the package reader and adds it to
// the workspace under fresh IDs, exactly as importing a package would. Date timelines move to the current week.
import {library,categories} from './templates/library/catalog.js';
import * as I from './interchange.js';
import * as T from './timeline.js';
export {library,categories};

export const BASE='templates/library/';
const IMAGE=/^@image:([a-zA-Z0-9_-]{1,100})$/;

// Bytes to a data URI without FileReader, so it also runs in Node tests.
function dataUri(bytes,type){let s='';const b=new Uint8Array(bytes);for(let i=0;i<b.length;i+=0x8000)s+=String.fromCharCode(...b.subarray(i,i+0x8000));return `data:${type};base64,${btoa(s)}`;}
const typeOf=file=>file.endsWith('.png')?'image/png':file.endsWith('.webp')?'image/webp':'image/jpeg';

/** Fetches a template and returns a complete Atelier package with its pictures embedded. */
export async function load(entry,{fetch:get=globalThis.fetch,base=BASE}={}){
 const res=await get(`${base}${entry.id}.json`);if(!res.ok)throw Error(`Template “${entry.title}” is missing.`);
 const pkg=await res.json(),cache=new Map();
 for(const b of pkg.boards)for(const c of b.cards){
  const m=IMAGE.exec(c.media||'');if(!m)continue;
  const file=entry.images[m[1]];if(!file)throw Error(`Template picture ${m[1]} is not in the catalog.`);
  if(!cache.has(file)){const r=await get(`${base}images/${file}`);if(!r.ok)throw Error(`Template picture ${file} is missing.`);cache.set(file,dataUri(await r.arrayBuffer(),typeOf(file)));}
  c.media=cache.get(file);
 }
 return pkg;
}

/** Moves every date timeline by whole weeks so its first week is the current one. Clips keep their weekdays. */
export function toCurrentWeek(boards,today=T.today()){
 for(const b of boards)for(const c of b.cards){
  const tl=c.timeline;if(!tl||tl.mode!=='date')continue;
  const weeks=Math.floor((today-tl.start)/7),delta=weeks*7;if(!delta)continue;
  tl.start+=delta;tl.end+=delta;for(const i of tl.items)i.at+=delta;
 }
 return boards;
}

/** Adds a loaded template to the workspace. Returns the ID of its top board. */
export function add(workspace,pkg,uid,{today}={}){
 const {boards}=I.read(pkg);
 const roots=I.graft(workspace,toCurrentWeek(boards,today),uid,{strip:true});
 return roots[0];
}

/** Search and filter over the catalog: words match title, description, tags and category. */
export function filter(query='',category=''){
 const words=query.toLowerCase().split(/\s+/).filter(Boolean);
 return library.filter(t=>(!category||t.category===category||t.also.includes(category))&&words.every(w=>[t.title,t.description,t.category,...t.also,...t.tags].join(' ').toLowerCase().includes(w)));
}

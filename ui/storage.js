import {validate} from './model.js';
const native=()=>window.__TAURI__?.core;
let db;
async function database(){if(db)return db;db=await new Promise((resolve,reject)=>{const r=indexedDB.open('atelier',1);r.onupgradeneeded=()=>r.result.createObjectStore('workspace');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});return db;}
export const isNative=()=>!!native();
export async function load(){
 if(native()){const raw=await native().invoke('load_workspace');return raw?validate(JSON.parse(raw)):null;}
 const d=await database();return new Promise((resolve,reject)=>{const r=d.transaction('workspace').objectStore('workspace').get('current');r.onsuccess=()=>{try{resolve(r.result?validate(r.result):null);}catch(e){reject(e);}};r.onerror=()=>reject(r.error);});
}
export async function save(w){
 validate(w);const raw=JSON.stringify(w);if(new TextEncoder().encode(raw).length>100*1024*1024)throw Error('Workspace exceeds 100 MB. Remove large media after exporting a backup.');
 if(native())return native().invoke('save_workspace',{data:raw});
 const d=await database();await new Promise((resolve,reject)=>{const tx=d.transaction('workspace','readwrite');tx.objectStore('workspace').put(w,'current');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
}
export async function exportFile(name,content,type='text/plain'){
 if(native())return native().invoke('export_file',{name,content});
 const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return true;
}
export function openLink(address){const u=new URL(address);if(!['http:','https:'].includes(u.protocol))throw Error('Use an http or https address.');if(native())return native().invoke('open_link',{address:u.href});window.open(u.href,'_blank','noopener,noreferrer');}
export const revisions=()=>native()?native().invoke('list_revisions'):Promise.resolve([]);
export const restoreRevision=id=>native().invoke('restore_revision',{id});

export async function saveAttachment(name,data){
 if(native())return native().invoke('save_attachment',{name,data});
 const a=document.createElement('a');a.href=data;a.download=name||'attachment';a.click();return true;
}

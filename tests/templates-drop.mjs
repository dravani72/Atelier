import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {initial} from '../ui/model.js';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:2});const page=await context.newPage();
await context.addInitScript(w=>{
 window.calls=[];window.desktopData=localStorage.getItem('drop-workspace')||JSON.stringify(w);
 window.__TAURI__={core:{invoke:async(name,args)=>{window.calls.push({name,args});if(name==='load_workspace')return window.desktopData;if(name==='save_workspace'){window.desktopData=args.data;localStorage.setItem('drop-workspace',args.data);return;}if(name==='import_dropped_files')return {files:[{id:'asset-video',filename:'large.mov',kind:'video',size:50000000,data:null},{id:'asset-psd',filename:'layered.psd',kind:'file',size:60000000,data:null},{id:'asset-note',filename:'notes.txt',kind:'file',data:'data:text/plain;base64,aGVsbG8='}],errors:[]};if(name==='save_managed_attachment')return true;if(name==='video_status')return {time:0,duration:5,pause:true};return null;}},webview:{getCurrentWebview:()=>({onDragDropEvent:async handler=>{window.dropHandler=handler;}})},window:{getCurrentWindow:()=>({onCloseRequested:async()=>{},destroy:async()=>{}})}};
},initial());
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:4173');await page.waitForSelector('.card');
 await page.locator('#templates-open').click();assert.equal(await page.locator('[data-template]').count(),53);
 await page.locator('#template-search').fill('Creative brief');await page.locator('[data-template="at-001"]').click();
 assert.equal(await page.locator('.card.column').count(),6); // Exact source section count, verified against catalog.
 await page.locator('#board-menu').click();await page.locator('#project-fields').click();await page.locator('[data-project-field="owner"]').fill('Studio');await page.locator('#save-project-fields').click();
 await page.waitForTimeout(600);
 const coords=await page.evaluate(()=>{const r=document.querySelector('#canvas').getBoundingClientRect();return {x:(r.left+150)*devicePixelRatio,y:(r.top+180)*devicePixelRatio};});
 const before=await page.evaluate(()=>JSON.parse(window.desktopData).boards.find(b=>b.id===JSON.parse(window.desktopData).active));
 await page.evaluate(async position=>{await window.dropHandler({payload:{type:'enter',position}});},coords);assert.ok(await page.locator('#canvas').evaluate(el=>el.classList.contains('drop-active')));
 await page.evaluate(async position=>{await window.dropHandler({payload:{type:'drop',position,paths:['/tmp/large.mov','/tmp/layered.psd','/tmp/notes.txt']}});},coords);
 await page.waitForTimeout(600);
 const imported=await page.evaluate(()=>{const w=JSON.parse(window.desktopData);return w.boards.find(b=>b.id===w.active);});
 const video=imported.cards.find(c=>c.localVideo==='asset-video');assert.ok(video);assert.ok(Math.abs(video.x-(150-before.view.x)/before.view.zoom)<1);assert.ok(Math.abs(video.y-(180-before.view.y)/before.view.zoom)<1);
 assert.equal(imported.projectFields.owner,'Studio');assert.ok(imported.cards.some(c=>c.localAttachment==='asset-note'));
 await page.locator('.card').filter({hasText:'layered.psd'}).locator('.download-attachment').click();assert.ok(await page.evaluate(()=>window.calls.some(c=>c.name==='save_managed_attachment'&&c.args.id==='asset-psd')));
 await page.reload();await page.waitForSelector('.play-native');
 await page.locator('#templates-open').click();await page.locator('#template-family').selectOption('recipes');assert.equal(await page.locator('[data-template]').count(),4);await page.locator('[data-template="narrative_film"]').click();assert.equal(await page.locator('.card.board').count(),7);
 assert.deepEqual(errors,[]);console.log('PASS: catalog search, recipe hierarchy, editable project fields, Retina Finder coordinates, large-video import, original attachment saving and reload.');
}finally{await browser.close();}

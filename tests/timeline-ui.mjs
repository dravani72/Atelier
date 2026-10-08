import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {initial} from '../ui/model.js';
const pixel='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 // ── Browser preview: one timeline, driven the way a person would drive it ──
 const page=await browser.newPage({viewport:{width:1440,height:1200}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const clips=()=>page.locator('.tl-item').evaluateAll(els=>els.map(e=>e.title)),foot=()=>page.locator('.tl-foot').textContent(),toast=()=>page.locator('#toast').textContent();
 const eventually=async(read,ok,label)=>{let seen;for(let i=0;i<60;i++){seen=await read();if(ok(seen))return seen;await page.waitForTimeout(50);}assert.fail(`${label}: ${JSON.stringify(seen)}`);};
 const track=()=>page.locator('.card.timeline .tl-lanes').boundingBox();
 const drag=async(from,to)=>{await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move((from.x+to.x)/2,(from.y+to.y)/2,{steps:4});await page.mouse.move(to.x,to.y,{steps:4});await page.mouse.up();};
 const header=async name=>{const r=await page.locator('.card').filter({hasText:name}).locator('.card-header').boundingBox();return {x:r.x+50,y:r.y+15};};
 const onTrack=async(share,lane=0)=>{const r=await track();return {x:r.x+r.width*share,y:r.y+r.height*(lane+.5)/3};};
 const setField=async(target,value)=>{const field=target.startsWith('#')?page.locator(target):page.getByLabel(target,{exact:true});await field.fill(value);await field.press('Tab');};
 const closeInspector=()=>page.getByRole('button',{name:'Close inspector'}).click();
 await page.goto('http://127.0.0.1:4173');await page.waitForSelector('.card');
 await page.locator('#new-board').click();await page.locator('#new-name').fill('Timeline test');await page.locator('#create-board').click();

 await page.getByRole('button',{name:'Timeline · timecode or dates',exact:true}).click();
 assert.equal(await page.locator('.card.timeline').count(),1);assert.equal(await page.locator('#tl-mode').inputValue(),'timecode');
 assert.match(await foot(),/00:00:00:00 → 00:01:00:00 · 24 fps · 1 min/);assert.match(await foot(),/Drag a card here/);
 let from=await header('Timeline');await drag(from,{x:from.x,y:from.y+440});await closeInspector(); // leave the top of the board free for new cards

 // Dragging a card onto the track connects it at that time and puts the card back where it was.
 await page.getByRole('button',{name:'Note · N',exact:true}).click();await setField('#edit-title','Opening shot');await closeInspector();
 const note=page.locator('.card.note'),home=await note.evaluate(el=>el.style.left+el.style.top);
 await drag(await header('Opening shot'),await onTrack(.25));
 assert.deepEqual(await clips(),['Opening shot · 00:00:15:00 – 00:00:22:00']);assert.equal(await note.evaluate(el=>el.style.left+el.style.top),home);assert.match(await toast(),/“Opening shot” connected at 00:00:15:00/);
 assert.equal(await page.locator('#edges [data-link]').count(),1);assert.equal(await page.locator('.card.timeline.selected').count(),1);
 await closeInspector();await page.locator('#media-input').setInputFiles({name:'pixel.png',mimeType:'image/png',buffer:Buffer.from(pixel,'base64')});await page.waitForSelector('.card.image');await closeInspector();
 await drag(await header('pixel'),await onTrack(.5,1));
 assert.deepEqual(await clips(),['Opening shot · 00:00:15:00 – 00:00:22:00','pixel · 00:00:30:00 – 00:00:37:00']);assert.equal(await page.locator('.tl-item img').count(),1);

 // Retime, trim and change lane by dragging the clip; undo restores it.
 const clip=name=>page.locator('.tl-item').filter({hasText:name}),box=name=>clip(name).boundingBox(),lanes=await track();
 let r=await box('Opening shot');await drag({x:r.x+r.width/2,y:r.y+r.height/2},{x:r.x+r.width/2+lanes.width*.1,y:r.y+r.height/2});
 assert.equal((await clips())[0],'Opening shot · 00:00:21:00 – 00:00:28:00');
 r=await box('Opening shot');await drag({x:r.x+r.width-2,y:r.y+r.height/2},{x:r.x+r.width-2+lanes.width*.05,y:r.y+r.height/2});
 assert.equal((await clips())[0],'Opening shot · 00:00:21:00 – 00:00:31:00');
 r=await box('Opening shot');await drag({x:r.x+3,y:r.y+r.height/2},{x:r.x+3-lanes.width*.1,y:r.y+r.height/2});
 assert.equal((await clips())[0],'Opening shot · 00:00:15:00 – 00:00:31:00');
 r=await box('Opening shot');await drag({x:r.x+r.width/2,y:r.y+r.height/2},{x:r.x+r.width/2,y:r.y+r.height/2+lanes.height*2/3});
 assert.match(await clip('Opening shot').getAttribute('style'),/calc\(2\*/);
 await page.locator('#undo').click();assert.match(await clip('Opening shot').getAttribute('style'),/calc\(0\*/);await page.locator('#redo').click();assert.match(await clip('Opening shot').getAttribute('style'),/calc\(2\*/);

 // Range, start timecode and frame rate from the inspector.
 await page.locator('.card.timeline .card-header').click();
 await setField('#tl-end','20');await eventually(foot,t=>/→ 00:00:20:00/.test(t)&&/2 connected · 1 outside this range/.test(t),'shorter duration hides later clips');assert.equal((await clips()).length,1);
 await setField('#tl-end','1:00');await eventually(clips,c=>c.length===2,'clips return with the range');
 await setField('#tl-end','not a time');await eventually(toast,t=>/Use HH:MM:SS:FF/.test(t),'invalid timecode is refused');assert.equal(await page.locator('#tl-end').inputValue(),'00:01:00:00');
 await setField('#tl-start','01:00:00:00');await eventually(clips,c=>c[0]==='Opening shot · 01:00:15:00 – 01:00:31:00','start timecode carries clips');
 await page.locator('#tl-rate').selectOption('29.97df');await eventually(clips,c=>c[0]==='Opening shot · 01:00:15;00 – 01:00:31;00','rate change keeps labels');assert.match(await foot(),/01:00:00;00 → 01:01:00;02 · 29.97 fps · drop frame/,"01:01:00;00 is a label drop-frame skips");
 await setField('In point of Opening shot','01:00:10;00');await eventually(clips,c=>c[0]==='Opening shot · 01:00:10;00 – 01:00:26;00','in point moves the clip');
 await setField('Out point of Opening shot','01:00:10;00');await eventually(()=>page.locator('.tl-item.marker').count(),n=>n===1,'equal in and out makes a marker');
 await setField('Out point of Opening shot','01:00:20;00');await eventually(clips,c=>c[0]==='Opening shot · 01:00:10;00 – 01:00:20;00','out point sets the length');

 // Calendar dates.
 await page.locator('#tl-mode').selectOption('date');await eventually(foot,t=>/28 days/.test(t),'date mode');assert.equal(await page.locator('.tl.date').count(),1);assert.equal((await clips()).length,2);
 await setField('#tl-start','2026-10-05');await eventually(foot,t=>/Oct 5, 2026 →/.test(t),'first day');await setField('#tl-end','2026-11-15');
 await eventually(foot,t=>/Oct 5, 2026 → Nov 15, 2026 · 42 days/.test(t),'date range');
 assert.deepEqual(await page.locator('.tl-ruler span').evaluateAll(els=>els.slice(0,3).map(e=>e.textContent)),['Oct 5','Oct 12','Oct 19']);
 await setField('First day of Opening shot','2026-10-19');await eventually(clips,c=>c.some(t=>/^Opening shot · Oct 19/.test(t)),'first day moves the clip');await setField('Last day of Opening shot','2026-10-21');
 await eventually(clips,c=>c.some(t=>/ · Oct 19 – Oct 21, 2026$/.test(t)),'dated clip spans whole days');

 // The Connect tool and the picker reach the same result.
 await closeInspector();await page.getByRole('button',{name:'Connect ideas · C',exact:true}).click();await page.locator('.card.note .card-header').click();let spot=await onTrack(.75);await page.mouse.click(spot.x,spot.y);
 await eventually(clips,c=>c.length===3,'connect tool');assert.equal(await page.locator('[data-edge]').count(),0,'a timeline connection is not an ordinary connector');
 spot=await onTrack(.6,2);await page.mouse.dblclick(spot.x,spot.y);await page.locator('#asset-query').fill('pixel');assert.equal(await page.locator('[data-asset]').count(),1);assert.match(await page.locator('[data-asset] small').textContent(),/already here once/);await page.locator('[data-asset]').click();
 await eventually(clips,c=>c.length===4,'picker');assert.equal(await page.locator('#edges [data-link]').count(),4);
 await page.locator('#tl-links').uncheck();await eventually(()=>page.locator('#edges [data-link]').count(),n=>n===0,'lines can be hidden');await page.locator('#tl-links').check();await eventually(()=>page.locator('#edges [data-link]').count(),n=>n===4,'lines return');

 // Arrow keys nudge the highlighted clip; Delete disconnects it and keeps both cards.
 const last=page.locator('.tl-item').last(),before=await last.getAttribute('title');await last.click();assert.equal(await page.locator('.tl-item.active').count(),1);assert.equal(await page.locator('.tl-row.active').count(),1);
 await page.keyboard.press('ArrowLeft');const nudged=await page.locator('.tl-item.active').getAttribute('title');assert.notEqual(nudged,before);await page.keyboard.press('Shift+ArrowLeft');assert.notEqual(await page.locator('.tl-item.active').getAttribute('title'),nudged);
 const cards=await page.locator('.card').count();await page.keyboard.press('Delete');assert.equal((await clips()).length,3);assert.equal(await page.locator('.card').count(),cards);

 // A file dropped on the track becomes a card below the timeline, already connected.
 spot=await onTrack(.5,2);await page.evaluate(({x,y,pixel})=>{const data=new DataTransfer();data.items.add(new File([Uint8Array.from(atob(pixel),c=>c.charCodeAt(0))],'dropped.png',{type:'image/png'}));for(const type of ['dragover','drop'])document.querySelector('#canvas').dispatchEvent(new DragEvent(type,{bubbles:true,cancelable:true,clientX:x,clientY:y,dataTransfer:data}));},{...spot,pixel});
 await eventually(clips,c=>c.length===4&&c.some(t=>t.startsWith('dropped · ')),'dropped file connects');
 const below=await page.evaluate(()=>{const t=document.querySelector('.card.timeline').getBoundingClientRect(),d=[...document.querySelectorAll('.card.image')].find(c=>c.textContent.includes('dropped')).getBoundingClientRect();return d.top>t.bottom;});assert.ok(below);

 // Double-clicking a clip selects its card, and a selected card lights up its clips.
 await clip('pixel').first().dblclick();assert.equal(await page.locator('#edit-title').inputValue(),'pixel');assert.equal(await page.locator('.card.image.selected').count(),1);
 assert.equal(await page.locator('.tl-item.linked').count(),(await clips()).filter(t=>t.startsWith('pixel · ')).length);assert.ok(await page.locator('#edges .tl-link.linked').count()>=1);

 // Exports carry the timeline; a saved workspace reopens with it; deleting a card removes its clips.
 await closeInspector();await page.locator('#export-open').click();
 let download=page.waitForEvent('download');await page.locator('[data-export="json"]').click();const path=await (await download).path(),saved=JSON.parse(await readFile(path,'utf8')),stored=saved.boards.find(b=>b.name==='Timeline test').cards.find(c=>c.type==='timeline').timeline;
 assert.equal(stored.mode,'date');assert.equal(stored.items.length,4);assert.ok(stored.items.every(i=>Number.isInteger(i.at)&&i.len>=1));
 download=page.waitForEvent('download');await page.locator('[data-export="svg"]').click();const svg=await readFile(await (await download).path(),'utf8');assert.match(svg,/Oct 12/);assert.match(svg,/Opening shot · Oct 19/);
 download=page.waitForEvent('download');await page.locator('[data-export="md"]').click();const md=await readFile(await (await download).path(),'utf8');assert.match(md,/- Oct 19 – Oct 21, 2026 · Opening shot/);await page.locator('#modal-close').click();
 await page.waitForTimeout(700);await page.reload();await page.waitForSelector('.card.timeline');assert.equal((await clips()).length,4);
 await page.locator('#import-input').setInputFiles(path);await page.locator('#confirm-import').click();await page.waitForSelector('.card.timeline');assert.equal((await clips()).length,4);
 await page.locator('.card.note .card-header').click();await page.keyboard.press('Delete');assert.equal(await page.locator('.card.note').count(),0);assert.equal((await clips()).filter(t=>t.startsWith('Opening shot')).length,0);assert.ok((await clips()).length>=1);
 await page.locator('.card.image').filter({hasText:'dropped'}).locator('.card-header').click();await page.locator('#move-board').selectOption({label:'The next great idea'});
 assert.equal((await clips()).filter(t=>t.startsWith('dropped')).length,0,'a card moved to another board leaves the timeline');assert.equal(await page.locator('.card.timeline').count(),1);
 assert.deepEqual(errors,[]);await page.close();

 // ── Desktop bridge: Finder drops over a timeline connect managed originals too ──
 const context=await browser.newContext({viewport:{width:1440,height:1200},deviceScaleFactor:2}),desktop=await context.newPage(),nativeErrors=[];desktop.on('pageerror',e=>nativeErrors.push(e.message));
 await context.addInitScript(w=>{window.desktopData=JSON.stringify(w);window.__TAURI__={core:{invoke:async(name,args)=>{if(name==='load_workspace')return window.desktopData;if(name==='save_workspace'){window.desktopData=args.data;return;}if(name==='import_dropped_files')return {files:[{id:'asset-video',filename:'take-03.mov',kind:'video',size:50000000,data:null},{id:'asset-note',filename:'notes.txt',kind:'file',data:'data:text/plain;base64,aGVsbG8='}],errors:[]};return null;}},webview:{getCurrentWebview:()=>({onDragDropEvent:async handler=>{window.dropHandler=handler;}})},window:{getCurrentWindow:()=>({onCloseRequested:async()=>{},destroy:async()=>{}})}};},initial());
 await desktop.goto('http://127.0.0.1:4173');await desktop.waitForSelector('.card');await desktop.locator('#new-board').click();await desktop.locator('#create-board').click();
 await desktop.getByRole('button',{name:'Timeline · timecode or dates',exact:true}).click();
 const position=await desktop.evaluate(()=>{const r=document.querySelector('.tl-lanes').getBoundingClientRect();return {x:(r.left+r.width/2)*devicePixelRatio,y:(r.top+20)*devicePixelRatio};});
 await desktop.evaluate(position=>window.dropHandler({payload:{type:'over',position}}),position);assert.equal(await desktop.locator('.tl.drop').count(),1);assert.equal(await desktop.locator('.tl-cursor b').textContent(),'00:00:30:00');
 await desktop.evaluate(position=>window.dropHandler({payload:{type:'drop',position,paths:['/Users/demo/take-03.mov','/Users/demo/notes.txt']}}),position);
 assert.deepEqual((await desktop.locator('.tl-item').evaluateAll(els=>els.map(e=>e.title))).sort(),['notes · 00:00:30:00 – 00:00:37:00','take-03.mov · 00:00:30:00 – 00:00:37:00']);assert.equal(await desktop.locator('.tl.drop').count(),0);
 await desktop.waitForTimeout(600);const native=JSON.parse(await desktop.evaluate(()=>window.desktopData)).boards.at(-1);assert.equal(native.cards.find(c=>c.type==='timeline').timeline.items.length,2);assert.equal(native.cards.find(c=>c.localVideo==='asset-video').type,'video');
 assert.deepEqual(nativeErrors,[]);
 console.log('PASS: timeline card, drag-to-connect, retime/trim/lanes, undo, timecode and date ranges, frame-rate conform, connect tool, picker, keyboard, file drops, exports, persistence, native drop bridge. No page errors.');
}finally{await browser.close();}

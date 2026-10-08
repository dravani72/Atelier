import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {initial} from '../ui/model.js';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const context=await browser.newContext(),page=await context.newPage();
await context.addInitScript(w=>{
 window.calls=[];window.desktopData=JSON.stringify(w);
 window.__TAURI__={core:{invoke:async(name,args)=>{window.calls.push({name,args});if(name==='load_workspace')return window.desktopData;if(name==='save_workspace'){window.desktopData=args.data;return null;}if(name==='export_file'||name==='save_attachment')return true;if(name==='list_revisions')return [];if(name==='open_link')return null;throw Error('Unknown native command: '+name);}},window:{getCurrentWindow:()=>({onCloseRequested:async callback=>{window.closeHandler=callback;},destroy:async()=>{window.destroyed=true;}})}};
},initial());
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:4173');await page.waitForSelector('.card');await page.getByRole('button',{name:'Note · N',exact:true}).click();await page.locator('#edit-title').fill('Native test');await page.locator('#edit-title').press('Tab');await page.waitForTimeout(700);
 assert.ok(await page.evaluate(()=>window.calls.some(c=>c.name==='save_workspace'&&c.args.data.includes('Native test'))));
 await page.locator('#export-open').click();await page.locator('[data-export="json"]').click();await page.waitForTimeout(50);assert.ok(await page.evaluate(()=>window.calls.some(c=>c.name==='export_file'&&c.args.name==='atelier-workspace.json')));await page.locator('#modal-close').click();
 // The desktop close handler flushes the final edit before destroying the window.
 await page.locator('#edit-body').fill('Last-second edit');await page.locator('#edit-body').press('Tab');await page.evaluate(()=>window.closeHandler({preventDefault(){}}));assert.ok(await page.evaluate(()=>window.destroyed&&window.desktopData.includes('Last-second edit')));
 assert.deepEqual(errors,[]);console.log('PASS: mocked native bridge loads, saves, exports, and flushes on close. This is a bridge contract test, not a native-window launch.');
}finally{await browser.close();}

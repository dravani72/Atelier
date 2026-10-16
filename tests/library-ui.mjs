import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {library} from '../ui/templates/library/catalog.js';
// The gallery opens on the worked examples; one is added with its pictures and timelines, then undone.
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const errors=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173');await page.waitForSelector('.card');
 await page.locator('#templates-open').click();await page.waitForSelector('[data-lib]');
 assert.equal(await page.locator('[data-lib]').count(),library.length,'every example is listed');
 await page.locator('#template-family').selectOption('Storyboards');const n=await page.locator('[data-lib]').count();assert.ok(n>=10&&n<library.length,'category filter');
 await page.locator('#template-search').fill('commercial');assert.ok(await page.locator('[data-lib="tvc-storyboard"]').count(),'search inside a category');
 const boards=await page.locator('#boards .board-row').count();
 await page.locator('[data-lib="tvc-storyboard"]').click();await page.waitForFunction(()=>document.querySelector('#board-title')?.textContent==='TVC advertising storyboard');
 assert.equal(await page.locator('#boards .board-row').count(),boards+1,'one board added');
 assert.ok(await page.locator('.card.sketch img, .card.image img').count()>=6,'pictures are embedded');
 assert.equal(await page.locator('.tl-item').count(),6,'timecode clips connected');
 // A calendar template lands in the current week.
 await page.locator('#templates-open').click();await page.locator('#template-search').fill('weekly plan');await page.locator('[data-lib="weekly-plan"]').click();
 await page.waitForFunction(()=>document.querySelector('#board-title')?.textContent==='Weekly plan');
 const summary=await page.locator('.card.timeline').first().innerText();const year=String(new Date().getFullYear());assert.ok(summary.includes(year),'calendar moved to this year');
 await page.locator('#undo').click();await page.locator('#undo').click();assert.equal(await page.locator('#boards .board-row').count(),boards,'undo removes both');
 // The scaffolds tab still offers the starter pack.
 await page.locator('#templates-open').click();await page.locator('[data-view="scaffolds"]').click();assert.ok(await page.locator('[data-template="at-001"]').count());
 assert.deepEqual(errors,[]);console.log('PASS: template library gallery, filters, pictures, timecode and calendar timelines, undo, scaffolds tab.');
}finally{await browser.close();}

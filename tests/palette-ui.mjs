import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:1500,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const pixel=()=>page.locator('#sketch-canvas').evaluate(c=>Array.from(c.getContext('2d').getImageData(500,325,1,1).data));
try{
 await page.goto('http://127.0.0.1:4173');await page.waitForSelector('.card');
 await page.getByRole('button',{name:'Note · N',exact:true}).click();await page.locator('#edit-title').fill('Palette test');await page.locator('#edit-title').press('Tab');
 await page.locator('#card-palette-family').selectOption('1');await page.getByRole('button',{name:'Use #2563eb',exact:true}).click();
 const card=page.locator('.card.selected');assert.equal(await card.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(37, 99, 235)');
 await page.locator('#color-target').selectOption('label');await page.locator('#card-palette-family').selectOption('1');await page.getByRole('button',{name:'Use #dc2626',exact:true}).click();
 await page.locator('#edit-tags').fill('priority');await page.locator('#edit-tags').press('Tab');assert.equal(await card.locator('.tag').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(220, 38, 38)');
 await page.waitForTimeout(700);await page.reload();await page.waitForSelector('.card');await page.locator('.card').filter({hasText:'Palette test'}).locator('.card-header').click();assert.equal(await page.getByLabel('Fill color',{exact:true}).inputValue(),'#2563eb');assert.equal(await page.getByLabel('Labels color',{exact:true}).inputValue(),'#dc2626');
 await mkdir('artifacts',{recursive:true});await page.screenshot({path:'artifacts/palette-card.png'});
 await page.locator('#color-reset').click();assert.equal(await card.evaluate(e=>e.style.getPropertyValue('--card-fill')),'');await page.locator('#inspector-close').click();
 await page.getByRole('button',{name:'Sketch',exact:true}).click();await page.locator('#draw-palette-family').selectOption('1');await page.getByRole('button',{name:'Use #2563eb',exact:true}).click();assert.equal(await page.locator('#sketch-color').inputValue(),'#2563eb');
 await page.locator('#sketch-size').fill('30');const r=await page.locator('#sketch-canvas').boundingBox();await page.mouse.click(r.x+r.width/2,r.y+r.height/2);assert.deepEqual(await pixel(),[37,99,235,255]);
 await page.locator('#sketch-undo').click();assert.deepEqual(await pixel(),[255,255,255,255]);await page.locator('#sketch-redo').click();assert.deepEqual(await pixel(),[37,99,235,255]);
 await page.locator('#sketch-eraser').click();await page.mouse.click(r.x+r.width/2,r.y+r.height/2);assert.deepEqual(await pixel(),[255,255,255,255]);await page.locator('#sketch-undo').click();
 await page.screenshot({path:'artifacts/palette-drawing.png'});await page.locator('#save-sketch').click();await page.locator('#replace-media').click();await page.waitForFunction(()=>!document.querySelector('#save-sketch').disabled);assert.deepEqual(await pixel(),[37,99,235,255]);
 await page.locator('#sketch-paper').evaluate(e=>{e.value='#fef08a';e.dispatchEvent(new Event('change',{bubbles:true}));});assert.deepEqual(await pixel(),[254,240,138,255]);await page.locator('#sketch-undo').click();assert.deepEqual(await pixel(),[37,99,235,255]);await page.locator('#save-sketch').click();
 assert.deepEqual(errors,[]);console.log('PASS: custom fill/labels persist, theme reset, drawing palette, undo/redo, eraser and existing sketch editing.');
}finally{await browser.close();}

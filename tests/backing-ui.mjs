import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import * as K from '../ui/color.js';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:1440,height:1000},acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
// Any CSS color the browser computed, as '#rrggbb' (color-mix results come back as color(srgb …), so paint and read a pixel).
const paint=(selector,property='backgroundColor')=>page.locator(selector).first().evaluate((el,property)=>{const c=document.createElement('canvas').getContext('2d');c.fillStyle=getComputedStyle(el)[property];c.fillRect(0,0,1,1);return '#'+[...c.getImageData(0,0,1,1).data].slice(0,3).map(v=>v.toString(16).padStart(2,'0')).join('');},property);
const token=name=>page.locator('#canvas').evaluate((el,name)=>getComputedStyle(el).getPropertyValue(name).trim(),name);
const inline=name=>page.locator('#canvas').evaluate((el,name)=>el.style.getPropertyValue(name),name);
const near=(a,b,what)=>assert.ok(K.distance(a,b)<.012,`${what}: ${a} is not ${b}`);
const closeInspector=async()=>{const c=page.getByRole('button',{name:'Close inspector'});if(await c.count())await c.click();};
const setHex=async value=>{await page.locator('#backing-hex').fill(value);await page.locator('#backing-hex').press('Enter');};
try{
 await page.goto('http://127.0.0.1:4173');await page.waitForSelector('.card.note');
 // Cards take the shade of their own type: the same pigment as their icon, mixed into the card surface.
 const surface=await token('--surface');
 for(const type of ['note','task','board'])near(await paint(`.card.${type}`),K.mix(await token('--k-'+type),surface,.18),type+' shade');
 assert.ok(K.distance(await paint('.card.note'),await paint('.card.task'))>.015);assert.ok(K.distance(await paint('.card.note'),surface)>.03);
 assert.equal(await page.locator('#canvas.has-backing').count(),0);
 await page.getByRole('button',{name:'Sticky note',exact:true}).click();near(await paint('.card.sticky'),K.mix(await token('--k-sticky'),surface,.45),'sticky shade');
 assert.equal(await page.getByRole('button',{name:'Sand',exact:true}).count(),0,'a sticky note’s own tint is its default, not a separate swatch');
 await closeInspector();
 // Plain and the named tints still override the type shade, and Type color brings it back.
 await page.locator('.card.note .card-header').last().click();assert.equal(await page.getByRole('button',{name:'Type color',exact:true}).getAttribute('aria-pressed'),'true');
 await page.getByRole('button',{name:'Plain',exact:true}).click();near(await paint('.card.note.selected'),surface,'plain card');
 await page.getByRole('button',{name:'Sage',exact:true}).click();near(await paint('.card.note.selected'),await token('--tint-sage'),'sage card');
 await page.getByRole('button',{name:'Type color',exact:true}).click();near(await paint('.card.note.selected'),K.mix(await token('--k-note'),surface,.18),'type color again');await closeInspector();

 // A preset backing: the canvas takes the color, and things drawn straight on the board switch to an ink that reads on it.
 await page.locator('#board-color').click();await page.getByRole('button',{name:'Navy',exact:true}).click();
 assert.equal(await paint('#canvas'),'#1b2a5c');assert.equal(await page.locator('#canvas.has-backing').count(),1);assert.equal(await paint('.card.heading .card-title','color'),'#ededea');
 assert.equal(await page.getByRole('button',{name:'Navy',exact:true}).getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#backing-hex').inputValue(),'#1b2a5c');
 near(await paint('.card.note'),K.mix(await token('--k-note'),surface,.18),'cards keep the theme on a dark backing');
 // Any color at all, typed as hex. A backing close to a card's shade makes that type deepen until it stands apart.
 await setHex('#dbeafb');assert.equal(await paint('#canvas'),'#dbeafb');assert.equal(await paint('.card.heading .card-title','color'),'#18181b');
 const deeper=parseFloat(await inline('--s-note'));assert.ok(deeper>18,'note shade deepens on a sky backing');near(await paint('.card.note'),K.mix(await token('--k-note'),surface,deeper/100),'deepened note');
 assert.ok(K.distance(await paint('.card.note'),'#dbeafb')>=K.CLEAR);assert.equal(await inline('--s-sketch'),'','a type far from the backing keeps its usual strength');
 await setHex('2f7');assert.equal(await paint('#canvas'),'#22ff77');
 await setHex('not a color');assert.equal(await paint('#canvas'),'#22ff77');assert.equal(await page.locator('#backing-hex').inputValue(),'#22ff77');assert.match(await page.locator('#toast').textContent(),/hex color/);
 // The system picker: the whole pick is one undo step.
 await page.locator('#backing-picker').fill('#2f7d5b');assert.equal(await paint('#canvas'),'#2f7d5b');assert.equal(await page.locator('#backing-hex').inputValue(),'#2f7d5b');
 await page.keyboard.press('Escape');assert.equal(await page.locator('#backing-pop').count(),0);
 await page.locator('#undo').click();assert.equal(await paint('#canvas'),'#22ff77');await page.locator('#redo').click();assert.equal(await paint('#canvas'),'#2f7d5b');
 await mkdir('artifacts',{recursive:true});await page.screenshot({path:'artifacts/atelier-board-backing.png'});

 // Presenting and exporting carry the backing.
 await page.getByRole('button',{name:'Frame',exact:true}).click();await closeInspector();await page.locator('#presentation-open').click();
 assert.equal(await paint('#canvas-presentation'),'#2f7d5b');assert.equal(await page.locator('#canvas-presentation.has-backing').count(),1);await page.keyboard.press('Escape');
 await page.locator('#export-open').click();const pending=page.waitForEvent('download');await page.locator('[data-export="svg"]').click();const svg=await readFile(await (await pending).path(),'utf8');await page.locator('#modal-close').click();
 assert.match(svg,/<rect[^>]*fill="#2f7d5b"/);assert.ok(svg.includes(`fill="${await paint('.card.note')}"`),'exported note keeps its shade');assert.doesNotMatch(svg,/var\(|color-mix|undefined|NaN/);

 // It is saved with the board, shows on the nested-board card, and can be handed back to the theme.
 await page.getByRole('button',{name:'Nested board',exact:true}).click();await page.locator('#new-name').fill('Night shoot');await page.locator('#create-board').click();assert.equal(await page.locator('#canvas.has-backing').count(),0,'a new board starts on the default');
 await page.locator('#board-color').click();await page.getByRole('button',{name:'Plum',exact:true}).click();await page.keyboard.press('Escape');await page.locator('#breadcrumbs [data-nav]').first().click();
 assert.equal(await paint('#canvas'),'#2f7d5b');assert.equal(await page.locator('.card.board').filter({hasText:'Night shoot'}).locator('.board-cover').evaluate(el=>el.style.getPropertyValue('--cover')),'#4a2550');
 await page.waitForTimeout(700);await page.reload();await page.waitForSelector('.card.note');assert.equal(await paint('#canvas'),'#2f7d5b');assert.equal(await inline('--on-canvas'),'#ededea');
 await page.locator('#board-color').click();await page.getByRole('button',{name:'Use the default',exact:true}).click();
 assert.equal(await page.locator('#canvas.has-backing').count(),0);assert.equal(await paint('#canvas'),await token('--canvas'));assert.equal(await inline('--on-canvas'),'');assert.ok(await page.getByRole('button',{name:'Use the default',exact:true}).isDisabled());
 await page.mouse.click(700,600);assert.equal(await page.locator('#backing-pop').count(),0,'clicking the board closes the picker');
 // The dark theme keeps its own cards and its own default canvas.
 await page.evaluate(()=>localStorage.setItem('atelier-dark','yes'));await page.reload();await page.waitForSelector('.card.note');
 near(await paint('.card.note'),K.mix(await token('--k-note'),await token('--surface'),.18),'dark note shade');assert.equal(await page.locator('.dark').count(),1);
 assert.deepEqual(errors,[]);console.log('PASS: type shades, plain and tint overrides, preset/hex/picker backings, adaptive deepening, on-board ink, undo, presentation, SVG export, nested cover, persistence, default, dark theme. No page errors.');
}finally{await browser.close();}

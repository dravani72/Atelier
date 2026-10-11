import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
// Canvas coordinates are the drawing's own 1000 × 650, whatever size the dialog shows it at.
let box;
const screen=(x,y)=>[box.x+x*box.width/1000,box.y+y*box.height/650];
const drag=async(points,{shift=false}={})=>{await page.mouse.move(...screen(...points[0]));await page.mouse.down();if(shift)await page.keyboard.down('Shift');for(const p of points.slice(1))await page.mouse.move(...screen(...p),{steps:8});await page.mouse.up();if(shift)await page.keyboard.up('Shift');};
const click=(x,y)=>page.mouse.click(...screen(x,y));
const pixel=(x,y)=>page.locator('#sketch-canvas').evaluate((c,[x,y])=>[...c.getContext('2d').getImageData(x,y,1,1).data].slice(0,3),[x,y]);
const tool=name=>page.getByRole('button',{name,exact:true}).click();
const ink=name=>page.getByRole('button',{name,exact:true}).click();
const pressed=name=>page.getByRole('button',{name,exact:true}).getAttribute('aria-pressed');
const is=async(x,y,expected,what,slack=6)=>{const got=await pixel(x,y);assert.ok(got.every((v,i)=>Math.abs(v-expected[i])<=slack),`${what}: (${x},${y}) is ${got}, expected ${expected}`);};
const WHITE=[255,255,255],BLACK=[24,24,27],RED=[220,38,38],BLUE=[37,99,235],GREEN=[22,163,74];
try{
 await page.goto('http://127.0.0.1:4173');await page.waitForSelector('.card');
 await page.getByRole('button',{name:'Sketch',exact:true}).click();await page.waitForSelector('#sketch-canvas');box=await page.locator('#sketch-canvas').boundingBox();
 assert.ok(box.height>400,'the paper is large enough to draw on');assert.equal(await page.locator('#modal').evaluate(el=>el.scrollHeight>el.clientHeight),false,'tools and save button fit without scrolling');
 assert.equal(await page.locator('[data-tool]').count(),8);assert.equal(await pressed('Pen'),'true');assert.ok(await page.getByRole('button',{name:'Undo',exact:true}).isDisabled());await is(500,300,WHITE,'blank paper');

 // Pen, and the whole history: undo, redo, and a new mark dropping what was undone.
 await drag([[100,100],[300,100]]);await is(200,100,BLACK,'pen line');await is(200,130,WHITE,'beside the pen line');
 await page.getByRole('button',{name:'Undo',exact:true}).click();await is(200,100,WHITE,'undone');await page.getByRole('button',{name:'Redo',exact:true}).click();await is(200,100,BLACK,'redone');
 await page.keyboard.press('Control+z');await is(200,100,WHITE,'undone from the keyboard');await page.keyboard.press('Control+Shift+z');await is(200,100,BLACK,'redone from the keyboard');
 await click(900,600);await is(900,600,BLACK,'a click with the pen is a dot');await page.keyboard.press('Control+z');

 // Rectangle and fill: the fill stays inside the outline and leaves no pale fringe along it.
 await page.keyboard.press('r');assert.equal(await pressed('Rectangle'),'true');assert.equal(await pressed('Pen'),'false');
 await drag([[100,200],[400,400]]);await is(100,300,BLACK,'rectangle left edge');await is(250,400,BLACK,'rectangle bottom edge');await is(250,300,WHITE,'rectangle is an outline');
 await click(600,300);await is(600,300,WHITE,'a click with a shape tool draws nothing');
 await tool('Fill');await ink('Blue');await click(250,300);await is(250,300,BLUE,'filled inside');await is(103,300,BLUE,'filled right up to the outline');await is(450,300,WHITE,'nothing filled outside');await is(100,300,BLACK,'outline kept');
 await page.keyboard.press('Control+z');await is(250,300,WHITE,'fill undone');await page.keyboard.press('Control+y');await is(250,300,BLUE,'fill redone');

 // Shift keeps a line level and makes a circle; the arrow gets a head; sizes change the stroke.
 await page.keyboard.press('l');await ink('Red');await page.locator('#sketch-size').fill('8');assert.equal(await page.locator('#sketch-size-value').textContent(),'8');
 await drag([[500,100],[800,112]],{shift:true});await is(650,100,RED,'level line');await is(790,100,RED,'level line reaches across');await is(650,112,WHITE,'the line did not follow the pointer down');
 await page.keyboard.press(']');assert.equal(await page.locator('#sketch-size-value').textContent(),'9');await page.keyboard.press('[');assert.equal(await page.locator('#sketch-size-value').textContent(),'8');
 await tool('Ellipse');await ink('Green');await drag([[500,200],[640,300]],{shift:true});await is(570,200,GREEN,'circle top');await is(570,340,GREEN,'circle bottom: as tall as it is wide');await is(570,270,WHITE,'circle is an outline');
 await tool('Arrow');await ink('Black');await drag([[700,250],[900,250]]);await is(800,250,BLACK,'arrow shaft');await is(885,258,BLACK,'arrowhead is wider than the shaft');await is(800,262,WHITE,'beside the shaft');

 // Highlighter tints paper but leaves the line under it dark; the eraser takes ink back to paper.
 await tool('Highlighter');await ink('Blue');await drag([[650,60],[650,140]]);const tinted=await pixel(650,70);assert.ok(tinted[2]>tinted[0]+40&&tinted[0]>120,'highlighter is a see-through tint: '+tinted);const crossed=await pixel(650,100);assert.ok(crossed[0]>crossed[2],'the red line still shows through the highlighter: '+crossed);
 await tool('Eraser');await drag([[250,250],[250,350]]);await is(250,300,WHITE,'erased');await is(180,300,BLUE,'not erased beside the stroke');
 await ink('Red');assert.equal(await pressed('Pen'),'true','choosing an ink while erasing goes back to the pen');
 // Any colour from the picker.
 await page.locator('#sketch-color').fill('#00aa88');assert.equal(await pressed('Red'),'false');await drag([[100,500],[300,500]]);await is(200,500,[0,170,136],'custom ink');

 // Clear is a mark like any other, so it can be undone.
 await page.getByRole('button',{name:'Clear',exact:true}).click();await is(200,500,WHITE,'cleared');await is(100,300,WHITE,'cleared');await page.getByRole('button',{name:'Undo',exact:true}).click();await is(200,500,[0,170,136],'clear undone');
 await mkdir('artifacts',{recursive:true});await page.screenshot({path:'artifacts/atelier-sketch-tools.png'});

 // Saving makes a card; Edit sketch reopens that drawing, and saving again keeps the card and its size.
 await page.locator('#save-sketch').click();await page.waitForSelector('.card.sketch img');assert.equal(await page.locator('.card.sketch').count(),1);assert.equal(await page.locator('#modal').evaluate(el=>el.open),false);
 const sized=()=>page.locator('.card.sketch').evaluate(el=>[el.style.width,el.style.height]);assert.deepEqual(await sized(),['350px','265px']);
 const handle=await page.locator('.card.sketch .resize-handle').boundingBox();await page.mouse.move(handle.x+5,handle.y+5);await page.mouse.down();await page.mouse.move(handle.x+85,handle.y+65,{steps:5});await page.mouse.up();const resized=await sized();assert.notDeepEqual(resized,['350px','265px']);
 await page.getByRole('button',{name:'Edit sketch',exact:true}).click();await page.waitForSelector('#sketch-canvas');box=await page.locator('#sketch-canvas').boundingBox();
 await page.waitForFunction(()=>!document.querySelector('#save-sketch').disabled);assert.equal(await page.locator('#save-sketch').textContent(),'Save sketch');
 await is(200,500,[0,170,136],'the saved drawing is the paper');await is(100,300,BLACK,'the saved drawing is the paper');assert.ok(await page.getByRole('button',{name:'Undo',exact:true}).isDisabled(),'an edit starts with a clean history');
 await page.keyboard.press('p');await ink('Red');await drag([[100,580],[300,580]]);await is(200,580,RED,'drawn on top');await page.locator('#save-sketch').click();await page.waitForFunction(()=>!document.querySelector('#modal').open);
 assert.equal(await page.locator('.card.sketch').count(),1);assert.deepEqual(await sized(),resized,'editing keeps the size the card was given');
 // The shortcuts belong to the editor: with it closed, the same keys are the board's again.
 await page.getByRole('button',{name:'Close inspector'}).click();const before=await page.locator('.card').count();await page.keyboard.press('n');assert.equal(await page.locator('.card').count(),before+1);
 await page.waitForTimeout(600);await page.reload();await page.waitForSelector('.card.sketch img');
 assert.deepEqual(errors,[]);console.log('PASS: pen, rectangle, fill, line, ellipse, arrow, highlighter, eraser, custom ink, sizes, Shift constraints, shortcuts, undo/redo, clear, save, edit and persistence. No page errors.');
}finally{await browser.close();}

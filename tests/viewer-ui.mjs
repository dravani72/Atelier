import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:940}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4173');await page.waitForSelector('.card');
const obj='mtllib triangle.mtl\nv 0 0 0\nv 1 0 0\nv 0 1 0\nusemtl red\nf 1 2 3\n';
await page.locator('#media-input').setInputFiles([{name:'triangle.obj',mimeType:'application/octet-stream',buffer:Buffer.from(obj)},{name:'triangle.mtl',mimeType:'text/plain',buffer:Buffer.from('newmtl red\nKd 1 0 0\n')}]);
await page.locator('.open-model').click();await page.waitForSelector('.viewer-stage[data-rendered=true]');assert.match(await page.locator('.viewer-status').textContent(),/1 meshes/);
await page.getByLabel('rotation Y',{exact:true}).fill('45');await page.getByLabel('rotation Y',{exact:true}).dispatchEvent('change');await page.locator('[data-save]').click();await page.locator('#modal-close').click();await page.waitForTimeout(600);await page.reload();await page.locator('.open-model').click();await page.waitForSelector('.viewer-stage[data-rendered=true]');assert.equal(await page.getByLabel('rotation Y',{exact:true}).inputValue(),'45');assert.ok(await page.locator('.model-preview').count());await page.locator('#modal-close').click();
const usd=`#usda 1.0\ndef Xform "Root" {\n def Mesh "Triangle" {\n  int[] faceVertexCounts = [3]\n  int[] faceVertexIndices = [0, 1, 2]\n  point3f[] points = [(0,0,0), (1,0,0), (0,1,0)]\n }\n}\n`;
for(const ext of ['usda','usd','usdt']){await page.locator('#media-input').setInputFiles({name:'triangle.'+ext,mimeType:'application/octet-stream',buffer:Buffer.from(usd)});await page.locator('.card.selected .open-model').click();await page.waitForSelector('.viewer-stage[data-rendered=true]');assert.match(await page.locator('.viewer-status').textContent(),/1 meshes/);await page.locator('#modal-close').click();}
await page.locator('#media-input').setInputFiles({name:'broken.fbx',mimeType:'application/octet-stream',buffer:Buffer.from('invalid')});await page.locator('.card.selected .open-model').click();await page.waitForSelector('.viewer-status[data-error=true]');assert.match(await page.locator('.viewer-status').textContent(),/Unable to preview/);
assert.deepEqual(errors,[]);await browser.close();console.log('3D viewer: OBJ/MTL, USDA/USD/USDT, transforms, thumbnail, persistence, malformed FBX passed');

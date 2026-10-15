// Renders a preview of every template for the gallery: the board as it appears in Atelier, fitted to the canvas.
// Needs the standalone packages (node template-library/build.mjs --standalone) and the preview server (npm run dev).
//   node template-library/tools/thumbs.mjs [id …]
import {readFileSync,readdirSync,mkdirSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const here=join(dirname(fileURLToPath(import.meta.url)),'..'),dist=join(here,'dist'),out=join(here,'../ui/templates/library/thumbs');
mkdirSync(out,{recursive:true});
const only=process.argv.slice(2),ids=readdirSync(dist).filter(f=>f.endsWith('.atelier.json')).map(f=>f.replace('.atelier.json','')).filter(id=>!only.length||only.includes(id));
const exe=['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync);
const browser=await chromium.launch({headless:true,...(exe?{executablePath:exe}:{}),args:['--no-sandbox']});
const page=await (await browser.newContext({viewport:{width:1680,height:1180},deviceScaleFactor:0.4})).newPage();
await page.goto('http://127.0.0.1:4173');await page.waitForSelector('.card');
// A clean canvas: hide the floating toolbars so the preview is just the board.
await page.addStyleTag({content:'#tools,.canvas-navigation,.canvas-bottom,#toast{visibility:hidden!important}'});
for(const id of ids){
 await page.locator('#import-input').setInputFiles({name:id+'.atelier.json',mimeType:'application/json',buffer:readFileSync(join(dist,id+'.atelier.json'))});
 await page.locator('#confirm-add').click();await page.waitForTimeout(250);
 await page.locator('#canvas').click({position:{x:4,y:4}});await page.keyboard.press('f');await page.waitForTimeout(450);
 await page.locator('#canvas').screenshot({path:join(out,id+'.jpg'),type:'jpeg',quality:72});
 // Remove the board again so the workspace stays small.
 await page.locator('#undo').click();await page.waitForTimeout(150);
 process.stdout.write('.');
}
await browser.close();console.log(`\n${ids.length} previews in ${out}`);

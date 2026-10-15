import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
// Two people: separate browser contexts are separate workspaces, like two Macs.
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const errors=[];
const person=async()=>{const ctx=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true}),page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4173');await page.waitForSelector('.card');return page;};
const boards=page=>page.locator('#boards .board-row .name').allInnerTexts();
const open=(page,file)=>page.locator('#import-input').setInputFiles(file);
const toast=page=>page.locator('#toast').textContent();
const fixture=JSON.parse(await readFile(new URL('./fixtures/package.json',import.meta.url),'utf8'));
try{
 // The sender builds a board with a nested board and exports it as a package.
 const sender=await person();
 await page_note(sender,'Shared idea','Made by the sender.');
 await sender.getByRole('button',{name:'Nested board',exact:true}).click();await sender.locator('#new-name').fill('Sender details');await sender.locator('#create-board').click();
 await sender.locator('#breadcrumbs [data-nav]').first().click();
 const top=await sender.locator('#board-title').textContent();
 await sender.locator('#export-open').click();assert.equal(await sender.locator('#export-package').count(),1);
 let pending=sender.waitForEvent('download');await sender.locator('#export-package').click();const download=await pending;
 assert.match(download.suggestedFilename(),/\.atelier\.json$/);
 const pkg=JSON.parse(await readFile(await download.path(),'utf8'));
 assert.equal(pkg.format,'atelier-package');assert.equal(pkg.version,1);assert.equal(pkg.name,top);assert.ok(pkg.boards.some(b=>b.name==='Sender details'));assert.ok(pkg.boards.every(b=>b.name!=='Elsewhere'));
 assert.match(await toast(sender),/^Package saved: \d+ boards\./);await sender.locator('#modal-close').click().catch(()=>{});

 // The receiver has work of their own. Importing the package adds it; nothing of theirs is replaced.
 const receiver=await person();await page_note(receiver,'Mine','Made by the receiver.');await receiver.waitForTimeout(600);
 const before=await boards(receiver);
 await open(receiver,await download.path());
 assert.equal(await receiver.locator('#modal h2').textContent(),'Add these boards?');assert.equal(await receiver.locator('#confirm-import').count(),0,'a package never offers to replace');
 assert.match(await receiver.locator('#modal').innerText(),new RegExp(`${pkg.boards.length} boards`));
 await receiver.locator('#confirm-add').click();
 const after=await boards(receiver);assert.equal(after.length,before.length+pkg.boards.length);assert.deepEqual(after.filter(n=>before.includes(n)).length>=before.length,true);
 assert.equal(await receiver.locator('#board-title').textContent(),top,'the added board opens');assert.equal(await receiver.locator('.card').filter({hasText:'Shared idea'}).count(),1);
 assert.match(await toast(receiver),/^Added \d+ boards/);
 // Everything that arrived can be changed like the receiver's own work, and it persists.
 await receiver.locator('#search-open').click();await receiver.locator('#search-query').fill('Made by the sender');await receiver.locator('.search-result').first().click();await receiver.locator('#edit-title').fill('Shared idea, revised');await receiver.locator('#edit-title').press('Tab');await receiver.getByRole('button',{name:'Close inspector'}).click();
 await receiver.waitForTimeout(700);await receiver.reload();await receiver.waitForSelector('.card');assert.equal(await receiver.locator('.card').filter({hasText:'Shared idea, revised'}).count(),1);
 assert.ok((await boards(receiver)).length===after.length);
 await receiver.locator('#boards .board-row').filter({hasText:before[0]}).first().click();assert.equal(await receiver.locator('.card').filter({hasText:'Mine'}).count(),1,'the receiver’s own board is intact');

 // A package that uses every relationship: frames, columns, groups, timelines, connectors, a nested board, a backing.
 await open(receiver,{name:'shot-plan.atelier.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))});await receiver.locator('#confirm-add').click();
 assert.equal(await receiver.locator('#board-title').textContent(),'Shot plan');assert.equal(await receiver.locator('#canvas.has-backing').count(),1);
 assert.equal(await receiver.locator('#cards .card').count(),fixture.boards[0].cards.length);assert.equal(await receiver.locator('.tl-item').count(),3);assert.equal(await receiver.locator('#edges [data-edge]').count(),2);
 await receiver.locator('.card.board [data-enter]').click();assert.equal(await receiver.locator('#board-title').textContent(),'References');assert.equal(await receiver.locator('.card').filter({hasText:'Tide tables'}).count(),1);
 // The same package again is a second copy, not a clash; undo takes the import back.
 const count=(await boards(receiver)).length;await open(receiver,{name:'again.atelier.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))});await receiver.locator('#confirm-add').click();
 assert.equal((await boards(receiver)).length,count+2);await receiver.locator('#undo').click();assert.equal((await boards(receiver)).length,count);
 await mkdir('artifacts',{recursive:true});await receiver.screenshot({path:'artifacts/atelier-package-import.png'});

 // A whole-workspace backup can be added the same way, or can still replace everything.
 await sender.locator('#export-open').click();pending=sender.waitForEvent('download');await sender.locator('[data-export="json"]').click();const backup=await (await pending).path();await sender.locator('#modal-close').click();
 await open(receiver,backup);assert.equal(await receiver.locator('#modal h2').textContent(),'Import this backup?');assert.equal(await receiver.locator('#confirm-add').count(),1);assert.equal(await receiver.locator('#confirm-import').textContent(),'Replace workspace');
 const n=(await boards(receiver)).length,backupBoards=JSON.parse(await readFile(backup,'utf8')).boards.length;await receiver.locator('#confirm-add').click();assert.equal((await boards(receiver)).length,n+backupBoards);
 await open(receiver,backup);await receiver.locator('#confirm-import').click();assert.equal((await boards(receiver)).length,backupBoards);assert.equal(await toast(receiver),'Workspace imported.');

 // Files from a newer Atelier, or that are not Atelier at all, are refused with a reason and change nothing.
 const left=(await boards(receiver)).length;
 await open(receiver,{name:'future.atelier.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...fixture,version:2}))});assert.match(await toast(receiver),/newer Atelier/);
 await open(receiver,{name:'other.json',mimeType:'application/json',buffer:Buffer.from('{"hello":"world"}')});assert.match(await toast(receiver),/^Could not import/);
 assert.equal((await boards(receiver)).length,left);assert.equal(await receiver.locator('#modal').evaluate(el=>el.open),false);

 assert.deepEqual(errors,[]);console.log('PASS: package export, additive import between workspaces, editing after import, nested boards, timelines, connectors, backing, repeat import, undo, backups added or replaced, newer/foreign files refused. No page errors.');
}finally{await browser.close();}

async function page_note(page,title,body){await page.getByRole('button',{name:'Note · N',exact:true}).click();await page.locator('#edit-title').fill(title);await page.locator('#edit-title').press('Tab');await page.locator('#edit-body').fill(body);await page.locator('#edit-body').press('Tab');await page.getByRole('button',{name:'Close inspector'}).click();}

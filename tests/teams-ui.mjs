import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {board} from '../ui/model.js';
import {pack} from '../ui/interchange.js';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const uid='00000000-0000-4000-8000-000000000001',tid='00000000-0000-4000-8000-000000000002',bid='00000000-0000-4000-8000-000000000003';
let role='owner',teams=[],shared=[],published=[],invited=[],displayName='',otpSent=false,conflict=false;
const b=board('From the team');const pkg=pack({version:1,active:b.id,boards:[b]},b.id).package;
const jwt='eyJhbGciOiJIUzI1NiJ9.'+Buffer.from(JSON.stringify({sub:uid,role:'authenticated',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url')+'.signature';
const account={id:uid,email:'owner@example.com',aud:'authenticated',role:'authenticated',app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
try{
 await page.route('https://example.supabase.co/**',async route=>{
  const req=route.request(),url=new URL(req.url()),path=url.pathname;
  if(req.method()==='OPTIONS')return route.fulfill({status:200,headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'}});
  let response={},status=200;const body=req.postDataJSON();
  if(path==='/auth/v1/otp'){otpSent=true;response={};}
  else if(path==='/auth/v1/verify')response={access_token:jwt,refresh_token:'refresh',expires_in:3600,token_type:'bearer',user:account};
  else if(path==='/auth/v1/logout')response={};
  else if(path==='/rest/v1/atelier_teams')response=teams;
  else if(path==='/rest/v1/atelier_profiles'){if(req.method()==='POST')displayName=body.display_name;response=displayName?[{user_id:uid,display_name:displayName}]:[];}
  else if(path==='/rest/v1/atelier_invites')response=invited;
  else if(path==='/rest/v1/atelier_members')response=[{user_id:uid,role}];
  else if(path==='/rest/v1/atelier_boards')response=url.searchParams.get('select')==='package'?{package:pkg}:shared;
  else if(path.endsWith('/atelier_create_team')){teams=[{id:tid,name:body.team_name}];response=tid;}
  else if(path.endsWith('/atelier_invite')){assert.equal(body.team,tid);invited=[{id:bid,team_id:tid,email:body.invite_email,role:body.invite_role,expires_at:new Date(Date.now()+86400000).toISOString()}];response=bid;}
  else if(path.endsWith('/atelier_accept_invite')){assert.equal(body.invitation,bid);teams=[{id:tid,name:'Invited team'}];invited=[];response=tid;}
  else if(path.endsWith('/atelier_publish')){if(conflict){status=400;response={message:'Board changed or access was removed. Refresh before publishing again.'};}else{published.push(body);shared=[{id:bid,name:body.board_name,revision:1,updated_at:new Date().toISOString()}];response=[{id:bid,revision:1}];}}
  else {throw Error('Unexpected hosted request: '+req.method()+' '+path);}
  await route.fulfill({status,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(response)});
 });
 await page.goto('http://127.0.0.1:4173');await page.waitForSelector('.card.note');const localTitle=await page.locator('#board-title').textContent();
 await page.locator('#teams-open').click();await page.locator('#team-url').fill('https://evil.test');await page.locator('#team-key').fill('sb_secret_no');await page.locator('#team-connect').click();await page.waitForFunction(()=>document.querySelector('#team-error').textContent.length>0);
 await page.locator('#team-url').fill('https://example.supabase.co');await page.locator('#team-key').fill('sb_publishable_test');await page.locator('#team-connect').click();
 await page.locator('#team-email').fill(account.email);await page.locator('#team-send-code').click();await page.locator('#team-code').fill('123456');assert.ok(otpSent);await page.locator('#team-verify').click();
 await page.locator('#team-profile').fill('<Owner>');await page.locator('#team-save-profile').click();await page.locator('#team-new-name').fill('Design team');await page.locator('#team-create').click();await page.waitForSelector('#team-publish');
 await page.locator('#team-invite-email').fill('guest@example.com');await page.locator('#team-invite-role').selectOption('viewer');await page.locator('#team-invite').click();await page.waitForSelector('[data-revoke]');assert.equal(invited[0].role,'viewer');
 await page.locator('#team-publish').click();assert.equal(published.length,0,'confirmation precedes network upload');await page.locator('#team-confirm').click();await page.waitForSelector('[data-open-board]');assert.equal(published.length,1);assert.equal(published[0].board_package.format,'atelier-package');assert.equal(published[0].board_name,localTitle);
 await mkdir('artifacts',{recursive:true});await page.screenshot({path:'artifacts/atelier-teams.png'});
 conflict=true;await page.locator('[data-update-board]').click();await page.locator('#team-confirm').click();await page.waitForFunction(()=>document.querySelector('#team-error').textContent.includes('Board changed'));assert.equal(published.length,1);await page.locator('#team-back').click();
 await page.locator('[data-open-board]').click();await page.waitForFunction(()=>!document.querySelector('#modal').open);assert.equal(await page.locator('#board-title').textContent(),'From the team');assert.ok(await page.locator('#boards').textContent().then(t=>t.includes(localTitle)),'existing boards retained');
 role='viewer';await page.locator('#teams-open').click();await page.waitForSelector('[data-open-board]');assert.equal(await page.locator('#team-publish').count(),0);assert.equal(await page.locator('[data-update-board]').count(),0);assert.equal(await page.locator('#team-invite').count(),0);
 await page.locator('#team-signout').click();await page.waitForSelector('#team-email');assert.equal(await page.locator('#board-title').textContent(),'From the team');
 teams=[];invited=[{id:bid,team_id:tid,team_name:'Invited team',email:account.email,role:'viewer',expires_at:new Date(Date.now()+86400000).toISOString()}];
 await page.locator('#team-email').fill(account.email);await page.locator('#team-send-code').click();await page.locator('#team-code').fill('123456');await page.locator('#team-verify').click();
 await page.locator('[data-accept]').click();await page.waitForSelector('[data-open-board]');assert.equal(await page.locator('#team-select option').textContent(),'Invited team');assert.equal(await page.locator('#team-publish').count(),0);
 await page.locator('#team-signout').click();await page.waitForSelector('#team-email');await page.locator('#modal-close').click();await page.waitForTimeout(700);await page.reload();await page.waitForSelector('#board-title');assert.equal(await page.locator('#board-title').textContent(),'From the team');
 assert.deepEqual(errors,[]);console.log('PASS: connection, email code, team/profile/invite, explicit publication, conflict, local copies, viewer controls, sign-out, persistence. No page errors.');
}finally{await browser.close();}

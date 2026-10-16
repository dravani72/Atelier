import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {connection,sharedPackage} from '../ui/cloud-source.js';
import {board,card} from '../ui/model.js';

test('hosted connection rejects secret keys and non-hosted endpoints',()=>{
 assert.deepEqual(connection('https://example.supabase.co/','sb_publishable_test'),{url:'https://example.supabase.co',key:'sb_publishable_test'});
 for(const url of ['http://example.supabase.co','https://evil.test','https://example.supabase.co.evil.test','https://example.supabase.co/path'])assert.throws(()=>connection(url,'sb_publishable_test'));
 for(const key of ['sb_secret_private','wrong',`x.${btoa(JSON.stringify({role:'service_role'}))}.x`])assert.throws(()=>connection('https://example.supabase.co',key));
});
test('shared packages omit device-only files and enforce the hosted size limit',()=>{
 const b=board('Team board'),c=card('file');c.localAttachment='local';b.cards.push(c);const w={version:1,active:b.id,boards:[b]};
 const p=sharedPackage(w,b.id);assert.equal(p.omitted,1);assert.equal(p.package.boards[0].cards[0].localAttachment,undefined);assert.equal(c.localAttachment,'local');
 c.media='data:text/plain;base64,'+'YQ=='.repeat(3*1024*1024);assert.throws(()=>sharedPackage(w,b.id),/10 MB/);
});
test('real PostgreSQL team isolation, verified invitations, roles and optimistic publication',async()=>{
 const db=new PGlite();
 const ids={owner:'00000000-0000-4000-8000-000000000001',editor:'00000000-0000-4000-8000-000000000002',viewer:'00000000-0000-4000-8000-000000000003',outsider:'00000000-0000-4000-8000-000000000004',unverified:'00000000-0000-4000-8000-000000000005'};
 try{
  await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;`);
  for(const [name,id] of Object.entries(ids))await db.query('insert into auth.users values($1,$2,$3)',[id,name+'@example.com',name==='unverified'?null:new Date()]);
  await db.exec(await readFile(new URL('../supabase/migrations/202610160001_hosted_teams.sql',import.meta.url),'utf8'));
  const as=async name=>{await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[ids[name]||'']);await db.exec('set role '+(name==='anon'?'anon':'authenticated'));};
  const scalar=async(sql,args=[])=>Object.values((await db.query(sql,args)).rows[0])[0];
  const denied=async(sql,args=[])=>assert.rejects(db.query(sql,args));
  await as('anon');await denied("select public.atelier_create_team('Bad')");await denied('select * from public.atelier_boards');
  await as('unverified');await denied("select public.atelier_create_team('Bad')");
  await as('owner');const team=await scalar("select public.atelier_create_team('Studio')");
  await db.query('insert into public.atelier_profiles values($1,$2)',[ids.owner,'Studio owner']);
  const invite=async(name,role)=>scalar('select public.atelier_invite($1,$2,$3)',[team,name+'@example.com',role]);
  const editorInvite=await invite('editor','editor'),viewerInvite=await invite('viewer','viewer'),unverifiedInvite=await invite('unverified','viewer');
  const b=board('Shared');const pkg=sharedPackage({version:1,active:b.id,boards:[b]},b.id).package;
  const publish=(id=null,rev=null)=>db.query('select * from public.atelier_publish($1,$2,$3,$4,$5)',[team,'Shared',pkg,id,rev]);
  const published=(await publish()).rows[0];assert.equal(published.revision,1);
  await as('outsider');assert.equal(await scalar('select count(*)::int from public.atelier_boards'),0);assert.equal(await scalar('select count(*)::int from public.atelier_profiles'),0);
  await denied('select public.atelier_accept_invite($1)',[editorInvite]);await denied('select public.atelier_invite($1,$2,$3)',[team,'outsider@example.com','owner']);await assert.rejects(publish());
  await denied('insert into public.atelier_members values($1,$2,$3)',[team,ids.outsider,'owner']);
  await as('unverified');await denied('select public.atelier_accept_invite($1)',[unverifiedInvite]);
  await as('viewer');await scalar('select public.atelier_accept_invite($1)',[viewerInvite]);assert.equal(await scalar('select count(*)::int from public.atelier_boards'),1);assert.equal(await scalar('select count(*)::int from public.atelier_profiles'),1);
  await assert.rejects(publish());await denied('select public.atelier_delete_board($1)',[published.id]);await denied('select public.atelier_set_member($1,$2,$3)',[team,ids.viewer,'editor']);await denied('select public.atelier_accept_invite($1)',[viewerInvite]);
  await denied('update public.atelier_boards set revision=revision+1');
  await as('editor');await scalar('select public.atelier_accept_invite($1)',[editorInvite]);assert.equal((await publish(published.id,1)).rows[0].revision,2);await assert.rejects(publish(published.id,1),/changed/);
  await denied('select public.atelier_invite($1,$2,$3)',[team,'outsider@example.com','editor']);await denied('select public.atelier_delete_board($1)',[published.id]);
  await as('owner');await denied('select public.atelier_set_member($1,$2,$3)',[team,ids.owner,null]);await denied('select public.atelier_set_member($1,$2,$3)',[team,ids.viewer,'owner']);
  const old=await invite('outsider','editor'),replacement=await invite('outsider','viewer');assert.notEqual(old,replacement);
  await as('outsider');await denied('select public.atelier_accept_invite($1)',[old]);
  await db.exec('reset role');await db.query("update public.atelier_invites set expires_at=now()-interval '1 second' where id=$1",[replacement]);
  await as('outsider');await denied('select public.atelier_accept_invite($1)',[replacement]);
  await as('owner');const revoked=await invite('outsider','editor');await scalar('select public.atelier_revoke_invite($1)',[revoked]);
  await scalar('select public.atelier_set_member($1,$2,$3)',[team,ids.editor,'viewer']);
  await as('editor');await assert.rejects(publish());
  await as('owner');await scalar('select public.atelier_set_member($1,$2,$3)',[team,ids.editor,null]);
  await as('editor');assert.equal(await scalar('select count(*)::int from public.atelier_boards'),0);assert.equal(await scalar('select count(*)::int from public.atelier_members'),0);
  await as('outsider');await denied('select public.atelier_accept_invite($1)',[revoked]);
  const other=await scalar("select public.atelier_create_team('Other')");assert.notEqual(other,team);assert.equal(await scalar('select count(*)::int from public.atelier_teams'),1);
  await as('owner');await assert.rejects(db.query('select * from public.atelier_publish($1,$2,$3)',[team,'Bad',{}]));
  await scalar('select public.atelier_delete_board($1)',[published.id]);assert.equal(await scalar('select count(*)::int from public.atelier_boards'),0);
 }finally{await db.close();}
});

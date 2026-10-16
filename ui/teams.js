import * as cloud from './cloud.js';

export function createTeams({modal,toast,esc,workspace,current,importBoards}){
 const $=s=>document.querySelector(s);let selectedTeam=null;
 // Every mutation disables its button; stale async responses never replace a closed or newer dialog.
 let generation=0;
 $('#modal').addEventListener('close',()=>generation++);
 function screen(title,subtitle,body){generation++;return modal(title,subtitle,body+'<p id="team-error" role="alert"></p>');}
 function action(selector,fn){$(selector)?.addEventListener('click',async e=>{const button=e.currentTarget,version=generation;button.disabled=true;try{await fn();}catch(error){if(version===generation&&$('#modal').open)$('#team-error').textContent=error.message||String(error);else toast(error.message||String(error));}finally{button.disabled=false;}});}
 const field=(id,label,value='',type='text')=>`<div class="field"><label for="${id}">${label}</label><input id="${id}" type="${type}" value="${esc(value)}" required></div>`;
 const roleOptions=role=>['editor','viewer'].map(r=>`<option value="${r}" ${r===role?'selected':''}>${r==='editor'?'Editor':'Viewer'}</option>`).join('');
 async function refresh(){if($('#modal').open)return open();}
 async function open(){
  const version=++generation;
  if(!cloud.configured())return setup();
  const account=await cloud.user();if(version!==generation)return;if(!account)return login();
 const [teams,allInvites,profiles]=await Promise.all([cloud.teams(),cloud.invites(),cloud.profiles()]);if(version!==generation)return;
  selectedTeam=teams.find(t=>t.id===selectedTeam)?.id||teams[0]?.id;
  const team=teams.find(t=>t.id===selectedTeam),roster=team?await cloud.members(team.id):[],role=roster.find(m=>m.user_id===account.id)?.role;
  const shared=team?await cloud.boards(team.id):[];if(version!==generation)return;
  const name=profiles.find(p=>p.user_id===account.id)?.display_name||'';
  const invitations=allInvites.filter(i=>i.email===account.email?.toLowerCase()&&!teams.some(t=>t.id===i.team_id));
  screen('Your teams',account.email,`
   <div class="team-account">${field('team-profile','Your name',name)}<button class="button" id="team-save-profile">Save name</button><button class="button" id="team-signout">Sign out</button><button class="button" id="team-disconnect">Disconnect service</button></div>
   ${invitations.length?`<h3>Invitations</h3>${invitations.map(i=>`<div class="team-row"><span>${esc(i.team_name)} · ${esc(i.role)} · expires ${esc(new Date(i.expires_at).toLocaleDateString())}</span><button class="button" data-accept="${esc(i.id)}">Join team</button></div>`).join('')}`:''}
   <div class="field"><label for="team-select">Workspace</label><select id="team-select">${teams.map(t=>`<option value="${esc(t.id)}" ${t.id===selectedTeam?'selected':''}>${esc(t.name)}</option>`).join('')}</select></div>
   <div class="team-row">${field('team-new-name','New team name')}<button class="button" id="team-create">Create team</button></div>
   ${team?`<h3>${esc(team.name)} <small>· ${esc(role)}</small></h3><p class="inline-note">Everyone in this team can read its shared boards. Editors can publish versions; the owner manages access. Copies added to a device remain there after access is removed.</p>
   <h3>Shared boards</h3><p class="inline-note">Add a local copy to work on, then publish a new version. Changes are shared only when published.</p>
   ${shared.map(b=>`<div class="team-row"><span><strong>${esc(b.name)}</strong><small>Version ${b.revision}</small></span><button class="button" data-open-board="${esc(b.id)}">Add local copy</button>${role!=='viewer'?`<button class="button" data-update-board="${esc(b.id)}">Publish over this</button>`:''}${role==='owner'?`<button class="button danger" data-delete-board="${esc(b.id)}">Delete</button>`:''}</div>`).join('')||'<p>No shared boards yet.</p>'}
   ${role!=='viewer'?'<button class="button primary" id="team-publish">Share current board</button>':''}
   <h3>People</h3>${roster.map(m=>`<div class="team-row"><span>${esc(profiles.find(p=>p.user_id===m.user_id)?.display_name||m.user_id)}${m.user_id===account.id?' (you)':''}</span>${role==='owner'&&m.role!=='owner'?`<select aria-label="Member role" id="role-${esc(m.user_id)}">${roleOptions(m.role)}</select><button class="button" data-role="${esc(m.user_id)}">Save role</button><button class="button danger" data-remove="${esc(m.user_id)}">Remove</button>`:`<small>${esc(m.role)}</small>`}</div>`).join('')}
   ${role==='owner'?`${field('team-invite-email','Invite by email','','email')}<div class="team-row"><select id="team-invite-role" aria-label="Invitation role">${roleOptions('editor')}</select><button class="button" id="team-invite">Create invitation</button></div><p class="inline-note">Ask the person to sign in to this Atelier service using that email, then accept the invitation in Teams. Invitations expire after 7 days. No invitation email is sent.</p>${allInvites.filter(i=>i.team_id===team.id).map(i=>`<div class="team-row"><span>${esc(i.email)} · ${esc(i.role)}</span><button class="button" data-revoke="${esc(i.id)}">Revoke invitation</button></div>`).join('')}`:''}`:''}
  `);
  $('#team-select').onchange=e=>{selectedTeam=e.target.value;open().catch(e=>toast(e.message));};
  action('#team-save-profile',async()=>{const name=$('#team-profile').value.trim();if(!name||name.length>100)throw Error('Enter a name of 1–100 characters.');await cloud.saveProfile(account.id,name);await refresh();});
  action('#team-signout',async()=>{await cloud.signOut();await refresh();});
  action('#team-disconnect',async()=>{await cloud.disconnect();setup();});
  action('#team-create',async()=>{const name=$('#team-new-name').value.trim();if(!name||name.length>100)throw Error('Enter a team name of 1–100 characters.');selectedTeam=await cloud.rpc('create_team',{team_name:name});await refresh();});
  action('#team-invite',async()=>{const email=$('#team-invite-email').value.trim();if(!$('#team-invite-email').checkValidity()||!email)throw Error('Enter a valid email.');await cloud.rpc('invite',{team:team.id,invite_email:email,invite_role:$('#team-invite-role').value});await refresh();});
  const bindAll=(attr,fn)=>$('#modal').querySelectorAll(`[${attr}]`).forEach(el=>action(`[${attr}="${el.getAttribute(attr)}"]`,()=>fn(el.getAttribute(attr))));
  bindAll('data-accept',async id=>{selectedTeam=await cloud.rpc('accept_invite',{invitation:id});await refresh();});
  bindAll('data-revoke',async id=>{await cloud.rpc('revoke_invite',{invitation:id});await refresh();});
  bindAll('data-role',async id=>{await cloud.rpc('set_member',{team:team.id,member:id,member_role:$('#role-'+id).value});await refresh();});
  bindAll('data-remove',async id=>{confirm('Remove this member?','They will lose hosted access to all boards in this team. Local copies remain on their device.',async()=>{await cloud.rpc('set_member',{team:team.id,member:id,member_role:null});await refresh();});});
  bindAll('data-delete-board',id=>confirm('Delete this shared board?','This removes the hosted version for everyone in the team. Local copies remain.',async()=>{await cloud.rpc('delete_board',{board_id:id});await refresh();}));
  bindAll('data-open-board',async id=>{const version=generation,incoming=await cloud.board(id);if(version!==generation||!$('#modal').open)return;importBoards(incoming.boards);$('#modal').close();toast('Added a local copy. Publish explicitly to share further changes.');});
  action('#team-publish',()=>publish(team));
  bindAll('data-update-board',id=>publish(team,shared.find(b=>b.id===id)));
 }
 function confirm(title,description,fn){screen(title,description,'<div class="modal-footer"><button class="button" id="team-back">Back</button><button class="button primary" id="team-confirm">Confirm</button></div>');action('#team-back',open);action('#team-confirm',fn);}
 function publish(team,existing){
  const {package:pkg,omitted}=cloud.sharedPackage(workspace(),current().id);
  confirm(existing?'Publish a new version?':'Share this board?',`“${pkg.name}” and included boards (${pkg.boards.map(b=>b.name).join(', ')}), embedded files and annotations will be uploaded to ${team.name}.${omitted?` ${omitted} managed originals cannot be shared and will be omitted.`:''}${existing?` This replaces “${existing.name}” version ${existing.revision}.`:''}`,async()=>{
   await cloud.rpc('publish',{team:team.id,board_name:pkg.name,board_package:pkg,board_id:existing?.id||null,expected_revision:existing?.revision||null});await refresh();toast('Board version published.');
  });
 }
 function setup(){
  screen('Connect Atelier Teams','An administrator needs to set up the hosted project once.',`<p class="inline-note">Local boards work without an account. To enable teams, follow HOSTED_TEAMS.md in the repository, then connect the same hosted project on each device.</p>${field('team-url','Project URL','','url')}${field('team-key','Publishable key')}<div class="modal-footer"><button class="button primary" id="team-connect">Connect service</button></div>`);
  action('#team-connect',async()=>{cloud.connect($('#team-url').value,$('#team-key').value);await refresh();});
 }
 function login(){
  screen('Sign in or create an account','We’ll email a one-time code. No password needed.',`${field('team-email','Email address','','email')}<button class="button primary" id="team-send-code">Email a code</button><button class="button" id="team-change-service">Change service</button>`);
  action('#team-change-service',async()=>{await cloud.disconnect();setup();});
  action('#team-send-code',async()=>{
   const version=generation,email=$('#team-email').value.trim();if(!email||!$('#team-email').checkValidity())throw Error('Enter a valid email.');await cloud.sendCode(email);if(version!==generation||!$('#modal').open)return;
   screen('Check your email',`Enter the code sent to ${email}.`,`${field('team-code','One-time code')}<div class="modal-footer"><button class="button" id="team-login-back">Use another email</button><button class="button primary" id="team-verify">Sign in</button></div>`);
   action('#team-login-back',login);action('#team-verify',async()=>{await cloud.verifyCode(email,$('#team-code').value.trim());await refresh();});
  });
 }
 return ()=>open().catch(e=>{toast(e.message||String(e));});
}

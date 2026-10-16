import {createClient} from '@supabase/supabase-js';
import {pack,read} from './interchange.js';
export const MAX_SHARED_BYTES=10*1024*1024;
export function connection(url,key){
 url=String(url||'').trim().replace(/\/$/,'');key=String(key||'').trim();
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url))throw Error('Use your hosted Supabase project URL (https://project.supabase.co).');
 let valid=key.startsWith('sb_publishable_');
 if(!valid)try{valid=JSON.parse(atob(key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role==='anon';}catch{}
 if(!valid)throw Error('Use a publishable key, never a secret or service-role key.');
 return {url,key};
}
export function sharedPackage(workspace,id){
 const result=pack(workspace,id);
 read(result.package);
 if(new TextEncoder().encode(JSON.stringify(result.package)).length>MAX_SHARED_BYTES)throw Error('Shared boards are limited to 10 MB including embedded media.');
 return result;
}
let client;
export function configured(){return !!localStorage.getItem('atelier-cloud-connection');}
export function connect(url,key){const config=connection(url,key);localStorage.setItem('atelier-cloud-connection',JSON.stringify(config));client=undefined;}
export function service(){
 if(client)return client;
 const raw=localStorage.getItem('atelier-cloud-connection');if(!raw)throw Error('Connect the hosted service first.');
 const saved=JSON.parse(raw),{url,key}=connection(saved.url,saved.key);
 client=createClient(url,key,{auth:{storage:sessionStorage,persistSession:true,detectSessionInUrl:false,autoRefreshToken:true}});
 return client;
}
export async function result(request){const {data,error}=await request;if(error)throw Error(error.message);return data;}
export const rpc=(name,args)=>result(service().rpc('atelier_'+name,args));
export const user=async()=>{const {data,error}=await service().auth.getSession();if(error)throw error;return data.session?.user||null;};
export const sendCode=email=>result(service().auth.signInWithOtp({email,options:{shouldCreateUser:true}}));
export const verifyCode=(email,token)=>result(service().auth.verifyOtp({email,token,type:'email'}));
export async function signOut(){await result(service().auth.signOut({scope:'local'}));}
export async function disconnect(){if(configured())await signOut();localStorage.removeItem('atelier-cloud-connection');client=undefined;}
export const teams=()=>result(service().from('atelier_teams').select('id,name').order('created_at'));
export const invites=()=>result(service().from('atelier_invites').select('id,team_id,team_name,email,role,expires_at'));
export const members=team=>result(service().from('atelier_members').select('user_id,role').eq('team_id',team));
export const profiles=()=>result(service().from('atelier_profiles').select('user_id,display_name'));
export const saveProfile=(id,name)=>result(service().from('atelier_profiles').upsert({user_id:id,display_name:name.trim()}));
// Lists exclude payloads. A package is fetched only after the user chooses to add a local copy.
export const boards=team=>result(service().from('atelier_boards').select('id,name,revision,updated_at').eq('team_id',team).order('updated_at',{ascending:false}));
export async function board(id){const row=await result(service().from('atelier_boards').select('package').eq('id',id).single());return read(row.package);}

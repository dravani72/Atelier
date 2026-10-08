import {isNative} from './storage.js';
const invoke=(cmd,args={})=>window.__TAURI__.core.invoke(cmd,args);
let lifecycle=Promise.resolve();
const enqueue=fn=>{lifecycle=lifecycle.catch(()=>{}).then(fn);return lifecycle;};
export const importVideo=()=>invoke('import_video');
export function videoPlayer(host,c){
 let closed=false,timer,observer,opened=false,pause=false;
 host.innerHTML=`<div class="native-video-stage"></div><div class="video-controls"><button data-pause>Pause</button><button data-back aria-label="Previous frame">◀ Frame</button><button data-frame aria-label="Next frame">Frame ▶</button><input data-seek type="range" min="0" max="1" step="0.01" value="0" aria-label="Video time"><span data-clock>0:00 / 0:00</span><label>Speed <select data-speed><option>0.5</option><option selected>1</option><option>1.5</option><option>2</option></select></label><label>Volume <input data-volume type="range" min="0" max="100" value="100"></label></div><div class="video-info" role="status">Opening libmpv…</div>`;
 const q=s=>host.querySelector(s),stage=q('.native-video-stage'),status=q('.video-info');
 const cleanup=()=>{closed=true;clearTimeout(timer);observer?.disconnect();window.removeEventListener('resize',onResize);if(isNative())return enqueue(()=>invoke('video_close')).catch(()=>{});};
 if(!isNative()){status.textContent='libmpv playback is available in the standalone macOS app.';return cleanup;}
 const onResize=()=>{if(opened&&!closed)invoke('video_rect',{rect:rect()}).catch(()=>{});};window.addEventListener('resize',onResize);
 const rect=()=>{const r=stage.getBoundingClientRect();return [r.x,r.y,r.width,r.height];};
 const control=(command,value)=>invoke('video_control',{command,value}).catch(e=>{if(!closed)status.textContent=String(e);});
 q('[data-pause]').onclick=()=>control('pause',pause?0:1);q('[data-back]').onclick=()=>control('frame',-1);q('[data-frame]').onclick=()=>control('frame',1);q('[data-seek]').onchange=e=>control('seek',Number(e.target.value));q('[data-speed]').onchange=e=>control('speed',Number(e.target.value));q('[data-volume]').oninput=e=>control('volume',Number(e.target.value));
 const clock=s=>`${Math.floor((s||0)/60)}:${String(Math.floor((s||0)%60)).padStart(2,'0')}`;
 async function poll(){if(closed)return;try{const s=await invoke('video_status');if(closed)return;pause=!!s.pause;q('[data-pause]').textContent=pause?'Play':'Pause';q('[data-seek]').max=s.duration||1;if(document.activeElement!==q('[data-seek]'))q('[data-seek]').value=s.time||0;q('[data-clock]').textContent=clock(s.time)+' / '+clock(s.duration);status.textContent=s.error||`libmpv · ${s.width||'…'} × ${s.height||'…'} · ${s.codec||'Loading'} · ${s.hwdec||'Software decode'} · ${s.primaries||'Unspecified primaries'} / ${s.gamma||'Unspecified transfer'} / ${s.range||'Unspecified range'} · Display ICC ${s.icc?'applied':'unavailable'}`;}catch(e){if(!closed)status.textContent=String(e);}if(!closed)timer=setTimeout(poll,250);}
 enqueue(()=>closed?null:invoke('video_open',{id:c.localVideo||null,media:c.localVideo?null:c.media,rect:rect()})).then(()=>{if(closed)return;opened=true;observer=new ResizeObserver(()=>{if(opened&&!closed)invoke('video_rect',{rect:rect()}).catch(()=>{});});observer.observe(stage);poll();}).catch(e=>{if(!closed)status.textContent='Playback unavailable: '+String(e);});
 return cleanup;
}

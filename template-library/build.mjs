// Builds the template library: every template in templates/*.mjs becomes a board package the app's gallery can add.
//
//   node template-library/build.mjs               build ui/templates/library (compact, images stored once)
//   node template-library/build.mjs --standalone  also write self-contained .atelier.json packages to template-library/dist
//
// Compact packages keep `media` as "@image:<key>"; the gallery swaps in the picture from ui/templates/library/images
// when a template is chosen, so each picture ships once however many templates use it. Every package is checked with
// the same reader that checks an imported package (ui/interchange.js) before anything is written.
import {readdirSync,readFileSync,writeFileSync,mkdirSync,existsSync,copyFileSync,rmSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {build,wanted} from './lib/dsl.mjs';
import {registry,FONTS} from './lib/assets.mjs';
import {read} from '../ui/interchange.js';

const here=dirname(fileURLToPath(import.meta.url)),repo=join(here,'..');
// Pictures live in one place, the folder the app serves: generated ones are rendered there, photos are fetched there.
const out=join(repo,'ui/templates/library'),imgOut=join(out,'images'),genDir=imgOut,photoDir=imgOut;
const standalone=process.argv.includes('--standalone');
const photos=JSON.parse(readFileSync(join(here,'images/photos.json'),'utf8'));

// ── Load templates ────────────────────────────────────────────────────────────
const files=readdirSync(join(here,'templates')).filter(f=>f.endsWith('.mjs')).sort();
const templates=[];
for(const f of files){const mod=await import(pathToFileURL(join(here,'templates',f)));for(const t of mod.default)templates.push({...t,source:f});}
const ids=new Set();for(const t of templates){if(ids.has(t.id))throw Error('Duplicate template id '+t.id);ids.add(t.id);if(!/^[a-z0-9-]{2,60}$/.test(t.id))throw Error('Bad id '+t.id);}

// ── Image registry: photos (manifest) plus generated pictures (registered while templates load) ──────────────────
// Photos templates ask for are added to the manifest with their description, ready for tools/fetch-photos.py.
let grew=false;for(const [key,w] of wanted)if(!photos[key]){photos[key]={title:'',want:w.want,ratio:w.ratio||0.75};grew=true;}
if(grew)writeFileSync(join(here,'images/photos.json'),JSON.stringify(Object.fromEntries(Object.entries(photos).sort()),null,1)+'\n');
const images={};
for(const [key,p] of Object.entries(photos)){
 const has=p.file&&existsSync(join(photoDir,p.file));
 images[key]={...p,key,title:p.title||p.want,kind:has?'photo':'placeholder',file:has?p.file:`${key}.jpg`,width:has?p.width:1000,height:has?p.height:Math.round(1000*(p.ratio||0.75))};
}
for(const [key,g] of registry)images[key]={key,kind:g.kind,title:g.title,file:`${key}.${g.format}`,width:g.width,height:g.height,html:g.html};

// Renders generated pictures (and stand-ins for photos not yet sourced) that are missing from disk.
async function render(list){
 if(!list.length)return;
 const {chromium}=await import('playwright');
 const exe=['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync);
 const browser=await chromium.launch({headless:true,...(exe?{executablePath:exe}:{}),args:['--no-sandbox']});
 const page=await browser.newPage({deviceScaleFactor:1});
 const fonts=join(here,'.fonts');if(!existsSync(join(fonts,'caveat-latin-400-normal.woff2')))throw Error('Run node template-library/tools/fetch-fonts.mjs first.');
 const faces=readdirSync(fonts).filter(f=>f.endsWith('.woff2')).map(f=>{const m=f.match(/^(.*)-latin-(\d+)-(normal|italic)\.woff2$/);if(!m)return '';const fam=Object.entries(FONTS).find(([,v])=>v.pkg===m[1]);return fam?`@font-face{font-family:${fam[1].css};src:url(${f});font-weight:${m[2]};font-style:${m[3]}}`:'';}).join('\n');
 writeFileSync(join(fonts,'faces.css'),faces);
 for(const g of list){
  const html=g.html.replace('<style>','<link rel="stylesheet" href="faces.css"><style>');
  writeFileSync(join(fonts,'page.html'),html);
  await page.setViewportSize({width:g.width,height:g.height});
  await page.goto(pathToFileURL(join(fonts,'page.html')).href);await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:join(genDir,g.file),type:g.file.endsWith('.jpg')?'jpeg':'png',...(g.file.endsWith('.jpg')?{quality:80}:{})});
  console.log('rendered',g.file);
 }
 await browser.close();
}
const placeholderHtml=(p)=>`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:${p.width}px;height:${p.height}px}body{background:linear-gradient(135deg,#d6d3d1,#a8a29e);font:500 34px Inter;color:#292524;display:flex;align-items:center;justify-content:center;text-align:center}div{max-width:70%;line-height:1.35}small{display:block;font-size:22px;opacity:.6;margin-top:14px}</style></head><body><div>${String(p.want||p.title).replace(/[<&]/g,'')}<small>Photo to source · ${p.key}</small></div></body></html>`;

// ── Build every template ──────────────────────────────────────────────────────
const built=[];
for(const t of templates){
 const {boards,used}=build(t,images);
 // Check with the importer's own rules, with a tiny stand-in for each picture.
 const probe=JSON.parse(JSON.stringify(boards));const dot='data:image/png;base64,iVBORw0KGgo=';
 for(const b of probe)for(const c of b.cards)if(c.media.startsWith('@image:'))c.media=dot;
 try{read({format:'atelier-package',version:1,boards:probe});}catch(e){throw Error(`${t.id}: ${e.message}`);}
 built.push({t,boards,used});
}
mkdirSync(genDir,{recursive:true});mkdirSync(photoDir,{recursive:true});
const allUsed=new Set(built.flatMap(b=>[...b.used]));
const missing=[...allUsed].map(k=>images[k]).filter(i=>i.kind!=='photo'&&!existsSync(join(genDir,i.file)));
for(const m of missing)if(m.kind==='placeholder')m.html=placeholderHtml(m);
await render(missing);
// Drop generated pictures no template uses any more (an edited drawing gets a new name).
const keep=new Set([...allUsed].map(k=>images[k].file));for(const f of readdirSync(imgOut))if(!keep.has(f)){rmSync(join(imgOut,f));console.log('removed stale',f);}

// ── Write the compact library ─────────────────────────────────────────────────
for(const f of readdirSync(out))if(f.endsWith('.json')||f==='catalog.js')rmSync(join(out,f));
const srcOf=i=>join(imgOut,i.file);
const catalog=[];
for(const {t,boards,used} of built){
 const pkg={format:'atelier-package',version:1,name:t.title,generator:'Atelier template library',boards};
 writeFileSync(join(out,`${t.id}.json`),JSON.stringify(pkg));
 const cards=boards.reduce((n,b)=>n+b.cards.length,0),tls=boards.flatMap(b=>b.cards.filter(c=>c.timeline).map(c=>c.timeline.mode));
 catalog.push({id:t.id,title:t.title,category:t.category,also:t.also||[],description:t.description,tags:t.tags||[],
  images:Object.fromEntries([...used].map(k=>[k,images[k].file])),thumb:existsSync(join(out,'thumbs',`${t.id}.jpg`))?`thumbs/${t.id}.jpg`:null,
  boards:boards.length,cards,timelines:[...new Set(tls)],placeholders:[...used].filter(k=>images[k].kind==='placeholder').length});
}
// Previews of templates that no longer exist.
if(existsSync(join(out,'thumbs')))for(const f of readdirSync(join(out,'thumbs')))if(!ids.has(f.replace(/\.jpg$/,'')))rmSync(join(out,'thumbs',f));
const order=JSON.parse(readFileSync(join(here,'categories.json'),'utf8'));
catalog.sort((a,b)=>order.indexOf(a.category)-order.indexOf(b.category)||a.title.localeCompare(b.title));
for(const c of catalog)if(!order.includes(c.category))throw Error(`${c.id}: category "${c.category}" is not in categories.json`);
writeFileSync(join(out,'catalog.js'),`// Generated by template-library/build.mjs. Do not edit.\nexport const categories=${JSON.stringify(order.filter(c=>catalog.some(t=>t.category===c||t.also.includes(c))))};\nexport const library=${JSON.stringify(catalog,null,0).replace(/\},\{/g,'},\n{')};\n`);

// Credits for every picture that ships.
const credits=[...allUsed].map(k=>images[k]).filter(i=>i.kind==='photo').sort((a,b)=>a.key.localeCompare(b.key));
writeFileSync(join(here,'CREDITS.md'),`# Image credits\n\nPhotographs in the template library, with their authors, licences and sources. Generated by \`build.mjs\`.\nEvery other picture (swatches, type specimens, sketches, wireframes, charts) is drawn by \`lib/assets.mjs\` and carries no third-party rights; type specimens use fonts under the SIL Open Font License, Apache 2.0 or the GUST Font License.\n\n| Image | Title | Author | Licence | Source |\n|---|---|---|---|---|\n${credits.map(i=>`| \`${i.file}\` | ${i.title} | ${i.author||''} | ${i.license_url?`[${i.license}](${i.license_url})`:i.license||''} | ${i.source?`[link](${i.source})`:''} |`).join('\n')}\n`);

if(standalone){
 const dist=join(here,'dist');mkdirSync(dist,{recursive:true});
 for(const {t,boards} of built){
  const copy=JSON.parse(JSON.stringify(boards));
  for(const b of copy)for(const c of b.cards)if(c.media.startsWith('@image:')){const i=images[c.media.slice(7)];c.media=`data:image/${i.file.endsWith('.png')?'png':'jpeg'};base64,${readFileSync(srcOf(i)).toString('base64')}`;}
  const pkg={format:'atelier-package',version:1,name:t.title,exported:new Date().toISOString(),generator:'Atelier template library',boards:copy};
  read(pkg);writeFileSync(join(dist,`${t.id}.atelier.json`),JSON.stringify(pkg));
 }
 console.log('standalone packages in',dist);
}
const ph=[...allUsed].filter(k=>images[k].kind==='placeholder').length;
console.log(`${catalog.length} templates · ${allUsed.size} pictures · ${credits.length} photographs${ph?` · ${ph} photo slots still to source`:''}`);

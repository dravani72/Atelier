// Fetches the OFL fonts the asset renderer uses from npm (@fontsource packages) into template-library/.fonts.
// Only needed to re-render generated pictures; the rendered PNGs are committed. Run: node template-library/tools/fetch-fonts.mjs
import {execFileSync} from 'node:child_process';
import {mkdirSync,readdirSync,renameSync,rmSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {FONTS} from '../lib/assets.mjs';
const root=join(dirname(fileURLToPath(import.meta.url)),'..'),out=join(root,'.fonts'),tmp=join(out,'tmp');
mkdirSync(tmp,{recursive:true});
for(const pkg of new Set(Object.values(FONTS).map(f=>f.pkg).filter(Boolean))){
 if(readdirSync(out).some(f=>f.startsWith(pkg+'-latin-')))continue;
 const tgz=execFileSync('npm',['pack',`@fontsource/${pkg}`,'--silent'],{cwd:tmp}).toString().trim().split('\n').pop();
 execFileSync('tar',['-xzf',tgz,'--wildcards','--no-anchored',`${pkg}-latin-[0-9]*.woff2`],{cwd:tmp});
 for(const f of readdirSync(join(tmp,'package/files')))renameSync(join(tmp,'package/files',f),join(out,f));
 rmSync(join(tmp,'package'),{recursive:true});rmSync(join(tmp,tgz));
 console.log('fetched',pkg);
}
rmSync(tmp,{recursive:true,force:true});
if(!existsSync(join(out,'caveat-latin-400-normal.woff2')))throw Error('Caveat missing');

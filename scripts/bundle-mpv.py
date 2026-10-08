#!/usr/bin/env python3
"""Relocate the actual linked Homebrew dylib closure, with source/license records."""
import json, pathlib, shutil, subprocess, sys, urllib.request, hashlib, zipfile
app=pathlib.Path(sys.argv[1]); frameworks=app/'Contents/Frameworks'; frameworks.mkdir(exist_ok=True)
binary=app/'Contents/MacOS/atelier'; pending=[binary]; visited=set(); formulas=set()
def command(*args): return subprocess.check_output(args,text=True).strip()
def deps(path): return [line.strip().split(' (',1)[0] for line in command('otool','-L',str(path)).splitlines()[1:]]
while pending:
 target=pending.pop()
 if target in visited: continue
 visited.add(target)
 for dep in deps(target):
  if dep.startswith(('/System/','/usr/lib/')): continue
  if dep.startswith('@'): continue
  source=pathlib.Path(dep)
  if not source.is_file(): raise RuntimeError('Missing dylib '+dep)
  real=source.resolve()
  parts=real.parts
  if 'Cellar' in parts: formulas.add(parts[parts.index('Cellar')+1])
  destination=frameworks/source.name
  if not destination.exists(): shutil.copy2(real,destination);destination.chmod(0o755);pending.append(destination)
  replacement=('@executable_path/../Frameworks/' if target==binary else '@loader_path/')+source.name
  subprocess.check_call(['install_name_tool','-change',dep,replacement,str(target)])
 if target!=binary: subprocess.check_call(['install_name_tool','-id','@rpath/'+target.name,str(target)])
records=json.loads(command('brew','info','--json=v2','--formula',*sorted(formulas)))['formulae']
source_dir=pathlib.Path('dist/apple-silicon/media-sources');source_dir.mkdir(parents=True,exist_ok=True)
licenses=app/'Contents/Resources/MediaLicenses';licenses.mkdir(parents=True,exist_ok=True)
(source_dir/'formulas.json').write_text(json.dumps(records,indent=2))
(licenses/'formulas.json').write_text(json.dumps(records,indent=2))
for record in records:
 name=record['name'];installed=record['installed'];stable=record['versions']['stable']
 if not any(x['version']==stable or x['version'].startswith(stable+'_') for x in installed): raise RuntimeError('Source version mismatch for '+name)
 prefix=pathlib.Path(command('brew','--prefix',name)).resolve()
 recipe=prefix/'.brew'/f'{name}.rb'
 if recipe.exists(): shutil.copy2(recipe,source_dir/f'{name}.rb')
 notice_dir=licenses/name;notice_dir.mkdir(exist_ok=True)
 for f in prefix.rglob('*'):
  if f.is_file() and (f.name.lower().startswith(('copying','license','copyright'))): shutil.copy2(f,notice_dir/f.name)
 url=record['urls']['stable']['url'];expected=record['urls']['stable'].get('checksum')
 if not url or not expected: raise RuntimeError('No checksummed source archive for '+name)
 filename=name+'-'+stable+'-'+url.split('/')[-1].split('?')[0]
 archive=source_dir/filename
 subprocess.check_call(['curl','--fail','--location','--retry','3',url,'-o',str(archive)])
 if hashlib.sha256(archive.read_bytes()).hexdigest()!=expected: raise RuntimeError('Source checksum mismatch for '+name)
# Exact formula recipes retain configuration and dependency build instructions.
shutil.copy2('scripts/bundle-mpv.py',source_dir/'bundle-mpv.py')
(licenses/'README.txt').write_text('This combined application includes GPL/LGPL media libraries. Atelier source is MIT; the combined binary is distributed under GPL-3.0-or-later. Corresponding media sources, exact Homebrew recipes, checksums and build records accompany this installer in Atelier_0.3.0_MediaSources.zip. Application source: https://github.com/dravani72/Atelier . Build instructions: README.md and scripts/build-macos.sh. No dependency is downloaded at runtime.\n')
shutil.copy2('COPYING-GPL-3.0',licenses/'COPYING-GPL-3.0')
shutil.make_archive('dist/apple-silicon/Atelier_0.3.0_MediaSources','zip',source_dir)
shutil.rmtree(source_dir)
for target in visited:
 if target!=binary: subprocess.check_call(['codesign','--force','--sign','-',str(target)])
subprocess.check_call(['codesign','--force','--deep','--sign','-',str(app)])

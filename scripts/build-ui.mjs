import {build} from 'esbuild';
await build({entryPoints:['ui/viewer-source.js'],bundle:true,format:'esm',outfile:'ui/viewer.js',minify:true,target:['safari16'],legalComments:'eof'});

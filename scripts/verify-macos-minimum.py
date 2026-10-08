#!/usr/bin/env python3
"""Reject bundled Mach-O files that require a newer OS than the app declares."""
import pathlib,re,subprocess,sys
app=pathlib.Path(sys.argv[1]);minimum=tuple(map(int,sys.argv[2].split('.')))
def version(value):return tuple(map(int,value.split('.')))+ (0,)*(3-len(value.split('.')))
for file in [app/'Contents/MacOS/atelier',*(app/'Contents/Frameworks').glob('*.dylib')]:
    output=subprocess.check_output(['otool','-l',str(file)],text=True)
    values=re.findall(r'\bminos\s+([\d.]+)',output)+re.findall(r'cmd LC_VERSION_MIN_MACOSX\s+cmdsize \d+\s+version ([\d.]+)',output)
    if not values:raise SystemExit('No macOS minimum-version load command: '+str(file))
    for value in values:
        if version(value)>version(sys.argv[2]):raise SystemExit(f'{file.name} requires macOS {value}, above declared {sys.argv[2]}')
print('All bundled Mach-O deployment targets fit the declared macOS minimum.')

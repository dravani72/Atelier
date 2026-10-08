"""Rebuild Atelier's monochrome icon from its bundled, OFL-licensed Geist font.
Requires Pillow and fontTools. No network or system font dependency.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen

root = Path(__file__).resolve().parents[1]
target = root / 'src-tauri/icons'
font = TTFont(root / 'ui/fonts/Geist-Variable.woff2')
font = instantiateVariableFont(font, {'wght': 650}, inplace=True)
font.flavor = None
glyphs = font.getGlyphSet()
glyph_name = font.getBestCmap()[ord('A')]
pen = SVGPathPen(glyphs)
glyphs[glyph_name].draw(pen)
units = font['head'].unitsPerEm
scale = 600 / units
advance = font['hmtx'][glyph_name][0] * scale
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
<rect x="64" y="64" width="896" height="896" rx="200" fill="#18181b"/>
<path d="{pen.getCommands()}" transform="translate({(1024-advance)/2} 735) scale({scale} {-scale})" fill="#fafafa"/>
</svg>'''
(target / 'icon.svg').write_text(svg)
(root / 'ui/app-icon.svg').write_text(svg)
with TemporaryDirectory() as temporary:
    ttf = Path(temporary) / 'Geist.ttf'
    font.save(ttf)
    # Supersampling keeps the small Dock/taskbar variants crisp.
    image = Image.new('RGBA', (4096, 4096), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((256, 256, 3840, 3840), radius=800, fill='#18181b')
    face = ImageFont.truetype(str(ttf), 2400)
    draw.text((2048, 2940), 'A', font=face, anchor='ms', fill='#fafafa')
    image = image.resize((1024, 1024), Image.Resampling.LANCZOS)
    image.save(target / 'icon.png')
    for name, size in [('32x32.png',32),('128x128.png',128),('128x128@2x.png',256)]:
        image.resize((size,size), Image.Resampling.LANCZOS).save(target/name)
    image.save(target/'icon.icns', sizes=[(16,16),(32,32),(64,64),(128,128),(256,256),(512,512),(1024,1024)])
    image.save(target/'icon.ico', sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)])
print('Generated monochrome Geist A icon, PNG/ICNS/ICO and vector sources.')

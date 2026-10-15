#!/usr/bin/env python3
"""Fill the template library's photo slots with openly licensed photographs from Wikimedia Commons.

Every slot in template-library/images/photos.json has a `want` (what the picture should show). For each slot without a
file, this searches Commons, keeps only freely licensed bitmaps (CC0, public domain, CC BY, CC BY-SA), prefers
Commons "Quality images", downloads a 1200 px rendition, resizes it to 960 px wide, strips metadata, saves it as
ui/templates/library/images/<key>.jpg and records title, author, licence and source in the manifest. The build then
writes template-library/CREDITS.md from those records, and the gallery credits every picture.

    python3 template-library/tools/fetch-photos.py              # fill empty slots
    python3 template-library/tools/fetch-photos.py ph-gd-poster-wall --refresh   # re-pick one slot
    python3 template-library/tools/fetch-photos.py --sheet      # contact sheet of everything, for review

Needs network access to commons.wikimedia.org and upload.wikimedia.org, and Pillow.
"""
import html, io, json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / 'template-library/images/photos.json'
OUT = ROOT / 'ui/templates/library/images'
API = 'https://commons.wikimedia.org/w/api.php'
UA = 'AtelierTemplateLibrary/1.0 (https://github.com/dravani72/Atelier; template example images)'
WIDTH, QUALITY = 960, 76
# Licences a template may ship with. Anything else (fair use, NC, ND, unknown) is skipped.
FREE = re.compile(r'^(cc0|cc-zero|public domain|pd\b|pd-|no restrictions|cc by(-sa)? ?\d(\.\d)?|cc-by(-sa)?-\d(\.\d)?)', re.I)
STOP = set('a an the of in on at with and or for to by from into over under its their his her very close up close-up'.split())


def get(params):
    q = urllib.parse.urlencode({**params, 'format': 'json', 'formatversion': 2})
    req = urllib.request.Request(f'{API}?{q}', headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def text(value):
    """extmetadata values are HTML; keep the readable text."""
    value = re.sub(r'<[^>]+>', ' ', value or '')
    return re.sub(r'\s+', ' ', html.unescape(value)).strip()


def queries(want):
    words = [w for w in re.findall(r"[A-Za-z][A-Za-z'-]+", want) if w.lower() not in STOP]
    seen, out = set(), []
    for q in (want, ' '.join(words[:6]), ' '.join(words[:4]), ' '.join(words[:2])):
        if q and q not in seen:
            seen.add(q); out.append(q)
    return out


def candidates(query, quality):
    search = f'{query} filetype:bitmap' + (' incategory:Quality_images' if quality else '')
    data = get({'action': 'query', 'generator': 'search', 'gsrsearch': search, 'gsrnamespace': 6, 'gsrlimit': 20,
                'prop': 'imageinfo', 'iiprop': 'url|size|mime|extmetadata', 'iiurlwidth': 1200})
    pages = sorted(data.get('query', {}).get('pages', []), key=lambda p: p.get('index', 0))
    for page in pages:
        info = (page.get('imageinfo') or [{}])[0]
        meta = info.get('extmetadata', {})
        licence = text(meta.get('LicenseShortName', {}).get('value'))
        if info.get('mime') not in ('image/jpeg', 'image/png') or info.get('width', 0) < 900:
            continue
        if not FREE.match(licence) or meta.get('NonFree', {}).get('value') == 'true':
            continue
        yield {
            'commons': page['title'],
            'url': info.get('thumburl') or info['url'],
            'width': info['width'], 'height': info['height'],
            'title': text(meta.get('ObjectName', {}).get('value')) or page['title'].removeprefix('File:').rsplit('.', 1)[0],
            'author': text(meta.get('Artist', {}).get('value'))[:160] or 'Unknown',
            'license': licence,
            'license_url': text(meta.get('LicenseUrl', {}).get('value')),
            'source': info.get('descriptionurl', ''),
        }


def choose(slot, used):
    """Best free candidate: quality images first, then any; closest to the wanted shape; never reuse a file."""
    ratio = slot.get('ratio') or 0.75
    for quality in (True, False):
        for q in queries(slot['want']):
            found = [c for c in candidates(q, quality) if c['commons'] not in used]
            if found:
                found.sort(key=lambda c: abs(c['height'] / c['width'] - ratio))
                return found[0]
            time.sleep(0.3)
    return None


def save(c, key):
    from PIL import Image
    req = urllib.request.Request(c['url'], headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        img = Image.open(io.BytesIO(r.read())).convert('RGB')
    if img.width > WIDTH:
        img = img.resize((WIDTH, round(img.height * WIDTH / img.width)), Image.LANCZOS)
    path = OUT / f'{key}.jpg'
    img.save(path, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
    return path.name, img.width, img.height


def sheet(manifest):
    from PIL import Image, ImageDraw
    done = [(k, v) for k, v in sorted(manifest.items()) if v.get('file') and (OUT / v['file']).exists()]
    cols, cell = 8, 240
    rows = (len(done) + cols - 1) // cols
    canvas = Image.new('RGB', (cols * cell, rows * (cell + 40)), 'white')
    draw = ImageDraw.Draw(canvas)
    for i, (k, v) in enumerate(done):
        im = Image.open(OUT / v['file']); im.thumbnail((cell - 8, cell - 8))
        x, y = (i % cols) * cell, (i // cols) * (cell + 40)
        canvas.paste(im, (x + 4, y + 4)); draw.text((x + 4, y + cell), k[3:40], fill='black')
    path = ROOT / 'template-library/dist/contact-sheet.jpg'; path.parent.mkdir(exist_ok=True)
    canvas.save(path, quality=80); print('contact sheet:', path)


def main(argv):
    manifest = json.loads(MANIFEST.read_text())
    if '--sheet' in argv:
        return sheet(manifest)
    refresh = '--refresh' in argv
    only = [a for a in argv if not a.startswith('--')]
    used = {v.get('commons') for v in manifest.values() if v.get('commons')}
    OUT.mkdir(parents=True, exist_ok=True)
    todo = [k for k in sorted(manifest) if (not only or k in only) and (refresh or not manifest[k].get('file'))]
    print(f'{len(todo)} photo slots to fill')
    for n, key in enumerate(todo, 1):
        slot = manifest[key]
        try:
            c = choose(slot, used - {slot.get('commons')})
            if not c:
                print(f'[{n}/{len(todo)}] {key}: nothing free found for “{slot["want"]}”'); continue
            file, w, h = save(c, key)
            slot.update(file=file, width=w, height=h, title=c['title'], author=c['author'], license=c['license'],
                        license_url=c['license_url'], source=c['source'], commons=c['commons'])
            used.add(c['commons'])
            MANIFEST.write_text(json.dumps(manifest, indent=1, ensure_ascii=False, sort_keys=True) + '\n')
            print(f'[{n}/{len(todo)}] {key}: {c["commons"]} ({c["license"]})')
        except Exception as e:  # keep going; a rerun picks up whatever failed
            print(f'[{n}/{len(todo)}] {key}: {e}')
        time.sleep(0.5)


if __name__ == '__main__':
    main(sys.argv[1:])

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
    python3 template-library/tools/fetch-photos.py --candidates ph-a ph-b   # 8 options per slot, numbered, for review
    python3 template-library/tools/fetch-photos.py --pick ph-a=3 ph-b=0     # use option N from the last --candidates

Needs network access to commons.wikimedia.org and upload.wikimedia.org, and Pillow.
"""
import html, io, json, os, re, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / 'template-library/images/photos.json'
OUT = ROOT / 'ui/templates/library/images'
API = 'https://commons.wikimedia.org/w/api.php'
UA = 'AtelierTemplateLibrary/1.0 (https://github.com/dravani72/Atelier; template example images)'
WIDTH, QUALITY = 720, 70  # cards show photos at most ~560 px wide
# Licences a template may ship with. Anything else (fair use, NC, ND, unknown) is skipped.
FREE = re.compile(r'^(cc0|cc-zero|public domain|pd\b|pd-|no restrictions|cc by(-sa)? ?\d(\.\d)?|cc-by(-sa)?-\d(\.\d)?)', re.I)
STOP = set('a an the of in on at with and or for to by from into over under its their his her very close up close-up'.split())


VERBOSE = '-v' in sys.argv
PACE = float(os.environ.get('PACE', 10))   # seconds between requests; Wikimedia rate-limits shared addresses, so go slowly and honour Retry-After
_last = [0.0]


def fetch(url, timeout=30):
    for attempt in range(8):
        wait = _last[0] + PACE - time.time()
        if wait > 0:
            time.sleep(wait)
        _last[0] = time.time()
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=timeout) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code not in (429, 500, 502, 503, 504):
                raise
            delay = float(e.headers.get('Retry-After') or 10) + 2 + attempt * 3
            if VERBOSE: print(f'  {e.code} from {url.split("/")[2]}, waiting {delay:.0f}s', flush=True)
            time.sleep(delay)
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:  # dropped connections and proxy hiccups
            if VERBOSE: print(f'  {e} from {url.split("/")[2]}, retrying', flush=True)
            time.sleep(3 + attempt * 3)
    raise RuntimeError(f'gave up after repeated rate limiting: {url[:80]}')


def get(params):
    q = urllib.parse.urlencode({**params, 'format': 'json', 'formatversion': 2})
    return json.loads(fetch(f'{API}?{q}'))


def text(value):
    """extmetadata values are HTML; keep the readable text."""
    value = re.sub(r'<[^>]+>', ' ', value or '')
    return re.sub(r'\s+', ' ', html.unescape(value)).strip()


def queries(slot):
    """Search plan: the slot's hand-written terms (`q`) with its first word required in the file title, then the terms
    loosely, then fewer of them, then words from the description."""
    q = slot.get('q', '').strip()
    words = [w for w in re.findall(r"[A-Za-z][A-Za-z'-]+", slot['want']) if w.lower() not in STOP]
    first, _, rest = q.partition(' ')
    plan = [f'intitle:{first} {rest}'.strip() if first and 'intitle:' not in q else '', q, ' '.join(q.split()[:2]), ' '.join(words[:3])]
    seen, out = set(), []
    for item in plan:
        if item and item not in seen:
            seen.add(item); out.append(item)
    return out


# Words in a file title that usually mean it is not the photograph a template wants (unless the search asks for them).
NOT_PHOTO = ('map', 'diagram', 'logo', 'coat of arms', 'flag of', 'chart', 'plan', 'scan', 'document', 'poster', 'screenshot',
             'svg', 'engraving', 'etching', 'lithograph', 'drawing', 'illustration', 'painting', 'sketch', 'print', 'cartoon',
             'plate', 'page', 'book', 'stamp', 'ticket', 'label', 'nocturne', 'watercolor', 'watercolour')
QI = ('Category:Quality images', 'Category:Featured pictures on Wikimedia Commons', 'Category:Valued images')


EVIDENCE = re.compile(r'^File:(EFTA\d|USVI IMG)', re.I)  # released case-file photographs: public domain, but not example material


def unwanted(title, query):
    q = query.lower()
    return bool(EVIDENCE.match(title)) or any(re.search(rf'\b{re.escape(w)}', title, re.I) and w not in q for w in NOT_PHOTO)


def candidates(query):
    """One request: up to 30 search hits with licence metadata and whether each is a Quality/Featured image."""
    data = get({'action': 'query', 'generator': 'search', 'gsrsearch': f'{query} filetype:bitmap', 'gsrnamespace': 6,
                'gsrlimit': 30, 'prop': 'imageinfo|categories', 'iiprop': 'url|size|mime|extmetadata', 'iiurlwidth': 960,
                'clcategories': '|'.join(QI), 'cllimit': 'max'})
    pages = sorted(data.get('query', {}).get('pages', []), key=lambda p: p.get('index', 0))
    for rank, page in enumerate(pages):
        info = (page.get('imageinfo') or [{}])[0]
        meta = info.get('extmetadata', {})
        licence = text(meta.get('LicenseShortName', {}).get('value'))
        drawn = any(w in query.lower() for w in ('illustration', 'drawing', 'painting', 'map', 'print', 'nocturne', 'sketch', 'watercolor', 'plate'))
        if info.get('mime') not in (('image/jpeg', 'image/png') if drawn else ('image/jpeg',)) or info.get('width', 0) < 900 or info.get('height', 0) < 500:
            continue
        if not FREE.match(licence) or meta.get('NonFree', {}).get('value') == 'true':
            continue
        yield {
            'rank': rank, 'quality': bool(page.get('categories')), 'avoid': unwanted(page['title'], query),
            'titled': any(w.lower() in page['title'].lower() for w in re.findall(r'[A-Za-z]{4,}', query.replace('intitle:', ''))),
            'commons': page['title'],
            # Thumbnails are served from upload.wikimedia.org too; use it (thumb.wikimedia.org may be unreachable).
            'url': re.sub(r'^https://thumb\.wikimedia\.org/', 'https://upload.wikimedia.org/', (info.get('thumburl') or info['url']).split('?')[0]),
            'width': info['width'], 'height': info['height'],
            'title': text(meta.get('ObjectName', {}).get('value')) or page['title'].removeprefix('File:').rsplit('.', 1)[0],
            'author': text(meta.get('Artist', {}).get('value'))[:160] or 'Unknown',
            'license': licence,
            'license_url': text(meta.get('LicenseUrl', {}).get('value')),
            'source': info.get('descriptionurl', ''),
        }


def choose(slot, used):
    """Search rank first; Quality/Featured images get a head start; shape close to the slot; never reuse a file."""
    ratio = slot.get('ratio') or 0.75
    for q in queries(slot):
        found = [c for c in candidates(q) if c['commons'] not in used and not c['avoid']]
        if found:
            score = lambda c: c['rank'] - (6 if c['quality'] else 0) - (5 if c['titled'] else 0) + 4 * abs(c['height'] / c['width'] - ratio)
            return min(found, key=score)
    return None


def save(c, key):
    from PIL import Image
    img = Image.open(io.BytesIO(fetch(c['url'], timeout=60))).convert('RGB')
    if img.width > WIDTH:
        img = img.resize((WIDTH, round(img.height * WIDTH / img.width)), Image.LANCZOS)
    path = OUT / f'{key}.jpg'
    img.save(path, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
    return path.name, img.width, img.height


CANDIDATES = ROOT / 'template-library/dist' / os.environ.get('CANDIDATES', 'candidates.json')  # one file per review batch


def thumb(url, width=330):
    """A small rendition of a candidate, from the same thumbnail path at a standard width."""
    return re.sub(r'/\d+px-', f'/{width}px-', url) if '/thumb/' in url else url


def options(slot, n=8):
    found, seen = [], set()
    for q in queries(slot):
        for c in candidates(q):
            if c['commons'] not in seen and not c['avoid']:
                seen.add(c['commons']); found.append(c)
        if len(found) >= n:
            break
    return found[:n]


def candidate_sheet(manifest, keys):
    from PIL import Image, ImageDraw
    from concurrent.futures import ThreadPoolExecutor
    cell, label = 220, 26
    # Resumable: options already found for this batch are kept, and finished sheets are not redrawn.
    pool = json.loads(CANDIDATES.read_text()) if CANDIDATES.exists() else {}
    rows = list(keys)
    CANDIDATES.parent.mkdir(exist_ok=True)
    for key in keys:
        if key in pool:
            continue
        pool[key] = options(manifest[key]); print(key, len(pool[key]), flush=True)
        CANDIDATES.write_text(json.dumps(pool, indent=1, ensure_ascii=False))

    def small(c):
        try:
            im = Image.open(io.BytesIO(fetch(thumb(c['url']), timeout=40))).convert('RGB'); im.thumbnail((cell - 8, cell - 8)); return im
        except Exception as e:
            return str(e)[:30]

    for part in range(0, len(rows), 12):
        path = CANDIDATES.with_name(f'{CANDIDATES.stem}-{part // 12}.jpg')
        if path.exists():
            print('sheet:', path, '(already drawn)', flush=True); continue
        chunk = rows[part:part + 12]
        canvas = Image.new('RGB', (180 + 8 * cell, len(chunk) * (cell + label)), 'white')
        draw = ImageDraw.Draw(canvas)
        with ThreadPoolExecutor(6) as ex:
            pictures = {key: list(ex.map(small, pool[key])) for key in chunk}
        for r, key in enumerate(chunk):
            y = r * (cell + label)
            draw.text((6, y + 8), key[3:], fill='black'); draw.text((6, y + 26), manifest[key]['want'][:28], fill='#666')
            for i, (c, im) in enumerate(zip(pool[key], pictures[key])):
                if isinstance(im, str):
                    draw.text((180 + i * cell + 8, y + 40), im, fill='red')
                else:
                    canvas.paste(im, (180 + i * cell + 4, y + 4))
                draw.text((180 + i * cell + 6, y + cell + 4), f'{i}  {c["license"]}', fill='black')
        canvas.save(path, quality=80); print('sheet:', path, flush=True)


def pick(manifest, choices):
    pool = json.loads(CANDIDATES.read_text())
    for choice in choices:
        key, _, n = choice.partition('=')
        c = pool[key][int(n)]
        file, w, h = save(c, key)
        manifest[key].update(file=file, width=w, height=h, title=c['title'], author=c['author'], license=c['license'],
                             license_url=c['license_url'], source=c['source'], commons=c['commons'])
        print(key, '->', c['commons'], flush=True)
        tmp = MANIFEST.with_suffix('.tmp'); tmp.write_text(json.dumps(manifest, indent=1, ensure_ascii=False, sort_keys=True) + '\n'); os.replace(tmp, MANIFEST)


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
    if '--candidates' in argv:
        return candidate_sheet(manifest, [a for a in argv if not a.startswith('-')])
    if '--pick' in argv:
        return pick(manifest, [a for a in argv if '=' in a])
    refresh = '--refresh' in argv
    only = [a for a in argv if not a.startswith('-')]
    used = {v.get('commons') for v in manifest.values() if v.get('commons')}
    OUT.mkdir(parents=True, exist_ok=True)
    todo = [k for k in sorted(manifest) if (not only or k in only) and (refresh or not manifest[k].get('file') or not (OUT / manifest[k]['file']).exists())]
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
            tmp = MANIFEST.with_suffix('.tmp')  # write-then-rename, so an interrupted run never leaves half a manifest
            tmp.write_text(json.dumps(manifest, indent=1, ensure_ascii=False, sort_keys=True) + '\n'); os.replace(tmp, MANIFEST)
            print(f'[{n}/{len(todo)}] {key}: {c["commons"]} ({c["license"]})')
        except Exception as e:  # keep going; a rerun picks up whatever failed
            print(f'[{n}/{len(todo)}] {key}: {e}')


if __name__ == '__main__':
    main(sys.argv[1:])

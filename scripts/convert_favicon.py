from pathlib import Path
from io import BytesIO
import sys

try:
    import cairosvg
    from PIL import Image
except Exception as e:
    print('Missing dependency:', e)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
JPG_PATH = ROOT / 'public' / 'images' / 'beethoven.jpg'
SVG_PATH = ROOT / 'public' / 'favicon.svg'
ICO_PATH = ROOT / 'public' / 'favicon.ico'

# Determine source: CLI arg -> JPG if exists -> SVG fallback
if len(sys.argv) > 1:
    SRC = Path(sys.argv[1])
from pathlib import Path
from io import BytesIO
import sys
import urllib.request

try:
    import cairosvg
    from PIL import Image
except Exception as e:
    print('Missing dependency:', e)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
JPG_PATH = ROOT / 'public' / 'images' / 'beethoven.jpg'
SVG_PATH = ROOT / 'public' / 'favicon.svg'
ICO_PATH = ROOT / 'public' / 'favicon.ico'

# Determine source: CLI arg -> JPG if exists -> SVG fallback
def is_url(s: str) -> bool:
    return s.startswith('http://') or s.startswith('https://')

if len(sys.argv) > 1:
    arg = sys.argv[1]
    if is_url(arg):
        SRC = arg
    else:
        SRC = Path(arg)
else:
    if JPG_PATH.exists() and JPG_PATH.stat().st_size > 0:
        SRC = JPG_PATH
    elif SVG_PATH.exists() and SVG_PATH.stat().st_size > 0:
        SRC = SVG_PATH
    else:
        print('No source image found (jpg or svg). Place your image at', JPG_PATH)
        sys.exit(1)


def open_image_from_src(src):
    # URL
    if isinstance(src, str) and is_url(src):
        with urllib.request.urlopen(src) as resp:
            data = resp.read()
        # try SVG first
        if src.lower().endswith('.svg'):
            png_bytes = cairosvg.svg2png(bytestring=data, output_width=512, output_height=512)
            return Image.open(BytesIO(png_bytes)).convert('RGBA')
        else:
            return Image.open(BytesIO(data)).convert('RGBA')
    # Path
    p = Path(src)
    if not p.exists() or p.stat().st_size == 0:
        raise FileNotFoundError('Source file missing or empty: ' + str(p))
    if p.suffix.lower() == '.svg':
        svg_data = p.read_text(encoding='utf-8')
        png_bytes = cairosvg.svg2png(bytestring=svg_data.encode('utf-8'), output_width=512, output_height=512)
        return Image.open(BytesIO(png_bytes)).convert('RGBA')
    else:
        return Image.open(p).convert('RGBA')

try:
    img = open_image_from_src(SRC)
except Exception as e:
    print('Error opening source image:', e)
    sys.exit(1)

# Save multi-size ICO
sizes = [(16,16),(32,32),(48,48),(64,64),(128,128),(256,256),(512,512)]
img.save(ICO_PATH, format='ICO', sizes=sizes)

print('Created', ICO_PATH)

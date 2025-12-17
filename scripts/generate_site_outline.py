import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'src' / 'App.jsx'
OUT = ROOT / 'testo-app-estratto.txt'

jsx = SRC.read_text(encoding='utf-8')

def extract_tag(tag):
    pattern = re.compile(rf"<{tag}[^>]*>([\s\S]*?)</{tag}>", re.IGNORECASE)
    return [re.sub(r"\s+"," ", m.group(1)).strip() for m in pattern.finditer(jsx)]

def extract_imgs():
    imgs = []
    for m in re.finditer(r'<img\s+([^>]+)>', jsx, re.IGNORECASE):
        attrs = m.group(1)
        src = re.search(r'src=\{?\"?([^\"\s\}]+)\"?\}?', attrs)
        alt = re.search(r'alt=\{?\"?([^\"\}]+)\"?\}?', attrs)
        # fallback alt from nearby figcaption
        imgs.append({'src': src.group(1) if src else '', 'alt': alt.group(1) if alt else ''})
    return imgs

def clean_text(s):
    # remove JSX expressions { ... } and tags inside
    s = re.sub(r"\{[^}]*\}", "", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = s.replace('&apos;','\'').replace('&quot;','"')
    return re.sub(r"\s+"," ", s).strip()

headings = []
for level in range(1,5):
    for h in extract_tag(f'h{level}'):
        headings.append((level, clean_text(h)))

paragraphs = [clean_text(p) for p in extract_tag('p')]
list_items = [clean_text(li) for li in extract_tag('li')]
imgs = extract_imgs()

out = []
out.append('SITO: struttura e contenuti estratti')
out.append('==================================')
out.append('')
out.append('Sezioni / Navigazione (label dei tab):')
# try to extract the tabs labels from tabs array
tabs_match = re.search(r'const\s+Navigation\s*=.*?const\s+tabs\s*=\s*(\[([\s\S]*?)\])', jsx)
if tabs_match:
    tabs_block = tabs_match.group(1)
    labels = re.findall(r'label:\s*\"([^\"]+)\"', tabs_block)
    if labels:
        for lbl in labels:
            out.append('- ' + lbl)
    else:
        out.append('- (non trovati label statici nei tabs)')
else:
    out.append('- (navigazione non rilevata automaticamente)')

out.append('')
out.append('Gerarchia di titoli e contenuti:')
for lvl, txt in headings:
    out.append(('  ' * (lvl-1)) + ('H' + str(lvl) + ': ' + txt))

if paragraphs:
    out.append('')
    out.append('Paragrafi principali:')
    for p in paragraphs:
        out.append('- ' + p)

if list_items:
    out.append('')
    out.append('Elenchi / Voci:')
    for li in list_items:
        out.append('- ' + li)

if imgs:
    out.append('')
    out.append('Immagini trovate (src / alt):')
    for im in imgs:
        out.append(f"- src: {im['src']}  |  alt: {im['alt']}")

out.append('')
out.append('NOTE: lo script estrae contenuti visibili statici presenti in `src/App.jsx`.')
out.append('Alcuni testi dinamici (variabili, props, contenuti generati) potrebbero non essere inclusi.')
out.append('Per ogni sezione indicata, il copywriter dovrebbe controllare i componenti corrispondenti in `src/` per eventuali sottosezioni o didascalie immagini.')

OUT.write_text('\n'.join(out), encoding='utf-8')
print('Outline scritto in', OUT)

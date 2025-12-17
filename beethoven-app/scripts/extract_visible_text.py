import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'src' / 'App.jsx'
OUT = ROOT / 'testo-app-estratto.txt'

text = SRC.read_text(encoding='utf-8')

# find all double-quoted and single-quoted strings
strings = re.findall(r"'([^'\\]*(?:\\.[^'\\]*)*)'|\"([^\\\"]*(?:\\.[^\\\"]*)*)\"", text)

seen = set()
out_lines = []

for a,b in strings:
    s = a if a else b
    s = s.replace('\\\'', "'").replace('\\\"', '"')
    s = s.strip()
    # filter heuristics: skip short tokens, code-like tokens, imports, classnames, paths
    if len(s) < 3:
        continue
    if any(c in s for c in ['/', '.js', 'http', '<', 'className', 'px', 'sm:', 'bg-','text-','/src','@']):
        continue
    # skip strings that look like variable names or icons
    if re.match(r'^[A-Za-z0-9_\- ]+$', s) and sum(1 for ch in s if ch.isupper())>5:
        continue
    if s in seen:
        continue
    seen.add(s)
    out_lines.append(s)

# Also extract text between JSX tags like >text<
between = re.findall(r'>\s*([^<>\n]{3,}?)\s*<', text)
for s in between:
    s = s.strip()
    if len(s) < 3: continue
    if any(sub in s for sub in ['className=', '=>', 'http', 'img', 'svg']): continue
    if s in seen: continue
    seen.add(s)
    out_lines.append(s)

OUT.write_text('\n'.join(out_lines), encoding='utf-8')
print('Wrote', OUT)

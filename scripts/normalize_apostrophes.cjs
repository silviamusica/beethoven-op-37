const fs = require('fs');
const { execSync } = require('child_process');

// Include a broader set of text-like files to ensure apostrophes normalized everywhere
const exts = ['*.jsx','*.js','*.txt','*.md','*.html','*.json'];
let files = [];
exts.forEach(ext => {
  const res = execSync(`find . -name "${ext}" -print || true`).toString().split('\n').filter(Boolean);
  files = files.concat(res);
});
if (!files.includes('testo-app-estratto.txt')) files.push('testo-app-estratto.txt');

files.forEach(f => {
  try {
    let s = fs.readFileSync(f, 'utf8');
    const original = s;
    // Replace po' -> po’ (typographic apostrophe)
    s = s.replace(/po'/g, "po");
    // Replace straight apostrophe between letters with typographic apostrophe
    s = s.replace(/([\p{L}])'([\p{L}])/gu, (m, a, b) => `${a}${b}`);
    // Convert temporary marker to real typographic apostrophe
    s = s.replace(/\u0007/g, '\u2019');
    if (s !== original) {
      fs.writeFileSync(f, s, 'utf8');
      console.log('patched', f);
    }
  } catch (e) {
    // ignore
  }
});
console.log('done');

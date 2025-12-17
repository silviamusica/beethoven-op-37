const fs = require('fs');
const { execSync } = require('child_process');

// Search a broader set of text file extensions across the repository
const exts = ['*.jsx','*.js','*.txt','*.md','*.html','*.json'];
let files = [];
exts.forEach(ext => {
  const res = execSync(`find . -name "${ext}" -print || true`).toString().split('\n').filter(Boolean);
  files = files.concat(res);
});
// ensure testo-app-estratto.txt included
if (!files.includes('testo-app-estratto.txt')) files.push('testo-app-estratto.txt');

files.forEach(f => {
  try {
    const s = fs.readFileSync(f, 'utf8');
    let ns = s
      .replace(/\bOp\. (\d+)/g, (m, p) => `Op.\u00A0${p}`)
      .replace(/\bop\. (\d+)/g, (m, p) => `op.\u00A0${p}`)
      .replace(/\bWoO\./g, 'WoO')
      .replace(/po'/g, "po");
    ns = ns.replace(/\u0007/g, '\u2019');
    if (ns !== s) {
      fs.writeFileSync(f, ns, 'utf8');
      console.log('patched', f);
    }
  } catch (e) {
    // ignore read errors
  }
});
console.log('done');

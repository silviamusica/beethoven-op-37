const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync("find src -type f \( -name '*.jsx' -o -name '*.js' \) -print").toString().split('\n').filter(Boolean);
files.push('testo-app-estratto.txt');

files.forEach(f => {
  try {
    const s = fs.readFileSync(f, 'utf8');
    let ns = s
      .replace(/\bOp\. (\d+)/g, (m, p) => `Op.\u00A0${p}`)
      .replace(/\bop\. (\d+)/g, (m, p) => `op.\u00A0${p}`)
      .replace(/\bWoO\./g, 'WoO')
      .replace(/po/g, "po");
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

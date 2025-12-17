import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { extname, join } from 'path';

const targetExtensions = new Set(['.js', '.jsx']);

const files = [];

const collectFiles = (dir) => {
  for (const dirent of readdirSync(dir, { withFileTypes: true })) {
    const resolved = join(dir, dirent.name);
    if (dirent.isDirectory()) {
      collectFiles(resolved);
    } else if (targetExtensions.has(extname(dirent.name))) {
      files.push(resolved);
    }
  }
};

collectFiles('src');
files.push('testo-app-estratto.txt');

const replaceNonBreaking = (content) => (
  content
    .replace(/\bOp\. (\d+)/g, (match, number) => `Op.\u00A0${number}`)
    .replace(/\bop\. (\d+)/g, (match, number) => `op.\u00A0${number}`)
    .replace(/\bWoO\./g, 'WoO')
);

const bellChar = '\u0007';

for (const file of files) {
  try {
    const original = readFileSync(file, 'utf8');
    let updated = replaceNonBreaking(original);
    if (updated.includes(bellChar)) {
      updated = updated.split(bellChar).join('\u2019');
    }
    if (updated !== original) {
      writeFileSync(file, updated, 'utf8');
      console.log('patched', file);
    }
  } catch {
    // ignore read errors
  }
}

console.log('done');

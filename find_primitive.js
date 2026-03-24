const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else if (file.endsWith('.js')) {
        results.push(file);
      }
    });
  } catch(e) {}
  return results;
}

const allFiles = walk(path.join(__dirname, 'components')).concat(walk(path.join(__dirname, 'screens'))).concat(walk(path.join(__dirname, 'navigation')));

allFiles.forEach(file => {
  const cnt = fs.readFileSync(file, 'utf8');
  const matches = cnt.match(/StyleSheet\.create\(\s*\{([\s\S]*?)\}\s*\)/g);
  if (matches) {
    matches.forEach(m => {
      // Look for primitive assignments directly
      const lines = m.split('\n');
      lines.forEach(line => {
        if (/^\s*[a-zA-Z0-9_]+\s*:\s*(['"`][^'"`]*['"`]|\d+|true|false)\s*(,|})/.test(line)) {
          console.log(`FOUND PRIMITIVE in ${file}:\n${line}`);
        }
      });
    });
  }
});

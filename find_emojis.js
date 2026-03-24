const fs = require('fs');
const path = require('path');

function walk(d) {
  let r = [];
  try {
    fs.readdirSync(d).forEach(f => {
      f = path.join(d, f);
      const s = fs.statSync(f);
      if (s.isDirectory()) r = r.concat(walk(f));
      else if (f.endsWith('.js')) r.push(f);
    });
  } catch (e) {}
  return r;
}

const files = [...walk('screens'), ...walk('components'), ...walk('navigation')];
const regex = /[\u2600-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD10-\uDDFF]/;
let results = [];

files.forEach(f => {
  const code = fs.readFileSync(f, 'utf8');
  const lines = code.split('\n');
  lines.forEach((l, i) => {
    if (regex.test(l)) {
      results.push('F: ' + f + ' L: ' + (i+1) + ' C: ' + l.trim());
    }
  });
});

fs.writeFileSync('emojis.txt', results.join('\n'));

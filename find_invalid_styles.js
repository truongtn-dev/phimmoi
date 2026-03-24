const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
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
  return results;
}

const allFiles = walk(path.join(__dirname, 'components')).concat(walk(path.join(__dirname, 'screens')));

allFiles.forEach(file => {
  const cnt = fs.readFileSync(file, 'utf8');
  const matches = cnt.match(/StyleSheet\.create\(\s*\{[\s\S]*?\}\s*\)/g);
  if (matches) {
    matches.forEach(m => {
      try {
        const argMatch = m.match(/StyleSheet\.create\(\s*(\{[\s\S]*?\})\s*\)/);
        if (argMatch) {
          // simple eval replacing known constants to objects 
          let argCode = argMatch[1];
          argCode = argCode.replace(/COLORS\.[a-zA-Z]+/g, '""');
          argCode = argCode.replace(/FONT\.[a-zA-Z]+/g, '0');
          argCode = argCode.replace(/SPACING\.[a-zA-Z]+/g, '0');
          argCode = argCode.replace(/RADIUS\.[a-zA-Z]+/g, '0');
          argCode = argCode.replace(/theme\.[a-zA-Z]+/g, '0');
          const obj = eval('(' + argCode + ')');
          
          Object.keys(obj).forEach(k => {
             if (typeof obj[k] !== 'object' && typeof obj[k] !== 'undefined' && obj[k] !== null) {
                console.log(`INVALID PRIMITIVE VALUE IN ${file} FOR KEY [${k}]`);
             }
          });
        }
      } catch (e) {
      }
    });
  }
});

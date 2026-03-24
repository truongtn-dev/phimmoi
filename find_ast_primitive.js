const babel = require('@babel/core');
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
allFiles.push(path.join(__dirname, 'App.js'));

allFiles.forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  try {
     babel.transformSync(code, {
       ast: true,
       plugins: [
         function() {
           return {
             visitor: {
               CallExpression(p) {
                 if (p.node.callee.type === 'MemberExpression' &&
                     p.node.callee.object.name === 'StyleSheet' &&
                     p.node.callee.property.name === 'create') {
                     const arg = p.node.arguments[0];
                     if (arg && arg.type === 'ObjectExpression') {
                         arg.properties.forEach(prop => {
                            if (prop.value && (prop.value.type === 'StringLiteral' || prop.value.type === 'NumericLiteral' || prop.value.type === 'BooleanLiteral')) {
                                  console.log(`FOUND PRIMITIVE VALUE IN ${file}: ${prop.key.name || prop.key.value} = ${prop.value.value}`);
                            }
                         });
                     }
                 }
               }
             }
           };
         }
       ]
     });
  } catch(e) {
  }
});

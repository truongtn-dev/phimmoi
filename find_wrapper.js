const fs = require('fs');
const lines = fs.readFileSync('bundle3.js', 'utf8').split('\n');

function printModuleHeader(lineNum) {
  for (let i = lineNum; i >= 0; i--) {
    if (lines[i].includes('__d(')) {
      console.log('Line ' + lineNum + ' is inside ' + lines[i].substring(0, 100));
      return;
    }
  }
}

printModuleHeader(90190);
printModuleHeader(30344);
printModuleHeader(99134);

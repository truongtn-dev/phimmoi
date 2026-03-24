const fs = require('fs');
const lines = fs.readFileSync('bundle3.js', 'utf8').split('\n');

function getModuleAt(lineNum) {
  if (lineNum >= lines.length) lineNum = lines.length - 1;
  for (let i = lineNum; i >= 0; i--) {
     if (lines[i].includes('__d(')) {
        return "MODULE HEADER at " + i + ": " + lines[i].substring(0, 200);
     }
  }
}

function getFooterAt(lineNum) {
  if (lineNum >= lines.length) lineNum = lines.length - 1;
  for (let i = lineNum; i < lines.length; i++) {
     let match = lines[i].match(/\},\d+,\[.*?\],".*?"\);/);
     if (match) return "MODULE FOOTER at " + i + ": " + match[0];
  }
}

console.log("For 99134 (approx latest):");
console.log(getModuleAt(99134));
console.log(getFooterAt(99134));

console.log("For 88863:");
console.log(getModuleAt(88863));
console.log(getFooterAt(88863));

console.log("For 90190:");
console.log(getModuleAt(90190));
console.log(getFooterAt(90190));

console.log("For 93330:");
console.log(getModuleAt(93330));
console.log(getFooterAt(93330));

// Let's also look up some module paths commonly found around 90190
console.log("For 90015:");
console.log(getModuleAt(90015));
console.log(getFooterAt(90015));

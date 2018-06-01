const fs = require('fs');

let sources = {};

fs.readdirSync(__dirname).filter(directoryItem => {
  return !directoryItem.includes('index') && !directoryItem[0] !== '.';
}).forEach(sourceFile => {
  sources[sourceFile.split('.')[0].toLowerCase()] = require('./' + sourceFile);
});

module.exports = sources;

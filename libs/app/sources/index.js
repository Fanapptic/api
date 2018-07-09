const fs = require('fs');

let sources = [];
let sourceClasses = {};

// require in function prevents circular dependency. /shrug
fs.readdirSync(__dirname).filter(directoryItem => {
  return !directoryItem.includes('index') && !directoryItem[0] !== '.';
}).forEach(sourceFile => {
  const sourceName = sourceFile.split('.')[0].toLowerCase();

  sources.push(sourceName);
  sourceClasses[sourceName] = () => require('./' + sourceFile);
});

module.exports = {
  sources,
  getSourceClass: source => sourceClasses[source](),
};

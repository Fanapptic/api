const fs = require('fs');
const path = require('path');

let configurables = {};

fs.readdirSync(__dirname).filter(directoryItem => {
  return path.extname(directoryItem) === '.js' && directoryItem !== 'index.js';
}).forEach(configurableFile => {
  configurables[path.basename(configurableFile, '.js')] = require('./' + configurableFile);
});

module.exports = configurables;

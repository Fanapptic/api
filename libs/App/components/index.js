const fs = require('fs');
const path = require('path');

let components = {};

fs.readdirSync(__dirname).filter(directoryItem => {
  return path.extname(directoryItem) === '.js' && directoryItem !== 'index.js';
}).forEach(componentFile => {
  components[path.basename(componentFile, '.js')] = require('./' + componentFile);
});

module.exports = components;

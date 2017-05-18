const fs = require('fs');
const path = require('path');

let moduleClasses = {};

fs.readdirSync(__dirname).filter(directoryItem => {
  return fs.lstatSync(path.join(__dirname, directoryItem)).isDirectory();
}).forEach(moduleDirectory => {
  const ModuleClass = require('./' + moduleDirectory);
  const { moduleName } = ModuleClass;

  if (moduleName) {
    moduleClasses[moduleName] = ModuleClass;
  }
});

module.exports = {
  moduleClasses,
  getModuleClass: (moduleName) => {
    return moduleClasses[moduleName];
  },
};

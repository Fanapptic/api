const fs = require('fs');
const path = require('path');

let moduleClasses = {};

fs.readdirSync(__dirname).filter(directoryItem => {
  return fs.lstatSync(path.join(__dirname, directoryItem)).isDirectory();
}).forEach(moduleDirectory => {
  const ModuleClass = require('./' + moduleDirectory);
  
  moduleClasses[ModuleClass.moduleName] = ModuleClass;
});

module.exports = {
  moduleClasses,
  initModule: (moduleName, config, options, styles, position) => {
    const ModuleClass = moduleClasses[moduleName];
  },
  getModuleClass: (moduleName) => {
    return moduleClasses[moduleName];
  },
};

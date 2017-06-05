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
  initModule: (moduleName, moduleConfig) => {
    const ModuleClass = moduleClasses[moduleName];

    if (!ModuleClass) {
      throw new Error('The module name provided is invaid.');
    }

    const module = new ModuleClass();
    module.import(moduleConfig);

    return module;
  },
  getModuleClass: moduleName => {
    return moduleClasses[moduleName];
  },
};

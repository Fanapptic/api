const fs = require('fs');
const path = require('path');

let moduleNames = [];
let moduleClasses = {};

fs.readdirSync(__dirname).filter(directoryItem => {
  return fs.lstatSync(path.join(__dirname, directoryItem)).isDirectory();
}).forEach(moduleDirectory => {
  const ModuleClass = require(`./${moduleDirectory}`);

  moduleNames.push(ModuleClass.name);
  moduleClasses[ModuleClass.name] = ModuleClass;
});

module.exports = {
  moduleNames,
  initModule: (name, config) => {
    const ModuleClass = moduleClasses[name];

    if (!ModuleClass) {
      throw new Error('The module name provided is invaid.');
    }

    const module = new ModuleClass();
    module.import(config);

    return module;
  },
};

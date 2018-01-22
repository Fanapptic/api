const fs = require('fs');
const path = require('path');

let apiRouters = [];
let moduleClasses = {};

fs.readdirSync(__dirname).filter(directoryItem => {
  return fs.lstatSync(path.join(__dirname, directoryItem)).isDirectory();
}).forEach(moduleDirectory => {
  const apiRouterPath = `./${moduleDirectory}/api`;
  const ModuleClass = require(`./${moduleDirectory}`);

  if (fs.existsSync(path.join(__dirname, apiRouterPath))) {
    apiRouters.push(require(apiRouterPath));
  }

  moduleClasses[ModuleClass.name] = ModuleClass;
});

module.exports = {
  apiRouters,
  moduleClasses,
  initModule: (name, config) => {
    const ModuleClass = moduleClasses[name];

    if (!ModuleClass) {
      throw new Error('The module name provided is invaid.');
    }

    const module = new ModuleClass();
    module.import(config);

    return module;
  },
  getModuleClass: name => {
    return moduleClasses[name];
  },
};

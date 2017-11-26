const appModules = rootRequire('/appModules');

/*
 * Model Definition
 */

const AppModuleModel = database.define('appModules', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  moduleName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isValid(value) {
        if (!appModules.moduleClasses[value]) {
          throw new Error('The module name provided is invalid.');
        }

        return true;
      },
    },
  },
  moduleConfig: {
    type: Sequelize.JSON,
    allowNull: false,
    validate: {
      isValid(value) {
        // initModule throws when passed an invalid config.
        const moduleName = this.getDataValue('moduleName');
        const module = appModules.initModule(moduleName, value);

        // export returns a sanitized config object.
        this.setDataValue('moduleConfig', module.export());

        return true;
      },
    },
    defaultValue: '',
  },
  position: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
});

/*
 * Instance Methods / Overrides
 */

AppModuleModel.prototype.generateModuleObject = function() {
  return appModules.initModule(this.moduleName, this.moduleConfig);
};

/*
 * Export
 */

module.exports = AppModuleModel;

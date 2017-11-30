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
  name: {
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
  config: {
    type: Sequelize.JSON,
    allowNull: false,
    validate: {
      isValid(value) {
        // initModule throws when passed an invalid config.
        const name = this.getDataValue('name');
        const module = appModules.initModule(name, value);

        // export returns a sanitized config object.
        this.setDataValue('config', module.export());

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
  return appModules.initModule(this.name, this.config);
};

/*
 * Export
 */

module.exports = AppModuleModel;

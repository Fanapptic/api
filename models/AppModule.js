const appModules = rootRequire('/appModules');

/*
 * Model Definition
 */

const AppModule = database.define('appModules', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  moduleName: {
    type: Sequelize.STRING,
  },
  moduleConfig: {
    type: Sequelize.JSON,
    validate: {
      isValid(value) {
        // initModule throws when passed an invalid config.
        const moduleName = this.getDataValue('moduleName');
        const module = appModules.initModule(moduleName, value);

        // exportConfig returns a sanitized config object.
        this.setDataValue('moduleConfig', module.exportConfig());

        return true;
      },
    },
  },
  position: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
});

/*
 * Export
 */

module.exports = AppModule;

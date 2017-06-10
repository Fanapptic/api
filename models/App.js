const App = rootRequire('/libs/App');
const AppDeploymentModel = rootRequire('/models/AppDeployment');
const AppModuleModel = rootRequire('/models/AppModule');
const Snapshot = rootRequire('/libs/App/Snapshot');
const contentRatings = ['4+', '9+', '12+', '17+'];

/*
 * Model Definition
 */

const AppModel = database.define('apps', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  bundleId: {
    type: Sequelize.STRING,
    unique: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  displayName: {
    type: Sequelize.STRING,
    validate: {
      max: {
        args: 11,
        msg: 'Display name cannot exceed a total of 11 characters.',
      },
    },
  },
  shortDescription: {
    type: Sequelize.STRING(80),
    validate: {
      max: {
        args: 80,
        msg: 'Short description cannot exceed a total of 80 characters.',
      },
    },
  },
  fullDescription: {
    type: Sequelize.STRING(4000),
    validate: {
      max: {
        args: 4000,
        msg: 'Full description cannot exceed a total of 4,000 characters.',
      },
    },
  },
  keywords: {
    type: Sequelize.STRING(100),
    validate: {
      max: {
        args: 100,
        msg: 'Keywords cannot exceed a total of 100 characters.',
      },
    },
  },
  iconUrl: {
    type: Sequelize.STRING,
    validate: {
      isUrl: {
        msg: 'The icon url provided is invalid.',
      },
    },
  },
  website: {
    type: Sequelize.STRING,
    validate: {
      isUrl: {
        msg: 'The website url provided is invalid.',
      },
    },
  },
  contentRating: {
    type: Sequelize.ENUM(...contentRatings),
    validate: {
      isIn: {
        args: [contentRatings],
        msg: 'The content rating provided is invalid.',
      },
    },
  },
  config: {
    type: Sequelize.JSON,
    allowNull: false,
    validate: {
      isValid(value) {
        const app = new App();

        // import throws when passed an invalid config.
        app.import(value);

        // export returns a sanitized config object.
        this.setDataValue('config', app.export());

        return true;
      },
    },
    defaultValue: '',
  },
});

/*
 * Instance Methods / Overrides
 */

AppModel.prototype.generateAppObject = function() {
  const app = new App();

  app.import(this.config);

  return app;
};

AppModel.prototype.deploy = function(previousDeployment) {
  const DEPLOYMENT_TYPE_HARD = 'hard';
  const DEPLOYMENT_TYPE_SOFT = 'soft';

  let snapshot = null;

  return this._generateSnapshot().then(generatedSnapshot => {
    snapshot = generatedSnapshot;

    if (this._shouldHardDeploy(previousDeployment, snapshot)) {
      return DEPLOYMENT_TYPE_HARD;
    }

    if (this._shouldSoftDeploy(previousDeployment, snapshot)) {
      return DEPLOYMENT_TYPE_SOFT;
    }

    throw new Error('No changes have been made since your most recent deployment.');
  }).then(deploymentType => {
    return database.transaction(transaction => {
      return AppDeploymentModel.create({
        appId: this.id,
        deploymentType,
        snapshot,
      }, { transaction }).then(appDeployment => {
        this._softDeploy(snapshot); // always soft deploy regardless of deployment type.

        if (deploymentType === 'hard') {
          this._hardDeploy(snapshot);
        }

        return appDeployment;
      });
    });
  });
};

AppModel.prototype._generateSnapshot = function() {
  const id = this.id;
  const app = this.generateAppObject();

  return AppModuleModel.findAll({ where: { appId: id } }).then(appModules => {
    appModules.forEach(appModule => {
      app.addModule(appModule.generateModuleObject());
    });

    return new Snapshot({
      bundleId: this.bundleId,
      name: this.name,
      displayName: this.displayName,
      shortDescription: this.shortDescription,
      fullDescription: this.fullDescription,
      keywords: this.keywords,
      iconUrl: this.iconUrl,
      website: this.website,
      contentRating: this.contentRating,
      packagedConfig: app.exportPackagedConfig(),
    });
  });
};

AppModel.prototype._shouldHardDeploy = function(previousDeployment, snapshot) {
  return true;
};

AppModel.prototype._shouldSoftDeploy = function(previousDeployment, snapshot) {
  return true;
};

AppModel.prototype._hardDeploy = function(snapshot) {
  console.log('hard deploy');
  return true;
};

AppModel.prototype._softDeploy = function(snapshot) {
  console.log('soft deploy');
  return true;
};

/*
 * Export
 */

module.exports = AppModel;

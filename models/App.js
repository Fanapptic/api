const Joi = require('joi');
const uuidV1 = require('uuid/v1');
const sharp = require('sharp');
const aws = require('aws-sdk');
const App = rootRequire('/libs/App');
const AppDeploymentModel = rootRequire('/models/AppDeployment');
const AppModuleModel = rootRequire('/models/AppModule');
const Snapshot = rootRequire('/libs/App/Snapshot');
const awsConfig = rootRequire('/config/aws');
const appConfig = rootRequire('/config/app');
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
    allowNull: false,
    defaultValue() {
      return `com.fanapptic.${uuidV1().split('-').join('')}`;
    },
  },
  name: {
    type: Sequelize.STRING,
    defaultValue: 'My App',
  },
  displayName: {
    type: Sequelize.STRING,
    validate: {
      max: {
        args: 11,
        msg: 'Display name cannot exceed a total of 11 characters.',
      },
    },
    defaultValue: 'My App',
  },
  subtitle: {
    type: Sequelize.STRING(80),
    validate: {
      max: {
        args: 80,
        msg: 'Subtitle cannot exceed a total of 80 characters.',
      },
    },
  },
  description: {
    type: Sequelize.STRING(4000),
    validate: {
      max: {
        args: 4000,
        msg: 'Description cannot exceed a total of 4,000 characters.',
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
  icons: {
    type: Sequelize.JSON,
    validate: {
      isValid(value) {
        for (const icon of value) {
          if (!icon.name || !icon.url || !icon.size) {
            return false;
          }
        }

        return true;
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

AppModel.prototype.processIconUploadAndSave = function(iconImageBuffer) {
  Joi.assert(iconImageBuffer, Joi.binary());

  const s3 = new aws.S3();
  const requiredIcons = appConfig.requiredIcons;

  let promises = [];
  let icons = [];

  for (const iconName in requiredIcons) {
    const size = requiredIcons[iconName].size;

    promises.push(
      sharp(iconImageBuffer).resize(size).toBuffer().then(buffer => {
        return s3.upload({
          ACL: 'public-read',
          Body: buffer,
          Bucket: awsConfig.s3AppsBucket,
          ContentType: appConfig.iconContentType,
          Key: `${this.bundleId}/${iconName}`,
        }).promise().then(result => {
          icons.push({
            name: iconName,
            url: result.Location,
            size,
          });
        });
      })
    );
  }

  return Promise.all(promises).then(() => {
    this.icons = icons;

    return this.save();
  });
};

AppModel.prototype.deploy = function() {
  let previousDeployment = null;
  let snapshot = null;

  return AppDeploymentModel.find({
    where: { appId: this.id },
    order: [['createdAt', 'DESC']],
  }).then(previousDeploymentInstance => {
    previousDeployment = previousDeploymentInstance;

    return this._generateSnapshot();
  }).then(generatedSnapshot => {
    snapshot = generatedSnapshot;

    if (!previousDeployment || snapshot.requiresHardDeploy(previousDeployment.snapshot)) {
      return Snapshot.DEPLOYMENT_TYPES.HARD;
    }

    if (snapshot.requiresSoftDeploy(previousDeployment.snapshot)) {
      return Snapshot.DEPLOYMENT_TYPES.SOFT;
    }

    throw new Error('No changes have been made since your most recent deployment.');
  }).then(deploymentType => {
    return database.transaction(transaction => {
      let appDeployment = null;

      return AppDeploymentModel.create({
        appId: this.id,
        type: deploymentType,
        snapshot,
      }, { transaction }).then(appDeploymentInstance => {
        appDeployment = appDeploymentInstance;

        return appDeployment.softDeploy();
      }).then(() => {
        if (deploymentType === Snapshot.DEPLOYMENT_TYPES.HARD) {
          return appDeployment.hardDeploy();
        }
      }).then(() => {
        return appDeployment;
      }).catch(error => {
        throw error;
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
      subtitle: this.subtitle,
      description: this.description,
      keywords: this.keywords,
      icons: this.icons,
      website: this.website,
      contentRating: this.contentRating,
      launchConfig: app.exportLaunchConfig(),
      packagedConfig: app.exportPackagedConfig(),
    });
  });
};

/*
 * Export
 */

module.exports = AppModel;

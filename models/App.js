const Joi = require('joi');
const uuidV1 = require('uuid/v1');
const sharp = require('sharp');
const aws = require('aws-sdk');
const App = rootRequire('/libs/App');
const AppDeploymentModel = rootRequire('/models/AppDeployment');
const AppModuleModel = rootRequire('/models/AppModule');
const UserModel = rootRequire('/models/User');
const UserAgreementModel = rootRequire('/models/UserAgreement');
const Snapshot = rootRequire('/libs/App/Snapshot');
const awsConfig = rootRequire('/config/aws');
const appConfig = rootRequire('/config/app');
const contentRatings = ['4+', '9+', '12+', '17+'];

/*
 * Model Definition
 */

const AppModel = database.define('app', {
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
      // All final bundle id segments are prefixed with 'f'.
      // uuidV1() can generate a uuid that starts with
      // an integer, this causes android deployments to break.
      
      return `com.fanapptic.f${uuidV1().split('-').join('')}`;
    },
  },
  name: {
    type: Sequelize.STRING(30),
    validate: {
      max: {
        args: 30,
        msg: 'Name cannot exceed a total of 30 characters.',
      },
    },
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
  apnsSnsArn: {
    type: Sequelize.STRING,
  },
  gcmSnsArn: {
    type: Sequelize.STRING,
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

AppModel.prototype.generateChecklist = function() {
  let brandingMarketing = Object.assign({ completed: false }, appConfig.checklist.brandingMarketing);
  let payout = Object.assign({ completed: false }, appConfig.checklist.payout);
  let releaseAgreement = Object.assign({ completed: false }, appConfig.checklist.releaseAgreement);
  let tabs = Object.assign({ completed: false }, appConfig.checklist.tabs);

  let promises = [];

  // Branding & Marketing
  if (this.name && this.displayName && this.subtitle &&
      this.description && this.keywords && this.icons &&
      this.website && this.contentRating && this.config) {
    brandingMarketing.completed = true;
  }

  // Payout Settings
  promises.push(UserModel.count({
    where: {
      id: this.userId,
      paypalEmail: {
        $ne: null,
      },
    },
  }).then(count => {
    payout.completed = (count) ? true : false;
  }));

  // Release Agreement Signature
  promises.push(UserAgreementModel.count({
    where: {
      userId: this.userId,
      agreement: 'release',
      signedAgreementUrl: {
        $ne: null,
      },
    },
  }).then(count => {
    const env = process.env.NODE_ENV;

    releaseAgreement.completed = (count || (env !== 'staging' && env !== 'production')) ? true : false;
  }));

  // At Least 2 Tabs
  promises.push(AppModuleModel.count({ where: { appId: this.id } }).then(count => {
    tabs.completed = (count >= 2) ? true : false;
  }));

  // Return Checklist
  return Promise.all(promises).then(() => {
    return [ brandingMarketing, payout, releaseAgreement, tabs ];
  });
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
      sharp(iconImageBuffer).resize(size, size).toBuffer().then(buffer => {
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
  }).then(_previousDeployment => {
    previousDeployment = _previousDeployment;

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
      }, { transaction }).then(_appDeployment => {
        appDeployment = _appDeployment;

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
  const app = this.generateAppObject();

  let user = null;

  return UserModel.find({ where: { id: this.userId } }).then(_user => {
    user = _user;

    return AppModuleModel.findAll({
      where: { appId: this.id },
      order: [['position', 'ASC']],
    });
  }).then(appModules => {
    appModules.forEach(appModule => {
      let module = appModule.generateModuleObject();

      module.id = appModule.id;

      app.addModule(module);
    });

    return new Snapshot({
      bundleId: this.bundleId,
      userAccessToken: user.accessToken,
      name: this.name,
      displayName: this.displayName,
      subtitle: this.subtitle,
      description: this.description,
      keywords: this.keywords,
      icons: this.icons,
      website: this.website,
      contentRating: this.contentRating,
      apnsSnsArn: this.apnsSnsArn,
      gcmSnsArn: this.gcmSnsArn,
      packagedConfig: app.exportPackagedConfig(),
    });
  });
};

/*
 * Export
 */

module.exports = AppModel;

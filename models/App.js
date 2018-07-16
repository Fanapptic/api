const Joi = require('joi');
const uuidV1 = require('uuid/v1');
const sharp = require('sharp');
const aws = require('aws-sdk');
const hashids = new (require('hashids'))('fanapptic-salt');
const RuntimeConfig = rootRequire('/libs/app/RuntimeConfig');
const awsConfig = rootRequire('/config/aws');
const appConfig = rootRequire('/config/app');
const appleConfig = rootRequire('/config/apple');
const googleConfig = rootRequire('/config/google');

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
  publicId: {
    type: Sequelize.STRING,
  },
  accessToken: {
    type: Sequelize.UUID,
    unique: true,
    defaultValue: Sequelize.UUIDV1,
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
    type: Sequelize.STRING,
    validate: {
      max: {
        args: 30,
        msg: 'Name cannot exceed a total of 30 characters.',
      },
      noControlCharacters(value) {
        if (value.match(/[^\x20-\x7E]/g)) {
          throw new Error('Control characters are not allowed in name.');
        }

        return true;
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
  },
  subtitle: {
    type: Sequelize.STRING,
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
  appleCategory: {
    type: Sequelize.STRING,
    validate: {
      isIn: {
        args: [appleConfig.categories],
        msg: 'The apple category provided is invalid.',
      },
    },
    defaultValue: 'Entertainment',
  },
  appleListingUrl: {
    type: Sequelize.STRING,
    validate: {
      isUrl: {
        msg: 'The apple listing url provided is invalid.',
      },
    },
  },
  googleCategory: {
    type: Sequelize.STRING,
    isIn: {
      args: [googleConfig.categories],
      msg: 'The google category provided is invalid.',
    },
    defaultValue: 'Entertainment',
  },
  googleListingUrl: {
    type: Sequelize.STRING,
    validate: {
      isUrl: {
        msg: 'The google listing url provided is invalid.',
      },
    },
  },
  googleServices: {
    type: Sequelize.JSON,
  },
  apnsSnsArn: {
    type: Sequelize.STRING,
  },
  gcmSnsArn: {
    type: Sequelize.STRING,
  },
  gcmSenderId: {
    type: Sequelize.STRING,
  },
  runtimeConfig: {
    type: Sequelize.JSON,
    allowNull: false,
    validate: {
      isValid(value) {
        value.icons = this.getDataValue('icons');
        value.displayName = this.getDataValue('displayName');

        const runtimeConfig = new RuntimeConfig(value);

        this.setDataValue('runtimeConfig', runtimeConfig);

        return runtimeConfig.uploadToS3(this);
      },
    },
    defaultValue: {},
  },
});

/*
 * Instance Methods / Overrides
 */

AppModel.prototype.processIconUploadAndSave = function(iconImageBuffer) {
  Joi.assert(iconImageBuffer, Joi.binary());

  const s3 = new aws.S3();
  const requiredIcons = appConfig.requiredIcons;
  const sharpImage = sharp(iconImageBuffer).background({r: 255, g: 255, b:255, alpha: 0}).flatten();

  let promises = [];
  let icons = [];

  for (const iconName in requiredIcons) {
    const size = requiredIcons[iconName].size;

    promises.push(
      sharpImage.resize(size, size).toBuffer().then(buffer => {
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

AppModel.prototype.sendGlobalNotification = function(url, title, message) {
  return database.models.appDevice.findAll({ where: { appId: this.id } }).then(appDevices => {
    let bulkNotifications = [];

    appDevices.forEach(appDevice => {
      bulkNotifications.push({
        appId: this.id,
        appDeviceId: appDevice.id,
        url,
        title,
        message,
      });
    });

    return database.models.appNotification.bulkCreate(bulkNotifications);
  });
};

/*
 * Instance Hooks
 */

AppModel.afterCreate(afterCreate);
AppModel.afterBulkCreate(instances => {
  instances.forEach(instance => afterCreate(instance));
});

function afterCreate(instance, options) {
  instance.publicId = hashids.encode(instance.id);

  return instance.save({ transaction: options.transaction });
}

/*
 * Export
 */

module.exports = AppModel;

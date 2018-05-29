const Joi = require('joi');
const uuidV1 = require('uuid/v1');
const sharp = require('sharp');
const aws = require('aws-sdk');
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
  appleEmail: {
    type: Sequelize.STRING,
  },
  applePassword: {
    type: Sequelize.STRING,
  },
  appleTeamId: {
    type: Sequelize.STRING,
  },
  appleTeamName: {
    type: Sequelize.STRING,
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
  googleEmail: {
    type: Sequelize.STRING,
  },
  googlePassword: {
    type: Sequelize.STRING,
  },
  googleServiceAccount: {
    type: Sequelize.JSON,
  },
  googleServices: {
    type: Sequelize.JSON,
  },
  googleCategory: {
    type: Sequelize.STRING,
    isIn: {
      args: [googleConfig.categories],
      msg: 'The google category provided is invalid.',
    },
    defaultValue: 'Entertainment',
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

/*
 * Export
 */

module.exports = AppModel;

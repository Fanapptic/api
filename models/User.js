const bcrypt = require('bcrypt');
const crypto = require('crypto');
const uuidV1 = require('uuid/v1');
const aws = require('aws-sdk');
const awsConfig = rootRequire('/config/aws');
const serverConfig = rootRequire('/config/server');
const statuses = ['onboarding', 'pending setup', 'pending processing', 'pending release', 'active'];

/*
 * Model Definition
 */

const UserModel = database.define('user', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  accessToken: {
    type: Sequelize.UUID,
    unique: true,
    defaultValue: Sequelize.UUIDV1,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      msg: 'An account already exists for the email address you provided.',
    },
    validate: {
      isEmail: {
        msg: 'A valid email address must be provided.',
      },
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'A password must be provided.',
      },
      isBcrypt: function(value) {
        if (!value.startsWith('$2a') && !value.startsWith('$2b') && !value.startsWith('$2y')) {
          return bcrypt.hash(value, 10).then(password => {
            this.setDataValue('password', password);
          });
        }
      },
    },
  },
  publisherName: {
    type: Sequelize.STRING,
  },
  internalEmail: {
    type: Sequelize.STRING,
  },
  appleEmail: {
    type: Sequelize.STRING,
  },
  applePassword: {
    type: Sequelize.STRING,
    get() {
      return decryptPassword(this.getDataValue('applePassword'));
    },
    set(value) {
      this.setDataValue('applePassword', encryptPassword(value));
    },
  },
  appleTeamId: {
    type: Sequelize.STRING,
  },
  appleTeamName: {
    type: Sequelize.STRING,
  },
  googleEmail: {
    type: Sequelize.STRING,
  },
  googlePassword: {
    type: Sequelize.STRING,
    get() {
      return decryptPassword(this.getDataValue('googlePassword'));
    },
    set(value) {
      this.setDataValue('googlePassword', encryptPassword(value));
    },
  },
  googleServiceAccount: {
    type: Sequelize.JSON,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [ statuses ],
        msg: 'The status provided is invalid.',
      },
    },
    defaultValue: 'onboarding',
  },
});

/*
 * Instance Methods / Overrides
 */

UserModel.prototype.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserModel.prototype.queueAccountSetup = function() {
  const sqs = new aws.SQS();

  const data = {
    userId: this.id,
    accessToken: this.accessToken,
    email: this.email,
    publisherName: this.publisherName,
    internalEmail: this.internalEmail,
    appleEmail: this.appleEmail,
    applePassword: this.applePassword,
    googleEmail: this.googleEmail,
    googlePassword: this.googlePassword,
  };

  return sqs.sendMessage({
    MessageBody: JSON.stringify(data), // bypass password deletion.
    MessageGroupId: `account-setup-user-${this.id}`,
    QueueUrl: awsConfig.sqsAccountSetupQueue,
  }).promise();
};

UserModel.prototype.toJSON = function() {
  let user = this.get();

  // We never want to return the user's passwords.
  delete user.password;
  delete user.applePassword;
  delete user.googlePassword;

  return user;
};

/*
 * Instance Hooks
 */

UserModel.afterCreate(afterCreate);
UserModel.afterBulkCreate(instances => {
  instances.forEach(instance => afterCreate(instance));
});

function afterCreate(instance, options) {
  const internalLocalPart = uuidV1().split('-').join('').substr(0, 28);
  const internalEmail = `${internalLocalPart}@${process.env.INTERNAL_EMAIL_DOMAIN}`;
  const internalPassword = `F${uuidV1().split('-').join('').substr(0, 15)}`;

  instance.internalEmail = internalEmail;

  instance.appleEmail = internalEmail;
  instance.applePassword = internalPassword;

  instance.googleEmail = `${internalLocalPart}@gmail.com`;
  instance.googlePassword = internalPassword;

  return instance.save({ transaction: options.transaction });
}

/*
 * Helpers
 */

function encryptPassword(value) {
  if (!value || value.includes('encrypted|')) {
    return value;
  }

  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(serverConfig.aesPassword), iv);
  let encrypted = cipher.update(value);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `encrypted|${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decryptPassword(value) {
  if (!value) {
    return;
  }

  value = value.replace('encrypted|', '');

  let parts = value.split(':');
  let iv = new Buffer(parts.shift(), 'hex');
  let encryptedText = new Buffer(parts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(serverConfig.aesPassword), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

/*
 * Export
 */

module.exports = UserModel;

const bcrypt = require('bcrypt');
const phone = require('phone');

/*
 * Model Definition
 */

const UserModel = database.define('users', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: {
        msg: 'A valid email address must be provided.',
      },
    },
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: 'A password must be provided.',
      },
      isBcrypt: function(value) {
        if (!value.startsWith('$2a')) {
          return bcrypt.hash(value, 10).then(password => {
            this.setDataValue('password', password);
          });
        }
      },
    },
  },
  accessToken: {
    type: Sequelize.STRING,
    unique: true,
    defaultValue: Sequelize.UUIDV1,
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  phoneNumber: {
    type: Sequelize.STRING,
    validate: {
      isPhoneNumber: function(value) {
        this.setDataValue('phoneNumber', phone(value)[0]);

        if (!this.phoneNumber) {
          throw new Error('The phone number provided is invalid.');
        }
      },
    },
  },
  paypalEmail: {
    type: Sequelize.STRING,
    validate: {
      isEmail: {
        msg: 'A valid PayPal email address must be provided.',
      },
    },
  },
});

/*
 * Instance Methods / Overrides
 */

UserModel.prototype.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserModel.prototype.toJSON = function() {
  let user = this.get();
  delete user.password; // We never want to return the user's password.

  return user;
};

/*
 * Export
 */

module.exports = UserModel;

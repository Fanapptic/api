const bcrypt = require('bcrypt');
const states = ['onboarding', 'pending', 'active'];

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
        if (!value.startsWith('$2a')) {
          return bcrypt.hash(value, 10).then(password => {
            this.setDataValue('password', password);
          });
        }
      },
    },
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [ states ],
        msg: 'The state provided is invalid.',
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

UserModel.prototype.toJSON = function() {
  let user = this.get();

  // We never want to return the user's password.
  delete user.password;

  return user;
};

/*
 * Export
 */

module.exports = UserModel;

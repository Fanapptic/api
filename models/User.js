const bcrypt = require('bcrypt');

/*
 * Model Definition
 */

const User = database.define('users', {
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
        msg: 'An email address must be provided.',
      },
    },
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: 'A password must be provided.',
      },
      isBcrypt: value => {
        if (typeof value !== 'string' || !value.startsWith('$2a')) {
          throw new Error('Password is not a BCRYPT hash.');
        }
      },
    },
  },
  accessToken: {
    type: Sequelize.STRING,
    unique: true,
    defaultValue: Sequelize.UUIDV1,
  },
});

/*
 * Model Methods
 */

User.hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

/*
 * Instance Methods / Overrides
 */

User.prototype.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

User.prototype.toJSON = function() {
  let user = this.get();
  delete user.password; // We never want to return the user's password.

  return user;
};

/*
 * Export
 */

module.exports = User;

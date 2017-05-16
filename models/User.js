module.exports = database.define('users', {
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
          throw new Error('Password is not BCRYPT hash.');
        }
      },
    },
  },
});

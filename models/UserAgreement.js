const hellosignConfig = rootRequire('/config/hellosign');
const agreements = Object.keys(hellosignConfig.agreements);

/*
 * Model Definition
 */

const UserAgreementModel = database.define('userAgreements', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  agreement: {
    type: Sequelize.ENUM(...agreements),
    validate: {
      isIn: {
        args: [agreements],
        msg: 'The agreement provided is invalid.',
      },
    },
  },
  signatureRequestId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  signedAgreementUrl: {
    type: Sequelize.STRING,
  },
}, {
  timestamps: false,
  paranoid: false,
});

/*
 * Export
 */

module.exports = UserAgreementModel;

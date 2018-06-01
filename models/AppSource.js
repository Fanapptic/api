const sources = rootRequire('/libs/app/sources');

/*
 * Model Definition
 */

const AppSourceModel = database.define('appSource', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: Object.keys(sources),
        msg: 'The type provided is invalid.',
      },
    },
  },
  avatarUrl: {
    type: Sequelize.STRING,
  },
  accountId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  accountName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  accountUrl: {
    type: Sequelize.STRING,
  },
  accessToken: {
    type: Sequelize.TEXT('small'),
    allowNull: false,
  },
  accessTokenSecret: {
    type: Sequelize.TEXT('small'),
  },
  refreshToken: {
    type: Sequelize.TEXT('small'),
  },
});

/*
 * Instance Hooks
 */

AppSourceModel.afterCreate(afterCreate);
AppSourceModel.afterBulkCreate(instances => {
  instances.forEach(instance => afterCreate(instance));
});

AppSourceModel.afterDestroy(afterDestroy);
AppSourceModel.afterBulkDestroy(instances => {
  instances.forEach(instance => afterDestroy(instance));
});

function afterCreate(instance) {
  const source = new sources[instance.type](instance);

  return source.connect();
}

function afterDestroy(instance) {
  const source = new sources[instance.type](instance);

  return source.disconnect();
}

/*
 * Export
 */

module.exports = AppSourceModel;

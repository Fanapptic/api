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
        args: [ sources.sources.concat([ 'fanapptic' ]) ],
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
  totalFans: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
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

function afterCreate(instance, options) {
  if (instance.type === 'fanapptic') {
    return;
  }

  const SourceClass = sources.getSourceClass(instance.type);
  const source = new SourceClass(instance, options);

  return source.connect();
}

function afterDestroy(instance, options) {
  if (instance.type === 'fanapptic') {
    return;
  }

  const SourceClass = sources.getSourceClass(instance.type);
  const source = new SourceClass(instance, options);

  return source.disconnect();
}

/*
 * Export
 */

module.exports = AppSourceModel;

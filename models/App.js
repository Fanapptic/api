const App = rootRequire('/libs/App');

/*
 * Model Definition
 */

const AppModel = database.define('apps', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  bundleId: {
    type: Sequelize.STRING,
    unique: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  shortDescription: {
    type: Sequelize.STRING(80),
    validate: {
      max: {
        args: 80,
        msg: 'Short description cannot exceed a total of 80 characters.',
      },
    },
  },
  fullDescription: {
    type: Sequelize.STRING(4000),
    validate: {
      max: {
        args: 4000,
        msg: 'Full description cannot exceed a total of 4,000 characters.',
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
  iconUrl: {
    type: Sequelize.STRING,
    validate: {
      isUrl: {
        msg: 'The icon url provided is invalid.',
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
  contentRating: {
    type: Sequelize.STRING,
    validate: {
      isIn: {
        args: [['4+', '9+', '12+', '17+']],
        msg: 'The content rating provided is invalid.',
      },
    },
  },
  config: {
    type: Sequelize.JSON,
    validate: {
      isValid(value) {

      },
    },
  },
  deployedVersion: {
    type: Sequelize.STRING,
  },
});

/*
 * Export
 */

module.exports = AppModel;

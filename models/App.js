const App = rootRequire('/libs/App');
const contentRatings = ['4+', '9+', '12+', '17+'];

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
    allowNull: false,
  },
  bundleId: {
    type: Sequelize.STRING,
    unique: true,
  },
  name: {
    type: Sequelize.STRING,
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
    type: Sequelize.ENUM(...contentRatings),
    validate: {
      isIn: {
        args: [contentRatings],
        msg: 'The content rating provided is invalid.',
      },
    },
  },
  config: {
    type: Sequelize.JSON,
    allowNull: false,
    validate: {
      isValid(value) {
        const app = new App();

        // import throws when passed an invalid config.
        app.import(value);

        // export returns a sanitized config object.
        this.setDataValue('config', app.export());

        return true;
      },
    },
    defaultValue: '',
  },
}, {
  getterMethods: {
    app() {
      const app = new App();

      app.import(this.getDataValue('config'));

      return app;
    },
  },
});

/*
 * Export
 */

module.exports = AppModel;

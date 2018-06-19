const Joi = require('joi');

/*
 * Model Definition
 */

const AppSourceContent = database.define('appSourceContent', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  appSourceId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  image: {
    type: Sequelize.JSON,
    validate: {
      isValidSchema(value) {
        Joi.assert(value, Joi.object({
          url: Joi.string().required(),
          width: Joi.number().allow(null),
          height: Joi.number().allow(null),
        }));
      },
    },
  },
  video: {
    type: Sequelize.JSON,
    validate: {
      isValidSchema(value) {
        Joi.assert(value, Joi.object({
          url: Joi.string().required(),
          thumbnailUrl: Joi.string().allow(null),
          width: Joi.number().allow(null),
          height: Joi.number().allow(null),
        }));
      },
    },
  },
  iframe: {
    type: Sequelize.JSON,
    validate: {
      isValidSchema(value) {
        Joi.assert(value, Joi.object({
          url: Joi.string().required(),
          options: Joi.object().allow(null),
        }));
      },
    },
  },
  link: {
    type: Sequelize.JSON,
    validate: {
      isValidSchema(value) {
        Joi.assert(value, Joi.object({
          url: Joi.string().required(),
          thumbnailUrl: Joi.string().allow(null),
          width: Joi.number().allow(null),
          height: Joi.number().allow(null),
          title: Joi.string().allow(null),
          description: Joi.string().allow(null),
        }));
      },
    },
  },
  collection: {
    type: Sequelize.JSON,
    validate: {
      isValidSchema(value) {
        Joi.assert(value, Joi.array().items(Joi.object({
          type: Joi.string().valid('image', 'video', 'link').required(),
          url: Joi.string().required(),
          thumbnailUrl: Joi.string().required(),
          width: Joi.number().allow(null),
          height: Joi.number().allow(null),
          title: Joi.string().allow(null),
          description: Joi.string().allow(null),
        })));
      },
    },
  },
  title: {
    type: Sequelize.TEXT,
  },
  description: {
    type: Sequelize.TEXT,
  },
  data: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  publishedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

/*
 * Export
 */

module.exports = AppSourceContent;

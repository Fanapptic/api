/*
 * Model Definition
 */

const NetworkUserAttachmentModel = database.define('networkUserAttachment', {
  id: {
    type:Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  networkUserId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  contentType: {
    type: Sequelize.STRING,
  },
  url: {
    type: Sequelize.STRING,
  },
  previewImageUrl: {
    type: Sequelize.STRING,
  },
  title: {
    type: Sequelize.TEXT,
  },
  description: {
    type: Sequelize.TEXT,
  },
});

/*
 * Export
 */

module.exports = NetworkUserAttachmentModel;

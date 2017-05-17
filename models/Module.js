/*
 * Model Definition
 */

const Module = database.define('modules', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
  },
}, {
  timestamps: false,
});

/*
 * Export
 */

module.exports = Module;

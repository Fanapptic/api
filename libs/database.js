const config = rootRequire('/config/database');

module.exports = new Sequelize(config.database, null, null, {
  dialect: 'mysql',
  port: config.port,
  replication: {
    read: config.readHosts,
    write: config.writeHost
  },
  pool: {
    minConnections: config.readMinWorkerConnections,
    maxConnections: config.readMaxWorkerConnections
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    underscored: false,
    timestamps: true,
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['updated_at', 'deleted_at']
      }
    }
  },
  logging: false
});

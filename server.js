const cluster = require('cluster');
const os = require('os');

require('dotenv').config(); // set environment vars from .env, existing vars take priority over .env

const clusterEnvironments = ['staging', 'production'];

if (cluster.isMaster && clusterEnvironments.includes(process.env.NODE_ENV)) {
  os.cpus().forEach(() => {
    cluster.fork();
  });

  cluster.on('exit', () => {
    cluster.fork();
  });
} else {
  require('./worker');
}

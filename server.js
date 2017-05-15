const cluster = require('cluster');
const os = require('os');

require('./setup/globals');

if (cluster.isMaster && process.env.NODE_ENV === 'production') {
  os.cpus().forEach(() => {
    cluster.fork();
  });

  cluster.on('exit', () => {
    cluster.fork();
  });
} else {
  require('./worker');
}

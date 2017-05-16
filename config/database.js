const username = process.env.MYSQL_USER || 'fanapptic';
const password = process.env.MYSQL_PASSWORD || 'fanapptic';
const writeHost = process.env.MYSQL_WRITE_HOST || 'fanapptic-dev.cdf8oc3tx2j9.us-west-2.rds.amazonaws.com';
const readHosts = (process.env.MYSQL_READ_HOSTS_LIST) ? process.env.MYSQL_READ_HOSTS_LIST.split(',') : [
  'fanapptic-dev.cdf8oc3tx2j9.us-west-2.rds.amazonaws.com',
];

module.exports.database = process.env.MYSQL_DATABASE || 'fanapptic';
module.exports.port = process.env.MYSQL_PORT || 3306;

// Read Hosts
module.exports.readHosts = [];

readHosts.forEach((readHost) => {
  module.exports.readHosts.push({
    host: readHost,
    username: username,
    password: password,
  });
});

module.exports.readMinWorkerConnections = 1;
module.exports.readMaxWorkerConnections = 8;

// Write Hosts
module.exports.writeHost = {
  host: writeHost,
  username: username,
  password: password,
};

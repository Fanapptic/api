const username = process.env.MYSQL_USERNAME;
const password = process.env.MYSQL_PASSWORD;
const writeHost = process.env.MYSQL_WRITE_HOST;
const readHosts = process.env.MYSQL_READ_HOSTS_LIST.split(',');

module.exports.database = process.env.MYSQL_DATABASE;
module.exports.port = process.env.MYSQL_PORT;

// Read Hosts
module.exports.readHosts = [];

readHosts.forEach(readHost => {
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

const compression = require('compression');
const bodyParser = require('body-parser');
const queryBooleanParser = require('express-query-boolean');
const serverConfig = rootRequire('/config/server');

module.exports = app => {
  app.use(compression());
  app.use(bodyParser.json({
    limit: serverConfig.maxRequestBodySize,
  }));
  app.use(bodyParser.urlencoded({
    extended: false,
    limit: serverConfig.maxRequestBodySize,
  }));
  app.use(queryBooleanParser());
};

const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const xmlParser = require('express-xml-bodyparser');
const queryBooleanParser = require('express-query-boolean');
const serverConfig = rootRequire('/config/server');

module.exports = app => {
  app.use(cors());
  app.use(compression());
  app.use(xmlParser());
  app.use(bodyParser.json({
    limit: serverConfig.maxRequestBodySize,
  }));
  app.use(bodyParser.urlencoded({
    extended: false,
    limit: serverConfig.maxRequestBodySize,
  }));
  app.use(queryBooleanParser());
};

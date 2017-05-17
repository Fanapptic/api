const compression = require('compression');
const bodyParser = require('body-parser');

const authorize = rootRequire('/middlewares/authorize');

module.exports = (app) => {
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false,
  }));
  app.use(authorize);
};

const Joi = require('joi');
const Component = require('../Component');
const { Option } = require('../configurables');

class DataSource extends Component {
  constructor(initObject) {
    if (new.target === Component) {
      throw new TypeError('Cannot construct DataSource instances directly.');
    }

    super(initObject, Joi.object({
      options: Joi.array().items(Joi.object().type(Option)).optional(),
    }));
  }

  handleReceivedData(request, response, next) {
    throw new Error('handleRequest must be overriden.');
  }
}

module.exports = DataSource;

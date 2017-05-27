const Joi = require('joi');
const Component = require('../Component');
const configurables = require('../configurables');

class Tab extends Component {
  constructor(initObject) {
    super(initObject, Joi.object({
      title: Joi.object().type(configurables.Option).required(),
      icon: Joi.object().type(configurables.Option).required(),
    }));
  }
}

module.exports = Tab;

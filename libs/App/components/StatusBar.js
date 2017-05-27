const Joi = require('joi');
const Component = require('../Component');
const configurables = require('../configurables');

class StatusBar extends Component {
  constructor(initObject) {
    super(initObject, Joi.object({
      barStyle: Joi.object().type(configurables.Option).required(),
      hidden: Joi.object().type(configurables.Option).required(),
    }));
  }
}

module.exports = StatusBar;

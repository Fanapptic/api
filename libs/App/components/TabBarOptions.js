const Joi = require('joi');
const Component = require('../Component');
const configurables = require('../configurables');

class TabBarOptions extends Component {
  constructor(initObject) {
    super(initObject, Joi.object({
      activeTintColor: Joi.object().type(configurables.Option).required(),
      inactiveTintColor: Joi.object().type(configurables.Option).required(),
      showLabel: Joi.object().type(configurables.Option).required(),
      style: Joi.array().items(Joi.object().type(configurables.Style)).optional(),
    }));
  }
}

module.exports = TabBarOptions;

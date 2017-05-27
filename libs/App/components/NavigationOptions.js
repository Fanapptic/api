const Joi = require('joi');
const Component = require('../Component');
const configurables = require('../configurables');

class NavigationOptions extends Component {
  constructor(initObject) {
    super(initObject, Joi.object({
      title: Joi.object().type(configurables.Option).required(),
      headerTintColor: Joi.object().type(configurables.Option).required(),
      headerStyle: Joi.array().items(Joi.object().type(configurables.Style)).optional(),
    }));
  }
}

module.exports = NavigationOptions;

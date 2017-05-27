const Joi = require('joi');
const Component = require('../Component');
const configurables = require('../configurables');

class Navigator extends Component {
  constructor(initObject) {
    super(initObject, Joi.object({
      backgroundGradient: Joi.object().type(configurables.Option).optional(),
      navigationOptions: Joi.object().type(Component).required(),
    }));
  }
}

module.exports = Navigator;

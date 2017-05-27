const Joi = require('joi');
const Component = require('../Component');
const configurables = require('../configurables');

class TabBar extends Component {
  constructor(initObject) {
    super(initObject, Joi.object({
      swipeEnabled: Joi.object().type(configurables.Option).required(),
      animationEnabled: Joi.object().type(configurables.Option).required(),
      backgroundGradient: Joi.object().type(configurables.Option).optional(),
      tabBarOptions: Joi.object().type(Component).required(),
    }));
  }
}

module.exports = TabBar;

const ConfigPackager = require('../configPackger');

module.exports = {
  swipeEnabled: ConfigPackager.BOOLEAN.OPTIONAL(false),
  animationEnabled: ConfigPackager.BOOLEAN.OPTIONAL(true),
  backgroundGradient: ConfigPackager.GRADIENT.OPTIONAL,
  tabBarOptions: {
    activeTintColor: ConfigPackager.COLOR.REQUIRED,
    inactiveTintColor: ConfigPackager.COLOR.REQUIRED,
    showLabel: ConfigPackager.BOOLEAN.OPTIONAL(true),
    style: ConfigPackager.STYLE.REQUIRED({
      backgroundColor: '#000',
    }),
  },
};

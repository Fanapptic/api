const ConfigPackager = require('../configPackger');

module.exports = {
  internalName: ConfigPackager.STRING.REQUIRED,
  navigator: {
    backgroundGradient: ConfigPackager.GRADIENT.OPTIONAL,
    navigationOptions: {
      title: ConfigPackager.STRING.OPTIONAL,
      headerTintColor: ConfigPackager.COLOR.REQUIRED('#fff'),
      headerStyle: ConfigPackager.STYLE.REQUIRED({
        backgroundColor: '#000',
      }),
    },
  },
  tab: {
    icon: ConfigPackager.ICON.REQUIRED,
    title: ConfigPackager.STRING.REQUIRED,
  },
  moduleUrl: ConfigPackager.URL.REQUIRED,
  injectedJavaScript: ConfigPackager.JAVASCRIPT.OPTIONAL,
};

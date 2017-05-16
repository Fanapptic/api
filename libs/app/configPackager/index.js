const ConfigPackager = ({ modules, tabBar, statusBar }) => {
  this.modules = modules || {};
  this.tabBar = tabBar || {};
  this.statusBar = statusBar || {};
};

// TODO: Finish this

ConfigPackager.STRING = require('./dataTypes/string').dataType;
ConfigPackager.NUMBER = require('./dataTypes/number').dataType;
ConfigPackager.BOOLEAN = require('./dataTypes/boolean').dataType;
ConfigPackager.GRADIENT = require('./dataTypes/gradient').dataType;
ConfigPackager.ICON = require('./dataTypes/icon').dataType;
ConfigPackager.COLOR = require('./dataTypes/color').dataType;
ConfigPackager.STYLE = require('./dataTypes/style').dataType;
ConfigPackager.URL = require('./dataTypes/url').dataType;
ConfigPackager.JAVASCRIPT = require('./dataTypes/javascript').dataType;

module.exports = ConfigPackager;

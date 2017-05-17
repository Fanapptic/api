/*

What will a module HAVE to have?

content url
injected javascript
navigator config
tab config

module data - data structure and validators
mapping of configurable options to css and validators

*/

class Module {
  constructor(options) {
    this.internalName = options.internalName;
    this.displayName = options.displayName;
    this.description = options.description;
    this.contentUrl = options.contentUrl;
    this.injectedJavaScript = options.injectedJavaScript;
    this.navigatorConfig = options.navigatorConfig;
    this.tabConfig = options.tabConfig;

    this._configurableDataSources = {};
    this._configurableOptions = {};
    this._configurableStyles = {};
  }

  addConfigurableDataSource(options) {
    this._configurableDataSources[options.internalName] = {
      displayName: options.displayName,
      description: options.description,
    };
  }

  addConfigurableOption(options) {
    this._configurableOptions[options.internalName] = {
      displayName: options.displayName,
      description: options.description,
      field: options.field,
      fieldOptions: options.fieldOptions,
      buildOptionCallback: options.buildOptionCallback || this._buildOption,
      parseOptionCallback: options.parseOptionCallback || this._parseOption,
      _value: null,
    };
  }

  addConfigurableStyle(options) {
    this._configurableStyles[options.internalName] = {
      displayName: options.displayName,
      description: options.description,
      field: options.field,
      fieldOptions: options.fieldOptions,
      cssSelector: options.cssSelector,
      cssProperty: options.cssProperty,
      buildStyleCallback: options.buildStyleCallback || this._buildStyle,
      parseStyleCallback: options.parseStyleCallback || this._parseStyle,
      _value: null,
    };
  }

  _buildOption(option) {

  }

  _buildStyle(style) {

  }

  _parseOption(option) {

  }

  _parseStyle(style) {

  }
}

Module.FIELDS.TEXT = 'text';
Module.FIELDS.TEXTAREA = 'textarea';
Module.FIELDS.SELECT = 'select';
Module.FIELDS.SWITCH = 'switch';
Module.FIELDS.COLOR = 'color';
Module.FIELDS.GRADIENT = 'gradient';
Module.FIELDS.PIXELS = 'pixels';
Module.FIELDS.BORDER = 'border';
Module.FIELDS.FONT = 'font';

module.exports = Module;

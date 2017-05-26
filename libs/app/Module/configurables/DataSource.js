const Joi = require('joi');
const Configurable = require('../../Component/Configurable');
const Component = require('../../Component');
const { Option } = Component.CONFIGURABLES;

class DataSource extends Configurable {
  constructor(initObject) {
    super();

    const schema = Joi.object({
      name: Joi.string().required(),
      displayName: Joi.string().required(),
      description: Joi.string().required(),
      options: Joi.array().items(Joi.object().type(Option)).optional(),
    });

    Joi.assert(initObject, schema);

    Object.assign(this, initObject);
  }

  dataSourceDidConnect() {
    /*
     * dataSourceDidConnect() will be called once after a data source is
     * connected to a module.
     * Override this to perform any one time setup required by the data source.
     * Return: nothing
     */
  }

  dataSourceDidDisconnect() {
    /*
     * dataSourceDidDisconnect() will be called once after a data source is
     * disconnected from a module.
     * Override this to perform any one time cleanup required by the module.
     * Return: nothing
     */
  }

  dataForRequest(request) {
    /*
     * dataForRequest()
     * Override this to handle requests sent to insert or attempt to update
     * an installed modules made to POST /apps/:appId/modules/:moduleId/data.
     * Return: An object to insert as a new row for this installed module
     * into the AppModuleData table.
     */
  }

  exportValue() {
    if (!this.options || !this.options.length) {
      return null;
    }

    const options = this.options.reduce((exportObject, option) => {
      exportObject[option.name] = option.exportValue();
    });

    return { options };
  }

  importValueAndValidate(value) {
    if (!this.options || !this.options.length) {
      return true;
    }

    return Object.keys(value.options).every(optionName => {
      const optionValue = value.options[optionName];

      const option = this.options.find(option => {
        return option.name === optionName;
      });

      if (!option) {
        return true;
      }

      return option.importValueAndValidate(optionValue);
    });
  }
}

module.exports = DataSource;

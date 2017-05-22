const Joi = require('joi');
const Option = require('./Option');

module.exports = class {
  constructor(initObject) {
    const schema = Joi.object({
      internalName: Joi.string().required(),
      displayName: Joi.string().required(),
      description: Joi.string().required(),
      options: Joi.array().items(Joi.object().type(Option)).optional(),
    });

    const validationResult = Joi.validate(initObject, schema);

    if (validationResult.error) {
      throw validationResult.error;
    }

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
};

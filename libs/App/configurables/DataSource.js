const Joi = require('joi');
const Configurable = require('../Configurable');

class DataSource extends Configurable {
  constructor(initObject) {
    if (new.target === DataSource) {
      throw new TypeError('Cannot construct DataSource instances directly.');
    }

    initObject.type = 'dataSource';
    initObject.field = Configurable.FIELDS.AUTHORIZE();

    super(initObject, Joi.object({
      platform: Joi.string().required(),
    }));
  }

  import(data) {
    /*
     * Due to the nature of a DataSource, they do not accept the assignment
     * of any value. To create, modify or delete a DataSource Provider, API
     * requests should be made to /apps/{appId}/modules/{appModuleId}/providers
     */

    return;
  }

  connect(appModuleProvider) {
    throw new Error('connect must be overriden.');
  }

  disconnect(appModuleProvider) {
    throw new Error('disconnect must be overriden.');
  }

  handleWebhookRequest(request) {
    throw new Error('handleReceivedData must be overriden.');
  }
}

module.exports = DataSource;

const Configurable = require('../Configurable');

class DataSource extends Configurable {
  constructor(initObject) {
    if (new.target === DataSource) {
      throw new TypeError('Cannot construct DataSource instances directly.');
    }

    initObject.field = Configurable.FIELDS.AUTHORIZE();

    super(initObject);

    initObject.field.validate = this._validateAuthorization.bind(this);
  }

  connect() {
    throw new Error('connect must be overriden.');
  }

  disconnect() {
    throw new Error('disconnect must be overriden.');
  }

  handleReceivedData(request, response, next) {
    throw new Error('handleReceivedData must be overriden.');
  }

  _validateAuthorization(value) {
    return (value) ? this.connect() : this.disconnect();
  }
}

module.exports = DataSource;

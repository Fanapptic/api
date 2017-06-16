const Component = require('../Component');
const Configurable = require('../Configurable');
const { Option } = require('../configurables');

class DataSource extends Component {
  constructor(initObject) {
    if (new.target === Component) {
      throw new TypeError('Cannot construct DataSource instances directly.');
    }

    super(initObject);

    this.authorization = new Option({
      name: 'authorization',
      displayName: 'Authorization',
      description: 'Data source authorization',
      field: Configurable.FIELDS.AUTHORIZE({
        validate: this._validateAuthorization.bind(this),
      }),
    });
  }

  connect() {
    throw new Error('connect must be overriden.');
  }

  disconnect() {
    throw new Error('disconnect must be overriden.');
  }

  handleReceivedData(request, response, next) {
    throw new Error('handleRequest must be overriden.');
  }

  _validateAuthorization(value) {
    return (value) ? this.connect() : this.disconnect();
  }
}

module.exports = DataSource;

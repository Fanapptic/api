const { DataSource } = rootRequire('/libs/App/configurables');

module.exports = class extends DataSource {
  constructor() {
    super({
      name: 'facebook',
      displayName: 'Facebook',
      description: 'Connect Facebook page content.',
    });
  }

  connect() {
    return true;
  }

  disconnect() {
    return true;
  }

  handleReceivedData(request, response, next) {

  }
};

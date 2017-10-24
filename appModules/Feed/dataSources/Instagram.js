const { DataSource } = rootRequire('/libs/App/configurables');

module.exports = class extends DataSource {
  constructor() {
    super({
      name: 'instagram',
      displayName: 'Instagram',
      description: 'Display Instagram profile content.',
      platform: 'instagram',
    });
  }

  connect() {
    return true;
  }

  disconnect() {
    console.log('disconnect fired?');
    return true;
  }

  handleReceivedData(request, response, next) {

  }
};

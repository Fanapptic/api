const { DataSource } = rootRequire('/libs/App/configurables');

module.exports = class extends DataSource {
  constructor() {
    super({
      name: 'twitter',
      displayName: 'Twitter',
      description: 'Display Twitter feed content.',
      platform: 'twitter',
    });
  }

  connect() {
    console.log('connect fired?');
    return true;
  }

  disconnect() {
    console.log('disconnect fired?');
    return true;
  }

  handleReceivedData(request, response, next) {

  }
};
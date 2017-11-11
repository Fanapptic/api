const { DataSource } = rootRequire('/libs/App/configurables');

module.exports = class extends DataSource {
  constructor() {
    super({
      name: 'youtube',
      displayName: 'YouTube',
      description: 'Display YouTube video feed content.',
      platform: 'youtube',
    });
  }

  connect(appModuleProvider) {
    console.log('connect fired?');
    return true;
  }

  disconnect(appModuleProvider) {
    console.log('disconnect fired?');
    return true;
  }

  handleReceivedData(request, response, next) {

  }
};

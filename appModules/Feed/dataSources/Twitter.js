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

  connect(appModuleProvider) {
    console.log('connect fired?');
    return true;
  }

  disconnect(appModuleProvider) {
    console.log('disconnect fired?');
    return true;
  }

  handleWebhookRequest(request) {

  }
};

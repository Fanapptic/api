const { DataSource } = rootRequire('/libs/App/configurables');

module.exports = class extends DataSource {
  constructor() {
    super({
      name: 'facebook',
      displayName: 'Facebook',
      description: 'Connect Facebook page content.',
      platform: 'facebook',
    });
  }

  connect(appModuleProvider) {
    return true;
  }

  disconnect(appModuleProvider) {
    return true;
  }

  handleWebhookRequest(request) {

  }
};

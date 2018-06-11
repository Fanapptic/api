const AppSourceContentModel = rootRequire('/models/AppSourceContent');

class Source {
  constructor(appSource) {
    if (new.target === Source) {
      throw new TypeError('Cannot construct Source instances directly.');
    }

    if (!appSource) {
      throw new Error('A AppSource instance must be provided.');
    }

    this.appSource = appSource;
  }

  connect() {
    throw new Error('connect must be overriden.');
  }

  disconnect() {
    AppSourceContentModel.destroy({
      where: {
        appSourceId: this.appSource.id,
      },
    });
  }

  static handleWebhookRequest(request) {
    throw new Error('handleWebhookRequest must be overriden.');
  }
}

module.exports = Source;

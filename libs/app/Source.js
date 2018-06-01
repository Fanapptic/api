class Source {
  constructor(appSource) {
    if (new.target === Source) {
      throw new TypeError('Cannot construct Source instances directly.');
    }

    this.appSource = appSource;
  }

  connect() {
    throw new Error('connect must be overriden.');
  }

  disconnect() {
    throw new Error('disconnect must be overriden.');
  }

  handleWebhookRequest(request) {
    throw new Error('handleWebhookRequest must be overriden.');
  }
}

module.exports = Source;

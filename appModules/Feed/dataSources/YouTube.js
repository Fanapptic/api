const { DataSource } = rootRequire('/libs/App/components');

module.exports = class extends DataSource {
  constructor() {
    super({
      name: 'youtube',
      displayName: 'YouTube',
      description: 'Display YouTube video feed content.',
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

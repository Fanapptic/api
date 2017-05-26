const Module = rootRequire('/libs/App/Module');

module.exports = class extends Module.CONFIGURABLES.DataSource {
  constructor() {
    super({
      name: 'facebook',
      displayName: 'Facebook',
      description: 'Connect Facebook page content.',
    });
  }
};

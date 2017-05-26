const Module = rootRequire('/libs/app/Module');

module.exports = class extends Module.CONFIGURABLES.DataSource {
  constructor() {
    super({
      name: 'facebook',
      displayName: 'Facebook',
      description: 'Connect Facebook page content.',
    });
  }
};

const Module = rootRequire('/libs/App/Module');

module.exports = class extends Module.CONFIGURABLES.DataSource {
  constructor() {
    super({
      name: 'instagram',
      displayName: 'Instagram',
      description: 'Display Instagram profile content.',
    });
  }
};

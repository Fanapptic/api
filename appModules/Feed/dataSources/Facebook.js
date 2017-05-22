const DataSource = rootRequire('/libs/app/Module/configurables/DataSource');

module.exports = class extends DataSource {
  constructor() {
    super({
      internalName: 'facebook',
      displayName: 'Facebook',
      description: 'Connect Facebook page content.',
    });
  }
};

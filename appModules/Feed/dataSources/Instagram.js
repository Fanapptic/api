const DataSource = rootRequire('/libs/app/Module/configurables/DataSource');

module.exports = class extends DataSource {
  constructor() {
    super({
      internalName: 'instagram',
      displayName: 'Instagram',
      description: 'Display Instagram profile content.',
    });
  }
};

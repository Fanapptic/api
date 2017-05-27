const { DataSource } = rootRequire('/libs/App/components');

module.exports = class extends DataSource {
  constructor() {
    super({
      name: 'instagram',
      displayName: 'Instagram',
      description: 'Display Instagram profile content.',
    });
  }
};

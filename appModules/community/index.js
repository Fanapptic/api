/*
 * Module: Community
 */

const { Module } = rootRequire('/libs/App/components');

class Community extends Module {
  static get name() {
    return 'community';
  }

  constructor() {
    super({
      name: Community.name,
      displayName: 'Community',
      description: 'Give your fans their own community to post content and interact with each other and you.',
      brandingColor: '#435E8D',
      defaultIcon: 'entypo-chat',
      url: `${process.env.APP_MODULES_BASE_URL}/community/`,
    });
  }
}

module.exports = Community;

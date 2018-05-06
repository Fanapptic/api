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
      description: 'Give your fans their own community to post content and chat! Fans can upvote, downvote, and comment on content with text, images, videos, GIFs, and links, not unlike a forum.',
      brandingColor: '#435E8D',
      defaultIcon: 'entypo-chat',
      url: `${process.env.APP_MODULES_BASE_URL}/community/`,
    });
  }
}

module.exports = Community;

/*
 * Module: Chats
 */

const { Module } = rootRequire('/libs/App/components');

class Chats extends Module {
  static get name() {
    return 'chats';
  }

  constructor() {
    super({
      name: Chats.name,
      displayName: 'Chats',
      description: 'Give fans a chance to ask, comment on, and upvote questions for you.',
      brandingColor: '#435E8D',
      defaultIcon: 'entypo-chat',
      url: `${process.env.APP_MODULES_BASE_URL}/chats/`,
    });
  }
}

module.exports = Chats;

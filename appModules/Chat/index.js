/*
 * Module: Chat
 */

const { Module } = rootRequire('/libs/App/components');

class Chat extends Module {
  static get name() {
    return 'chat';
  }

  constructor() {
    super({
      name: Chat.name,
      displayName: 'Chat',
      description: 'Give fans a chance to ask, comment on, and upvote questions for you.',
      brandingColor: '#435E8D',
      defaultIcon: 'entypo-chat',
      url: `${process.env.APP_MODULES_BASE_URL}/chat/`,
    });
  }
}

module.exports = Chat;

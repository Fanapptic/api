/*
 * Module: Gossip
 */

const { Module } = rootRequire('/libs/App/components');

class Gossip extends Module {
  static get name() {
    return 'gossip';
  }

  constructor() {
    super({
      name: Gossip.name,
      displayName: 'Gossip',
      description: 'Give fans a change to ask, comment on, and upvote questions for you.',
      brandingColor: '#435E8D',
      defaultIcon: {
        name: 'ion-chatboxes',
        set: 'ion',
      },
      url: `${process.env.APP_MODULES_BASE_URL}/gossip/`,
    });
  }
}

module.exports = Gossip;

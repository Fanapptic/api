/*
 * Module: Twitch
 */

const { Module } = rootRequire('/libs/App/components');

class Twitch extends Module {
  static get name() {
    return 'twitch';
  }

  constructor() {
    super({
      name: Twitch.name,
      displayName: 'Twitch',
      description: 'Stream live video to fans by integrating Twitch TV into your app.',
      brandingColor: '#4D387D',
      defaultIcon: 'entypo-video-camera',
      url: 'https://player.twitch.tv/?channel=espnesports',
    });
  }
}

module.exports = Twitch;

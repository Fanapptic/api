/*
 * Module: SoundCloud
 */

const { Module, ConfigurableGrouping } = rootRequire('/libs/App/components');
const Configurable = rootRequire('/libs/App/Configurable');
const { Option, Style } = rootRequire('/libs/App/configurables');

class SoundCloud extends Module {
  static get moduleName() {
    return 'soundCloud';
  }

  constructor() {
    super({
      name: SoundCloud.moduleName,
      displayName: 'SoundCloud',
      description: 'Import your soundcloud tracks to allow your fans to listen in.',
      brandingColor: '#F84403',
      defaultIcon: {
        name: 'ion-cloud',
        set: 'ion',
      },
      moduleUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/2068138&color=%23ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true&amp;visual=true',
    });
  }
}

module.exports = SoundCloud;

/*
 * Module: SoundCloud
 */

const Module = rootRequire('/libs/app/module');

class SoundCloud extends Module {
  static get moduleName() {
    return 'soundCloud';
  }

  constructor() {
    super({
      name: SoundCloud.moduleName,
      displayName: 'SoundCloud',
      description: 'Display an embedded track list from a sound cloud profile.',
      moduleUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/12239113&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false',
      navigator: new Module.CONFIGURABLES.Navigator({
        navigationOptions: {
          title: 'Feed',
          headerTintColor: '#000',
        },
      }),
      tab: new Module.CONFIGURABLES.Tab({
        title: 'Feed',
        icon: {
          set: 'ion-icons',
          name: 'feed',
        },
      }),
    });

    /*
     * Data Sources
     */

    /*
     * Options
     */

    /*
     * Styles
     */


  }
}

module.exports = SoundCloud;

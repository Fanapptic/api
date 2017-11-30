/*
 * Module: Spotify
 */

const { Module } = rootRequire('/libs/App/components');

class Spotify extends Module {
  static get moduleName() {
    return 'spotify';
  }

  constructor() {
    super({
      name: Spotify.moduleName,
      displayName: 'Spotify',
      description: 'Let fans listen in on your public Spotify playlists and favorite artists.',
      brandingColor: '#141414',
      defaultIcon: {
        name: 'ion-music-note',
        set: 'ion',
      },
      moduleUrl: 'https://open.spotify.com/embed/user/124212358/playlist/6YNoqb9vaSrQymo51I01gG',
    });
  }
}

module.exports = Spotify;

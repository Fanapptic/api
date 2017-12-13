/*
 * Module: SoundCloud
 */

const { Module, ConfigurableGrouping } = rootRequire('/libs/App/components');
const Configurable = rootRequire('/libs/App/Configurable');
const { Option } = rootRequire('/libs/App/configurables');

class SoundCloud extends Module {
  static get name() {
    return 'soundCloud';
  }

  constructor() {
    super({
      name: SoundCloud.name,
      displayName: 'SoundCloud',
      description: 'Import your soundcloud tracks to allow your fans to listen in.',
      brandingColor: '#F84403',
      defaultIcon: {
        name: 'ion-cloud',
        set: 'ion',
      },
      moduleUrl: 'http://localhost:8484/soundCloud/',
    });

    /*
     * Source
     */

    const sourceGrouping = new ConfigurableGrouping({
      name: 'playerSource',
      displayName: 'Player Source',
      description: 'Your SoundCloud tab displays music from a specified artist, playlist, or track.',
    });

    sourceGrouping.addConfigurable(new Option({
      name: 'url',
      displayName: 'Artist, Playlist or Track URL',
      description: 'The URL on SoundCloud of the artist, playlist or track you want to display.',
      field: Configurable.FIELDS.TEXT({
        attributes: {
          placeholder: 'https://soundcloud.com/martingarrix',
        },
      }),
      defaultValue: '',
    }));

    this.addConfigurableGrouping(sourceGrouping);

    /*
     * Look & Feel
     */

    const lookAndFeelGrouping = new ConfigurableGrouping({
      name: 'lookAndFeel',
      displayName: 'Look & Feel',
      description: 'Tweak the visual aesthetics of basic pieces of your SoundCloud tab to better suit the overall design of your app.',
    });

    lookAndFeelGrouping.addConfigurable(new Option({
      name: 'playerColor',
      displayName: 'Highlight Color',
      description: 'This is the color of the play button and currently playing track.',
      field: Configurable.FIELDS.COLOR(),
      defaultValue: '#ff5500',
    }));

    this.addConfigurableGrouping(lookAndFeelGrouping);

    /*
     * Behavior
     */

    const behaviorGrouping = new ConfigurableGrouping({
      name: 'behavior',
      displayName: 'Behavior',
      description: 'Depending on how you want your SoundCloud tab to behave, You can configure a variety of different options that affect it\'s overall functionality.',
    });

    behaviorGrouping.addConfigurable(new Option({
      name: 'autoPlay',
      displayName: 'Auto Play',
      description: 'Automatically begin playing the first track when this tab is opened.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: true,
    }));

    behaviorGrouping.addConfigurable(new Option({
      name: 'buying',
      displayName: 'Enable Buying',
      description: 'If the artist, set or track loaded into the player offers the ability to purchase from SoundCloud, your users will be able to do so.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: true,
    }));

    behaviorGrouping.addConfigurable(new Option({
      name: 'liking',
      displayName: 'Enable Liking',
      description: 'Users can interact with and like music as it plays. Likes are applied on SoundCloud and reflect in track statistics.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: true,
    }));

    behaviorGrouping.addConfigurable(new Option({
      name: 'sharing',
      displayName: 'Enable Sharing',
      description: 'Users can share your music to other social networks and by email.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: true,
    }));

    behaviorGrouping.addConfigurable(new Option({
      name: 'downloading',
      displayName: 'Enable Downloading',
      description: 'Users can download music if the current artist, playlist or track allows it.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: true,
    }));

    behaviorGrouping.addConfigurable(new Option({
      name: 'visual',
      displayName: 'Show Artwork & Visuals',
      description: 'Show a visually pleasing version of the player that is based around the artist and track artwork.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: true,
    }));

    behaviorGrouping.addConfigurable(new Option({
      name: 'showComments',
      displayName: 'Show Comments',
      description: 'Show comments associated with the current track as it plays.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: true,
    }));

    behaviorGrouping.addConfigurable(new Option({
      name: 'showPlayCount',
      displayName: 'Show Play Count',
      description: 'Show the amount of plays tracks have.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: true,
    }));

    behaviorGrouping.addConfigurable(new Option({
      name: 'showRelated',
      displayName: 'Show Related Music',
      description: 'Show music related to the most recently played track after it finishes playing.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: false,
    }));

    this.addConfigurableGrouping(behaviorGrouping);
  }
}

module.exports = SoundCloud;

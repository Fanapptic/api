const fs = require('fs');
const helpers = require('../helpers');

describe('Apps', () => {
  /*
   * PATCH
   */

  describe('PATCH /apps', () => {
    const persistentHeader = {
      tintColor: '#AAAAAA',
      backgroundGradient: '#BBBBBB,#000000',
    };

    it('200s with updated app object and ignores properties not in config schema when passed config', done => {
      const fields = {
        name: 'My cool app',
        subtitle: 'A really awesome app.',
        description: 'A really awesome app. With a longer description.',
        keywords: 'some,really,great,keywords',
        website: 'http://www.website.com/',
        contentRating: '4+',
        config: {
          global: {
            fontFamily: 'Verdana',
          },
          statusBar: {
            barStyle: 'default',
          },
          header: persistentHeader,
          content: {
            fontSize: '14px',
            textColor: '#000000',
            backgroundGradient: '#CCCCCC,#222222',
          },
          tabBar: {
            swipeEnabled: true,
            animationEnabled: false,
            backgroundGradient: '#FFFFFF, #000000',
            tabBarOptions: {
              activeTintColor: '#000000',
              inactiveTintColor: '#CCCCCC',
              showLabel: false,
            },
          },
          badField: {
            shouldIgnore: 'example',
          },
        },
      };

      chai.request(server)
        .patch('/apps/1')
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.name.should.equal(fields.name);
          response.body.subtitle.should.equal(fields.subtitle);
          response.body.description.should.equal(fields.description);
          response.body.keywords.should.equal(fields.keywords);
          response.body.website.should.equal(fields.website);
          response.body.contentRating.should.equal(fields.contentRating);
          response.body.config.global.fontFamily.value.should.equal(fields.config.global.fontFamily);
          response.body.config.statusBar.should.deep.equal(fields.config.statusBar);
          response.body.config.header.should.deep.equal(fields.config.header);
          response.body.config.content.fontSize.value.should.equal(fields.config.content.fontSize);
          response.body.config.content.textColor.value.should.equal(fields.config.content.textColor);
          response.body.config.content.backgroundGradient.value.should.equal(fields.config.content.backgroundGradient);
          response.body.config.tabBar.should.deep.equal(fields.config.tabBar);
          response.body.config.should.not.have.property('badField');
          done();
        });
    });

    it('200s with a partially updated app object when passed partial fields', done => {
      const fields = {
        config: {
          global: {
            fontFamily: 'Helvetica',
          },
        },
      };

      chai.request(server)
        .patch('/apps/1')
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.config.global.fontFamily.value.should.equal(fields.config.global.fontFamily);
          response.body.config.header.should.deep.equal(persistentHeader);
          done();
        });
    });

    it('200s with updated app object', done => {
      const fields = {
        name: 'Some APp Name',
        displayName: 'appyo',
        subtitle: 'some subtitle',
        description: 'some description',
        keywords: 'really,great,keywords',
        website: 'https://www.fanapptic.com/',
        contentRating: '4+',
      };

      chai.request(server)
        .patch('/apps/1')
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.name.should.equal(fields.name);
          response.body.displayName.should.equal(fields.displayName);
          response.body.subtitle.should.equal(fields.subtitle);
          response.body.description.should.equal(fields.description);
          response.body.keywords.should.equal(fields.keywords);
          response.body.website.should.equal(fields.website);
          response.body.contentRating.should.equal(fields.contentRating);
          done();
        });
    });

    it('200s with updated app object when passed icon file and form data', done => {
      const name = 'changed name';

      // TODO: Known issue, if you pass config with an icon in
      // multi-part/form-data, the config will not update due to it being JSON.

      chai.request(server)
        .patch('/apps/1')
        .set('X-Access-Token', testUser.accessToken)
        .field('name', name)
        .attach('icon', fs.readFileSync('./test/icon.png'), 'icon.png')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.name.should.equal(name);
          response.body.icons.should.be.an('array');
          done();
        });
    });

    it('400s when passed invalid config', done => {
      const fields = {
        config: {
          statusBar: {
            barStyle: 'invalidStyle',
          },
        },
      };

      chai.request(server)
        .patch('/apps/1')
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    it('400s when passed invalid app id', done => {
      chai.request(server)
        .patch('/apps/1241253')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('patch', '/apps');
  });

  /*
   * GET
   */

  describe('GET /apps', () => {
    it('200s with an array of app objects owned by user', done => {
      chai.request(server)
        .get('/apps')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appObject => {
            appObject.should.be.an('object');
            appObject.userId.should.equal(testUser.id);
          });
          done();
        });
    });

    it('200s with app object owned by user when passed app id', done => {
      chai.request(server)
        .get('/apps/1')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.userId.should.equal(testUser.id);
          done();
        });
    });

    it('400s when passed invalid app id', done => {
      chai.request(server)
        .get('/apps/1241241')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/apps');
  });
});

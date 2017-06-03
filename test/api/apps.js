const helpers = require('../helpers');

describe('Apps', () => {
  /*
   * GET
   */

  describe('GET /apps', () => {
    it('200s with array of app objects owned by user', (done) => {
      chai.request(server)
        .get('/apps')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.forEach(appObject => {
            appObject.should.be.a('object');
            appObject.userId.should.equal(testUser.id);
          });
          done();
        });
    });

    it('200s with app object owned by user when passed app id', (done) => {
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

    it('400s when passed invalid app id', (done) => {
      chai.request(server)
        .get('/apps/1241241')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenAuthorizationIsInvalid('get', '/apps');
  });

  /*
   * PATCH
   */

  describe('PATCH /apps', () => {
    it('200s with updated app object and ignores properties not in config schema when passed config', (done) => {
      const fields = {
        name: 'My cool app',
        shortDescription: 'A really awesome app.',
        fullDescription: 'A really awesome app. With a longer description.',
        keywords: 'some,really,great,keywords',
        iconUrl: 'http://www.some.icon.domain/icon.png',
        website: 'http://www.website.com/',
        contentRating: '4+',
        config: {
          statusBar: {
            barStyle: 'default',
            hidden: true,
          },
          tabBar: {
            swipeEnabled: true,
            animationEnabled: true,
            backgroundGradient: '#FFFFFF, #000000',
            tabBarOptions: {
              activeTintColor: '#000000',
              inactiveTintColor: '#CCCCCC',
              showLabel: true,
              style: {
                backgroundColor: '#FFFFFF',
              },
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
          response.body.shortDescription.should.equal(fields.shortDescription);
          response.body.fullDescription.should.equal(fields.fullDescription);
          response.body.keywords.should.equal(fields.keywords);
          response.body.iconUrl.should.equal(fields.iconUrl);
          response.body.website.should.equal(fields.website);
          response.body.contentRating.should.equal(fields.contentRating);
          response.body.config.statusBar.should.deep.equal(fields.config.statusBar);
          response.body.config.tabBar.should.deep.equal(fields.config.tabBar);
          response.body.config.should.not.have.property('badField');
          done();
        });
    });

    it('400s when passed invalid config', (done) => {
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

    it('400s when passed invalid app id', (done) => {
      chai.request(server)
        .patch('/apps/1241253')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenAuthorizationIsInvalid('patch', '/apps');
  });
});

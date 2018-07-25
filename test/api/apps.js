const fs = require('fs');
const helpers = require('../helpers');

describe('Apps', () => {
  /*
   * PATCH
   */

  describe('PATCH /apps', () => {
    it('200s with updated app object', done => {
      const fields = {
        name: 'My cool app',
        displayName: 'Some display name',
        subtitle: 'A really awesome app.',
        description: 'A really awesome app. With a longer description.',
        keywords: 'some,really,great,keywords',
        website: 'http://www.website.com/',
        appleCategory: 'SocialNetworking',
        appleListingUrl: 'https://itunes.apple.com/nz/app/maplestory-m/id1290086677?mt=8',
        googleCategory: 'Business',
        googleListingUrl: 'https://play.google.com/store/apps/details?id=com.nexon.maplem.global',
        googleServices: { // just a generic google-services.json, not related to tests.
          'project_info': {
            'project_number': '1030805393842',
            'firebase_url': 'https://fanapptic-app-template.firebaseio.com',
            'project_id': 'fanapptic-app-template',
            'storage_bucket': 'fanapptic-app-template.appspot.com',
          },
          'client': [
            {
              'client_info': {
                'mobilesdk_app_id': '1:1030805393842:android:c119b0085a33b38d',
                'android_client_info': {
                  'package_name': 'com.fanapptic.apptemplate',
                },
              },
              'oauth_client': [
                {
                  'client_id': '1030805393842-nke4rbqtd8mru4n4ohte9qqqqdn5njv1.apps.googleusercontent.com',
                  'client_type': 3,
                },
              ],
              'api_key': [
                {
                  'current_key': 'AIzaSyDKx_-0_qzKggdntaTq1gI7JWu3HG19yjU',
                },
              ],
              'services': {
                'analytics_service': {
                  'status': 1,
                },
                'appinvite_service': {
                  'status': 1,
                  'other_platform_oauth_client': [],
                },
                'ads_service': {
                  'status': 2,
                },
              },
            },
          ],
          'configuration_version': '1',
        },
        apnsSnsArn: 'arn:aws:sns:us-west-2:026971357:app/APNS/production-apns-app-com.fanapptic.deploymentTestApp',
        gcmSnsArn: 'arn:aws:sns:us-west-2:02697123357:app/GCM/production-gcm-app-com.fanapptic.deploymentTestApp',
        gcmSenderId: '1030805393842',
        runtimeConfig: {
          css: {
            body: {
              background: '#212121',
            },
          },
          name: 'My cool app',
          displayName: 'Some display name',
          bundleId: testApp.bundleId,
          publicId: testApp.publicId,
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
          response.body.displayName.should.equal(fields.displayName);
          response.body.subtitle.should.equal(fields.subtitle);
          response.body.description.should.equal(fields.description);
          response.body.keywords.should.equal(fields.keywords);
          response.body.website.should.equal(fields.website);
          response.body.appleCategory.should.equal(fields.appleCategory);
          response.body.appleListingUrl.should.equal(fields.appleListingUrl);
          response.body.googleCategory.should.equal(fields.googleCategory);
          response.body.googleListingUrl.should.equal(fields.googleListingUrl);
          response.body.googleServices.should.deep.equal(fields.googleServices);
          response.body.apnsSnsArn.should.equal(fields.apnsSnsArn);
          response.body.gcmSnsArn.should.equal(fields.gcmSnsArn);
          response.body.gcmSenderId.should.equal(fields.gcmSenderId);
          response.body.runtimeConfig.should.deep.equal(fields.runtimeConfig);
          done();
        });
    });

    it('200s with updated app object when passed icon file and form data', done => {
      const name = 'changed name';

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

    it('400s when passed name with control characters', done => {
      const fields = {
        name: 'Cats – For Cat Lovers',
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

    it('400s when passed invalid runtime config property', done => {
      const fields = {
        runtimeConfig: {
          test: 'meep',
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

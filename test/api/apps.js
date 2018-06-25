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
        appleEmail: 'me@braydonb.com',
        applePassword: 'testPassword',
        appleTeamId: '7G6A3SWDG83',
        appleTeamName: 'Braydon Batungbacal',
        appleCategory: 'SocialNetworking',
        googleEmail: 'me@braydonb.com',
        googlePassword: 'testing',
        googleServiceAccount: { // just a generic google service account, not related to tests.
          type: 'service_account',
          project_id: 'api-4763755230702910538-543799',
          private_key_id: '209298c57d9e41252b5ee637724eda4154fc001c',
          private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDddN9FOTCFVs4/\nVAbR00vT+lDX6iSIk96787XyoArIcagdwh/XRe8kAL7ypwot0Bn0KpYq4REMKA0/\nbKdrwl6zPjLe1f0P9877J4E8/Ok7g0kcYuQJDQxO1s+67kS98AH38yy3jQJ4rA/y\n0dOhSY4xL6Wq7TJmRhwYXOrIC1fb1q2JTRijj/zbxIMt3VWqaP+30TrQMMpQjm06\nv3tAEUK2tJ/mfVXNlCSMF0r/JYO9R0KHZvGxmyNOahwOgAiymPFIjqVmU1aAueKP\nG7N8HDjjr06py3Ir2MRCDllCSMdB4SwrlsvqKUzuKhrFVlthStiH3rHpXZA+f4Bi\nUZI1xkkLAgMBAAECggEAGMOHbgW5o8dzs8gxJQiEO7WLkcFoiW9Dom/bwkBcRFLV\nUlKRXfC/j56Xu6mrLTlOlaundC8LyXi3FocPZ7DqBxAm/x0ducnjttkRjiDX8eQ5\n6jcyucJgRHan7wbS4Ax1I+Vo9DOL+bN/6w7EpA4GHQDvfSAeGSqw3JaTWIBQOFBh\na+S76x25fJvD+RZjiQC+L3aUyfLAKTdq+e9MlRi6p8W1dyqM34K+QF/zEW0JQB3A\nk5bltlWjXu5PQRpuxUQHHECon0TJ5aASdmTVk6pzgaIbzxLFfcO4SC+b6DSc+k0/\n6oVzs1XilbOozGgTUsS4r5+KvECTqk8+QYlgSpa7wQKBgQD8GI82JE3hMHtGkkZ9\nFKpHSabo5r4N9P6UdMy3q3DrKy1iczX+/oOOW9rwg84hGCJdUGSeSlpCR4s5L9Tx\n7AFhvXhukkujErjGDtO+FIUC2jjDB4QIcf+stYYhWeDKZwX4FELIQ0fdPE6gPiFS\nT4y/fm4L7Sd24a3nds+J8KpwywKBgQDg4teRAXZzRGb2DM8eDR2kUdfw9PCBSeIs\nzr3XWxUPD5OQEbH8R7dcY50m/wgiu0GM6Xppb/lmll2PoS5nN6yhDU3mfKaIDAnO\nbdOZy5C+HLBuEzG3x9BApl5C/OAuxp9kYBQz+G04To3k9sjlIS5WFg9eDLkq0Kye\nkbXXty3AwQKBgEwk0uTklE1nSmTne7j+C+yaV3rTbyZiEJ8gpFD5zJKLqRqqd+28\nTFosbnXlKdafJooO5UVWaerJF0k/pE8qHMS76Otk7smjtwHDqrsoEYDqDukBlSTD\n4hj1fz0Fm7sm4QusevtoLwWo2IrYGVJ2SqnwcybRC/GBeviFz2v3sFN/AoGAJRjm\njJIcMxmWjoJAbGmneSLTJ3mQbxN8Dv4vzOXGjIx6QCrbHI3MDp6UHwm1Et2nC5K8\nUcZZ8vVdC8N//yDtBkhGkH4BjrHFsFrnrBgrkWD0LcRW0EVS8kc/h3dll/HF+23q\nB0S057P1rk6Th1C47xSGhna83XY8849/2szp7EECgYEAzPFz6cqj26p3U19oo+s2\nKkeRJ4fza69QsFO6GthZAPyp/2wb4MaMs7hnretOyslcl0O/B4hgskTx4hByqcS4\nPyaEe6ud1EYqwIOJ279DcWkU5oKjvtYoCMVFBdt5xu+FtDIrDHVy6cxOWem22oJV\nGPH54nHILP7mw4PFlLuiP40=\n-----END PRIVATE KEY-----\n',
          client_email: 'testing@api-4763755230702910538-543799.iam.gserviceaccount.com',
          client_id: '109975124562492192553',
          auth_uri: 'https://accounts.google.com/o/oauth2/auth',
          token_uri: 'https://accounts.google.com/o/oauth2/token',
          auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
          client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/testing%40api-4763755230702910538-543799.iam.gserviceaccount.com',
        },
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
        googleCategory: 'Business',
        apnsSnsArn: 'arn:aws:sns:us-west-2:026971357:app/APNS/production-apns-app-com.fanapptic.deploymentTestApp',
        gcmSnsArn: 'arn:aws:sns:us-west-2:02697123357:app/GCM/production-gcm-app-com.fanapptic.deploymentTestApp',
        gcmSenderId: '1030805393842',
        runtimeConfig: {
          css: {
            body: {
              background: '#212121',
            },
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
          response.body.displayName.should.equal(fields.displayName);
          response.body.subtitle.should.equal(fields.subtitle);
          response.body.description.should.equal(fields.description);
          response.body.keywords.should.equal(fields.keywords);
          response.body.website.should.equal(fields.website);
          response.body.appleEmail.should.equal(fields.appleEmail);
          response.body.applePassword.should.equal(fields.applePassword);
          response.body.appleTeamId.should.equal(fields.appleTeamId);
          response.body.appleTeamName.should.equal(fields.appleTeamName);
          response.body.appleCategory.should.equal(fields.appleCategory);
          response.body.googleEmail.should.equal(fields.googleEmail);
          response.body.googlePassword.should.equal(fields.googlePassword);
          response.body.googleServiceAccount.should.deep.equal(fields.googleServiceAccount);
          response.body.googleServices.should.deep.equal(fields.googleServices);
          response.body.googleCategory.should.equal(fields.googleCategory);
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

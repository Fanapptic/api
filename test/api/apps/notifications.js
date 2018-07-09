const helpers = require('../../helpers');

describe('App Notifications', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/notifications', () => {
    it('204s and creates push notifications for app devices', done => {
      const fields = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'great title dawg',
        message: 'Open for a surprise!',
      };

      chai.request(server)
        .post(`/apps/${appId}/notifications`)
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .then(response => {
          response.should.have.status(204);

          return chai.request(server)
            .get(`/apps/${appId}/notifications`)
            .set('X-App-Device-Access-Token', testAppDevice.accessToken);
        }).then(response => {
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appNotification => {
            appNotification.should.be.an('object');
            appNotification.appId.should.equal(appId);
            appNotification.appDeviceId.should.be.a('number');
            appNotification.url.should.equal(fields.url);
            appNotification.message.should.equal(fields.message);
          });

          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/apps/1/notifications');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('post', '/apps/1241/notifications');
  });

  /*
   * PATCH
   */

  describe('PATCH /apps/{appId}/notifications', () => {
    it('200s with updated app notification object', done => {
      const fields = {
        read: true,
      };

      let appNotification = null;

      chai.request(server)
        .get(`/apps/${appId}/notifications`)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .then(response => {
          appNotification = response.body[0];

          return chai.request(server)
            .patch(`/apps/${appId}/notifications/${appNotification.id}`)
            .set('X-App-Device-Access-Token', testAppDevice.accessToken)
            .send(fields);
        }).then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.equal(appNotification.id);
          response.body.appId.should.equal(appId);
          response.body.read.should.equal(fields.read);
          done();
        });
    });

    helpers.it401sWhenAppDeviceAuthorizationIsInvalid('patch', '/apps/1/notifications/1');
  });

  /*
   * GET
   */

  describe('GET /apps/{appId}/notifications', () => {
    it('200s with an array of app notifications owned by app device for app', done => {
      chai.request(server)
        .get(`/apps/${appId}/notifications`)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appNotification => {
            appNotification.should.be.an('object');
            appNotification.appDeviceId.should.equal(testAppDevice.id);
          });
          done();
        });
    });

    it ('200s with app notification object owned by app device for app', done => {
      chai.request(server)
        .get(`/apps/${appId}/notifications/1`)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appDeviceId.should.equal(testAppDevice.id);
          done();
        });
    });

    helpers.it401sWhenAppDeviceAuthorizationIsInvalid('get', '/apps/1/notifications/1');
  });
});

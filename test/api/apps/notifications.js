const helpers = require('../../helpers');

let appNotificationNetworkUser = null;
let a

describe('App Notifications', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/notifications', () => {
    it('204s and creates push notifications for app devices and app device session network users', done => {
      const fields = {
        modulePath: '',
        externalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        parameters: { rick: 'roll' },
        preview: 'Open this notification for a surprise!',
        content: 'Open this notification for a surprise!!',
      };

      let devices = [];
      let deviceCreationPromises = [];

      for (let i = 0; i < 2; i++) {
        const deviceCreationPromise = chai.request(server)
          .post(`/apps/${appId}/devices`)
          .send({ platform: 'ios' })
          .then(response => {
            devices.push(response.body);
          });

        deviceCreationPromises.push(deviceCreationPromise);
      }

      Promise.all(deviceCreationPromises).then(() => {
        return chai.request(server)
            .post(`/apps/${appId}/devices/${devices[0].id}/sessions`)
            .set('X-App-Device-Access-Token', devices[0].accessToken)
            .set('X-Network-User-Access-Token', testNetworkUser.accessToken);
      }).then(() => {
        return chai.request(server)
          .post(`/apps/${appId}/notifications`)
          .set('X-Access-Token', testUser.accessToken)
          .send(fields);
      }).then(response => {
        response.should.have.status(204);

        return chai.request(server)
          .get(`/apps/${appId}/notifications`)
          .set('X-Network-User-Access-Token', testNetworkUser.accessToken);
      }).then(response => {
        response.body.should.be.an('array');
        response.body.length.should.be.at.least(1);
        response.body.forEach(appNotification => {
          appNotification.should.be.an('object');
          appNotification.appId.should.equal(appId);
          appNotification.networkUserId.should.equal(testNetworkUser.id);
          appNotification.content.should.equal(fields.content);
          appNotification.preview.should.equal(fields.preview);
          appNotificationNetworkUser = appNotification;
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
    it('200s with updated app notification object for app device', done => {
      const fields = {
        read: true,
      };

      let appNotificationAppDevice = null;

      chai.request(server)
        .get(`/apps/${appId}/notifications`)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .then(response => {
          appNotificationAppDevice = response.body[0];

          return chai.request(server)
            .patch(`/apps/${appId}/notifications/${appNotificationAppDevice.id}`)
            .set('X-App-Device-Access-Token', testAppDevice.accessToken)
            .send(fields);
        }).then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.equal(appNotificationAppDevice.id);
          response.body.appId.should.equal(appId);
          response.body.read.should.equal(fields.read);
          done();
        });
    });

    it('200s with updated app notification object for network user', done => {
      const fields = {
        read: true,
      };

      chai.request(server)
        .patch(`/apps/${appId}/notifications/${appNotificationNetworkUser.id}`)
        .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.equal(appNotificationNetworkUser.id);
          response.body.appId.should.equal(appId);
          response.body.read.should.equal(fields.read);
          done();
        });
    });

    helpers.it403sWhenAppDeviceAndUserAuthorizationIsNotProvided('patch', '/apps/1/notifications/1');
  });

  /*
   * GET
   */

  describe('GET /apps/{appId}/notifications', () => {
    it('200s with an array of app notifications owned by app and app device', done => {
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

    it('200s with an array of app notifications owned by app and network user prioritizing network user over app device', done => {
      chai.request(server)
        .get(`/apps/${appId}/notifications`)
        .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appNotification => {
            appNotification.should.be.an('object');
            appNotification.networkUserId.should.equal(testNetworkUser.id);
          });
          done();
        });
    });

    it('200s with app notification object owned by app and app device when pass app notification id', done => {
      chai.request(server)
        .get(`/apps/${appId}/notifications`)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .then(response => {
          return chai.request(server)
            .get(`/apps/${appId}/notifications/${response.body[0].id}`)
            .set('X-App-Device-Access-Token', testAppDevice.accessToken);
        }).then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal(appId);
          response.body.appDeviceId.should.equal(testAppDevice.id);
          done();
        });
    });

    helpers.it403sWhenAppDeviceAndUserAuthorizationIsNotProvided('get', '/apps/1/notifications');
  });
});

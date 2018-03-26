const helpers = require('../../helpers');

describe('App Devices', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/devices', () => {
    it('200s with created app device object owned by app', done => {
      const fields = {
        platform: 'android',
        deviceDetails: {
          brand: 'Apple',
          deviceCountry: 'US',
          deviceName: 'Braydons iPhone',
          deviceLocale: 'en_US',
          manufacturer: 'Apple',
          model: 'iPhone 6',
          systemName: 'iPhone OS',
          systemVersion: '9.0',
          uniqueId: 'FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9',
          userAgent: 'AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.98 Mobile Safari/537.36',
        },
      };

      chai.request(server)
        .post(`/apps/${appId}/devices`)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal(appId + '');
          response.body.platform.should.equal(fields.platform);
          response.body.deviceDetails.should.deep.equal(fields.deviceDetails);
          done();
        });
    });

    it('400s when passed invalid app id', done => {
      chai.request(server)
        .post('/apps/9494949/devices')
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    it('400s when passed invalid platform', done => {
      const fields = {
        platform: 'windows',
      };

      chai.request(server)
        .post(`/apps/${appId}/devices`)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });

  /*
   * PATCH
   */

  describe('PATCH /apps/{appId}/devices', () => {
    it('200s with updated app device object owned by app', done => {
      const fields = {
        apnsToken: 'sometoken123abc',
        gcmRegistrationId: 'someid123',
      };

      chai.request(server)
        .patch(`/apps/${appId}/devices/${testAppDevice.id}`)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.apnsToken.should.equal(fields.apnsToken);
          response.body.gcmRegistrationId.should.equal(fields.gcmRegistrationId);
          done();
        });
    });

    it('400s when passed invalid app device id', done => {
      chai.request(server)
        .post(`/apps/${appId}/devices/123132`)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    it('401s when passed invalid app device access token', done => {
      chai.request(server)
        .patch(`/apps/${appId}/devices/${testAppDevice.id}`)
        .set('X-App-Device-Access-Token', 'somebadaccesstoken')
        .end((error, response) => {
          response.should.have.status(401);
          done();
        });
    });
  });

  /*
   * GET
   */

  describe('GET /apps/{appId}/devices', () => {
    it('200s with an array of app device objects owned by app', done => {
      chai.request(server)
        .get(`/apps/${appId}/devices`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appDeviceObject => {
            appDeviceObject.should.be.an('object');
            appDeviceObject.appId.should.equal(appId);
          });
          done();
        });
    });

    it('200s with app device object owned by app when passed app device id', done => {
      chai.request(server)
        .get(`/apps/${appId}/devices/1`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal(appId);
          done();
        });
    });

    it('400s when passed invalid app device id', done => {
      chai.request(server)
        .get(`/apps/${appId}/devices/1241241`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/apps/1/devices');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('get', '/apps/124124/devices');
  });
});

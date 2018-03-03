const helpers = require('../../../helpers');

describe('App Device Sessions', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/devices/{appDeviceId}/sessions', () => {
    it('200s with created app device session object owned by app device', done => {
      const fields = {
        location: {
          as: 'AS54858 Condointernet.net',
          city: 'Mercer Island',
          country: 'United States',
          countryCode: 'US',
          isp: 'Condointernet.net',
          lat: 47.5707,
          lon: -122.2221,
          org: 'Condointernet.net',
          query: '64.187.163.6',
          region: 'WA',
          regionName: 'Washington',
          status: 'success',
          timezone: 'America/Los_Angeles',
          zip: '98040',
        },
      };

      chai.request(server)
        .post(`/apps/${appId}/devices/${testAppDevice.id}/sessions`)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.be.a('number');
          response.body.appDeviceId.should.equal(testAppDevice.id);
          response.body.location.should.deep.equal(fields.location);
          response.body.startedAt.should.be.a('string');
          done();
        });
    });

    it('401s when passed invalid app device access token', done => {
      const fields = {
        appDeviceId: testAppDevice.id,
      };

      chai.request(server)
        .post(`/apps/${appId}/devices/${testAppDevice.id}/sessions`)
        .set('X-App-Device-Access-Token', 'somebadaccesstoken')
        .send(fields)
        .end((error, response) => {
          response.should.have.status(401);
          done();
        });
    });
  });

  /*
   * PATCH
   */

  describe('PATCH /apps/{appId}/sessions', () => {
    it('200s with updated app device session object', done => {
      const fields = {
        location: {

          zip: '98466',
        },
      };

      chai.request(server)
        .patch(`/apps/${appId}/devices/${testAppDevice.id}/sessions/1`)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.be.a('number');
          response.body.location.should.deep.equal(fields.location);
          done();
        });
    });

    it('200s with ended app device session object', done => {
      const fields = {
        ended: true,
      };

      chai.request(server)
        .patch(`/apps/${appId}/devices/${testAppDevice.id}/sessions/1`)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.be.a('number');
          response.body.startedAt.should.be.a('string');
          response.body.endedAt.should.be.a('string');
          done();
        });
    });

    it('400s when patching ended app session', done => {
      const fields = {
        location: {
          somedata: 'about location',
        },
      };

      chai.request(server)
        .patch(`/apps/${appId}/devices/${testAppDevice.id}/sessions/1`)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    it('400s when passed invalid app device session id', done => {
      chai.request(server)
        .patch(`/apps/${appId}/devices/${testAppDevice.id}/sessions/412412`)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    it('401s when passed invalid app device access token', done => {
      chai.request(server)
        .patch(`/apps/${appId}/devices/${testAppDevice.id}/sessions`)
        .set('X-App-Device-Access-Token', 'somebadaccesstoken')
        .end((error, response) => {
          response.should.have.status(401);
          done();
        });
    });
  });
});

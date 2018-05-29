const helpers = require('../../../helpers');

describe('App Device Sessions', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/devices/{appDeviceId}/sessions', () => {
    it('200s with created app device session object owned by app device and updates app device', done => {
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
        .set('X-App-User-Access-Token', testAppUser.accessToken)
        .send(fields)
        .then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.be.a('number');
          response.body.appDeviceId.should.equal(testAppDevice.id);
          response.body.appUserId.should.equal(testAppUser.id);
          response.body.location.should.deep.equal(fields.location);
          response.body.startedAt.should.be.a('string');

          return chai.request(server)
            .get(`/apps/${appId}/devices/${testAppDevice.id}`)
            .set('X-Access-Token', testUser.accessToken);
        }).then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appUserId.should.equal(testAppUser.id);
          response.body.location.should.deep.equal(fields.location);
          done();
        }).catch(e => console.log(e));
    });

    helpers.it401sWhenAppDeviceAuthorizationIsInvalid('post', `/apps/${appId}/devices/${testAppDevice.id}/sessions`);
  });
});

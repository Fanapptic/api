const helpers = require('../../helpers');

describe('App Deployments', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/deployments', () => {
    it('200s with created soft app deployment object and the initial testAppDeployment is a hard deployment', done => {
      chai.request(server)
        .post(`/apps/${appId}/deployments`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal(appId);
          response.body.type.should.equal('soft');
          testAppDeployment.type.should.equal('hard');
          done();
        });
    });

    it('400s when no changes have occurred since previous deployment', done => {
      chai.request(server)
        .post(`/apps/${appId}/deployments`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    it('200s with created soft app deployment object owned by app when config changes', done => {
      chai.request(server)
        .patch(`/apps/${appId}`)
        .set('X-Access-Token', testUser.accessToken)
        .send({
          config: {
            tabBar: {
              backgroundGradient: '#CCCCCC, #111111',
            },
          },
        })
      .then(() => {
        chai.request(server)
          .post(`/apps/${appId}/deployments`)
          .set('X-Access-Token', testUser.accessToken)
          .end((error, response) => {
            response.should.have.status(200);
            response.body.should.be.an('object');
            response.body.appId.should.equal(appId);
            response.body.type.should.equal('soft');
            done();
          });
      });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/apps/1/deployments');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('get', '/apps/1241/deployments');
  });

  /*
   * PATCH
   */

  describe('PATCH /apps/{appId}/deployments', () => {
    const fields = {
      status: 'complete',
    };

    it('200s with updated deployment object owned by app', done => {
      chai.request(server)
        .patch(`/apps/${appId}/deployments/1`)
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal(appId);
          response.body.status.should.equal(fields.status);
          done();
        });
    });

    it('400s when passed invalid app deployment id', done => {
      chai.request(server)
        .patch(`/apps/${appId}/deployments/12512`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('patch', '/apps/1/deployments');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('patch', '/apps/2411/deployments');
  });

  /*
   * GET
   */

  describe('GET /apps/{appId}/deployments', () => {
    it('200s with array of app deployment objects owned by app', done => {
      chai.request(server)
        .get(`/apps/${appId}/deployments`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appDeploymentObject => {
            appDeploymentObject.should.be.an('object');
            appDeploymentObject.appId.should.equal(appId);
          });
          done();
        });
    });

    it('200s with app deployment object owned by app when passed app deployment id', done => {
      chai.request(server)
        .get(`/apps/${appId}/deployments/1`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal(appId);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/apps/1/deployments');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('get', '/apps/1241/deployments');
  });
});

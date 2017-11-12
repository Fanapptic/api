const querystring = require('querystring');
const helpers = require('../../../../helpers');

describe('App Module Provider Webhooks', () => {
  /*
   * GET
   */

  describe('GET /apps/{appId}/modules/{appModuleId}/providers/{appModuleProviderId}/webhooks', () => {
    const query = {
      dataSource: 'facebook',
      webhookToken: '71ec605b-085b-434e-b6e1-6b55f0ca4193',
      'hub.mode': 'subscribe',
      'hub.challenge': 'random-182747yfqiyf',
      'hub.verify_token': 'somePointlessSpecificationValue',
    };

    it('200s when passed PubSubHubbub verification and dataSource', done => {
      chai.request(server)
        .get('/apps/*/modules/*/providers/*/webhooks?' + querystring.stringify(query))
        .end((error, response) => {
          response.should.have.status(200);
          done();
        });
    });

    it('400s when missing any PubSubHubbub verification argument', done => {
      const incompleteQuery = Object.assign({}, query, {
        'hub.mode': null,
      });

      chai.request(server)
        .get('/apps/*/modules/*/providers/*/webhooks?' + querystring.stringify(incompleteQuery))
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    it('400s when missing dataSource argument', done => {
      const incompleteQuery = Object.assign({}, query, {
        dataSource: null,
      });

      chai.request(server)
        .get('/apps/*/modules/*/providers/*/webhooks?' + querystring.stringify(incompleteQuery))
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenPassedInvalidWebhookToken(
      'get',
      '/apps/*/modules/*/providers/*/webhooks?' +
        querystring.stringify(Object.assign({}, query, {
          webhookToken: null,
        }))
    );
  });

  /*
   * POST
   */

  describe('POST /apps/{appId}/modules/{appModuleId}/providers/{appModuleProviderId}/webhooks', () => {
    const query = {
      dataSource: 'facebook',
      webhookToken: '71ec605b-085b-434e-b6e1-6b55f0ca4193',
    };

    it('200s when passed dataSource', done => {
      chai.request(server)
        .post('/apps/*/modules/*/providers/*/webhooks?' + querystring.stringify(query))
        .end((error, response) => {
          response.should.have.status(204);
          done();
        });
    });

    it('400s when passed invalid dataSource', done => {
      const invalidQuery = Object.assign({}, query, {
        dataSource: 'dawdaiw',
      });

      chai.request(server)
        .post('/apps/*/modules/*/providers/*/webhooks?' + querystring.stringify(invalidQuery))
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenPassedInvalidWebhookToken(
      'post',
      '/apps/*/modules/*/providers/*/webhooks?' +
        querystring.stringify(Object.assign({}, query, {
          webhookToken: null,
        }))
    );
  });
});

const querystring = require('querystring');
const helpers = require('../../../helpers');

describe('User Agreement Webhooks', () => {
  /*
   * POST
   */

  describe('POST /users/{userId}/agreements/{userAgreementId}/webhooks', () => {
    const query = {
      webhookToken: '71ec605b-085b-434e-b6e1-6b55f0ca4193',
    };

    it('200s with "Hello API Event Received"', done => {
      chai.request(server)
        .post('/users/*/agreements/*/webhooks?' + querystring.stringify(query))
        .end((error, response) => {
          console.log(response.body);
          response.should.have.status(200);
          response.body.should.equal('Hello API Event Received');
          done();
        });
    });

    helpers.it401sWhenPassedInvalidWebhookToken(
      'post',
      '/users/*/agreements/*/webhooks?' +
        querystring.stringify(Object.assign({}, query, {
          webhookToken: null,
        }))
    );
  });
});

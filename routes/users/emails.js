/*
 * Route: /users/:userId/emails/:userEmailId?
 */

const aws = require('aws-sdk');
const UserModel = rootRequire('/models/User');
const UserEmailModel = rootRequire('/models/UserEmail');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const internalAuthorize = rootRequire('/middlewares/internal/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', (request, response, next) => {
  const { user } = request;
  const { userEmailId } = request.params;

  if (userEmailId) {
    UserEmailModel.find({ where: { id: userEmailId, userId: user.id } }).then(userEmail => {
      if (!userEmail) {
        throw new Error('The user email does not exist.');
      }

      response.success(userEmail);
    });
  } else {
    UserEmailModel.findAll({ where: { userId: user.id } }).then(userEmails => {
      response.success(userEmails);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', internalAuthorize);
router.post('/', (request, response, next) => {
  const { Type, Token, TopicArn } = request.body;

  if (Type === 'SubscriptionConfirmation') {
    const sns = new aws.SNS();

    sns.confirmSubscription({
      Token,
      TopicArn,
      AuthenticateOnUnsubscribe: 'true',
    }).send();

    return response.success();
  }

  if (Type === 'Notification') {
    const message = JSON.parse(request.body.Message);
    const source = message.mail.source;
    const recipient = message.mail.destination[0];
    const subject = message.mail.commonHeaders.subject;
    const content = message.content;
    const boundary = content.match(/boundary="(.*)"/)[1];
    const contentParts = message.content.split(boundary);
    const plainContent = contentParts.find(contentPart => {
      return contentPart.indexOf('Content-Type: text/plain') !== -1;
    });
    const htmlContent = contentParts.find(contentPart => {
      return contentPart.indexOf('Content-Type: text/html') !== -1;
    });

    let where = null;

//    if (source.includes('apple') || source.includes('google')) {
      where = { internalEmail: recipient };
//    }

    if (!where) {
      return response.success();
    }

    return UserModel.find({ where }).then(user => {
      if (user) {
        return UserEmailModel.create({
          userId: user.id,
          source,
          recipient,
          subject,
          content,
          plainContent,
          htmlContent,
        });
      }
    }).then(() => {
      response.success();
    }).catch(e => {
      console.log(e);
      response.respondRaw(500); // SNS retries
    });
  }

  response.success();
});

/*
 * Export
 */

module.exports = router;

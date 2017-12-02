/*
 * Route: /users/:userId/agreements/:userAgreementId?
 */

const UserAgreementModel = rootRequire('/models/UserAgreement');
const userAuthorize = rootRequire('/middlewares/users/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', (request, response, next) => {
  const userId = request.user.id;
  const  { userAgreementId } = request.params;

  if (userAgreementId) {
    UserAgreementModel.find({ where: { id: userAgreementId, userId } }).then(userAgreement => {
      if (!userAgreement) {
        throw new Error('The user agreement does not exist.');
      }

      response.success(userAgreement);
    }).catch(next);
  } else {
    UserAgreementModel.findAll({ where: { userId } }).then(userAgreements => {
      response.success(userAgreements);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', userAuthorize);
router.post('/', (request, response, next) => {
  const userId = request.user.id;
  const { email } = request.user;
  const { agreement } = request.body;

  UserAgreementModel.findOrCreate({
    where: {userId, agreement },
    defaults: { userId, agreement, email },
  }).spread(userAgreement => {
    userAgreement.sendSignatureRequestOrReminder();

    response.success(userAgreement);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;

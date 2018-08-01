/*
 * Route: /internal/fanapptic/users/:userId/setup
 */

const UserModel = rootRequire('/models/User');
const internalAuthorize = rootRequire('/middlewares/internal/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */

router.post('/', internalAuthorize);
router.post('/', (request, response, next) => {
  const { userId } = request.params;

  UserModel.find({ where: { id: userId } }).then(user => {
    if (!user) {
      throw new Error('The user does not exist.');
    }

    if (user.status !== 'pending setup') {
      throw new Error('The user is not in "pending setup" status and cannot be queued for account setup.');
    }

    return user.queueAccountSetup();
  }).then(() => {
    response.success();
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;

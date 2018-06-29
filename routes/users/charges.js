/*
 * Route: /users/:userId/charges
 */

const stripeConfig = rootRequire('/config/stripe');
const stripe = require('stripe')(stripeConfig.secretKey);
const UserChargeModel = rootRequire('/models/UserCharge');
const userAuthorize = rootRequire('/middlewares/users/authorize');


const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */

router.post('/', userAuthorize);
router.post('/', (request, response, next) => {
  const { user } = request;
  const { source, amount, description } = request.body;

  stripe.charges.create({
    amount,
    source,
    description,
    currency: 'usd',
  }, function(error, charge) {
    if (error) {
      return next(error);
    }

    UserChargeModel.create({
      userId: user.id,
      details: charge,
    }).then(userCharge => {
      response.success(userCharge);
    }).catch(next);
  });
});

/*
 * Export
 */

module.exports = router;

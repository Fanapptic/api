/*
 * Route: /users/:userId/charges
 */

const stripeConfig = rootRequire('/config/stripe');
const stripe = require('stripe')(stripeConfig.secretKey);
const AppModel = rootRequire('/models/App');
const AppSourceModel = rootRequire('/models/AppSource');
const UserChargeModel = rootRequire('/models/UserCharge');
const userConfig = rootRequire('/config/user');
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
  const { source } = request.body;

  let userCharge = null;

  // The only payment is currently the setup fee, later we can make
  // this allow many types of payments if necessary.

  AppModel.find({ where: { userId: user.id } }).then(app => {
    return AppSourceModel.findAll({ where: { appId: app.id } });
  }).then(appSources => {
    let totalFans = appSources.reduce((total, appSource) => {
      return total + appSource.totalFans;
    }, 0);

    return new Promise((resolve, reject) => {
      if (totalFans < userConfig.setupFansWaiveMinimum) {
        stripe.charges.create({
          source,
          amount: 12500,
          description: 'Fanapptic Setup Fee',
          currency: 'usd',
        }, function(error, charge) {
          if (error) {
            reject(error);
          }

          resolve(charge);
        });
      } else {
        resolve('waived');
      }
    });
  }).then(chargeDetails => {
    return UserChargeModel.create({
      userId: user.id,
      type: 'setup',
      details: chargeDetails,
    });
  }).then(_userCharge => {
    userCharge = _userCharge;

    user.status = 'pending';

    return user.save();
  }).then(() => {
    response.success(userCharge);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;

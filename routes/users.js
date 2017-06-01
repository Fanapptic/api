/*
 * Route: /users
 */

const auth = require('basic-auth');

const UserModel = rootRequire('/models/User');
const AppModel = rootRequire('/models/App');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', (request, response, next) => {
  const authCredentials = auth(request) || {};
  const email = authCredentials.name;
  const password = authCredentials.pass;

  if (!email || !password) {
    throw new Error('Authentication credentials were not provided.');
  }

  let user = null;

  UserModel.findOne({ where: { email } }).then(userInstance => {
    user = userInstance;

    if (!user) {
      throw new Error(`User with email ${email} does not exist.`);
    }

    return user.comparePassword(password);
  }).then(authorized => {
    if (!authorized) {
      throw new Error('The password you provided is incorrect.');
    }

    response.success(user);
  }).catch(next);
});

/*
 * POST
 */

router.post('/', (request, response, next) => {
  const { email, password, firstName, lastName, phoneNumber, paypalEmail } = request.body;

  let user = null;

  return database.transaction(transaction => {
    return UserModel.create({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      paypalEmail,
    }, { transaction }).then(userInstance => {
      user = userInstance;

      return AppModel.create({ userId: user.id }, { transaction });
    }).then(() => {
      response.success(user);
    });
  }).catch(next);
});

/*
 * PATCH
 */

router.patch('/', (request, response, next) => {
  const user = request.user;

  user.email = request.body.email || user.email;
  user.password = request.body.password || user.password;
  user.firstName = request.body.firstName || user.firstName;
  user.lastName = request.body.lastName || user.lastName;
  user.phoneNumber = request.body.phoneNumber || user.phoneNumber;
  user.paypalEmail = request.body.paypalEmail || user.paypalEmail;

  user.save().then(() => {
    response.success(user);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;

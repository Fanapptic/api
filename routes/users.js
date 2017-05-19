/*
 * Route: /users
 */

const auth = require('basic-auth');

const User = rootRequire('/models/User');
const App = rootRequire('/models/App');

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
    return next(new Error('Authentication credentials were not provided.'));
  }

  let user = null;

  User.findOne({ where: { email } }).then(userInstance => {
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
  const { email, password } = request.body;

  let user = null;

  return database.transaction(transaction => {
    return User.create({
      email,
      password,
    }, { transaction }).then(userInstance => {
      user = userInstance;

      return App.create({ userId: user.id }, { transaction });
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

  user.save().then(() => {
    response.success(user);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;

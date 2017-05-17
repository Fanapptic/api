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
  const authCredentials = auth(request);
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

  User.hashPassword(password).then(password => {
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

    });
  }).catch(next);
});

/*
 * PUT
 */

router.put('/', (request, response, next) => {
  const { email, password } = request.body;
});

module.exports = router;

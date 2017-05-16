/*
 Route: /users
 */

const auth = require('basic-auth');
const bcrypt = require('bcrypt');

const User = rootRequire('/models/User');
const App = rootRequire('/models/App');

const router = express.Router({
  mergeParams: true,
});

router.get('/', (request, response, next) => {
  const authCredentials = auth(request);
  const email = authCredentials.name;
  const password = authCredentials.pass;

  if (!email || !password) {
    return next(new Error('Authentication credentials were not provided.'));
  }

  User.findOne({ where: { email } }).then(user => {
    if (!user) {
      throw new Error(`User with email ${email} does not exist.`);
    }

    return bcrypt.compare(password, user.password).then(authorized => {
      if (!authorized) {
        throw new Error('The password you provided is incorrect.');
      }

      response.success(user);
    });
  }).catch(next);
});

router.post('/', (request, response, next) => {
  const { email, password } = request.body;

  bcrypt.hash(password, 10).then(passwordHash => {
    return database.transaction(transaction => {
      // returns the final state of the promise chain to commit or drop the transaction.
      let user = null;

      return User.create({
        email,
        password: passwordHash
      }, { transaction }).then(instance => {
        user = instance;
        return App.create({ userId: instance.id });
      }).then(app => {
        response.success(user);
      });
    });
  }).catch(next);
});

router.put('/', (request, response, next) => {

});

module.exports = router;

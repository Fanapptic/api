/*
 * Route: /users
 */

const auth = require('basic-auth');
const UserModel = rootRequire('/models/User');
const AppModel = rootRequire('/models/App');
const userAuthorize = rootRequire('/middlewares/users/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', (request, response, next) => {
  const accessToken = request.get('X-Access-Token');
  const authCredentials = auth(request) || {};
  const email = authCredentials.name;
  const password = authCredentials.pass;

  if (accessToken) {
    UserModel.find({ where: { accessToken } }).then(user => {
      if (!user) {
        return response.respond(401, 'Invalid access token.');
      }

      response.success(user);
    });
  } else {
    if (!email || !password) {
      throw new Error('Authentication credentials were not provided.');
    }

    let user = null;

    UserModel.find({ where: { email } }).then(_user => {
      user = _user;

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
  }
});

/*
 * POST
 */

router.post('/', (request, response, next) => {
  const { email, password, publisherName, appleEmail, applePassword, appleTeamId, appleTeamName, googleEmail, googlePassword, googleServiceAccount } = request.body;

  let user = null;

  database.transaction(transaction => {
    return UserModel.create({
      email,
      password,
      publisherName,
      appleEmail,
      applePassword,
      appleTeamId,
      appleTeamName,
      googleEmail,
      googlePassword,
      googleServiceAccount,
    }, { transaction }).then(_user => {
      user = _user;

      return AppModel.create({ userId: user.id }, { transaction });
    });
  }).then(() => {
    response.success(user);
  }).catch(next);
});

/*
 * PATCH
 */

router.patch('/', userAuthorize);
router.patch('/', (request, response, next) => {
  const { user } = request;

  user.email = request.body.email || user.email;
  user.password = request.body.password || user.password;
  user.publisherName = request.body.publisherName || user.publisherName;
  user.appleEmail = request.body.appleEmail || user.appleEmail;
  user.applePassword = request.body.applePassword || user.applePassword;
  user.appleTeamId = request.body.appleTeamId || user.appleTeamId;
  user.appleTeamName = request.body.appleTeamName || user.appleTeamName;
  user.googleEmail = request.body.googleEmail || user.googleEmail;
  user.googlePassword = request.body.googlePassword || user.googlePassword;
  user.googleServiceAccount = request.body.googleServiceAccount || user.googleServiceAccount;

  user.save().then(() => {
    response.success(user);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;

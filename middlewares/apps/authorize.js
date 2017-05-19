const App = rootRequire('/models/App');

module.exports = (request, response, next) => {
  const userId = request.user.id;
  const { appId } = request.params;

  App.findAndCountAll({
    where: {
      id: appId,
      userId,
    },
    limit: 1,
  }).then(userHasPermission => {
    if (!userHasPermission) {
      return response.respond(401, 'Insufficient application permissions.');
    }

    next();
  });
};

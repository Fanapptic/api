const App = rootRequire('/models/App');
const AppModule = rootRequire('/models/AppModule');
const Module = rootRequire('/models/Module');
const User = rootRequire('/models/User');

User.hasMany(App);
App.hasMany(AppModule);
Module.hasMany(AppModule);

database.sync({
  force: true,
});

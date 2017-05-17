const App = rootRequire('/models/App');
const AppAdRevenue = rootRequire('/models/AppAdRevenue');
const AppModule = rootRequire('/models/AppModule');
const AppModuleData = rootRequire('/models/AppModuleData');
const AppPushNotification = rootRequire('/models/AppPushNotification');
const AppSession = rootRequire('/models/AppSession');
const AppUser = rootRequire('/models/AppUser');

const Currency = rootRequire('/models/Currency');
const Module = rootRequire('/models/Module');
const User = rootRequire('/models/User');

App.hasMany(AppAdRevenue);
App.hasMany(AppModule);
App.hasMany(AppPushNotification);
App.hasMany(AppSession);
App.hasMany(AppUser);
AppModule.hasMany(AppModuleData);
AppUser.hasMany(AppSession);

Currency.hasMany(AppAdRevenue);
Module.hasMany(AppModule);
User.hasMany(App);

database.sync({
  force: true,
});

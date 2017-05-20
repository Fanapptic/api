const App = rootRequire('/models/App');
const AppDeployment = rootRequire('/models/AppDeployment');
const AppRevenue = rootRequire('/models/AppRevenue');
const AppModule = rootRequire('/models/AppModule');
const AppModuleData = rootRequire('/models/AppModuleData');
const AppPushNotification = rootRequire('/models/AppPushNotification');
const AppSession = rootRequire('/models/AppSession');
const AppUser = rootRequire('/models/AppUser');

const Currency = rootRequire('/models/Currency');
const User = rootRequire('/models/User');

App.hasMany(AppDeployment);
App.hasMany(AppModule);
App.hasMany(AppPushNotification);
App.hasMany(AppRevenue);
App.hasMany(AppSession);
App.hasMany(AppUser);
AppModule.hasMany(AppModuleData);
AppUser.hasMany(AppSession);

Currency.hasMany(AppRevenue);
User.hasMany(App);

database.sync({
  force: true,
});

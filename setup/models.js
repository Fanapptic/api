const AppModel = rootRequire('/models/App');
const AppDeviceModel = rootRequire('/models/AppDevice');
const AppDeviceSessionModel = rootRequire('/models/AppDeviceSession');
const AppNotificationModel = rootRequire('/models/AppNotification');
const AppSourceModel = rootRequire('/models/AppSource');
const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const AppUserModel = rootRequire('/models/AppUser');
const UserModel = rootRequire('/models/User');

AppModel.hasMany(AppUserModel);
AppModel.hasMany(AppDeviceModel);
AppModel.hasMany(AppNotificationModel);
AppModel.hasMany(AppSourceModel);
AppDeviceModel.hasMany(AppDeviceSessionModel);
AppDeviceModel.hasMany(AppNotificationModel);
AppSourceModel.hasMany(AppSourceContentModel);
AppUserModel.hasMany(AppDeviceModel);
AppUserModel.hasMany(AppDeviceSessionModel);

UserModel.hasMany(AppModel);

module.exports = database.sync({force: true});

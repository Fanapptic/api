const AppModel = rootRequire('/models/App');
const AppDeviceModel = rootRequire('/models/AppDevice');
const AppDeviceSessionModel = rootRequire('/models/AppDeviceSession');
const AppFeedActivityModel = rootRequire('/models/AppFeedActivity');
const AppNotificationModel = rootRequire('/models/AppNotification');
const AppSourceModel = rootRequire('/models/AppSource');
const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const AppUserModel = rootRequire('/models/AppUser');
const UserModel = rootRequire('/models/User');

AppModel.hasMany(AppUserModel);
AppModel.hasMany(AppDeviceModel);
AppModel.hasMany(AppFeedActivityModel);
AppModel.hasMany(AppNotificationModel);
AppModel.hasMany(AppSourceModel);
AppDeviceModel.hasMany(AppDeviceSessionModel);
AppDeviceModel.hasMany(AppFeedActivityModel);
AppDeviceModel.hasMany(AppNotificationModel);
AppDeviceSessionModel.hasMany(AppFeedActivityModel);
AppSourceModel.hasMany(AppSourceContentModel);
AppSourceContentModel.hasMany(AppFeedActivityModel);
AppUserModel.hasMany(AppDeviceModel);
AppUserModel.hasMany(AppDeviceSessionModel);
AppUserModel.hasMany(AppFeedActivityModel);

UserModel.hasMany(AppModel);

module.exports = database.sync({force:true});

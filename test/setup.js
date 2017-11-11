/*
 * Set Globals
 */

global.chai = require('chai');
global.chaiHttp = require('chai-http');
global.server = 'http://localhost:8000';

global.internalToken = 'd9d467a6-6afe-11e7-907b-a6006ad3dba0';

global.appId = 1;

global.testUser = {
  id: null,
  email: 'tester@fanapptic.com',
  password: 'testpassword',
  accessToken: null,
  firstName: 'Fanapptic',
  lastName: 'Man',
  phoneNumber: '+12535452412',
  paypalEmail: 'testemail@gmail.com',
};

global.testAppUser = {
  id: null,
  appId: null,
  uuid: null,
  platform: 'ios',
};

global.testAppDeployment = {
  id: null,
  appId: null,
};

global.testAppModule = {
  id: null,
  appId: appId,
  moduleName: 'feed',
  position: 0,
};

global.testAppModuleProvider = {
  source: 'instagram',
  avatarUrl: 'https://scontent.cdninstagram.com/t51.2885-19/s150x150/23161741_371295803327277_1672749771627954176_n.jpg',
  accountId: '6323900411',
  accountName: 'fanapptic',
  accountUrl: 'https://www.instagram.com/fanapptic',
  accessToken: '6323900411.20d8092.0e030ca81339459daea5d3edadd78fde',
  accessTokenSecret: null,
  refreshToken: null,
};

chai.should();
chai.use(chaiHttp);

/*
 * Test Connection
 * Truncate DB
 * Create Global Test User + App In DB
 * Create Global Test App Deployment In DB
 * Create Global Test App User In DB
 * Create Global Test App Module In DB
 * Start Tests
 */

const Sequelize = require('sequelize');
const { database } = require('./config');

before(done => {
  const sequelize = new Sequelize(database.database, database.username, database.password, {
    host: database.host,
    dialect: 'mysql',
    port: database.port,
  });

  fatLog('Testing DB connection...');

  sequelize.authenticate().then(() => {
    fatLog('Truncating DB...');
    sequelize.transaction(transaction => {
      return sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction }).then(() => {
        return sequelize.query(`
          SELECT Concat('TRUNCATE TABLE ',table_schema,'.',TABLE_NAME, ';')
          FROM INFORMATION_SCHEMA.TABLES
          WHERE table_schema in ('${database.database}');`,
          { transaction }
        );
      }).then(results => {
        let truncatePromises = [];

        results[0].forEach(result => {
          Object.keys(result).forEach(key => {
            truncatePromises.push(sequelize.query(result[key], { transaction }));
          });
        });

        return Promise.all(truncatePromises);
      });
    }).then(() => {
      fatLog('Creating global test user & app in DB...');

      return chai.request(server).post('/users').send(testUser);
    }).then(response => {
      fatLog('Making global test user an admin...');

      Object.assign(testUser, response.body);

      return sequelize.query(`
        UPDATE users
        SET admin = 1
        WHERE id = ${testUser.id}
      `);
    }).then(() => {
      fatLog('Updating global test app...');

      return chai.request(server)
        .patch(`/apps/${appId}`)
        .set('X-Access-Token', testUser.accessToken)
        .send({
          name: 'test name',
          displayName: 'cool app',
          subtitle: 'a subtitle',
          description: 'a long description',
          keywords: 'some,great,keywords',
          website: 'http://www.mysite.com/',
          contentRating: '9+',
        });
    }).then(() => {
      fatLog('Adding initial modules to global test app...');

      let promises = [];

      for (let i = 0; i < 2; i++) {
        promises.push(
          chai.request(server)
            .post(`/apps/${appId}/modules`)
            .set('X-Access-Token', testUser.accessToken)
            .send({ moduleName: 'feed' })
        );
      }

      return Promise.all(promises);
    }).then(() => {
      fatLog('Creating global test app user in DB...');

      return chai.request(server).post('/apps/1/users').send(testAppUser);
    }).then(response => {
      Object.assign(testAppUser, response.body);
      fatLog('Creating global test app deployment in DB...');

      return chai.request(server)
        .post('/apps/1/deployments')
        .set('X-Access-Token', testUser.accessToken)
        .send(testAppDeployment);
    }).then(response => {
      Object.assign(testAppDeployment, response.body);
      fatLog('Creating global test app module in DB...');

      return chai.request(server)
        .post('/apps/1/modules')
        .set('X-Access-Token', testUser.accessToken)
        .send(testAppModule);
    }).then(response => {
      Object.assign(testAppModule, response.body);
      fatLog('Creating global test app module provider in DB...');

      return chai.request(server)
        .post('/apps/1/modules/1/providers')
        .set('X-Access-Token', testUser.accessToken)
        .send(testAppModuleProvider);
    }).then(response => {
      Object.assign(testAppModuleProvider, response.body);

      fatLog('Starting tests...');
      done();
    }).catch(error => {
      console.log(error);
    });
  });
});

/*
 * Helpers
 */

function fatLog(message) {
  let divider = Array(message.length + 1).join('=');

  console.log('\n');
  console.log(divider);
  console.log(message);
  console.log(divider);
  console.log('\n');
}

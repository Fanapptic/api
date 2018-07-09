const fs = require('fs');
const portScanner = require('portscanner');

/*
 * Import Environment Variables
 */

require('dotenv').config(); // machine level env takes priority over .env file

/*
 * Start A Local Server Instance
 */

portScanner.checkPortStatus(process.env.PORT, 'localhost', (error, status) => {
  if (status === 'closed') {
    require('../worker');
  }
});

/*
 * Set Globals
 */

global.chai = require('chai');
global.chaiHttp = require('chai-http');
global.server = `http://localhost:${process.env.PORT}`;

global.appId = 1;

global.testApp = {};

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

global.testAppDevice = {
  id: null,
  appId: null,
  uuid: null,
  platform: 'ios',
};

global.testAppDeviceSession = {};

global.testAppSource = {
  type: 'instagram',
  avatarUrl: 'https://scontent.cdninstagram.com/t51.2885-19/11809603_737295259710174_813805448_a.jpg',
  accountId: '417616778',
  accountName: 'braydo25',
  accountUrl: 'https://www.instagram.com/braydo25',
  accessToken: '417616778.f5f72cc.78dcb5562ebe406a82921fe472ef4d65',
  accessTokenSecret: null,
  refreshToken: null,
};

global.testAppUser = {
  facebookAccessToken: 'EAAFfFpdEd8UBAJU0KZBELCD5zry7kxySSuG8sm8F0aLgB6xdXRjqil9EFnqmtZCFSqIWAGglkmPYFpZCZCs8Bn9KNdXLy6covzFweZCSfymqZAJUtGjor3YE4RDVt4r7qochm3zp78gBUp2ZAXJU950z9RPbOKkUjZCZCZCv0hGbZBCV0Illm9pPvv1',
};

/*
 * Configure Chai
 */

chai.should();
chai.use(chaiHttp);

/*
 * Setup Test Environment
 */

const waitPort = require('wait-port');
const Sequelize = require('sequelize');
const databaseConfig = {
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_WRITE_HOST,
  port: process.env.MYSQL_PORT,
};

before(done => {
  const database = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, {
    host: databaseConfig.host,
    dialect: 'mysql',
    port: databaseConfig.port,
  });

  waitPort({
    host: 'localhost',
    port: parseInt(process.env.PORT),
  }).then(() => {
    fatLog('Testing DB Connection');

    return database.authenticate();
  }).then(() => {
    fatLog('Truncating DB...');

    return database.transaction(transaction => {
      return database.query('SET FOREIGN_KEY_CHECKS = 0', { transaction }).then(() => {
        return database.query(`
          SELECT Concat('TRUNCATE TABLE ',table_schema,'.',TABLE_NAME, ';')
          FROM INFORMATION_SCHEMA.TABLES
          WHERE table_schema in ('${databaseConfig.database}');`,
          { transaction }
        );
      }).then(results => {
        let truncatePromises = [];

        results[0].forEach(result => {
          Object.keys(result).forEach(key => {
            truncatePromises.push(database.query(result[key], { transaction }));
          });
        });

        return Promise.all(truncatePromises);
      });
    });
  }).then(() => {
    fatLog('Creating global test user & app in DB...');

    return chai.request(server).post('/users').send(testUser);
  }).then(response => {
    Object.assign(testUser, response.body);

    fatLog('Adding icon to global test app...');

    return chai.request(server)
      .patch(`/apps/${appId}`)
      .set('X-Access-Token', testUser.accessToken)
      .attach('icon', fs.readFileSync('./test/icon.png'), 'icon.png');
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
  }).then(response => {
    fatLog('Creating global test app device in DB...');

    Object.assign(testApp, response.body);

    return chai.request(server)
      .post('/apps/1/devices')
      .set('X-App-Access-Token', testApp.accessToken)
      .send(testAppDevice);
  }).then(response => {
    Object.assign(testAppDevice, response.body);

    fatLog('Creating global test app user in DB...');

    return chai.request(server)
      .post(`/apps/${appId}/users`)
      .set('X-App-Access-Token', testApp.accessToken)
      .send(testAppUser);
  }).then(response => {
    Object.assign(testAppUser, response.body);

    fatLog('Creating global test app device session in DB...');

    return chai.request(server)
      .post('/apps/1/devices/1/sessions')
      .set('X-App-Device-Access-Token', testAppDevice.accessToken)
      .send(testAppDeviceSession);
  }).then(response => {
    Object.assign(testAppDeviceSession, response.body);

    fatLog('Creating global test app source in DB...');

    return chai.request(server)
      .post(`/apps/${appId}/sources`)
      .set('X-Access-Token', testUser.accessToken)
      .send(testAppSource);
  }).then(response => {
    Object.assign(testAppSource, response.body);

    fatLog('Starting tests...');

    done();
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

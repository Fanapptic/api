const express = require('express');
const app = express();

require('dotenv').config(); // reimport of .env required per forked worker

require('./setup/globals');
rootRequire('/setup/aws');
rootRequire('/setup/prototypes');
rootRequire('/setup/models').then(() => { // wait for DB + Models to connect & sync...
  rootRequire('/setup/middlewares')(app);
  rootRequire('/setup/routes')(app);

  app.listen(process.env.PORT, () => {
    console.log(`HTTP: WORKER LISTENING ON PORT: ${process.env.PORT}`);
  });
});

// TODO: Check maxConnections default of 5, raise it to prevent efficiency limits.

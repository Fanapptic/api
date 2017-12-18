const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

require('dotenv').config(); // machine level env takes priority over .env file

require('./setup/globals');
rootRequire('/setup/aws');
rootRequire('/setup/prototypes');
rootRequire('/setup/models');
rootRequire('/setup/middlewares')(app);
rootRequire('/setup/routes')(app);

app.listen(port, () => {
  console.log(`HTTP: WORKER LISTENING ON PORT: ${port}`);
});

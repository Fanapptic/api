const express = require('express');
const app = express();

const port = process.env.PORT || 8000;

rootRequire('/setup/prototypes');
rootRequire('/setup/models');
rootRequire('/setup/middlewares')(app);
rootRequire('/setup/routes')(app);

// testing
rootRequire('/libs/app/configPackager');
// testing

app.listen(port, () => {
  console.log(`HTTP: WORKER LISTENING ON PORT: ${port}`);
});

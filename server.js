require('dotenv').config();
const express = require('express');
const {PORT } = require('./config');
const bodyParser = require("body-parser");
const {cors} = require('./tools/cors');
const {router} = require('./routers/router-main');
const { errorHandler } = require('./tools/tools');
const jsonParser = bodyParser.json();
app = express();
app.use(jsonParser);

app.use(cors);
app.use('/api',router);
app.use(errorHandler);

function runServer(port = PORT) {

    server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
    })
  }
  
  
  if (require.main === module) {
    runServer();
  }
  
  module.exports = { app, runServer };
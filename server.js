require('dotenv').config();
const express = require('express');
const {PORT } = require('./config');
const bodyParser = require("body-parser");
const {cors} = require('./tools/cors');
const jsonParser = bodyParser.json();
app = express();
app.use(jsonParser);

app.use(cors);

function runServer(port = PORT) {

    server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
    })
  }
  
  
  if (require.main === module) {
    runServer();
  }
  
  module.exports = { app, runServer };
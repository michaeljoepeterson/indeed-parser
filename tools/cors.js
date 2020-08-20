const {DOMAINS } = require('../config');

function cors(req, res, next){
    let origin = req.headers.origin;
    let allowedOrigins = DOMAINS.split(',');
    if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
}

module.exports = {cors};
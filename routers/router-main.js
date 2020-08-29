const express = require('express');
const router = express.Router();
const {router:searchIndeed} = require('./search-indeed');
const {router:geonames} = require('./geonames-router');

router.use('/search',searchIndeed);
router.use('/geonames',geonames);

module.exports = {router};
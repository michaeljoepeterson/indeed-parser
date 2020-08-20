const express = require('express');
const router = express.Router();
const {router:searchIndeed} = require('./search-indeed');

router.use('/search',searchIndeed);

module.exports = {router};
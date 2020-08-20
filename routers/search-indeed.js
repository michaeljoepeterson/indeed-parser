const express = require('express');
const router = express.Router();
const axios = require('axios');
router.get('/',async (req,res,next) => {
    return res.json({
        code:200,
        message:'Success'
    })
});

module.exports = {router};
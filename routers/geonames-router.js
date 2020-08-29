const express = require('express');
const router = express.Router();
const {GeonamesInterface} = require('../models/geonames');

router.get('/getId',async (req,res,next) => {
    let {name} = req.query;
    let geonames = new GeonamesInterface();
    try{
        let id = await geonames.getId(name);
        return res.json({
            message:'success',
            id
        });
    }
    catch(err){
        console.log('error getting geoid',err);
        next();
    }

    
});

module.exports = {router};
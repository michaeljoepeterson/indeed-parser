const express = require('express');
const router = express.Router();
const {GeonamesInterface} = require('../models/geonames');

router.get('/getId',async (req,res,next) => {
    let {name} = req.query;
    let geonames = new GeonamesInterface();
    //check cache before
    try{
        let id = await geonames.getId(name);
        return res.json({
            code:200,
            message:'success',
            id
        });
    }
    catch(err){
        console.log('error getting geoid',err);
        next();
    }

    
});
//default route to get provinces
router.get('/provinces',async (req,res,next) => {
    let {name} = req.query;
    let geonames = new GeonamesInterface();
    //check cache before
    try{
        let provinces = await geonames.getChildren();
        return res.json({
            code:200,
            message:'success',
            provinces
        });
    }
    catch(err){
        console.log('error getting geoid',err);
        next();
    }

    
});

module.exports = {router};
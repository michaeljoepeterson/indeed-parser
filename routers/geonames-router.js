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

router.get('/cities',async (req,res,next) => {
    let {name} = req.query;
    let geonames = new GeonamesInterface();
    //check cache before for existing id to speed up dropdowns
    try{
        let id = await geonames.getId(name);
        let cities = await geonames.getChildren(id);
        return res.json({
            code:200,
            message:'success',
            cities
        });
    }
    catch(err){
        console.log('error getting geoid',err);
        next();
    }

    
});

module.exports = {router};
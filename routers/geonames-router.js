const express = require('express');
const router = express.Router();
const {GeonamesInterface} = require('../models/geonames');
const {Wikipedia} = require('../models/wikipedia');
const NodeCache = require( "node-cache" );
let timeOutDefault = (60 * 1000) * 15;
let checkPeriod = (60 * 1000) * 20;
const myCache = new NodeCache({ stdTTL: timeOutDefault, checkperiod: checkPeriod });

router.get('/getId',async (req,res,next) => {
    let {name} = req.query;
    let existingId = myCache.get(name);
    if(existingId){
        return res.json({
            code:200,
            message:'success existing',
            id:existingId
        });
    }
    let geonames = new GeonamesInterface();
    
    try{
        let id = await geonames.getId(name);
        myCache.set( name, id );
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
    let provinceKey = 'provinces';
    let existingProvinces = myCache.get(provinceKey);
    if(existingProvinces){
        return res.json({
            code:200,
            message:'success existing',
            provinces:existingProvinces
        });
    }
    try{
        let provinces = await geonames.getChildren();
        myCache.set( provinceKey, provinces );
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
    let wiki = new Wikipedia();
    let existingCities = myCache.get(name);
    if(existingCities){
        return res.json({
            code:200,
            message:'success existing',
            cities:existingCities
        });
    }
    try{
        //let id = await geonames.getProvince(name);
        //let isBc = name.toLowerCase() === 'british columbia' ? true:false;
        //let cities = await geonames.getChildren(id,isBc);
        let cities = await wiki.findCities(name);
        myCache.set( name, cities );
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
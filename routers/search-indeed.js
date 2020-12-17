const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio'); 
const {IndeedData} = require('../models/indeed-data');
router.get('/',async (req,res,next) => {
    let defaultQuery = 'q=security+guard&l=Edmonton%2C+AB&radius=25&start=30'
    let {city,province,radius,page} = req.query;
    console.log(req.query);
    let query = !city ? defaultQuery : `q=security+guard&l=${city}+${province}&radius=${radius}&start=${page}`;
    let url = `https://ca.indeed.com/jobs?${query}`;
    console.log(url);
    try{
        let response = await axios.get(url);
        //console.log(response);
        let cleanedData = response.data.trim().replace(/\r?\n|\r/g,'');
        const $ = cheerio.load(response.data.trim());
        //console.log(cleanedData);
        //console.log(body$.html());
        let jobs =  []; 
        //select by attribute create jobs differently
        $('.jobtitle').each(async function(i, item){
            let item$ = $(item);
            let initOptions = {
                item:item,
                type:'attribute',
                item$
            };
            //console.log('job title?',item$.text());
            let data = new IndeedData(initOptions);
            jobs.push(data);
        });
        //console.log(jobs);
        
        jobs = await Promise.all (jobs.map(async(job) => {
            //await job.findData();
            return job.serialize();
        }));
        
        return res.json({
            code:200,
            results:jobs
        });
    }
    catch(err){
        console.log(err);
        next();
    }

    
});

module.exports = {router};
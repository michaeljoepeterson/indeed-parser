const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio'); 
const {IndeedData} = require('../models/indeed-data');
router.get('/',async (req,res,next) => {
    let url = 'https://ca.indeed.com/m/jobs?q=security+guard&l=Edmonton%2C+AB&radius=25&start=10';
    try{
        let  response = await axios.get(url);
        //console.log(response);
        const $ = cheerio.load(response.data);
        const jobs =  []; 

        $('.salary').each((i,item) => {
            let item$ = $(item);
            let parent$ = $(item$.parent('p'));
            //console.log(parent$.html())
        });
        let pTags = $('p');

        $('.jobTitle').each(function(i, item){
            let item$ = $(item);
            let wage$ = item$.nextAll('.salary');
            console.log('item html============',item$.html())
            console.log('item html============',item$.next().next().next().next().text())
            console.log('parent html============',wage$.html());
            let data = new IndeedData(item$);
            jobs.push(data);
        });
        //console.log(jobs);
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
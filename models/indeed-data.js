const {BASE_URL} = require('../config');
const cheerio = require('cheerio'); 
const axios = require('axios');

class IndeedData{
    jobtitle = null;
    company = null;
    formattedLocation = null;
    //days ago
    date = null;
    url = null;
    //nice to have
    latitude = null;
    longitude = null;
    wage = null;
    baseUrl = BASE_URL;
    description = null;
    attributeInitType = 'attribute';

    companyChecks = ['span[class=icl-u-textColor--success]','.icl-u-xs-mr--xs > a',{
        selector:'.jobsearch-DesktopStickyContainer-companyrating',
        child:0
    }];
    descriptionChecks = ['#jobDescriptionText']

    constructor(options){
        let {type,item,item$} = options;
        if(item$ && !type){
            this.extractData(item$);
        }
        if(item$ && type === this.attributeInitType){
            this.extractByAttribute(item,item$)
        }
    }

    checkWage = (item$)  => {
        let wage = item$.next().next().next().next().text();
        if(wage.includes('$')){
            return true;
        }
        else{
            return false;
        }
    }

    extractData = (item$) => {
        this.jobtitle = item$.find('a[data-tn-element="jobTitle"]').text();
        this.url = this.baseUrl + item$.find('a[rel="nofollow"]').attr('href');
        let isWage = this.checkWage(item$);
        if(isWage){
            this.wage = item$.nextAll('.salary').html();
        }
        this.formattedLocation = item$.nextAll('.location').html();
        this.date = item$.nextAll('.date').html();
    }

    extractByAttribute = (item,item$) =>{
        //console.log(item.attribs);
        this.jobtitle = item$.text().trim();
        let locationContainer = item$.parent().next('.sjcl')
        this.company = locationContainer.find('.company').text().trim();
        let mouseDown = locationContainer.find('.company').html()//.attr('target');
        let jobIdRegex = /fromjk=(.*?)\&/gi;
        let matches = jobIdRegex.exec(mouseDown);
        let recJobMatch = null;
        console.log(mouseDown);
        if(matches){
            this.url = `${this.baseUrl}viewjob?jk=${matches[1]}`
        }
        if(!matches){
            let recJobContainer = locationContainer.find('.recJobLoc');
            let id = recJobContainer.attr('id').replace('recJobLoc_','');
            this.url = `${this.baseUrl}viewjob?jk=${id}`;
        }
        else if(!matches && ! recJobMatch){
            console.log('==============no match: ======================');
            this.url = `${this.baseUrl}viewjob?jk=${item$.attr('id').replace('jl_','')}`
        }
        let dateContainer = item$.parent().siblings('.jobsearch-SerpJobCard-footer');
        let date = dateContainer.find('.date');
        this.date = date.text().trim();
        console.log(this.jobtitle);
        console.log(this.company);
        console.log(this.url);
        console.log(this.date);
        //console.log(item$.attr('id').replace('jl_',''));
        console.log('===============');
    }
    //to do combine functions
    checkCompany = ($) =>{
        let company = null;

        for(let i = 0;i < this.companyChecks.length;i++){
            let checkString = this.companyChecks[i];
            let companyFound = null;
            if(typeof checkString === 'string'){
                companyFound = $(checkString).text();
            }
            else{
                let parent = $(checkString.selector);
                if(checkString.child === 0){
                    companyFound = parent.children().first().text();
                }
            }
            
            if(companyFound && companyFound !== ''){
                company = companyFound;
                return company;
            }
        }

        return company;
    }

    escapeChars = (text) => {
        return text.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    checkDescription = ($) => {
        let description = null;

        for(let i = 0;i < this.descriptionChecks.length;i++){
            let checkString = this.descriptionChecks[i];
            let descriptionFound = null
            if(typeof checkString === 'string'){
                description = $(checkString).html();
            }
            else{

            }

            if(descriptionFound && descriptionFound !== ''){
                description = descriptionFound;
                return description;
            }

        }
        description = this.escapeChars(description);

        return description;
    }

    findData = async () => {
        try{
            if(this.url){
                let response = await axios.get(this.url);
                let cleanedData = response.data.trim().replace(/\r?\n|\r/g,'');
                const $ = cheerio.load(cleanedData);

                this.company = this.checkCompany($);
                this.description = this.checkDescription($);
            }
            else{
                throw 'No Url';
            }
        }
        catch(err){
            throw(err);
        }
        
    }

    serialize = () => {
        return {
            jobtitle:this.jobtitle,
            company:this.company,
            formattedLocation:this.formattedLocation,
            date:this.date,
            url:this.url,
            latitude:this.latitude,
            longitude:this.longitude,
            wage:this.wage,
            description:this.description
        };
    }
}

module.exports = {IndeedData};
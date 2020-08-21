const {BASE_URL} = require('../config');

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

    constructor(item$){
        this.extractData(item$);
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
        this.jobtitle = item$.find('a[rel="nofollow"]').text();
        this.url = this.baseUrl + item$.find('a[rel="nofollow"]').attr('href');
        let isWage = this.checkWage(item$);
        if(isWage){
            this.wage = item$.nextAll('.salary').html();
        }
        this.formattedLocation = item$.nextAll('.location').html();
        this.date = item$.nextAll('.date').html();
    }
}

module.exports = {IndeedData};
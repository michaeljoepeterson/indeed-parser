const axios = require('axios');
const cheerio = require('cheerio'); 
const {WIKI_URL} = require('../config');

class Wikipedia{

    buildCityUrl = (province) => {
        if(province === 'Northwest Territories'){
            province = 'the ' + province;
        }
        let municipalites = {
            'the Northwest Territories':true,
            'Newfoundland and Labrador':true,
            'Prince Edward Island':true,
            'Nunavut':true,
            'Yukon':true
        }
        let splitProvince = province.trim().split(' ');
        splitProvince = splitProvince.map(name => {
            if(name !== 'and' && name !== 'the'){
                name = name.charAt(0).toUpperCase() + name.slice(1);
            }
            
            return name;
        });
        
        let joinedProvince = splitProvince.join(' ');
        console.log('===========',splitProvince,joinedProvince);
        let selector = municipalites[province] ? 'municipalities' : 'cities';
        let endpoint = `${WIKI_URL}List_of_${selector}_in_${joinedProvince.replace(/\s/g,'_')}`;
        return endpoint;
    }

    cleanCity = (city) =>{
        let squareRegex = /\[.*\]/g;
        let bracketRegex = /\(.*\)/g
        let cleaneCity = city.replace(squareRegex,'');
        cleaneCity = cleaneCity.replace(bracketRegex,'');

        return cleaneCity;
    }

    filterCities = (cities) => {
        let filters = ['total','35,944'];
        let filteredCities = cities.filter(city => {
            let hasFilter = filters.find(filter => city.toLowerCase().includes(filter));
            if(city === '' || city === '-' || city === '—'){
                return false;
            }
            else if(hasFilter){
                return false;
            }
            else{
                return true;
            }
        });

        return filteredCities;
    }

    findCities = async (province) => {
       
        try{
            let url = this.buildCityUrl(province);
            console.log(url);
            let response = await axios.get(url);
            let cleanedData = response.data.trim().replace(/\r?\n|\r/g,'');
            const $ = cheerio.load(cleanedData);
            let cities = [];
            $('.wikitable,.sortable').each((i, item) => {
                if(i === 0){
                    let item$ = $(item);
                    let rows$ = $(item$.find('tr'));
                    rows$.each((i, row) => {
                        if(i !== rows$.length -1 && i !== 0){
                            let row$ = $(row);
                            let city$ = row$.find('td').first();
                            //console.log(city$.text());
                            cities.push(city$.text());
                        }
                        
                    });
                } 
            });
            cities = cities.map(city => this.cleanCity(city));
            cities = this.filterCities(cities);
            return cities.sort();
        }
        catch(err){
            throw err;
        }
        
    }

}

module.exports = {Wikipedia};
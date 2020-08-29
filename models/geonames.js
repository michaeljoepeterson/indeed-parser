const axios = require('axios');
const {GEONAMES_URL, GEONAMES_USER,CANADA_ID} = require('../config');

class GeonamesInterface{
    constructor(){

    }

    getId = async(name) => {
        try{
            let url = `${GEONAMES_URL}searchJSON?name=${name}&username=${GEONAMES_USER}`;
            let results = await axios.get(url);
            let data = results.data;
            let id = data.geonames && data.geonames.length > 0 ? data.geonames[0].geonameId : null;
            return id;
        }
        catch(err){
            throw err;
        }
    }

    cleanCities = (cities) => {
        let filters = ['county of', 'improvement','municipal'];
        let cleanedCities = cities.filter(city => {
            let lowerCity = city.toLowerCase();
            let hasFilter = filters.find(filter => lowerCity.includes(filter));
            if(!hasFilter){
                return true;
            }
            else{
                return false;
            }
        });

        return cleanedCities.sort();
    }

    getChildren = async(id,isBc) => {
        try{

                id = id ? id : CANADA_ID;
                let url = `${GEONAMES_URL}childrenJSON?geonameId=${id}&username=${GEONAMES_USER}`;
                let results = await axios.get(url);
                let data = results.data;
                let names = results.data.geonames && results.data.geonames.length > 0 ? data.geonames.map(child => child.name)
                : null;
                if(isBc){
                    let allNames = [];
                    //console.log(data.geonames);
                    names = await Promise.all(data.geonames.map(async (district)=>{
                        let id = district.geonameId;
                        console.log('getting next cities: ');
                        let cities = await this.getChildren(id);
                        allNames = allNames.concat(cities);
                        console.log(id,allNames);
                    }));
                    allNames = allNames.sort();
                    allNames = allNames.filter((value, index, self) => self.indexOf(value) === index);
                    allNames = this.cleanCities(allNames);
                    return allNames
                }
                else{
                    names = this.cleanCities(names);
                    return names;
                }
                
        }
        catch(err){
            throw err;
        }
    }

    getProvince = async(name) => {
        try{
            let target = 'first-order administrative division';
            let url = `${GEONAMES_URL}searchJSON?name=${name}&username=${GEONAMES_USER}`;
            let results = await axios.get(url);
            let data = results.data;
            let province = data.geonames && data.geonames.length > 0 ? data.geonames.find(result => result.fcodeName.trim() === target) : null;
    
            return province.geonameId;
        }
        catch(err){
            throw err;
        }
    }
}

module.exports = {GeonamesInterface};
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

    getChildren = async(id) => {
        try{
            id = id ? id : CANADA_ID;
            let url = `${GEONAMES_URL}childrenJSON?geonameId=${id}&username=${GEONAMES_USER}`;
            let results = await axios.get(url);
            let data = results.data;
            let names = results.data.geonames && results.data.geonames.length > 0 ? data.geonames.map(child => child.name)
             : null;
            return names;
        }
        catch(err){
            throw err;
        }
    }
}

module.exports = {GeonamesInterface};
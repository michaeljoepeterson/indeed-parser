const axios = require('axios');
const {GEONAMES_URL, GEONAMES_USER} = require('../config');

class GeonamesInterface{
    constructor(){

    }

    getId = async (name) => {
        try{
            let url = `${GEONAMES_URL}searchJSON?name=${name}&username=${GEONAMES_USER}`;
            let results = await axios.get(url);
            console.log(results);
            let id = results.data.geonames && results.data.geonames.length > 0 ? results.data.geonames[0].geonameId : null;
            return id;
        }
        catch(err){
            throw err;
        }
    }
}

module.exports = {GeonamesInterface};
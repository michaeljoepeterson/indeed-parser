async function getCities(event,data){
    console.log('get cities',event);
    console.log(data);
    let city = data.value;

    let url = '/api/geonames/cities?name=' + city;
    let options = {
        url
    };
    try{
        let results = await $.ajax(options);
        console.log('cities: ',results.provinces);
        
        let cityOptions = {
            label:"City",
            searchContainerId:'city-search',
            results:results.cities
        };
        var citySearch = new SearchList(cityOptions);
    }
    catch(err){
        console.log('error getting provinces: ',err);
    }
}

async function getProvinces(){
    let url = '/api/geonames/provinces';
    let options = {
        url
    };
    try{
        let results = await $.ajax(options);
        return results.provinces;
    }
    catch(err){
        console.log('error getting provinces: ',err);
    }
}

function initJobList(){
    let jobOptions = {
        jobResultsId:'indeed-results',
        parentClass:'job-list-container'
    }
    var jobSearch = new JobList(jobOptions);
}


async function initSearches(){
    

    let provinceOptions = {
        label:"Province",
        searchContainerId:'provinces-search',
        results:['Alberta','BC','Manitoba'],
        selectListener:getCities
    };
    let provinces = await getProvinces();
    provinceOptions.results = provinces;
    
    var provinceSearch = new SearchList(provinceOptions);
}

function initPage(){
    initJobList();
    initSearches();
}

$(initPage);
class JobSearchApp{
    searchClass = '.search-container';
    provinceSearch;
    citySearch;
    jobSearch;

    constructor(){
        this.initJobList();
        this.initSearches();
        this.initSubmit();
    }

    submitSearch= (event) => {
        event.preventDefault();
        console.log(event);
    }

    initSubmit = () =>{
        $(this.searchClass).submit(event => {
            this.submitSearch(event);
        });
    }

    getCities = async (event,data) =>{
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
            this.citySearch = new SearchList(cityOptions);
        }
        catch(err){
            console.log('error getting provinces: ',err);
        }
    }

     getProvinces = async () =>{
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

    initJobList = () =>{
        let jobOptions = {
            jobResultsId:'indeed-results',
            parentClass:'job-list-container'
        }
        
        this.jobSearch = new JobList(jobOptions);
    }
    initSearches = async() =>{
    

        let provinceOptions = {
            label:"Province",
            searchContainerId:'provinces-search',
            results:['Alberta','BC','Manitoba'],
            selectListener:this.getCities
        };
        let provinces = await this.getProvinces();
        provinceOptions.results = provinces;
        
        this.provinceSearch = new SearchList(provinceOptions);
    }
}


function initPage(){

    var app = new JobSearchApp();
}

$(initPage);
class JobSearchApp{
    searchClass = '.search-container';
    provinceSearch;
    citySearch;
    jobSearch;

    constructor(){
        this.loader = $(".loader-container");
        this.loadStartEvent = 'jobsLoading';
        this.loadDoneEvent = 'jobsDone';
        this.initJobList();
        this.initSearches();
        this.initSubmit();
        this.initLoader();
    }

    initLoader = () => {
        $(document).on(this.loadStartEvent,(event) => {
            this.jobsLoading();
        });

        $(document).on(this.loadDoneEvent,(event) => {
            this.jobsDone();
        });
    }

    jobsLoading = () => {
        this.loader.removeClass('hide');
    }

    jobsDone = () => {
        this.loader.addClass('hide');
    }

    submitSearch= (event) => {
        event.preventDefault();
        let province = this.provinceSearch.getValue();
        let city = this.citySearch.getValue();
        if(city && province){
            this.initJobList(province,city);
        }
        console.log(province,city);
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

    initJobList = (province,city) =>{
        let shortList = document.URL.includes('short-list') ? true : false;
        let jobOptions = {
            jobResultsId:'indeed-results',
            parentClass:'job-list-container',
            shortList
        };
        if(city && province){
            let radius = $('#radius').val();
            jobOptions.urlOptions = {
                province,
                city,
                radius
            }
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
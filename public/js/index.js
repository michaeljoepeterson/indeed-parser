function initJobList(){
    let jobOptions = {
        jobResultsId:'indeed-results'
    }
    var jobSearch = new JobSearch(jobOptions);
}


function initSearches(){
    let cityOptions = {
        label:"City",
        searchContainerId:'city-search',
        results:['Edmonton','Calgary']
    };

    let provinceOptions = {
        label:"Province",
        searchContainerId:'provinces-search',
        results:['Alberta','BC','Manitoba']
    };
    var citySearch = new SearchList(cityOptions);
    var provinceSearch = new SearchList(provinceOptions);
}

function initPage(){
    initJobList();
    initSearches();
}

$(initPage);
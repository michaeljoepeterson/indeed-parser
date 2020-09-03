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
    var citySearch = new SearchList(cityOptions);
    //var provinceSearch = new SearchList();
}

function initPage(){
    initJobList();
    initSearches();
}

$(initPage);
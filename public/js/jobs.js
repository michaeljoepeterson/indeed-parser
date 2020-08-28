function JobSearch(options){
    this.constructor(options)
}

JobSearch.prototype.constructor = function(options){
    
    this.resultContainer = $('#' + options.jobResultsId);
    console.log('get jobs',this.resultContainer);
    this.getJobs();
}

JobSearch.prototype.getJobs = function(){
    let url = '/api/search?q=security+guard&l=Edmonton%2C+AB&radius=25&start=30';
    let options = {
        url
    };

    $.ajax(options)

    .then(response => {
        console.log('results: ',response);
        try{
            this.buildResults(response.results);
        }
        catch(err){
            console.log('error getting results after', response)
        }
    })

    .catch(err => {
        console.log('error getting results', err);
    });
}

JobSearch.prototype.buildResults = function(jobs){
    for(let i = 0;i < jobs.length;i++){
        let job = jobs[i];
        let jobeElement = this.buildJob(job);
        $(this.resultContainer[0]).append(jobeElement);
    }
}

JobSearch.prototype.buildJob = function(job){
    let jobElement = $('<div></div>');
    let title = $('<p></p>');
    title.text(job.jobtitle);
    let company = $('<p></p>');
    company.text(job.company);
    
    jobElement.append(title);
    jobElement.append(company);
    
    return jobElement;
}
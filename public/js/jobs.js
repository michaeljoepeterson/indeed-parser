
/*
class JobSearch {

    constructor(options) {

        this.resultContainer = $('#' + options.jobResultsId);
        console.log('get jobs', this.resultContainer);
        this.getJobs();
    }
    getJobs() {
        let url = '/api/search?q=security+guard&l=Edmonton%2C+AB&radius=25&start=30';
        let options = {
            url
        };

        $.ajax(options)

            .then(response => {
                console.log('results: ', response);
                try {
                    this.buildResults(response.results);
                }
                catch (err) {
                    console.log('error getting results after', response);
                }
            })

            .catch(err => {
                console.log('error getting results', err);
            });
    }
    buildResults(jobs) {
        for (let i = 0; i < jobs.length; i++) {
            let job = jobs[i];
            let jobeElement = this.buildJob(job);
            $(this.resultContainer[0]).append(jobeElement);
        }
    }
    buildJob(job) {
        let jobElement = $('<div></div>');
        let title = $('<p></p>');
        title.text(job.jobtitle);
        let company = $('<p></p>');
        company.text(job.company);

        jobElement.append(title);
        jobElement.append(company);

        return jobElement;
    }
}

*/

class JobList {

    addScrollListener() {
        $('#load-button').click(function (e) {
            this.loadJobs();
        }.bind(this));
    }
    loadJobs() {
        if (this.currentPage <= this.lastPage) {
            var self = this;
            //will need to add this to get jobs in prod
            this.loader.removeClass(this.hideClass);
            setTimeout(function () {
                self.getJobs(self.currentPage, true);
            }, 3000);
        }
    }
    initCardListener(card) {
        var self = this;
        //remove any existing click listeners
        card.unbind();
        card.click(function (event) {
            var index = $(this).data(this.jobIndex).jobIndex;
            if(self.useMap){
                self.setJobPosition(index);
            }
        });
    }
    setJobPosition(index) {
        var job = this.jobData[index];
        this.mapInterface.positionMap(job, index);
    }
    buildSingleCard(cardData, index) {
        var card = $('<div class="row job-card"></div>');
        var titleContainer = $('<div class="job-card-titles col-sm-12 col-md-6"></div>');
        var descContainer = $('<div class="job-card-description col-sm-12 col-md-6"></div>');
        var jobTitle = $('<p class="job-title"></p>');
        var jobLink = $('<a></a>');
        var jobCompany = $('<p class="job-company"></p>');
        jobCompany.text(cardData.company);
        var jobLocation = $('<p class="job-location"></p>');
        jobLocation.text(cardData.formattedLocationFull);
        var jobDate = $('<p class="job-date"></p>');
        jobDate.text(cardData.date);
        var jobDesc = $('<p></p>');
        jobDesc.text(cardData.snippet);
        //build link
        jobLink.attr('href', cardData.url);
        jobLink.attr('target', '_blank');
        jobLink.text(cardData.jobtitle);
        //build title and description containers
        jobTitle.append(jobLink);
        titleContainer.append(jobTitle);
        titleContainer.append(jobCompany);
        titleContainer.append(jobLocation);
        titleContainer.append(jobDate);
        descContainer.append(jobDesc);
        //add to card
        card.append(titleContainer);
        card.append(descContainer);
        //use for retrieving data
        card.attr('data-' + this.jobIndex, index);
        return card;
    }
    buildCards(data, addPage) {
        try {
            var jobCard = $('<div class="job-cards"></div>');
            let jobCards = addPage ? $(this.jobCardsContainer) : null;
            for (var i = 0; i < data.length; i++) {
                var cardData = data[i];
                var card = this.buildSingleCard(cardData, this.cardIndex);

                if (addPage) {
                    jobCards.append(card);
                }
                else {
                    jobCard.append(card);
                }
                this.initCardListener(card);
                this.cardIndex++;
            }
            if (!addPage) {
                this.parent.append(jobCard);
            }
        }
        catch (err) {
            console.log("Error building cards: ", err);
        }

    }
    //placeholder for ajax calls
    //need seperate function for appending jobs
    getJobs(page, addPage) {

        if (!this.gettingJobs) {
            this.gettingJobs = true;
            let url = '/api/search?q=security+guard&l=Edmonton%2C+AB&radius=25&start=30';
            if (page) {
                //url += '?page=' + page;
            }
            var req = {
                method: 'GET',
                url: url
            };

            $.ajax(req)

                .then(response => {
                    console.log(response);
                    let data =response.results;
                    this.buildCards(data, addPage);
                    this.jobData = this.jobData.concat(data);
                    //this.mapOptions.jobData = addPage ? this.jobData : response.data.results;
                    //this.mapInterface = new MapInterface(this.mapOptions);
                    this.currentPage++;
                    this.loader.addClass(this.hideClass);
                    this.gettingJobs = false;
                })

                .catch(err => {
                    console.log('Error getting data: ', err);
                    this.loader.addClass(this.hideClass);
                    this.gettingJobs = false;
                });
        }

    }
    constructor(options) {
        this.title = "Simple List";
        this.useMap = options.useMap ? true : false;
        var parentSelector = options.parentClass.startsWith('.') ? options.parentClass : '.' + options.parentClass;
        //wrap selected dom element in $ to make $ object available to class
        this.parent = $($(parentSelector)[0]);
        this.mapOptions = options.mapOptions;
        this.mapInterface;
        this.jobIndex = 'job-index';
        this.jobData = [];
        this.cardIndex = 0;
        this.currentPage = 1;
        this.addScrollListener();
        this.jobCardsContainer = '.job-cards';
        this.loader = $(".loader-container");
        this.hideClass = "hide";
        this.gettingJobs = false;
        this.lastPage = 2;
        this.render();
    }
    render() {
        console.log(this.title);
        this.getJobs();
    }
}










//called by google maps callback
function init(){
    var jobptions = {
        parentClass:'job-list-container',
        mapOptions:{
            id:'map'
        }
    };

    var joblist = new JobList_1(jobptions);

    joblist.render();
    
}



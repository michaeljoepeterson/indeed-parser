class JobList {
    
    constructor(options) {
        this.title = "Simple List";
        this.useMap = options.useMap ? true : false;
        var parentSelector = options.parentClass.startsWith('.') ? options.parentClass : '.' + options.parentClass;
        //wrap selected dom element in $ to make $ object available to class
        this.parent = $($(parentSelector)[0]);
        this.mapOptions = options.mapOptions;
        this.urlOptions = options.urlOptions ? options.urlOptions : null;
        this.mapInterface;
        this.nextPageButton;
        this.previousPageButton;
        this.jobIndex = 'job-index';
        this.jobData = [];
        this.descriptions = [];
        this.cardIndex = 0;
        this.currentPage = 0;
        this.addScrollListener();
        this.jobCardsContainer = '.job-cards';
        //this.loader = $(".loader-container");
        this.loadStartEvent = options.loadStartEvent ? options.loadStartEvent : 'jobsLoading';
        this.loadDoneEvent = options.loadDoneEvent ? options.loadDoneEvent : 'jobsDone';
        this.hideClass = "hide";
        this.gettingJobs = false;
        this.lastPage = 2;
        this.jobModal = null;
        this.parent.empty();
        this.render();
    }

    addScrollListener() {
        $('#load-button').click(function (e) {
            this.loadJobs();
        }.bind(this));
    }
    loadJobs() {
        if (this.currentPage <= this.lastPage) {
            var self = this;
            //will need to add this to get jobs in prod
            //this.loader.removeClass(this.hideClass);
            
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

    buildShortDesc(decodedDesc){
        let shortDesc = decodedDesc.slice(0,500);
        let descChars = shortDesc.split('');
        let lastPeriodIndex = 0;
        descChars.forEach((char,i) => {
            if(char === '.'){
                lastPeriodIndex = i;
            }
        });
        if(lastPeriodIndex !== 0){
            shortDesc = shortDesc.slice(0,lastPeriodIndex + 1);
        }
        return shortDesc;
    }

    openDescriptionModal(index){
        let selectedDescription = this.descriptions[index];
        console.log(selectedDescription);
        let job = this.jobData[index];
        console.log(job);
        let modal = $(this.jobModal);
        var jobLink = modal.find('.job-modal-title');
        jobLink.attr('href', job.url);
        jobLink.attr('target', '_blank');
        jobLink.text(job.jobtitle);

        modal.find('.job-modal-company').html(job.company);
        if(job.wage){
            modal.find('.job-modal-wage').html(job.wage);
        }
        modal.find('.modal-body').html(selectedDescription.description);
    }

    buildModalContainer(){
        if(!this.jobModal){
            this.jobModal = $(`<div class="modal fade" id="jobModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <div class="job-modal-heder">
                    <h5 class="modal-title" id="exampleModalLabel">
                    <a class="job-modal-title"></a>
                    </h5>
                    <p class="job-modal-company"></p>
                    <p class="job-modal-wage"></p>
                  </div>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  ...
                </div>
            </div>
          </div>`);
          this.parent.append(this.jobModal);
        }
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
        let description = cardData.snippet ? cardData.snippet : cardData.description;
        let decodedDesc = jobDesc.html(description).text(); 
        let shortDesc = this.buildShortDesc(decodedDesc);
        jobDesc.html(shortDesc);
        let wage = cardData.wage ? cardData.wage : null;
        var moreLinkContainer = $('<div class="more-link"></div>');
        var moreLinkButton = $('<button type="button" class="btn btn-link" data-toggle="modal" data-target="#jobModal">More</button>');
        moreLinkContainer.append(moreLinkButton);
        moreLinkButton.click((event) => {
            this.openDescriptionModal(index);
        });
        this.descriptions.push({
            description:decodedDesc
        });

        //build link
        jobLink.attr('href', cardData.url);
        jobLink.attr('target', '_blank');
        jobLink.text(cardData.jobtitle);
        //build title and description containers
        jobTitle.append(jobLink);
        titleContainer.append(jobTitle);
        titleContainer.append(jobCompany);
        if(wage){
            let wageData = $('<p class="job-wage"></p>'); 
            wageData.text(wage);
            titleContainer.append(wageData);
        }
        titleContainer.append(jobLocation);
        titleContainer.append(jobDate);
        descContainer.append(jobDesc);
        descContainer.append(moreLinkContainer);
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
            this.buildModalContainer();
            if (!addPage) {
                this.parent.append(jobCard);
            }
        }
        catch (err) {
            console.log("Error building cards: ", err);
        }

    }
    buildUrl(page){
        let pageVal = page ? page * 10 : 0
        let url = `/api/search?city=${this.urlOptions.city}&province=${this.urlOptions.province}&radius=25&page=${pageVal}`;
        return url;
    }
    //placeholder for ajax calls
    //need seperate function for appending jobs
    getJobs(page, addPage) {

        if (!this.gettingJobs) {
            $(document).trigger(this.loadStartEvent);
            this.gettingJobs = true;

            let defaultUrl = '/api/search?q=security+guard&l=Edmonton%2C+AB&radius=25&start=30';
            let url = this.urlOptions ? this.buildUrl(page) : defaultUrl;
            
            var req = {
                method: 'GET',
                url: url
            };

            $.ajax(req)

                .then(response => {
                    console.log(response);
                    let data =response.results;
                    this.jobData = this.jobData.concat(data);
                    this.buildCards(data, addPage);
                    if(this.useMap){
                        this.mapOptions.jobData = addPage ? this.jobData : response.data.results;
                        this.mapInterface = new MapInterface(this.mapOptions);
                    }
                    this.currentPage++;
                    $(document).trigger(this.loadDoneEvent);
                    //this.loader.addClass(this.hideClass);
                    this.gettingJobs = false;
                })

                .catch(err => {
                    console.log('Error getting data: ', err);
                    $(document).trigger(this.loadDoneEvent);
                    //this.loader.addClass(this.hideClass);
                    this.gettingJobs = false;
                });
        }

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



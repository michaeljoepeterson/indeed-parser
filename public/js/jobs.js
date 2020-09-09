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
        this.jobCardsContainerClass = '.job-cards';
        this.jobCardsContainer = null;
        //this.loader = $(".loader-container");
        this.loadStartEvent = options.loadStartEvent ? options.loadStartEvent : 'jobsLoading';
        this.loadDoneEvent = options.loadDoneEvent ? options.loadDoneEvent : 'jobsDone';
        this.hideClass = "hide";
        this.gettingJobs = false;
        this.pageRange = 5;
        this.jobModal = null;
        this.shortList = options.shortList ? options.shortList : false;
        
        this.render();
    }

    resetContianer(){
        this.parent.empty();
        if(this.jobCardsContainer){
            this.jobCardsContainer.empty();
        }
        if(this.jobModal){
            this.descriptions = [];
            this.jobModal.empty();
        }
    }

    addScrollListener() {
        $('#load-button').click(function (e) {
            this.loadJobs();
        }.bind(this));
    }

    loadJobs() {
        var self = this;
        
        setTimeout(function () {
            self.getJobs(self.currentPage, true);
        }, 3000);
    
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

    initPageListeners(pageContainer){
        const leftClass = '.prev-button';
        const rightClass = '.next-button';
        const pageButton = '.page-button';

        let leftButton = pageContainer.find(leftClass);
        let rightButton = pageContainer.find(rightClass);
        let pageButtons = pageContainer.find(pageButton);

        $(leftButton).click((event) => {
            this.changePage(null,-1);
        });

        $(rightButton).click((event) => {
            this.changePage(null,1);
        });

        $(pageButtons).each((index,button) => {
            let dataPage = $(button).data('page');
            $(button).click((event) => {
                this.changePage(dataPage);
            });
        });
    }

    addPageNumbers(pageContainer){
        const numbersClass = '.page-numbers'
        let numbersContainer = pageContainer.find(numbersClass);
        for(let i = this.currentPage;i < this.currentPage + this.pageRange;i++){
            let button = $(`<button type="button" class="btn btn-link page-button" data-page=${i}>${i + 1}</button>`);
            numbersContainer.append(button);
        }
    }

    setActivePage(pageContainer){
        const buttonClass = '.page-button'
        let buttons = $(pageContainer).find('.page-button');
        $(buttons).each((i,button) => {
            let button$ = $(button);
            let page = button$.data('page');
            if(page === this.currentPage){
                button$.addClass('current-page');
            }
        });
    }

    buildPagination(parent){
        let pageContainer = $(`
        <div class="page-container">
            <div class="previous-page">
                <button class="btn btn-light prev-button" id="load-button">
                    <i class="material-icons">
                        chevron_left
                    </i>
                </button>
            </div>
            <div class="page-numbers">
            </div>
            <div class="next-page">
                <button class="btn btn-light next-button" id="load-button">
                    <i class="material-icons">
                        chevron_right
                    </i>
                </button>
            </div>
        </div>`);
        this.addPageNumbers(pageContainer);
        this.initPageListeners(pageContainer);
        this.setActivePage(pageContainer);

        parent.append(pageContainer);
    }

    changePage(page,adjustPage){
        if(page){
            this.currentPage = page;
        }
        //left and right clicks
        if(adjustPage){
            this.currentPage += adjustPage;
        }
        
        this.render();
    }

    buildCards(data, addPage) {
        try {
            //if(!this.jobCardsContainer){
                this.jobCardsContainer = $('<div class="job-cards"></div>');
            //}
            
            for (var i = 0; i < data.length; i++) {
                var cardData = data[i];
                var card = this.buildSingleCard(cardData, i);
                this.jobCardsContainer.append(card);
                this.initCardListener(card);
                //this.cardIndex++;
            }
            this.buildModalContainer();
            if(!this.shortList){
                this.buildPagination(this.jobCardsContainer);
            }
            if (!addPage) {
                this.parent.append(this.jobCardsContainer);
            }
        }
        catch (err) {
            console.log("Error building cards: ", err);
        }

    }

    buildUrl(){
        let pageVal = this.currentPage ? this.currentPage * 10 : 0
        let url = `/api/search?city=${this.urlOptions.city}&province=${this.urlOptions.province}&radius=25&page=${pageVal}`;
        return url;
    }
    //placeholder for ajax calls
    //need seperate function for appending jobs
    getJobs(page, addPage) {

        if (!this.gettingJobs && this.urlOptions) {
            $(document).trigger(this.loadStartEvent);
            this.gettingJobs = true;

            let defaultUrl = '/api/search?q=security+guard&l=Edmonton%2C+AB&radius=25&start=30';
            let url = this.urlOptions ? this.buildUrl() : defaultUrl;
            
            var req = {
                method: 'GET',
                url: url
            };

            $.ajax(req)

                .then(response => {
                    console.log(response);
                    this.resetContianer();
                    let data = this.shortList ? response.results.slice(0,5) : response.results;
                    //this.jobData = this.jobData.concat(data);
                    this.jobData = data;
                    this.buildCards(data, addPage);
                    if(this.useMap){
                        this.mapOptions.jobData = addPage ? this.jobData : response.data.results;
                        this.mapInterface = new MapInterface(this.mapOptions);
                    }
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
        }else{
            $(document).trigger(this.loadDoneEvent);
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



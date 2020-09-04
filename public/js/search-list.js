function SearchList(options){
    this.constructor(options);
}

SearchList.prototype.constructor = function(options){
    //toggle for checking if input is highlighted
    this.results = options.results ? options.results : null;
    this.searchId = options.searchContainerId ? options.searchContainerId : null;
    this.searchContainer = options.searchContainerId ? $('#' + options.searchContainerId)[0] : null;
    this.label = options.label ? options.label : null;
    //debugger;
    this.isFocused = false;
    this.debounceTime = 800;
    this.debounceTimeout = null;
    this.listUpdateEvent = 'listUpdated';
    this.filteredResults = this.results;

    this.initList();
    this.initEventListeners();
}
//todo add event listeners for keyboard up and down in a list
SearchList.prototype.initEventListeners = function(){
    var input = $(this.searchContainer).find('input');

    input.focus(function(event){
        this.focused(event);
    }.bind(this));

    input.blur(function(event){
        this.blured(event);
    }.bind(this));

    $(document).keydown(function(event){
        this.filterResults(event);
    }.bind(this));

    $(this.searchContainer).on(this.listUpdateEvent,function(event,custData){
        console.log('updated list',event);
        console.log('updated list',custData);
        this.renderResults();
    }.bind(this));
}

SearchList.prototype.buildPlaceholderText = function(){
    return 'Eg. ' + this.results[0];
}

//build initial input
SearchList.prototype.initList = function(){
    var labelId = this.searchId + '-input';
    var labelElement = $('<label class="search-label"></label');
    labelElement.attr('id',labelId);
    labelElement.text(this.label);

    var searchControls = $('<div class="search-controls"></div>');
    var searchInput = $('<input class="search-list-input">');
    var placeholderText = this.buildPlaceholderText();
    searchInput.attr('placeholder',placeholderText);
    searchInput.attr('id',labelId);

    var icon = $('<i class="material-icons search-icon">expand_more</i>');
    var seachListContent = $('<div class="search-list-content hide-search"></div>');
    var searchResults = $('<ul class="search-results"></ul>');
    var items = this.buildResults();

    searchResults.append(items);
    seachListContent.append(searchResults);

    searchControls.append(searchInput);
    searchControls.append(icon);
    searchControls.append(seachListContent);
    //debugger;
    $(this.searchContainer).append(labelElement);
    $(this.searchContainer).append(searchControls);
}
//render result list
//also need to append event listeners
SearchList.prototype.buildResults = function(){
    var items = [];
    for(var i = 0;i < this.filteredResults.length;i++){
        var result = this.filteredResults[i];
        var item = $('<li class="search-item"></li>');
        item.text(result);
        items.push(item);
    }

    return items;
}

//render result list
SearchList.prototype.renderResults = function(){
    var items = this.buildResults();
    var searchResults = $(this.searchContainer).find('.search-results');
    searchResults.empty();
    searchResults.append(items);
}

SearchList.prototype.filterList = function(event){
    clearInterval(this.debounceInterval);
    this.filteredResults = [];
    var inputText = $(event.target).val().toLowerCase();
    if(inputText === ''){
        this.filteredResults = this.results;
    }
    else{
        for(var i = 0;i < this.results.length;i++){
            var result = this.results[i].toLowerCase();
            let found = result.indexOf(inputText);
            if(found >= 0){
                this.filteredResults.push(result);
            }
        }
    }

    console.log('done typing',this.filteredResults);
    var data = {
        results:'hi'
    };
    $(this.searchContainer).trigger(this.listUpdateEvent,data);
}

SearchList.prototype.filterResults = function(event){
    if(this.isFocused){
        console.log('key down');
        //set initial event
        if(!this.debounceTimeout){
            this.debounceTimeout = setTimeout(function(){
                this.filterList(event);
            }.bind(this),this.debounceTime);
        }
        else{
            clearInterval(this.debounceTimeout);
            this.debounceTimeout = setTimeout(function(){
                this.filterList(event);
            }.bind(this),this.debounceTime);
        }
    }
}

//pulse color change on click
//also transform placeholder by adding class
SearchList.prototype.focused = function(event){
    this.isFocused = true;
    var icon = $(this.searchContainer).find('i');
    icon.addClass('opened-icon');
    var input = $(this.searchContainer).find('input');
    input.addClass('highlighted');
    var searchList = $(this.searchContainer).find('.search-list-content');
    searchList.removeClass('hide-search');
    
}

SearchList.prototype.blured = function(event){
    this.isFocused = false;
    var icon = $(this.searchContainer).find('i');
    icon.removeClass('opened-icon');
    var input = $(this.searchContainer).find('input');
    input.removeClass('highlighted');
    var searchList = $(this.searchContainer).find('.search-list-content');
    searchList.addClass('hide-search');
    
}
//todo
//adjust search list margin bottom to ensure enough space is after input
//of search list container
SearchList.prototype.adjustListMargin = function(){
    
}
//handle selecting a item from the dropdown list
SearchList.prototype.itemClicked = function(){
    
}
function SearchList(options){
    this.constructor(options);
}

SearchList.prototype.constructor = function(options){
    //toggle for checking if input is highlighted
    this.results = options.results ? this.normalizeResults(options.results) : null;
    if(!this.results){
        return;
    }
    this.searchId = options.searchContainerId ? options.searchContainerId : null;
    this.searchContainer = options.searchContainerId ? $('#' + options.searchContainerId)[0] : null;
    this.label = options.label ? options.label : null;
    //debugger;
    this.isFocused = false;
    this.debounceTime = 800;
    this.debounceTimeout = null;
    this.listUpdateEvent = 'listUpdated';
    this.filteredResults = this.results;
    this.controlKeys = {
        arrowup:'arrowup',
        arrowdown:'arrowdown',
        enter:'enter',
        escape:'escape'
    };
    this.listSelector = '.search-results > li';
    this.selectListener = options.selectListener ? options.selectListener : null;
    this.selectChangedEvent = 'selectChanged';
    this.clearList();
    this.initList();
    this.initEventListeners();
}

SearchList.prototype.clearList = function(){
    $(this.searchContainer).empty();
}

SearchList.prototype.normalizeResults = function(results){
    var newResults = [];
    
    for(var i = 0;i < results.length;i++){
        var result = {
            value:results[i],
            highlighted:false
        };

        newResults.push(result);
    }

    return newResults;
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
        let key = event.key.toLowerCase();

        if(!this.controlKeys[key]){
            this.findResults(event);
        }
        else if(this.controlKeys[key]){
            this.controlDropdown(event);
        }
    }.bind(this));

    $(this.searchContainer).on(this.listUpdateEvent,function(event,custData){
        //console.log('updated list',event);
        //console.log('updated list',custData);
        this.resetHighlighted();
        this.renderResults();
    }.bind(this));

    $(this.searchContainer).on(this.selectChangedEvent,function(event,custData){
        //console.log('updated list',event);
        //console.log('updated list',custData);
        if(this.selectListener){
            this.selectListener(event,custData);
        }

    }.bind(this));
}

SearchList.prototype.resetHighlighted = function(index){
    if(!index && index !== 0){
        this.filteredResults = this.filteredResults.map(result => {
            result.highlighted = false;
            return result;
        });
    }
    else{
        this.filteredResults = this.filteredResults.map((result,i) => {
            if(i === index){
                result.highlighted = true;
            }
            else{
                result.highlighted = false;
            }

            return result;
        });  
    }
    
}

SearchList.prototype.buildPlaceholderText = function(){
    return 'Eg. ' + this.results[0].value;
}

SearchList.prototype.highlightItems = function(){
    let highlightedClass ='highlighted';
    let items = $(this.searchContainer).find(this.listSelector);
    let highlightedIndex = this.filteredResults.findIndex(result => result.highlighted);
    $(items[highlightedIndex]).addClass(highlightedClass);
    for(let i = 0;i < items.length;i++){
        let item$ = $(items[i]);
        if(i === highlightedIndex){
            item$.addClass(highlightedClass);
        }
        else{
            item$.removeClass(highlightedClass);
        }
    }
}

SearchList.prototype.handleKeyUp = function(){
    let highlightedIndex = this.filteredResults.findIndex(result => result.highlighted);
    let currentIndex = 0;
    if(highlightedIndex >= 0){
        //circle to bottom
        currentIndex = highlightedIndex - 1;
        if(currentIndex < 0){
            currentIndex = this.filteredResults.length - 1;
            this.filteredResults[currentIndex].highlighted = true; 
        }
        else{
            this.filteredResults[currentIndex].highlighted = true;
        }
    }
    else{
        currentIndex = this.filteredResults.length - 1;
        this.filteredResults[currentIndex].highlighted = true;
    }
    this.resetHighlighted(currentIndex)
    this.highlightItems();
}

SearchList.prototype.handleKeyDown = function(){
    let highlightedIndex = this.filteredResults.findIndex(result => result.highlighted);
    let currentIndex = 0;
    let lastIndex = this.filteredResults.length - 1;
    if(highlightedIndex <= lastIndex){
        //circle to top
        currentIndex = highlightedIndex + 1;
        if(currentIndex > lastIndex){
            currentIndex = 0;
            this.filteredResults[currentIndex].highlighted = true; 
        }
        else{
            this.filteredResults[currentIndex].highlighted = true;
        }
    }
    else{
        currentIndex = 0;
        this.filteredResults[currentIndex].highlighted = true;
    }
    this.resetHighlighted(currentIndex)
    this.highlightItems();
}

SearchList.prototype.handleEnter = function(){
    let highlighted = 'highlighted';
    let items = $(this.searchContainer).find(this.listSelector);
    let highlightedIndex = -1;
    for(let i = 0;i < items.length;i++){
        let item$ = $(items[i]);
        if(item$.hasClass(highlighted)){
            highlightedIndex = i;
            break;
        }
    }
    if(highlightedIndex >= 0){
        this.itemClicked(highlightedIndex);
    }
}

SearchList.prototype.controlDropdown = function(event){
    if(this.isFocused){
        const keyUp = 'arrowup';
        const keyDown = 'arrowdown';
        const enter = 'enter';
        const escape = 'escape';
        let key = event.key.toLowerCase();
        
        switch(key){
            case keyUp:
                this.handleKeyUp();
                break;
            case keyDown:
                this.handleKeyDown();
                break;
            case enter:
                this.handleEnter();
                break;
            case escape:
                this.blured();
                break;
        }
    }
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
        var result = this.filteredResults[i].value;
        var item = $('<li class="search-item"></li>');
        item.text(result);
        this.addItemEvent(item,i)
        items.push(item);
    }

    return items;
}

SearchList.prototype.addItemEvent = function(item,i){
    item.click(event => {
        this.itemClicked(i);
    });
}

//render result list
SearchList.prototype.renderResults = function(){
    var items = this.buildResults();
    var searchResults = $(this.searchContainer).find('.search-results');
    searchResults.empty();
    searchResults.append(items);
}

SearchList.prototype.filterList = function(event,value){
    clearInterval(this.debounceInterval);
    this.filteredResults = [];
    var inputText = value ? value.toLowerCase() : $(event.target).val().toLowerCase();

    if(inputText === ''){
        this.filteredResults = this.results;
    }
    else{
        for(var i = 0;i < this.results.length;i++){
            var result = this.results[i];
            let found = result.value.toLowerCase().indexOf(inputText);
            if(found >= 0){
                this.filteredResults.push(result);
            }
        }
    }

    var data = {
        results:'hi'
    };
    $(this.searchContainer).trigger(this.listUpdateEvent,data);
}

SearchList.prototype.findResults = function(event){
    if(this.isFocused){
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
SearchList.prototype.itemClicked = function(index){
    this.filteredResults[index].highlighted = true;
    this.resetHighlighted(index);
    this.highlightItems();
    let items = $(this.searchContainer).find(this.listSelector);
    let itemText = $(items[index]).text();
    let input = $(this.searchContainer).find('input');
    input.val(itemText);
    this.filterList(null,itemText);
    let data = {
        value:itemText
    };

    $(this.searchContainer).trigger(this.selectChangedEvent,data);
}

SearchList.prototype.getValue = function(){
    let value = $(this.searchContainer).find('input').val();
    return value;
}
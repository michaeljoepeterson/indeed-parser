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

    this.initList();
}

SearchList.prototype.initEventListeners = function(){

}

SearchList.prototype.buildPlaceholderText = function(){
    return 'Eg. ' + this.results[0];
}

//build initial input
SearchList.prototype.initList = function(){
    let labelId = this.searchId + '-input';
    let labelElement = $('<label></label');
    labelElement.attr('id',labelId);
    labelElement.text(this.label);

    let searchControls = $('<div class="search-controls"></div>');
    let searchInput = $('<input class="search-list-input">');
    let placeholderText = this.buildPlaceholderText();
    searchInput.attr('placeholder',placeholderText);
    searchInput.attr('id',labelId);

    let icon = $('<i class="material-icons">expand_more</i>');
    let seachListContent = $('<div class="search-list-content"></div>');
    let searchResults = $('<ul class="search-results"></ul>');
    let items = this.buildResults();

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
SearchList.prototype.buildResults = function(){
    let items = [];
    for(let i = 0;i < this.results.length;i++){
        let result = this.results[i];
        let item = $('<li class="search-item"></li>');
        item.text(result);
        items.push(item);
    }

    return items;
}

SearchList.prototype.filterResults = function(){

}

//pulse color change on click
//also transform placeholder by adding class
SearchList.prototype.highlight = function(){
    this.isFocused = true;
}
//adjust search list margin bottom to ensure enough space is after input
//of search list container
SearchList.prototype.adjustListMargin = function(){

}
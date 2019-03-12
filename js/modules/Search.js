import $ from 'jquery';

class Search {
  // 1. describe and create/initiate our object
  constructor() {
    this.addSearchHTML();  // dynamically add HTML elements, class .search-overlay's visibility is hidden
    this.resultsDiv = $("#search-overlay__results");
    this.openButton = $(".js-search-trigger");
    this.closeButton = $(".search-overlay__close");
    this.searchOverlay = $(".search-overlay");
    this.searchField = $("#js-search-term");
    this.searchFieldPrev;
    this.searchTimer;
    this.events();  // add event handlers as soon as object is instantiated
    this.searchActive = false;
    this.spinnerActive = false;
  }

  // 2. events
  events() {
    console.log("what is this: ", this);
    this.openButton.on("click", this.openOverlay.bind(this));
    this.closeButton.on("click", this.closeOverlay.bind(this));
    $(document).on("keydown", this.keyPressDispatcher.bind(this));
    this.searchField.on("keyup", this.liveSearch.bind(this));
  }

  // 3. methods (function, action...)
  
  keyPressDispatcher(e) {
    if ( e.keyCode === 83 && !this.searchActive && !$("input, textarea").is(':focus') ) { // lowercase s
      this.openOverlay();
    }
    if ( e.keyCode === 27 && this.searchActive ) { // escape key
      this.closeOverlay();
    }
  }
  
  liveSearch(){
    // Each new keystroke resets the searchTimer and keeps the Spinner displayed 
    // Any pause in typing produces a call getResults() which uses our custom 
    // WP REST API to obtain the results the user searches for.
    if ( this.searchField.val() !== this.searchFieldPrev ) {
      clearTimeout(this.searchTimer);
      
      // Display a spinner while searchField criteria is being typed in.
      if (this.searchField.val()) {
        if ( !this.spinnerActive ) {
          // display spinner
          this.resultsDiv.html('<div class="spinner-loader"></div>');
          this.spinnerActive = true;
        }
        this.searchTimer = setTimeout( this.getResults.bind(this), 300 );
      } else {
        this.resultsDiv.html(''); // clear search results if search field empty
        this.spinnerActive = false;
      }
    }
    this.searchFieldPrev = this.searchField.val();
  }
  // Call Custom WP REST API -- server sends JSON data to results parameter
  getResults() {
    $.getJSON( universityData.root_url + '/wp-json/university/v1/search?term=' + this.searchField.val(), (results) => {
      this.resultsDiv.html(`
        <div class="row">
          <div class="one-third">
            <h2 class="search-overlay__section-title">General Information</h2>
            ${ results.generalInfo.length ? '<ul class="link-list min-list">' : '<p>No General Information matches that search</p>' }
            ${ results.generalInfo.map( item=>`<li><a href="${item.permalink}">${item.title}</a> 
              ${ item.postType == 'post' ? `- by ${item.authorName}` : ``}</li>` ).join('') }
            ${ results.generalInfo.length ? '</ul>' : '' } 
          </div>
          
          <div class="one-third">
            <h2 class="search-overlay__section-title">Programs</h2>
            ${ results.programs.length ? '<ul class="link-list min-list">' : `<p>No Programs match that search. <a href="${universityData.root_url}/programs">View all programs</a></p>` }
            ${ results.programs.map( item=>`<li><a href="${item.permalink}">${item.title}</a></li>` ).join('') }
            ${ results.programs.length ? '</ul>' : '' }
            
            <h2 class="search-overlay__section-title">Professors</h2>
            ${ results.professors.length ? '<ul class="professor-cards">' : `<p>No Professors match that search.</p>` }
            ${ results.professors.map( item=>`
              <li class="professor-card__list-item">
                <a class="professor-card" href="${item.permalink}">
                  <img class="professor-card__image" src="${item.image}">
                  <span class="professor-card__name">${item.title}</span>
                </a>
              </li>            
            ` ).join('') }
            ${ results.professors.length ? '</ul>' : '' }
          </div>
          
          <div class="one-third">
            <h2 class="search-overlay__section-title">Campuses</h2>
            ${ results.campuses.length ? '<ul class="link-list min-list">' : `<p>No Campuses match that search. <a href="${universityData.root_url}/campuses">View all campuses</a></p>` }
            ${ results.campuses.map( item=>`<li><a href="${item.permalink}">${item.title}</a></li>` ).join('') }
            ${ results.campuses.length ? '</ul>' : '' }
            
            <h2 class="search-overlay__section-title">Events</h2>
            ${ results.events.length ? '' : `<p>No Events match that Search.  <a href="${universityData.root_url}/events">View all events</a></p>` }
            ${ results.events.map( item=>`
              <div class="event-summary">
                <a class="event-summary__date t-center" href="${item.permalink}">
                  <span class="event-summary__month">${item.month}</span>
                  <span class="event-summary__day">${item.day}</span>  
                </a>
                <div class="event-summary__content">
                  <h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">
                    ${item.title}</a></h5>
                  <p>${item.description}<a href="${item.permalink}" class="nu gray"> Learn more</a></p>
                </div>
              </div>              
            ` ).join('') }
            
          </div>
        </div>
      `); // end resultsDiv.html
      this.spinnerActive = false;
    }); // end $.getJSON CB function
  } // end getResults
  
  openOverlay() {
    this.searchActive = true;
    this.searchOverlay.addClass("search-overlay--active");
    $("body").addClass("body-no-scroll");
    this.searchField.val('');
    this.resultsDiv.html('');
    setTimeout( ()=> this.searchField.focus(), 301 ); // wait for fade-in to complete before focusing in searchField
    return false;  // prevents default behavior of anchor elements
  }

  closeOverlay() {
    this.searchActive = false;
    this.searchOverlay.removeClass("search-overlay--active");
    $("body").removeClass("body-no-scroll");
  }
  // add SearchHTML CODE originally in footer.php
  addSearchHTML() {
    $("body").append(`
      <div class="search-overlay">
        <div class="search-overlay__top">
          <div class="container">
            <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
            <input type="text" class="search-term" placeholder="Search for?" id="js-search-term">
            <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
          </div>
        </div>
        
        <div class="container">
          <div id="search-overlay__results">
          </div>
        </div>
      </div>
    `);
  }
}

export default Search;  // make Search Class available to other programs. ie. scripts.js
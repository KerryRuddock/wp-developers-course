import $ from 'jquery';

class Search {
  // 1. describe and create/initiate our object
  constructor() {
    this.addSearchHTML();
    this.resultsDiv = $("#search-overlay__results");
    this.openButton = $(".js-search-trigger");
    this.closeButton = $(".search-overlay__close");
    this.searchOverlay = $(".search-overlay");
    this.searchField = $("#js-search-term");
    this.searchFieldPrev;
    this.searchTimer;
    this.events();
    this.searchActive = false;
    this.spinnerActive = false;
  }

  // 2. events
  events() {
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
    if ( this.searchField.val() !== this.searchFieldPrev ) {
      clearTimeout(this.searchTimer);
      
      // Display a spinner when typing in unique search criteria
      if (this.searchField.val()) {
        if ( !this.spinnerActive ) {
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
  
  getResults() {
    // http GET search request, on success post(s) title(s) is/are displayed
    $.when(
      $.getJSON( universityData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.val() ),
      $.getJSON( universityData.root_url + '/wp-json/wp/v2/pages?search=' + this.searchField.val() )
    ).then( (posts, pages) => {
      
      var combinedResults = posts[0].concat(pages[0]);
      this.resultsDiv.html(`
        <h2 class="search-overlay__section-title">General Information</h2>
        ${ combinedResults.length ? '<ul class="link-list min-list">' : '<p>No Search Results found</p>' }
          ${ combinedResults.map( item=>`<li><a href="${item.link}">${item.title.rendered}</a> 
          ${item.type == 'post' ? `- by ${item.authorName}` : ``}</li>` ).join('') }
        ${ combinedResults.length ? '</ul>' : '' } 
      `);
      this.spinnerActive = false;      
      
    }, () => {
      // this 2nd parameter is our FailCallback when the Deferred is rejected.
      this.resultsDiv.html('<p>Unexpected error; Please try again. </p>');
    });
  }
  
  openOverlay() {
    this.searchActive = true;
    this.searchOverlay.addClass("search-overlay--active");
    $("body").addClass("body-no-scroll");
    this.searchField.val('');
    this.resultsDiv.html('');
    setTimeout( ()=> this.searchField.focus(), 301 );
  }

  closeOverlay() {
    this.searchActive = false;
    this.searchOverlay.removeClass("search-overlay--active");
    $("body").removeClass("body-no-scroll");
  }
  
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

export default Search;
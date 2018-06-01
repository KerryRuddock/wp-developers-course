import $ from 'jquery';

class Search {
  // 1. describe and create/initiate our object
  constructor() {
    this.openButton = $(".js-search-trigger");
    this.closeButton = $(".search-overlay__close");
    this.searchOverlay = $(".search-overlay");
    this.events();
    this.searchActive = false;
  }

  // 2. events
  events() {
    this.openButton.on("click", this.openOverlay.bind(this));
    this.closeButton.on("click", this.closeOverlay.bind(this));
    $(document).on("keydown", this.keyPressDispatcher.bind(this));
  }

  // 3. methods (function, action...)
  
  keyPressDispatcher(e) {
    if ( e.keyCode === 83 && !this.searchActive ) { // lowercase s
      this.openOverlay();
    }
    if ( e.keyCode === 27 && this.searchActive ) { // escape key
      this.closeOverlay();
    }
  }
  
  openOverlay() {
    this.searchActive = true;
    this.searchOverlay.addClass("search-overlay--active");
    $("body").addClass("body-no-scroll");
  }

  closeOverlay() {
    this.searchActive = false;
    this.searchOverlay.removeClass("search-overlay--active");
    $("body").removeClass("body-no-scroll");
  }
}

export default Search;
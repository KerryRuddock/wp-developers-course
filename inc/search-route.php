<?php



function universityRegisterSearch() {
  register_rest_route('university/v1', 'search', array(
    'methods' => WP_REST_SERVER::READABLE,
    'callback' => 'universitySearchResults'
  ));
}

add_action('rest_api_init', 'universityRegisterSearch');

function universitySearchResults() {
  return 'Congrats, you created a route.';
}


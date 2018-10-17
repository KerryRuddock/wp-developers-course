<?php

function universityRegisterSearch() {
  register_rest_route('university/v1', 'search', array(
    'methods' => WP_REST_SERVER::READABLE,
    'callback' => 'universitySearchResults'
  ));
}

add_action('rest_api_init', 'universityRegisterSearch');

function universitySearchResults($data) {
  $mainQuery = new WP_Query(array(
    'post_type' => array('post', 'page', 'professor', 'program', 'campus', 'event'),
    's' => sanitize_text_field($data['term'])
  ));
  // push posts that match search results into these empty containers 
  $results = array(
    'generalInfo' => array(),
    'professors' => array(),
    'programs' => array(),
    'events' => array(),
    'campuses' => array()
  );
  
  while ( $mainQuery->have_posts() ) {
    $mainQuery->the_post();
    
    if ( get_post_type() == 'post' OR get_post_type() == 'page' ) {
      array_push( $results['generalInfo'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'postType' => get_post_type(),
        'authorName' => get_the_author()       
      ));
    }
    
    if ( get_post_type() == 'professor'  ) {
      array_push( $results['professors'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'image' => get_the_post_thumbnail_url(0,'professorLandscape')
      ));
    }
    
    if ( get_post_type() == 'program' ) {
      array_push( $results['programs'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'id' => get_the_id()
      ));
    }

    if ( get_post_type() == 'campus' ) {
      array_push( $results['campuses'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'id' => get_the_id()
      ));
    }

    if ( get_post_type() == 'event' ) {
      $eventDate = new DateTime( get_field('event_date'));
      $description = null;
      if( has_excerpt() ){
        $description = get_the_excerpt();
      } else {
        $description = wp_trim_words( get_the_content(), 18);
      }  
      
      array_push( $results['events'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'month' => $eventDate->format('M'),
        'day' => $eventDate->format('d'),
        'description' => $description
      ));
    }    
  } // end while $mainQuery

  if ( $results['programs'] ) {
    
     //Build meta_query array for $professorRelatedPrograms Query
    $programsMetaQuery = array('relation' => 'OR');
    
    foreach($results['programs'] as $item ){
      array_push( $programsMetaQuery, array(
        'key' => 'related_programs',  // Custom Field within Professor PostType.
        'compare' => 'LIKE',
        'value' => '"' . $item['id'] . '"'
      ));
    }
    
    // Professors : eCourse used $programRelationshipQuery. not $professorRelatedPrograms
    $professorRelatedPrograms = new WP_Query( array(
      'posts_per_page' => -1,
      'post_type' => 'professor',
      'orderby' => 'title',
      'order' => 'ASC',
      'meta_query' => $programsMetaQuery
    ));
    
    while($professorRelatedPrograms->have_posts()){
      $professorRelatedPrograms->the_post();
      
      if ( get_post_type() == 'professor'  ) {
        array_push( $results['professors'], array(
          'title' => get_the_title(),
          'permalink' => get_the_permalink(),
          'image' => get_the_post_thumbnail_url(0,'professorLandscape')
        ));
      }    
    }//end while $professorRelatedPrograms
    
    // Because we run 2 wp_queries, we may have duplicate professor results (1 for main, 1 for professors)
    // Remove any duplicate results here.
    $results['professors'] = array_values(array_unique($results['professors'], SORT_REGULAR));
    
  } // end if results['programs']
  
  return $results;
  
} // end function: universitySearchResults


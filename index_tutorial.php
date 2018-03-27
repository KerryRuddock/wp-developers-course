<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * e.g., it puts together the home page when no home.php file exists.
 *
 * Learn more: {@link https://codex.wordpress.org/Template_Hierarchy}
 *
 * @package WordPress
 * @subpackage WP_University
 * @since WP University 1.0
 */
?>
My most amazing theme.
<?php

function htmlpara($name, $color){
  echo "<p>Hi, my name is $name and my favorite color is $color, this is an html paragraph echoed from php </p>";
}
htmlpara("Kerry","blue");
htmlpara("Teresa","Azure");
?>

<h1><?php bloginfo('name')?></h1>
<p><?php bloginfo('description')?></p>
<p><?php bloginfo('wpurl')?></p>
<p><?php bloginfo('url')?></p>
<p><?php bloginfo('version')?></p>

<?php 

  $names = array('Brad', 'John', 'Jane', 'Ringo');
  $count = 0; $size = count($names);
  while( $count < $size ) {
    echo "<li>Hi my name is $names[$count]</li>";
    $count++;
  }
?>


<?php
/*
** searchform.php - WP get_search_form() will call this file.
*/
?>
<form class="search-form" method="get" action="<?php echo esc_url(site_url('/')); ?>">
  <label class="headline headline--medium" for="s">Perform a new search:</label>
  <div class="search-form-row">
    <input class="s" id="s" type="search" name="s">
    <input class="search-submit" type="submit">
  </div>
</form>
<?php
/*
Plugin Name: Heatmap
Plugin URI: http://wpheatmap.oufel.com
Description: This plugin monitor user mouse movement and clicks.
Version: 1.3
Author: Dimitry Kislichenko
Author URI: http://www.oufel.com
*/

// Version of DataBase
global $heatmap_db_version;
$heatmap_db_version = "1.0";

// Heatmap table name
global $wpdb, $heatmap_table_name;
$heatmap_table_name = $wpdb->prefix . "heatmap";


/**
 * Initialize Heatmap plugin
 */
function heatmap_init()
{
	global $user_level;

	// Load Heatmap JavaScript
	if(function_exists('wp_enqueue_script'))
	{
		if($user_level == 10 && !is_admin())
		{
			wp_enqueue_style('heatmap_plugin', get_bloginfo('wpurl') . '/wp-content/plugins/heatmap/view.css');
			wp_enqueue_script('calendar_plugin', get_bloginfo('wpurl') . '/wp-content/plugins/heatmap/js/jcalendar.js', array('jquery'));
			wp_enqueue_script('heatmap_plugin', get_bloginfo('wpurl') . '/wp-content/plugins/heatmap/js/view.js', array('jquery'));
		}
		else
		{
			wp_enqueue_script('heatmap_plugin', get_bloginfo('wpurl') . '/wp-content/plugins/heatmap/js/loger.js');
		}
	}
}

/**
 * Install Heatmap plugin
 */
function heatmap_install()
{
	global $wpdb, $heatmap_db_version, $heatmap_table_name;

	// Check, if DataBase not exist then execute SQL to create DataBase
	if($wpdb->get_var("SHOW TABLES LIKE '" . $heatmap_table_name . "'") != $heatmap_table_name)
	{
		$sql = "CREATE TABLE " . $heatmap_table_name ." (
			x int(8) not null default 0,
			y int(8) not null default 0,
			file varchar(255) not null default '',
			added int(32) not null default 0
		);";

		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);

		add_option("heatmap_db_version", $hetmap_db_version);
	}
}

/**
 * Function set domain name
 */
function heatmap_set_wpurl() {
	echo "<script type=\"text/javascript\">\n//<![CDATA[ \n\tvar WPURL = '" . get_bloginfo('wpurl') . "';\n //]]>\n</script>";
}



// Set Hooks
register_activation_hook(__FILE__, 'heatmap_install');

// Set Actions
add_action('wp_head', 'heatmap_set_wpurl', 1);
add_action('init', 'heatmap_init');

?>

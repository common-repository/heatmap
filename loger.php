<?php

// Define ABSPATH
if(!defined(ABSPATH))
{
	$classic_root = dirname(dirname(dirname(dirname(__FILE__)))) . '/' ;
	define('ABSPATH', $classic_root);
}


// Require classes
require_once(ABSPATH . '/wp-load.php');
global $wpdb;

// Table name
global $heatmap_table_name;
$heatmap_table_name = $wpdb->prefix . "heatmap";


/**
 * Log users Clicks
 *
 * @param int x - X coordinate
 * @param int y - Y coordinate
 */
function heatmap_log_click($x, $y)
{
	global $wpdb, $heatmap_table_name;

        // Insert data in DataBase
        $wpdb->query("INSERT INTO " . $heatmap_table_name . " VALUES(
                        '" . $x . "', '" . $y . "',
                        '" . $_SERVER['HTTP_REFERER'] . "',
                        '" . date('U') . "')");
}


if(isset($_GET['heatmap']))
{
	switch($_GET['heatmap'])
	{
		case 'click':
		{
			if(isset($_GET['x'], $_GET['y']) && $_GET['x'] != "" && $_GET['y'])
			{
				heatmap_log_click($_GET['x'], $_GET['y']);
			}
  		} break;
	};
}

?>

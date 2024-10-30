<?php

// Plugin Path
define('PLUGIN_PATH', dirname(__FILE__));
// Cacha for generated images
define('CACHE_PATH', PLUGIN_PATH . '/cache');
// Root Path
define('ROOT_PATH', dirname(dirname(dirname(dirname(__FILE__)))));

// Include config
require_once(ROOT_PATH . '/wp-config.php');

// Include classes
require_once(PLUGIN_PATH . '/classes/Heatmap.class.php');
require_once(PLUGIN_PATH . '/classes/HeatmapFromDatabase.class.php');

$servMemoryLimit = (int) @ini_get('memory_limit');
$memoryLimit = ($servMemoryLimit === 0 ? 8 : $servMemoryLimit);

// Set memory and time limit
@set_time_limit(120);
@ini_set('memory_limit', $memoryLimit.'M');

// Screen size
$screen = (isset($_GET['screen']) ? (int)$_GET['screen'] : 0);
$minScreen = 0;

if($screen < 0)
{
	$width = abs($screen);
	$maxScreen = 3000;
}
else
{
	$maxScreen = $screen;
	$width = $screen - 25;
}

// Date and Days
if(isset($_GET['day'], $_GET['month'], $_GET['year']) && $_GET['day'] != "" && $_GET['month'] != "" && $_GET['year'] != "")
{
	$fromRange = mktime(0, 0, 0, $_GET['month'], $_GET['day'], $_GET['year']);
}
else
{
	$fromRange = mktime(0, 0, 0, date('m'), date('d'), date('Y'));
}

$toRange = $fromRange + (86400 * ((isset($_GET['range']) && $_GET['range'] != "") ? $_GET['range'] : 1));

$imagePath = md5($_SERVER['HTTP_REFERER']).'-'.$fromRange.'-'.$toRange.'-'.$screen.'-click';


// Table  name
$heatmap_table_name = $wpdb->prefix . "heatmap";

// Call Heatmap class
$heatmap = new HeatmapFromDatabase();
$heatmap->memory = $memoryLimit * 1048576;

$heatmap->query = "SELECT x, y FROM {$heatmap_table_name} WHERE `file` = '{$_SERVER['HTTP_REFERER']}' AND `added` BETWEEN '{$fromRange}' AND '{$toRange}'";
$heatmap->maxQuery = "SELECT MAX(y) FROM {$heatmap_table_name} WHERE `file` = '{$_SERVER['HTTP_REFERER']}' AND `added` BETWEEN '{$fromRange}' AND '{$toRange}'";

$heatmap->host = DB_HOST;
$heatmap->database = DB_NAME;
$heatmap->user = DB_USER;
$heatmap->password = DB_PASSWORD;

$heatmap->minScreen = $minScreen;
$heatmap->maxScreen = $maxScreen;
$heatmap->__grey = 0;

$heatmap->path = CACHE_PATH;
$heatmap->cache = CACHE_PATH;
$heatmap->file = $imagePath.'-%d.png';

// Add adata in class

$result = $heatmap->generate($width);
if($result == false)
{
	showError($heatmap->error);
}

$output = '';
for ($i = 0; $i < $result['count']; $i++)
{
        $output .= '<img src="http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']).'/cache/'.$result['filenames'][$i].'" width="'.$result['width'].'" height="'.$result['height'].'" alt="" id="heatmap-'.$i.'" /><br />';
}
echo $output;


/**
 * Function show error mesage to user
 */
function showError($message)
{
	echo "<div>" . $message . "</div>";
	exit;
}

?>

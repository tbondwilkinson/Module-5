<?php
session_start();
require "database.php";

$stmt = $mysqli->prepare("SELECT cat_id FROM category WHERE cat_title=?");

if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$category_title = $_GET['category'];


$stmt->bind_param('s', $category_title);
$stmt->execute();
$stmt->bind_result($cat_id);

if($stmt->fetch()) {
	$stmt->close();

	$results = array();
	$results['cat'] = array();
	$results['page'] = array();

	$stmt = $mysqli->prepare("SELECT cl_to, cl_type FROM categorylinks WHERE cl_from=?");

	if(!$stmt){
		printf("Query Prep Failed: %s\n", $mysqli->error);
		exit;
	}

	$stmt->bind_param('s', $cat_id);
	$stmt->execute();
	$stmt->bind_result($title_to, $type);
	
	while($stmt->fetch()) {
		if($type=='subcat'){
			array_push($results['cat'], $title_to);
		} else if ($type=='page') {
			array_push($results['page'], $title_to);
		}
	}

	echo json_encode($page_links);

	$stmt->close();
}

exit;
?>
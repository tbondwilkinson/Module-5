<?php
session_start();
require "database.php";

$stmt = $mysqli->prepare("SELECT page_id FROM page WHERE page_title=?");

if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$page_title = $_GET['post_title'];


$stmt->bind_param('s', $page_title);
$stmt->execute();
$stmt->bind_result($page_id);

if($stmt->fetch()) {
	$stmt->close();

	$page_links = array();

	$stmt = $mysqli->prepare("SELECT cl_to FROM categorylinks WHERE cl_from=?");

	if(!$stmt){
		printf("Query Prep Failed: %s\n", $mysqli->error);
		exit;
	}

	$stmt->bind_param('s', $page_id);
	$stmt->execute();
	$stmt->bind_result($cl_to);
	while($stmt->fetch()) {
		array_push($page_links, $cl_to);
	}

	echo json_encode($page_links);
	
	$stmt->close;
}

exit;
?>
<?php
session_start();
require "database.php";

$stmt = $mysqli->prepare("SELECT page_id FROM page WHERE page_title=? AND page_namespace=?");

if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$page_title = $_GET['post_title'];

$zero = 0;

$stmt->bind_param('sd', $page_title, $zero);
$stmt->execute();
$stmt->bind_result($page_id);

if($stmt->fetch()) {
	$stmt->close();

	$page_links = array();

	$stmt = $mysqli->prepare("SELECT pl_title FROM pagelinks INNER JOIN page ON page.page_title = pagelinks.pl_title WHERE pl_from=? AND pl_namespace=?");

	if(!$stmt){
		printf("Query Prep Failed: %s\n", $mysqli->error);
		exit;
	}

	$stmt->bind_param('sd', $page_id, $zero);
	$stmt->execute();
	$stmt->bind_result($pl_title);
	while($stmt->fetch()) {
		array_push($page_links, $pl_title);
	}

	echo json_encode($page_links);

	$stmt->close();
}

exit;
?>
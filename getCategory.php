<?php //hello
session_start();
require "database.php";

$_SESSION['page'] = $_GET['post_title'];
unset($_SESSION['category']);

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

	$categories = array();

	$stmt = $mysqli->prepare("SELECT cl_to FROM categorylinks WHERE cl_from=?");

	if(!$stmt){
		printf("Query Prep Failed: %s\n", $mysqli->error);
		exit;
	}

	$stmt->bind_param('s', $page_id);
	$stmt->execute();
	$stmt->bind_result($cl_to);
	while($stmt->fetch()) {
		array_push($categories, $cl_to);
	}

	echo json_encode($categories);
	
	$stmt->close();
}

exit;
?>

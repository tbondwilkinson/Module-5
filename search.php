<?php
session_start();
require "database.php";

$stmt = $mysqli->prepare("SELECT page_title, page_namespace FROM page WHERE page_title LIKE ? LIMIT 10");

if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$query = '%'.$_GET['query'].'%';


$stmt->bind_param('s', $query);
$stmt->execute();
$stmt->bind_result($title, $namespace);

$result = array();
$i=0;

while($stmt->fetch()) {
	$result[$i]['title']=$title;
	$result[$i]['namespace']=$namespace;
}

echo json_encode($result);

$stmt->close();

exit;
?>
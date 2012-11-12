<?php
session_start();
require "database.php";

$stmt = $mysqli->prepare("SELECT page_title, page_namespace FROM page WHERE (page_namespace=0 OR page_namespace=14) AND page_title LIKE ? LIMIT 15");

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
	$i++;
}

echo json_encode($result);

$stmt->close();

exit;
?>

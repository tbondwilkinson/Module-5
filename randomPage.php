<?php
session_start();
require "database.php";

$rnd=mt_rand() / mt_getrandmax();

$stmt = $mysqli->prepare("SELECT page_title FROM page WHERE page_namespace=0
													AND page_is_redirect=0 AND page_random>$rnd ORDER BY
													page_random LIMIT 1");

if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt->execute();
$stmt->bind_result($page_title);

if($stmt->fetch()) {

	echo $page_title;

}

$stmt->close();

exit;
?>
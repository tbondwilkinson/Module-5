<?php
session_start();
require "database.php";

$category_title = $_GET['category'];

$results = array();

$stmt = $mysqli->prepare("SELECT page.page_title, cl_type FROM categorylinks LEFT JOIN
                          page ON page.page_id=cl_from WHERE cl_to=?");

if(!$stmt){
  printf("Query Prep Failed: %s\n", $mysqli->error);
  exit;
}

$stmt->bind_param('s', $category_title);
$stmt->execute();
$stmt->bind_result($title_to, $type);

while($stmt->fetch()) {
  if ($type=='page') {
    array_push($results, $title_to);
  }
}

echo json_encode($results);

$stmt->close();

exit;
?>
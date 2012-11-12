<?php
session_start();

$lastSet = array();
$lastSet['random'] = false;
if (isset($_SESSION['category'])) {
	$lastSet['category'] = $_SESSION['category'];
}
else if (isset($_SESSION['page'])) {
		$lastSet['page'] = $_SESSION['page'];
}
else {
	$lastSet['random'] = true;
}

echo json_encode($lastSet);

?>
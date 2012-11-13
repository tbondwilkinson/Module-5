<?php
$url="http://simple.wikipedia.org/wiki/".$_GET['title'];

//load in the page
$str = file_get_contents($url);
$DOM = new DOMDocument;
$DOM->loadHTML($str);

$dom_xpath = new DOMXpath($DOM);

$jsondata = array();
$jsondata['title'] = "";
$jsondata['img'] = "";
$jsondata['summary'] = "";

//get all h1
$items = $DOM->getElementsByTagName('h1');

//json encode:
if ($items->length >0)
	$jsondata['title']=$items->item(0)->nodeValue;

//get all img
$items = $dom_xpath->query("//div[@id='mw-content-text']/img");//[@class='image']/img");
//json encode:
if ($items->length > 0)
	$jsondata['img']=$items->item(0)->getAttribute('src');

//get all p
$items = $DOM->getElementsByTagName('p');

//json encode:
if ($items->length >0)
	$jsondata['summary']=$items->item(0)->nodeValue;

echo json_encode($jsondata);
?>
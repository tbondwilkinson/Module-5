<?php
ini_set('user_agent', 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.9) Gecko/20071025 Firefox/2.0.0.9');

$url="http://simple.wikipedia.org/wiki/".$_GET['title'];

//load in the page
$str = file_get_contents($url);
$DOM = new DOMDocument();
libxml_use_internal_errors(true);
$DOM->loadHTML($str);
libxml_clear_errors();

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

$items = $dom_xpath->query("//*[@id='mw-content-text']//a/img");//[@class='image']/img");
//json encode:
if ($items->length > 0)
foreach ($items as $item) {
	if ($item->getAttribute('width') > 50 && $item->getAttribute("height") > 50) {
		$jsondata['img']= $item->getAttribute('src');
		break;
	}
}

//get all p
$items = $dom_xpath->query("//*[@id='mw-content-text']/p");

//json encode:
if ($items->length > 0)
	$jsondata['summary']=$items->item(0)->nodeValue;

echo json_encode($jsondata);
?>

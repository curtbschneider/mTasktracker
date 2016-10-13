<?php
echo "what the";
echo $_SERVER['DOCUMENT_ROOT'];
echo 
// load data model module
include $_SERVER['DOCUMENT_ROOT'] . "/mTasktracker/lib/dbModel.php";
$logger = "curts";
$request = $_POST['requested'];
$log_start_date = '2015-02-03';
$log_end_date = '2015-02-23';

$send_to_client = array();
$db = new Tasksdb();
// See which request
$request = 'show-log';
echo $request;
switch ($request) {
    case "task-elements":
        echo "here";
        $sites = $db->getSites();
        //print_r($sites);
        $components = $db->getComponents();
        //print_r($components);
        $categories = $db->getCategories();
        //print_r($categories);
        $send_to_client = array('sites' => $sites, 'components' => $components, 'categories' => $categories);
        print_r($send_to_client);
        break;
    case "show-log":
        $userid = $db->validateUser($logger);
        if ($userid) {
            $logs = $db->getLogs($userid, $log_start_date, $log_end_date);
            if ($logs) {
                $send_to_client = $logs;
                array_push($send_to_client, array('status' => TRUE));
            }
        }
        print_r($send_to_client);
        break;
    
    
    
}
//echo "bullshit";
//header('Cache-Control: no-cache, must-revalidate');
//header("content-type:application/json");
//echo(json_encode($send_to_client));

?>
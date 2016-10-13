<?php
// load data model module
include $_SERVER['DOCUMENT_ROOT']."/mTasktracker/lib/dbModel.php";
$logger = $_SERVER['REMOTE_USER'];
//test
//$logger = 'curts';
$request = $_POST['requested'];
$taskdate = $_POST['task-date'];
$component = $_POST['select-component'];
$category = $_POST['select-category'];
$site = $_POST['select-site'];
$duration = $_POST['task-time'];
$comment = $_POST['task-details'];
if ($request == "update-task") {
    $component = $_POST['edit-select-component'];
    $category = $_POST['edit-select-category'];
    $site = $_POST['edit-select-site'];
    $duration = $_POST['edit-task-time'];
    $comment = $_POST['edit-details'];
}
$run_date = date("Y-m-d H:i:s");
$log_start_date = $_POST['log-start-date'];
$log_end_date = $_POST['log-end-date'];
$logId = $_POST['logid'];
$send_to_client = array('status' => FALSE);

$db = new Tasksdb();
// See which request
switch ($request) {
    case "task-elements":
        $sites = $db->getSites();
        $components = $db->getComponents();
        $categories = $db->getCategories();
        $send_to_client = array('sites' => $sites, 'components' => $components, 'categories' => $categories);
        break;
    case "add-task":
        $userid = $db->validateUser($logger);
        if ($userid) {
            $insert = $db->addTask($userid, $category, $component, $site, $duration, $comment, $taskdate, $run_date);
            if ($insert) {
                $send_to_client = array('status' => TRUE);
            }
        }
        break;
    case "show-log":
        $userid = $db->validateUser($logger);
        if ($userid) {
            $logs = $db->getLogs($userid, $log_start_date, $log_end_date);
            if ($logs) {
                $send_to_client = array('logs' => $logs, 'status' => TRUE);
            }
        }
        break;
    case "delete-log":
        $delete = $db->deleteLogTask($logId);
        if ($delete) {
            $send_to_client = array('status' => TRUE);
        }
        break;
    case "update-task":
        $update = $db->updateLogTask($logId, $category, $component, $site, $duration, $comment, $run_date);
        if (count(update) > 0) {
            $send_to_client = array('log' => $update, 'status' => TRUE);
        }
        break;
        
 }

header('Cache-Control: no-cache, must-revalidate');
header("content-type:application/json");
echo json_encode($send_to_client);

?>
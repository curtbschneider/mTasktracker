<?php

class Tasksdb {
	// just creates connection object
	private $host;
	private $user;
	private $password;
	private $db;
        private $con;

	public function __construct(){
		$this->host = "localhost";
		$this->user = "tasktracker";
		$this->password = "tasktracker";
		$this->db = "tasktracker";
	}
	public function connect() {
		$this->con = new mysqli($this->host, $this->user, $this->password, $this->db) or die('Could not connect to server');
		
	}
	
	
	public function getSites() {
		// get list of sites
		$sites = array();
		$query = "SELECT siteid AS id, code AS val FROM site ORDER BY siteid ASC ";
		$this->connect();
		$result = $this->con->query($query);
		while ($row = $result->fetch_assoc()) {
			array_push($sites, array('id' => $row['id'], 'val' => $row['val']));
		}
		$this->con->close();
		return $sites;
	}
 	
	public function getComponents() {
		// get list of components
		$components = array();
		$query = "SELECT systemid AS id, component AS val FROM system ORDER BY systemid ASC ";
		$this->connect();
		$result = $this->con->query($query);
		while ($row = $result->fetch_assoc()) {
			array_push($components, array('id' => $row['id'], 'val' => $row['val']));
		}
		$this->con->close();
		return $components;
	}
	
	public function getCategories() {
		// get list of components
		$categories = array();
		$query = "SELECT catid AS id, catvalue AS val, systemid AS componentId FROM category ORDER BY id ASC ";
		$this->connect();
		$result = $this->con->query($query);
		while ($row = $result->fetch_assoc()) {
			array_push($categories, array('id' => $row['id'], 'val' => $row['val'], 'componentId' => $row['componentId']));
		}
		$this->con->close();
		return $categories;
	}
	
	public function addTask($userid, $category, $component, $site, $duration, $comment, $taskDate, $run_date) {
		// add task log entry
		$this->connect();
		$run_date = date("Y-m-d H:i:s");
		$comment = $this->con->real_escape_string($comment);
                $comment = preg_replace( '/[^[:print:]]/', '',$comment);
                $insert = "INSERT INTO logs (userid, catid, systemid, siteid, duration, details, logdate, start_time, end_time, created) ";
		$insert .= "VALUES ($userid, $category, $component, $site, $duration, '$comment', '$taskDate', NULL, NULL, '$run_date')";	
		$results = $this->con->query($insert);
		if (!$results) {
			$this->con->close();
			return FALSE;
		}
		$this->con->close();
		return TRUE;
	}
	
	public function validateUser($user) {
		// validate user is in the database
		$query = "SELECT userid FROM user WHERE logname = '$user' ";
		$this->connect();
		$result = $this->con->query($query);
		if ($result->num_rows < 1) {
			$this->con->close();
			return null;
		}
		$row = $result->fetch_assoc();
		$userid = $row['userid'];
		$this->con->close();
		return $userid;
	}
        
        public function getLogs($userId, $start, $end) {
            // get logs for user
            $rowdata = array();
            $query = "SELECT logs.logid AS id, logs.logdate AS logdate, system.component AS component, category.catvalue AS category, site.siteid AS siteid, site.code AS site, ";
            $query .= "logs.systemid AS systemid, logs.catid AS catid, logs.details AS details, logs.duration AS duration FROM logs, system, category, site ";
            $query .= "WHERE logs.userid = $userId AND logs.systemid = system.systemid AND logs.catid = category.catid ";
            $query .= "AND logs.siteid = site.siteid AND logs.logdate BETWEEN '$start' AND '$end' ORDER BY logdate DESC";
            $this->connect();
            $results = $this->con->query($query);
            if ($results->num_rows > 0) {
                while ($row = $results->fetch_assoc()) {
                        $id = $row['id'];
                        $logged = $row['logdate'];
                        $comp = $row['component'];
                        $cat = $row['category'];
                        $site = $row['site'];
                        $detail = $row['details'];
                        $howlong = $row['duration'];
                        $systemid = $row['systemid'];
                        $catid = $row['catid'];
                        $siteid = $row['siteid'];
                        array_push($rowdata, array('id' => $id, 'systemid' => $systemid, 'categoryid' => $catid, 'logged' => $logged,'component' => $comp,'category' => $cat,'siteid' => $siteid,'site' => $site,'details' => $detail,'duration' => $howlong));
                }
            }
            $this->con->close();
            return $rowdata;
        }

        public function deleteLogTask($taskId) {
            // delete a log entry
            $this->connect();
            $query = "DELETE FROM logs WHERE logid = $taskId";
            $results = $this->con->query($query);
	    if (!$results) {
		$this->con->close();
		return FALSE;
            }
	    $this->con->close();
	    return TRUE;
        }

        public function updateLogTask ($logId, $category, $component, $site, $duration, $comment, $run_date) {
            $row = array();
            $this->connect();
	    $comment = $this->con->real_escape_string($comment);
            $comment = preg_replace( '/[^[:print:]]/', '',$comment);
            $update = "UPDATE logs SET catid = $category, systemid = $component, siteid = $site, duration = $duration, details = '$comment', created = '$run_date' WHERE logid = $logId";
            $results = $this->con->query($update);
	    if (!$results) {
		$this->con->close();
		return $row;
            }
            $query = "SELECT logs.logid AS id, logs.logdate AS logdate, system.component AS component, category.catvalue AS category, site.siteid AS siteid, site.code AS site, ";
            $query .= "logs.systemid AS systemid, logs.catid AS catid, logs.details AS details, logs.duration AS duration FROM logs, system, category, site ";
            $query .= "WHERE logs.systemid = system.systemid AND logs.catid = category.catid ";
            $query .= "AND logs.siteid = site.siteid AND logs.logid = $logId";
            $result = $this->con->query($query);
            if ($result->num_rows == 1) {
                $row = $result->fetch_assoc();
            }
            
            $this->con->close();
            return $row;
        }
        
}




?>
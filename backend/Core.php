<?php
/**
 * Core database connection and setup Class
 */
class Core
{
	private $conn;

	function __construct(){
		require_once('_config.php');
		$conn = new mysqli($db_host, $db_username, $db_password, $db_name);
		if($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		} 
		$this->conn = $conn;
		/* Uncomment the below line to create default database and dummt data for the very first time
		** Run the API home url
		** Then Comment the line back to as it is for performance efficiency
		*/
		//$this->createTable();
	}

	function __destruct(){
		$this->conn->close();
	}

	public function escape($str){
		return $this->conn->real_escape_string($str);
	}

	public function query($query){
		return $this->conn->query($query);
	}

	public function sqlError(){
		return $this->conn->error;
	}

	private function insertDummyData(){
		$dummy_user = "INSERT INTO `user` SET `name`='Swapneel Roy', `team`='Kritanj', `email`='swapneelr09@gmail.com', `mobile`='8240714745', `startedAt`=''";
		$query = $this->query("SELECT * FROM `user` WHERE `email`='swapneelr09@gmail.com'");
		if($query->num_rows < 1)
			$this->query($dummy_user);
	}

	private function createTable(){
		$table_user = "CREATE TABLE IF NOT EXISTS `user` (
		`id` int(11) NOT NULL AUTO_INCREMENT,
		`name` varchar(256) NOT NULL,
		`team` varchar(256) NOT NULL,
		`email` varchar(256) NOT NULL,
		`mobile` varchar(256) NOT NULL,
		`startedAt` varchar(256) NOT NULL,
		PRIMARY KEY (`id`)
		) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;";

		$this->query($table_user);

		$this->insertDummyData();

		$table_user = "CREATE TABLE IF NOT EXISTS `submission` (
		`id` int(11) NOT NULL AUTO_INCREMENT,
		`email` varchar(256) NOT NULL,
		`questionNo` varchar(256) NOT NULL,
		`score` int(11) NOT NULL,
		`fullmark` int(11) NOT NULL,
		`code` text NOT NULL,
		`language` varchar(256) NOT NULL,
		`time` varchar(256) NOT NULL,
		PRIMARY KEY (`id`)
		) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;";

		$this->query($table_user);
	}
}

?>
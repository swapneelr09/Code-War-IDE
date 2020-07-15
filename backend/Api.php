<?php

require_once 'Core.php';

class Api extends Core
{
	private $answer_file = 'warPrelimA.json';
	private $question_file = 'warPrelimQ.json';
	private $max_file_size = '1500';
	private $max_exec_time = '5';
	private $totalTime = 60*60*2;

	function __construct(){
		parent::__construct();
	}

	function __destruct(){
		parent::__destruct();
	}

	public function test(){
		$output["data"]='testing OK';
		$this->returnOutput($output);
	}

	public function error404(){
		$output["error"] = "404 Page not found";
		$this->returnOutput($output);
    }
	
	public function login(){
		$this->checkRequestMethod('POST');
		$email = $this->value('email');
		$password = $this->value('password');
		$query = $this->query("SELECT * FROM `user` WHERE `email`='$email' AND `mobile`='$password'");
		if($query->num_rows > 0){
			$output["error"] = false;
			$output["data"] = $query->fetch_assoc();
		}
		else
			$output["error"] = true;
		$this->returnOutput($output,true);
	}

	public function signup(){
		$this->checkRequestMethod('POST');
		$email = $this->value('email');
		$mobile = $this->value('mobile');
		$name = $this->value('name');
		$team = $this->value('team');
		$query = $this->query("SELECT * FROM `user` WHERE `email`='$email'");
		if($query->num_rows < 1){
			$output["error"] = false;
			$output["test"] = $_POST;
			$query = $this->query("INSERT INTO `user` SET `email`='$email',`mobile`='$mobile',`name`='$name',`team`='$team', `startedAt`='', `updateTime`=''");
		}
		else{
			$output["error"] = true;
		}
		$this->returnOutput($output,true);
	}

	public function start(){
		$this->checkRequestMethod('POST');
		$email = $this->value('email');
		$output=[];
		$check = $this->query("SELECT * FROM `user` WHERE `email`='$email' AND `startedAt`=''");
		if($check->num_rows > 0){
			$started = strtotime("now");
			$query = $this->query("UPDATE `user` SET `startedAt`='0' WHERE `email`='$email'");
			$output[]='Started';
		}
		$this->returnOutput($output,true);
	}

	public function changeStart(){
		$this->checkRequestMethod('POST');
		$email = $this->value('email');
		$start = $this->value('start');
		$output=[];
		$check = $this->query("SELECT * FROM `user` WHERE `email`='$email'");
		if($check->num_rows > 0){
			$query = $this->query("UPDATE `user` SET `startedAt`='$start', `updateTime`='' WHERE `email`='$email'");
			$output[]='Started';
		}
		$this->returnOutput($output,true);
	}

	public function getQuestion(){
		$this->checkRequestMethod('GET');
		$output = json_decode(file_get_contents($this->question_file),true);
		$this->returnOutput($output);
	}

	public function getLanguage(){
		$this->checkRequestMethod('GET');
		$output = json_decode(file_get_contents('language.json'),true);
		$this->returnOutput($output);
	}

	public function time(){
		$this->checkRequestMethod('GET');
		header('Access-Control-Allow-Origin: *');
		echo strtotime("now");
	}

	public function userTime(){
		$this->checkRequestMethod('POST');
		$email = $this->value('email');
		$check = $this->query("SELECT `startedAt`, `updateTime` FROM `user` WHERE `email`='$email'");
		if($check->num_rows > 0){
			while ($data = $check->fetch_assoc()) {
				$output = $data;
			}
		}
		$this->returnOutput($output,true);
	}

	public function changeTime(){
		$this->set_process();
		$this->checkRequestMethod('POST');
		$email = $this->value('email');
		$d = $this->value('d');
		$output=[];
		$check = $this->query("SELECT * FROM `user` WHERE `email`='$email'");
		if($check->num_rows > 0){
			$started = strtotime("now");
			$query = $this->query("UPDATE `user` SET `updateTime`='$d' WHERE `email`='$email'");
			$output[]='Updated';
		}
		$this->release_process();
		$this->returnOutput($output,true);
	}

	public function mySubmission(){
		$this->checkRequestMethod('POST');
		$email = $this->value('email');
		$query = $this->query("SELECT * FROM `submission` WHERE `email`='$email' ORDER BY `time` DESC LIMIT 10");
		$output=[];
		if($query->num_rows > 0){
			while ($data = $query->fetch_assoc()) {
				$output[]=$data;
			}
		}
		$this->returnOutput($output);
	}

	public function submit(){
		$this->set_process();
		$this->checkRequestMethod('POST');
		$language = $_POST['language'];
		$codeContent = $_POST['codeContent'];
		$questionNo = $_POST['questionNo'];
		$now = $_POST['now'];
		$testCases = json_decode(file_get_contents($this->answer_file),true)[$questionNo]["testcase"];
		//print_r($testCases);
		//exit();
		$output = [];
		$temp_type = '';

		if(preg_match_all('/system\(.*?\)|exec\(.*?\)/i', $codeContent)){
			$temp_type = 'CE';
		}

		$result = [];
		foreach ($testCases as $key => $testCase) {
			$result[$key]["fullMark"] = $testCase["mark"];
			$result[$key]["mark"] = 0;
			$result[$key]["passed"] = false;
			if(!empty($temp_type)){
				$result[$key]["type"] = $temp_type;
			}
			else{
				switch($language){
					case 'c':
						$resultData = $this->c_compiler($codeContent, trim($testCase["input"]));
					break;
					case 'cpp':
						$resultData = $this->cpp_compiler($codeContent, trim($testCase["input"]));
					break;
					case 'java':
						$resultData = $this->java_compiler($codeContent, trim($testCase["input"]));
					break;
					case 'python3':
						$resultData = $this->python_compiler($codeContent, trim($testCase["input"]));
					break;
				}
				if($resultData["type"]=='CA'){
					if(trim($resultData["data"])==trim($testCase["output"])){
						$result[$key]["type"] = 'CA';
						$result[$key]["mark"] = $testCase["mark"];
						$result[$key]["passed"] = true;
					}
					else{
						$result[$key]["type"] = 'WA';
					}
				}else{
					$result[$key]["type"] = $resultData["type"];
				}
			}
		}

		$fullMark = 0;
		$score = 0;

		foreach ($result as $data) {
			$fullMark += $data['fullMark'];
			$score += $data['mark'];
		}

		$email = $this->value('email');
		$language = $this->value('language');
		$codeContent = $this->value('codeContent');
		$questionNo = $this->value('questionNo');

		$query = "INSERT INTO `submission` SET `email`='$email', `questionNo`='$questionNo', `score`='$score', `fullmark`='$fullMark', `language`='$language', `code`='$codeContent', `time`='$now'";

		$this->query($query);

		$output = $result;

		$this->release_process();

		$this->returnOutput($output);
	}

	public function leaderboard(){
		$this->checkRequestMethod('GET');
		$total = $this->totalTime;
		$fullDatabase = "SELECT a.id, a.email, a.time, a.questionNo, a.score, b.team, b.startedAt FROM `submission` a INNER JOIN `user` b ON a.email = b.email ORDER BY `id`";
		$allMaxScore = "SELECT a.questionNo, a.team, max(a.score) maxscore FROM ($fullDatabase) a GROUP BY a.questionNo, a.team";
		$withId = "SELECT id, startedAt, maxscore, b.questionNo, b.team FROM ($allMaxScore) b LEFT JOIN ($fullDatabase) a ON b.maxscore = a.score AND b.questionNo = a.questionNo AND b.team = a.team GROUP BY b.questionNo, b.team ORDER BY b.team,id DESC";
		$rawleaderboard = "SELECT id,team,sum(maxscore) score, startedAt FROM ($withId) a GROUP BY team ORDER BY score DESC,id";
		$leaderboard = "SELECT a.id,a.team,a.score,($total - b.time) as `time` FROM ($rawleaderboard) a LEFT JOIN ($fullDatabase) b ON a.id = b.id ORDER BY a.score DESC,`time`";

		$query = $this->query($leaderboard);
		$output=[];
		if($query->num_rows > 0){
			while ($data = $query->fetch_assoc()) {
				$output[]=$data;
			}
		}
		$this->returnOutput($output);
	}

	public function compile(){
		$this->set_process();
		$this->checkRequestMethod('POST');
		$language = $_POST["language"];
		$customInput = $_POST['customInput'];
		$codeContent = $_POST['codeContent'];
		$output = [];

		if(preg_match_all('/system\(.*?\)|exec\(.*?\)/i', $codeContent)){
			$output["message"] = 'Compilation failed, program contains restricted library or function.';
			$output["type"] = 'CE';
			$output["data"] = '';
			$this->returnOutput($output);
			exit();
		}

		switch($language){
			case 'c':
				$output = $this->c_compiler($codeContent, trim($customInput));
			break;
			case 'cpp':
				$output = $this->cpp_compiler($codeContent, trim($customInput));
			break;
			case 'java':
				$output = $this->java_compiler($codeContent, trim($customInput));
			break;
			case 'python3':
				$output = $this->python_compiler($codeContent, trim($customInput));
			break;
		}
		$this->release_process();
		$this->returnOutput($output);
	}

	private function c_compiler($codeContent, $customInput){
		$generated_file_name = './temp/'.strtotime("now").'_'.rand(0001,9999);

		$main_file_name = $generated_file_name.'.c';
		$stdin_file_name = $generated_file_name.'stdin.txt';
		$stdexe_file_name = $generated_file_name.'stdexe.out';
		$stdout_file_name = $generated_file_name.'stdout.txt';
		$fp=fopen($main_file_name,"w+");
		fwrite($fp,$codeContent);
		fclose($fp);
		$fp=fopen($stdin_file_name,"w+");
		fwrite($fp,trim($customInput));
		fclose($fp);

		$compile_command = 'g++ -lm -o '.$stdexe_file_name.' '.$main_file_name.' 2>&1';
		$execution_command='timeout -s KILL '.$this->max_exec_time.'s '.$stdexe_file_name.' < '.$stdin_file_name.' | head -c '.$this->max_file_size.'k 1> '.$stdout_file_name.' 2>&1';

		$stdErr = shell_exec($compile_command);

		if(trim($stdErr)==''){
			$executionStartTime = microtime(true);
			$stdErr = shell_exec($execution_command);
			$executionEndTime = microtime(true);
			$seconds = $executionEndTime - $executionStartTime;
			$seconds = sprintf('%0.3f', $seconds);
			if(filesize($stdout_file_name)*0.001 >= $this->max_file_size){
				$output["message"] = 'Memory limit exceeded !';
				$output["type"] = 'FSE';
				$output["data"] = '';
			}
			else if($seconds >= $this->max_exec_time){
				$output["message"] = 'Time limit of exceeded !';
				$output["type"] = 'TLE';
				$output["data"] = '';
			}
			else{
				$output["message"] = 'Compiled successfully in '.$seconds.'s !';
				$output["type"] = 'CA';
				$output["data"] = rtrim(file_get_contents($stdout_file_name));
			}
		}
		else{
			$output["message"] = 'Compilation Failed !';
			$output["type"] = 'CE';
			$output["data"] = $stdErr;
		}

		exec("rm $main_file_name");
		exec("rm $stdin_file_name");
		exec("rm $stdexe_file_name");
		exec("rm $stdout_file_name");
		//print_r($output);
		//exit();
		return $output;
	}

	private function cpp_compiler($codeContent, $customInput){

		$generated_file_name = './temp/'.strtotime("now").'_'.rand(0001,9999);

		$main_file_name = $generated_file_name.'.cpp';
		$stdin_file_name = $generated_file_name.'stdin.txt';
		$stdexe_file_name = $generated_file_name.'stdexe.out';
		$stdout_file_name = $generated_file_name.'stdout.txt';

		$fp=fopen($main_file_name,"w+");
		fwrite($fp,$codeContent);
		fclose($fp);
		$fp=fopen($stdin_file_name,"w+");
		fwrite($fp,trim($customInput));
		fclose($fp);

		$compile_command = 'g++ -o '.$stdexe_file_name.' '.$main_file_name.' 2>&1';
		$execution_command='timeout -s KILL '.$this->max_exec_time.'s '.$stdexe_file_name.' < '.$stdin_file_name.' | head -c '.$this->max_file_size.'k 1> '.$stdout_file_name.' 2>&1';

		$stdErr = shell_exec($compile_command);

		if(trim($stdErr)==''){
			$executionStartTime = microtime(true);
			$stdErr = shell_exec($execution_command);
			$executionEndTime = microtime(true);
			$seconds = $executionEndTime - $executionStartTime;
			$seconds = sprintf('%0.3f', $seconds);
			
			if(filesize($stdout_file_name)*0.001 >= $this->max_file_size){
				$output["message"] = 'Memory limit exceed !';
				$output["type"] = 'FSE';
				$output["data"] = '';
			}
			else if($seconds >= $this->max_exec_time){
				$output["message"] = 'Time limit exceed !';
				$output["type"] = 'TLE';
				$output["data"] = '';
			}
			else{
				$output["message"] = 'Compiled successfully in '.$seconds.'s !';
				$output["type"] = 'CA';
				$output["data"] = rtrim(file_get_contents($stdout_file_name));
			}
		}
		else{
			$output["message"] = 'Compilation Failed !';
			$output["type"] = 'CE';
			$output["data"] = $stdErr;
		}

		exec("rm $main_file_name");
		exec("rm $stdin_file_name");
		exec("rm $stdexe_file_name");
		exec("rm $stdout_file_name");
		
		return $output;
	}

	private function python_compiler($codeContent, $customInput){

		$generated_file_name = './temp/'.strtotime("now").'_'.rand(0001,9999);

		$main_file_name = $generated_file_name.'.py';
		$stdin_file_name = $generated_file_name.'stdin.txt';
		$stderr_file_name = $generated_file_name.'stderr.txt';
		$stdout_file_name = $generated_file_name.'stdout.txt';

		$fp=fopen($main_file_name,"w+");
		fwrite($fp,$codeContent);
		fclose($fp);
		$fp=fopen($stdin_file_name,"w+");
		fwrite($fp,trim($customInput));
		fclose($fp);

		//$compile_command = 'g++ -o '.$stdexe_file_name.' '.$main_file_name.' 2>&1';
		$execution_command='timeout -s KILL '.$this->max_exec_time.'s python3 '.$main_file_name.' < '.$stdin_file_name.' 2> '.$stderr_file_name.' | head -c '.$this->max_file_size.'k 1> '.$stdout_file_name;

			$executionStartTime = microtime(true);
			shell_exec($execution_command);
			$executionEndTime = microtime(true);
			$seconds = $executionEndTime - $executionStartTime;
			$seconds = sprintf('%0.3f', $seconds);

		$stdErr = explode('File "/usr/lib/python3',file_get_contents($stderr_file_name));
		$stdErr = $stdErr[0];
		if(strpos($stdErr, 'BrokenPipeError'))
			$stdErr = '';

		if(trim($stdErr)==''){			
			if(filesize($stdout_file_name)*0.001 >= $this->max_file_size){
				$output["message"] = 'Memory limit exceed !';
				$output["type"] = 'FSE';
				$output["data"] = '';
			}
			else if($seconds >= $this->max_exec_time){
				$output["message"] = 'Time limit exceed !';
				$output["type"] = 'TLE';
				$output["data"] = '';
			}
			else{
				$output["message"] = 'Compiled successfully in '.$seconds.'s !';
				$output["type"] = 'CA';
				$output["data"] = rtrim(file_get_contents($stdout_file_name));
			}
		}
		else{
			$output["message"] = 'Compilation Failed !';
			$output["type"] = 'CE';
			$output["data"] = $stdErr;
		}

		exec("rm $main_file_name");
		exec("rm $stdin_file_name");
		exec("rm $stderr_file_name");
		exec("rm $stdout_file_name");
		return $output;
	}

	private function java_compiler($codeContent, $customInput){

		$generated_file_name = './temp/'.strtotime("now").'_'.rand(0001,9999);

		$main_file_name = $generated_file_name.'/Codewar.java';
		$stdin_file_name = $generated_file_name.'/stdin.txt';
		$stdexe_file_name = $generated_file_name.'/Codewar.class';
		$stdout_file_name = $generated_file_name.'/stdout.txt';

		$dirname = dirname($main_file_name);
		if (!is_dir($dirname))
		{
			mkdir($dirname, 0777, true);
			shell_exec("chmod -R 777 $dirname");
		}

		$fp=fopen($main_file_name,"w+");
		fwrite($fp,$codeContent);
		fclose($fp);
		$fp=fopen($stdin_file_name,"w+");
		fwrite($fp,trim($customInput));
		fclose($fp);

		$compile_command = 'javac '.$main_file_name.' 2>&1';
		//$execution_command='timeout -s KILL 5s java -cp '.$generated_file_name.' Codewar < '.$stdin_file_name.' | head -c 300k 1> '.$stdout_file_name.' 2>&1';

		$execution_command='timeout -s KILL '.$this->max_exec_time.'s java -cp '.$generated_file_name.' Codewar < '.$stdin_file_name.' 1> '.$stdout_file_name.' 2>&1';

		$stdErr = shell_exec($compile_command);

		if(trim($stdErr)==''){
			$executionStartTime = microtime(true);
			$stdErr = shell_exec($execution_command);
			$executionEndTime = microtime(true);
			$seconds = $executionEndTime - $executionStartTime;
			$seconds = sprintf('%0.3f', $seconds);
			if(filesize($stdout_file_name)*0.001 >= $this->max_file_size){
				$output["message"] = 'Memory limit exceed !';
				$output["type"] = 'FSE';
				$output["data"] = '';
			}
			else if($seconds >= $this->max_exec_time){
				$output["message"] = 'Time limit exceed !';
				$output["type"] = 'TLE';
				$output["data"] = '';
			}
			else{
				$output["message"] = 'Compiled successfully in '.$seconds.'s !';
				$output["type"] = 'CA';
				$output["data"] = rtrim(file_get_contents($stdout_file_name));
			}
		}
		else{
			$output["message"] = 'Compilation Failed !';
			$output["type"] = 'CE';
			$output["data"] = $stdErr;
		}

		exec("rm -rf $generated_file_name");
		return $output;
	}

	private function checkRequestMethod($request){
		if($_SERVER['REQUEST_METHOD'] != $request){
			$output["error"] = "Invalid request.";
			$this->returnOutput($output);
		}

	}

	private function value($item,$escape=true) {
        if(isset($_POST[$item])) {
            return ($escape) ? $this->escape($_POST[$item]) : $_POST[$item];
        } else if(isset($_GET[$item])) {
            return ($escape) ? $this->escape($_GET[$item]) : $_GET[$item];
        }
        return '';
    }

	private function returnOutput($data, $isPostMethod = false){
		header('Access-Control-Allow-Origin: *');
		header("Content-Type: application/json; charset=UTF-8");
		if($isPostMethod)
			header("Access-Control-Allow-Methods: POST");
		header("Access-Control-Max-Age: 3600");
		header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
		echo json_encode($data);
		exit();
	}

	private function set_process() {
		$count = file_get_contents('countQueue.dat');
		if($count<10){
			$x = file_put_contents('countQueue.dat',$count+1);
		}
		else{
			header('Access-Control-Allow-Origin: *');
			echo '0';
			exit();
		}
	}

	private function release_process() {
		$count = file_get_contents('countQueue.dat');
		if($count>0){
			file_put_contents('countQueue.dat',$count-1);
		}
	}
}
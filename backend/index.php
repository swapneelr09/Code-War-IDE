<?php
    require_once 'Api.php';
    $apiUrl = '/kritanjApi/';

    $ob = new Api();

    $ROUTE = array(
        'error404' => 'error404',
        'test' => 'test',
        'getQuestion' => 'getQuestion',
        'getLanguage' => 'getLanguage',
		'submit' => 'submit',
		'compile' => 'compile',
		'time' => 'time',
		'login' => 'login',
		'signup' => 'signup',
		'mySubmission' => 'mySubmission',
		'leaderboard' => 'leaderboard',
		'start' => 'start',
		'usertime' => 'userTime',
		'changetime' => 'changeTime',
		'changestart' => 'changeStart'
    );

	$url = rtrim($_SERVER['REQUEST_URI'], '/');
	$url = substr($url, strlen($apiUrl));
	$url = explode('?',$url);

	if(empty($url[0]))
		$index = 'test';
	else{
		$index = rtrim($url[0], '/');
	}

	if(array_key_exists($index, $ROUTE)){
		if(!empty($ROUTE[$index])){
			$ob->{$ROUTE[$index]}();
		}
	}
	else
	{	
		$o =  array('error' => $index );
		echo json_encode($o);
		//$ob->{$ROUTE['error404']}();
	}
?>
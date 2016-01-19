<?php
$data = array(
    'success'    => true,
    'message'    => "ok",
    'data'       => array(
		'id'	=> rand(10,100),
		'text'	=> "New sticky",
		'pos_x' => $_POST['pos_x'],
		'pos_y' => $_POST['pos_y']
	)
);
die( json_encode($data) );
?>
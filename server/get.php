<?php
$data = array(
    'success'   => true,
    'message'   => "ok",
	'data'		=> array(
		array(	'id'	=> 1,
		  		'text' 	=> "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		  		'pos_x'	=> 100,
		  		'pos_y'	=> 80
		),
		array(	'id'	=> 2,
		  		'text' 	=> "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		  		'pos_x'	=> 240,
		  		'pos_y'	=> 110
		)
	)
);

die( json_encode($data) );
?>
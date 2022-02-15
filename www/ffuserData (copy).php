<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8"/>
<title>Homie | UserData</title>
<link rel ="stylesheet" href="login.css">
<link rel ="stylesheet" href="./font-awesome-4.7.0/css/font-awesome.min.css">
</head>
<body>
<?php

$db = new SQLite3('./db/homie.db') or die("cannot open the database");

$userData = json_decode($_GET['userData']);



if(!empty($userData)){
    // The user's profile info
    
    $oauth_uid  = $userData->id;
    $first_name = $userData->gname; var_dump($first_name);
    $email      = $userData->email;
    $oauth_provider = $_GET['oauth_provider'];
    
    // Check whether the user data already exist in the database
    $query = "SELECT * FROM user_data WHERE oauth_provider = '$oauth_provider' AND username = '$oauth_uid'";
    $result = $db->query($query);
    $row = $result->fetchArray();
    
    $count = count($row);echo $oauth_uid;
    if($count>1){ 
        // Update user data if already exists
        $query = "UPDATE user_data SET first_name= '$first_name' username = '$oauth_uid',  email = '$email' WHERE oauth_provider = '$oauth_provider' AND username = '$oauth_uid'";
        $update = $db->query($query);
        echo "sono qui";
        session_start();
        $_SESSION["first_name"]=$first_name;
        header("location: home.php");
    }else{
        // Insert user data
        $query = "INSERT INTO user_data (username, email, first_name, oauth_provider ) VALUES ( '$oauth_uid', '$email', '$first_name', '$oauth_provider')";
        $insert = $db->query($query);
        echo "sono li";
        session_start();
        $_SESSION["first_name"]=$first_name;
        header("location: home.php");
    }
    
    return true;
}
?>
</body>

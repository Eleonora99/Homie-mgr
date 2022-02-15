<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8"/>
<title>Homie | signup</title>
<link rel ="stylesheet" href="login.css">
<link rel ="stylesheet" href="./font-awesome-4.7.0/css/font-awesome.min.css">
</head>
<body>
<?php

$db = new SQLite3('./db/homie.db') or die("cannot open the database");

$username = $_POST["username"];
$email    = $_POST["email"];
$password = $_POST["password"];
$first_name =$_POST["first_name"];


if ($username){
     $query = "SELECT * FROM user_data WHERE username='$username'"; 
     $users =$db->query($query);
     $row = $users->fetchArray();
    
     $count = count($row);
    
     if($count>1) {
          echo "<script> alert('username già usato')</script>";
     }
     else { 
          $riga="INSERT INTO user_data (username, email, password, first_name, oauth_provider ) VALUES ( '$username', '$email','$password', '$first_name', NULL)";
          
         if ($dati = $db->query($riga)) {
              session_start();
               $_SESSION["first_name"]=$first_name;
               header("location: home.php");
         }
          else {
               echo  "<form> <input type=\"button\" value=\"ERRORE DB- Go back!\" onclick=\"history.back()\"> </form>";
          }
     }
   }       
    

$db = null;
?>

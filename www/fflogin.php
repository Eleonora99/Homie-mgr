<!doctype html>
<html lang="it">
   <head>
    <meta charset="utf-8"/>
    <title>Homie | Login</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel ="stylesheet" href="home.css">
    </head>
    <body>
<?php
$db = new SQLite3('./db/homie.db') or die("cannot open the database");

$username   = $_POST["username"];
$password   = $_POST["password"];

if(!empty($_POST["remember"])) {
      setcookie ("username",$_POST["username"],time()+ 3600);
      setcookie ("password",$_POST["password"],time()+ 3600);
      echo "Cookies Set Successfuly";
    } else {
      setcookie("username","");
      setcookie("password","");
      echo "Cookies Not Set";
    }

if ($username!="" AND $password !=""){
     
    $query = $db->query("SELECT * FROM user_data WHERE username = '$username' AND password = '$password';");
    
    $row=$query->fetchArray();
    
        $count= count($row);
        
        
        if($count > 1){
          $first_name = $row[3];
          session_start();
          $_SESSION["first_name"]=$first_name;
        
          header("location: home.php");
          
        }else{echo "<div class ='container' style='width=50%; height:50%;'><h1> Attenzione! Non sei registrato. </h1><form> <input type=\"button\" value=\" Go back!\" onclick=\"history.back()\"> </form></div>";
           
        }
    }

$db = null;
?>
</body>
</html>
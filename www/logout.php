<?php
 session_start();

 unset($_SESSION["first_name"]);
 header("Location:ffindex.php");
 ?>
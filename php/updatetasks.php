<?php
  $prev_priority = $_POST["prev"];
  $curr_priority = $_POST["curr"];
  
  try
  {
    // open connection to database
    $dbh = new PDO("sqlite:../todolist.db");
    
    $dbh->exec("UPDATE tasks SET priority = priority + 1 WHERE priority > $prev_priority");
    if (intval($prev_priority) == -1)
    {
      $dbh->exec("UPDATE tasks SET priority = $prev_priority + 1 WHERE priority = $curr_priority + 1");
    }
    else
    {
      $dbh->exec("UPDATE tasks SET priority = $prev_priority + 1 WHERE priority = $curr_priority");
    }
    
    $dbh = null;
    
    echo "Your tasks have been updated.";
  }
  catch(PDOException $e)
  {
    echo $e->getMessage();
  }
?>
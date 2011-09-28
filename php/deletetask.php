<?php
  try
  {
    // get priority of task to be deleted
    $priority = $_POST["priority"];
    
    // open connection to database
    $dbh = new PDO("sqlite:../todolist.db");
    
    // delete task
    $dbh->exec("DELETE FROM tasks WHERE priority = $priority");
    
    // update the other tasks
    $dbh->exec("UPDATE tasks SET priority = priority - 1 WHERE priority > $priority");
    
    // close database connection
    $dbh = null;
  }
  catch(PDOException $exception)
  {
    echo $exception->getMessage();
  }
?>
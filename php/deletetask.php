<?php
  try
  {
    // get index that needs to be deleted
    $priority = $_POST["priority"];
    
    // open connection to database
    $dbh = new PDO("sqlite:../todolist.db");
    
    // delete task
    $dbh->exec("DELETE FROM tasks WHERE priority = $priority");
    
    // update the other tasks
    $dbh->exec("UPDATE tasks SET priority = priority - 1 WHERE priority > $priority");
    
    // close database connection
    $dbh = null;
    
    echo "Your task has been deleted.";
  }
  catch(PDOException $e)
  {
    echo $e->getMessage();
  }
?>
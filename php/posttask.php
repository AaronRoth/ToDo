<?php
  try
  {
    // get values to insert
    $task = sqlite_escape_string($_POST["task"]);
    
    // open connection to database
    $dbh = new PDO("sqlite:../todolist.db");
    
    // count the number of rows in database
    $result = $dbh->query("SELECT * FROM tasks");
    $row_count = 0;
    foreach($result as $row)
    {
      $row_count++;
    }
    
    // only update priorities if there is at least one task in the database
    if($row_count > 0)
    {
      // update all task priorities
      $dbh->exec("UPDATE tasks SET priority = priority + 1 WHERE priority >= 0");
    }
    
    // insert values of new task
    $dbh->exec("INSERT INTO tasks VALUES (0, '$task')");
    
    // close database connection
    $dbh = null;
    
    echo "Your task has been added.";
  }
  catch(PDOException $e)
  {
    echo $e->getMessage();
  }
?>
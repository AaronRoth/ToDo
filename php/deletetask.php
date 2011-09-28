<?php
  try
  {
    // get index that needs to be deleted
    $index = $_POST["index"];
    
    // open connection to database
    $dbh = new PDO("sqlite:../todolist.db");
    
    // get number of rows in table
    $result = $dbh->query("SELECT * FROM tasks");
    $row_count = 0;
    foreach($result as $row)
    {
      $row_count++;
    }
    
    // delete task
    $dbh->exec("DELETE FROM tasks WHERE priority = $index");
    
    $start = $index + 1;
    $end = $row_count;
    
    // increase priorities of every task (by 1) with a lower priority than deleted task
    for($i = $start; $i < $end; $i++)
    {
      $new_prior = $i - 1;
      $dbh->exec("UPDATE tasks SET priority = $new_prior WHERE priority = $i");
    }
        
    $dbh = null;
    
    echo "Your task has been deleted.";
  }
  catch(PDOException $e)
  {
    echo $e->getMessage();
  }
?>
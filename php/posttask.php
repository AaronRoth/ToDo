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
    
    // do not update priorities if there are no tasks in database
    if($row_count > 0)
    {
      $i = $row_count - 1;
      
      // increases all priorities in the database by one
      while($i != -1)
      {
        $j = $i + 1;
        $dbh->exec("UPDATE tasks SET priority = $j WHERE priority = $i");
        $i--;
      }
    }
    
    // insert values of added task
    $dbh->exec("INSERT INTO tasks VALUES (0, '$task')");
    
    $dbh = null;
    
    echo "Your task has been added.";
  }
  catch(PDOException $e)
  {
    echo $e->getMessage();
  }
?>
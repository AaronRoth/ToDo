<?php
  try
  {
    // get text for new task
    $task = $_POST["task"];
    $poster = $_POST["poster"];
    
    // replace any double quotes with single quotes
	  $lookfor = array('"');
	  $replacewith = "'";
    $task = str_replace($lookfor, $replacewith, $task);
    
    // remove any newline and backslash characters
	  $lookfor = array("\r\n", "\n", "\r", "\\");
	  $replacewith = "** NO NEWLINE OR BACKSLASH CHARACTERS ALLOWED **";
    $task = str_replace($lookfor, $replacewith, $task);
    
    // prepare text for database
    $task = sqlite_escape_string($task);
        
    // open connection to database
    $dbh = new PDO("sqlite:../todolist.db");
    
    // count the number of rows in database
    $result = $dbh->query("SELECT * FROM tasks");
    $row_count = 0;
    foreach ($result as $row)
    {
      $row_count++;
    }
    
    // only update priorities if there is at least one task in the database
    if ($row_count > 0)
    {
      // update all task priorities
      $dbh->exec("UPDATE tasks SET priority = priority + 1 WHERE priority >= 0");
    }
    
    // insert values of new task
    $dbh->exec("INSERT INTO tasks VALUES (0, '$task', '$poster')");
    
    // close database connection
    $dbh = null;
  }
  catch (PDOException $exception)
  {
    echo $eexception->getMessage();
  }
?>
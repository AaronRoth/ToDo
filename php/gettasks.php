<?php
  try
  {
    // ---------- Connect to database and get resources and info ---------- //
    
    // open connection to database
    $dbh = new PDO("sqlite:../todolist.db");
    
    // get two different references to all records in database
    $result1 = $dbh->query("SELECT * FROM tasks");
    $result2 = $dbh->query("SELECT * FROM tasks");
    
    // get number of rows in table
    $row_count = 0;
    foreach($result1 as $row)
    {
      $row_count++;
    }
    
    // ---------- Build JSON array of tasks ---------- //
    
    $jsontasks = "[";
    $loop_count = 0;
    
    foreach($result2 as $row)
    {
      $jsontaskobject =
        "{" .
          "\"priority\": \"$row[0]\"," .
          "\"task\": \"$row[1]\"" .
        "}";
        
			$loop_count++;
			
			if($loop_count < $row_count)
			{
			  $jsontasks .= $jsontaskobject . ",";
			}
			else
			{
				$jsontasks .= $jsontaskobject;
			}
    }
    
    $jsontasks .= "]";
    
    $dbh = null;
    
    echo $jsontasks;
  }
  catch(PDOException $e)
  {
    echo $e->getMessage();
  }
?>
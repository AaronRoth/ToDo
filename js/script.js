$(document).ready(function() {
  // populates current tasks when page loads
  getTasks();
  
  // submits task
  $('#submit-task').click(function() {
    var task_text = $('#task-text').val();
    submitTask(task_text);
  });
  
  // shows delete button on tasks and changes poster name color
  $('.task-class').live('mouseover', function() {
    $(this).children().first().next().attr('style', 'display: block');
    $(this).children().first().next().next().attr('style', 'color: #b2b2b2');
  });
  
  // hides delete button on tasks and changes poster name color
  $('.task-class').live('mouseout', function() {
    $(this).children().first().next().attr('style', 'display: none');
    $(this).children().first().next().next().attr('style', 'color: #999999');
  });
  
  // calls the task delete function
  $('.delete-button').live('click', function(event) {
    var task = $(this).parent();
    var priority = parseInt(task.children().first().text());
    
    deleteTask(task, priority);
  });
  
  // FancyBox options
  $('#task-link').fancybox({
    'scrolling' : 'no',
    'titleShow' : false,
    'speedIn' : 600,
    'speedOut' : 200,
    'overlayShow' : true,
    'overlayOpacity' : 0.7,
    'overlayColor' : '#000000',
    'onComplete' : fancyboxCallback,
    'onCleanup' : deleteText
  });
  
  // jQuery UI sortable options
  $('#list-area').sortable({
    containment: 'document',
    cursor: 'crosshair',
    update: function(event, ui) {
      var curr = ui.item;
      var curr_priority = parseInt(curr.children().first().text());
      var prev = curr.prev();
      if (prev.length > 0) {
        var prev_priority = parseInt(prev.children().first().text());
      } else {
        var prev_priority = -1;
      }
      
      updateTasks(prev_priority, curr_priority);
    }
  });
});

// builds HTML task divs from JSON
function buildList(json) {
  var html = '';
  
  var array = [];
  for (var i = 0; i < json.length; i++) {
    array[json[i]['priority']] = [json[i]['priority'], json[i]['task']];
  }
  
  for (var i = 0; i < array.length; i++) {
    if (array[i] != undefined) {
      html += '<div class=\'task-class\'><div class=\'priority\'>' + array[i][0] + 
        '</div>' + array[i][1] + '<div class=\'delete-button\'>x</div><div class=\'poster\'>Aaron</div></div>';
    }
  }
  
  return html;
}

// deletes task from database
function deleteTask(task, priority) {
  $.ajax({
    type: 'POST',
    url: 'php/deletetask.php',
    data: {'priority': priority},
    success: function(report) {
      task.remove();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
			$('#list-area').append('<p>Ajax error: ' + errorThrown + '</p>');
		},
		complete: function(jqXHR, textStatus) {
		  getTasks();
		}
  });
}

// deletes text from textbox when a task is submitted
function deleteText() {
  var textbox_handle = $('#fancybox-content').children().first().children().first().children().first().next();
  textbox_handle.val('');
}

// focuses on textarea when loaded with fancybox
function fancyboxCallback() {
  var textbox_handle = $('#fancybox-content').children().first().children().first().children().first().next();
  textbox_handle.focus();
}

// gets JSON array of tasks
function getTasks() {
  $.ajax({
    type: 'GET',
    url: 'php/gettasks.php',
    dataType: 'json',
    success: function(jsonresponse) {
      // builds html from json and appends it
      var html = buildList(jsonresponse);
      $('#list-area').empty();
      $('#list-area').append(html);
		},
    error: function(XMLHttpRequest, textStatus, errorThrown) {
			$('#list-area').append('<p>Ajax error: ' + errorThrown + '</p>');
		},
		complete: function(jqXHR, textStatus) {
		  stripeIt();
		}
  });
}

// gives an html task list alternating colors
function stripeIt() {
  $('#list-area').children().each(function(index) {
    if (index % 2 == 0) {
      $(this).addClass('task-class-alt');
    }
  });
};

// submits task to database
function submitTask(text) {
  $.ajax({
    type: 'POST',
    url: 'php/posttask.php',
    data: {'task': text},
    success: function(report) {
      $.fancybox.close();
      getTasks();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
			('#list-area').append('<p>Ajax error: ' + errorThrown + '</p>');
		}
  });
}

// updates priorities in database after human sorting
function updateTasks(prev_priority, curr_priority) {
  $.ajax({
    type: 'POST',
    url: 'php/updatetasks.php',
    data: {'prev': prev_priority, 'curr': curr_priority},
    error: function(XMLHttpRequest, textStatus, errorThrown) {
			('#list-area').append('<p>Ajax error: ' + errorThrown + '</p>');
		},
		complete: function(jqXHR, textStatus) {
		  getTasks();
		}
  });
}
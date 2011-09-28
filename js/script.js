$(document).ready(function() {
  getTasks();
  
  // submits task
  $('#submit-task').click(function() {
    var task_text = $('textarea').val();
    
    submitTask(task_text);
  });
  
  // shows delete button on tasks
  $('.task-class').live('mouseover', function() {
    $(this).children().first().attr('style', 'display: block');
  });
  
  // hides delete button on tasks
  $('.task-class').live('mouseout', function() {
    $(this).children().first().attr('style', 'display: none');
  });
  
  // deletes task
  $('.delete-button').live('click', function() {
    var task = $(this).parent();
    var index = $('#list-area').children().index(task);
    
    deleteTask(task, index);
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
});

// builds HTML task list from JSON
function buildList(json) {
  var html = '';
  
  for(var i = 0; i < json.length; i++) {
    html = '<div class=\'task-class\'>' + json[i]['task'] + '<div class=\'delete-button\'>x</div></div>' + html;
  }
  
  return html;
}

// deletes task from database
function deleteTask(task, index) {
  $.ajax({
    type: 'POST',
    url: 'php/deletetask.php',
    data: {'index': index},
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

// delete text from textbox when submitted
function deleteText() {
  var textbox_handle = $('#fancybox-content').children().first().children().first().children().first().next();
  textbox_handle.val('');
}

// focuses on textarea when loaded 
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
		}
  });
}

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
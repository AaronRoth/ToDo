$(document).ready(function() {
  getTasks();
});

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

// builds HTML task list from JSON
function buildList(json) {
  var html = '';
  
  for(var i = 0; i < json.length; i++) {
    html = '<div class=\'task-class\'>' + json[i]['task'] + '<div class=\'delete-button\'>x</div></div>' + html;
  }
  
  return html;
}
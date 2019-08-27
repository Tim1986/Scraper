$(document).on("click", "li", function() {
  $("#comments").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function(data) {
      console.log(data);
      $("#comments").append("<h2>" + data.title + "</h2>");
      $("#comments").append("<input id='titleinput' name='title' >");
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");
      $("#comments").append("<button data-id='" + data._id + "' id='deletecomment'>Delete Comment</button>");

      if (data.comment) {
        $("#titleinput").val(data.comment.title);
        $("#bodyinput").val(data.comment.body);
      }
    });
});

$(document).on("click", "#savecomment", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      console.log(data);
      $("#comments").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", "#deletecomment", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      console.log(data);
      $("#comments").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// $.getJSON("/articles", function(data) {
//     db.Article.find({})
//     console.log("before the then")
//       .then(function (dbArticles) {
//         console.log("after the then")
//         res.render("index", {articles: dbArticles} );
//       })
//       .catch(function (err) {
//         res.json(err);
//       });
//   });
  
// $(document).on("click", "p", function() {
//   $("#comments").empty();
//   var thisId = $(this).attr("data-id");

//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     .then(function(data) {
//       console.log(data);
//       $("#comments").append("<h2>" + data.title + "</h2>");
//       $("#comments").append("<input id='titleinput' name='title' >");
//       $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
//       $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

//       if (data.note) {
//         $("#titleinput").val(data.comment.title);
//         $("#bodyinput").val(data.comment.body);
//       }
//     });
// });

// $(document).on("click", "#savecomment", function() {
//   var thisId = $(this).attr("data-id");

//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       title: $("#titleinput").val(),
//       body: $("#bodyinput").val()
//     }
//   })
//     .then(function(data) {
//       console.log(data);
//       $("#comments").empty();
//     });

//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });

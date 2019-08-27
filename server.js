var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

var cheerio = require("cheerio");
var axios = require("axios");

var db = require("./models");
var PORT = 3000;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/scrape", function (req, res) {
  axios.get("http://www.realclearpolitics.com/").then(function (response) {
    var $ = cheerio.load(response.data);

    $("div.post").each(function (i, element) {
      var result = {};
      var authorPublisher = [];

      result.title = $(this).text().split("\n")[1].trim();
      author = $(this).children(".byline").text().split(",")[0];
      publisher = $(this).children(".byline").text().split(",")[1];
      result.link = $(this).children().children().attr("href");
      // if (result.author || result.publisher) {
      authorPublisher.push(author)
      authorPublisher.push(publisher)
      console.log(authorPublisher)

        if (authorPublisher[1] === undefined) {
          result.publisher = authorPublisher[0]
          result.author = "N/A"
        } else {
          result.publisher = authorPublisher[1]
          result.author = authorPublisher[0]
        }
      // }

      db.Article.create(result)
        .then(function (dbArticle) {
          // console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
    res.send("Scrape Complete");
  });
});

app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.delete("/articles/:id", function(req, res) {
  db.Comment.remove(req.body)
  .then(function(dbComment) {
    return db.Article.findOneAndRemove({ _id: req.params.id }, { comment: dbComment._id })
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  })
})

app.get("/", function(req, res, next) {
  db.Article.find({})
    .then(function(data){
      var hbsObject = {
        articles: data
      };
      // console.log(hbsObject.articles[0].title);

      res.render("index", hbsObject);
    })
    .catch(function (err) {
      res.json(err);
    });

  });

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});

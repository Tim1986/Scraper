var express = require("express");
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

mongoose.connect("mongodb://localhost/scraperhomework13", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {
  axios.get("http://www.realclearpolitics.com/").then(function (response) {
    var $ = cheerio.load(response.data);

    $("div.post").each(function (i, element) {
      var result = {};

      result.title = $(this).text().split("\n")[1].trim();
      result.author = $(this).children(".byline").text().split(",")[0];
      result.publisher = $(this).children(".byline").text().split(",")[1];
      result.link = $(this).children().children().attr("href");

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

app.get("/", function(req, res, next) {
  db.Article.find({})
    .then(function(err, content){
      res.render("index", { articles: content });
    })
    .catch(function (err) {
      res.json(err);
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


app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});

var cheerio = require("cheerio");
var axios = require("axios");

console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from realclearpolitics.com:" +
            "\n***********************************\n");

axios.get("https://www.realclearpolitics.com/").then(function(response) {

  var $ = cheerio.load(response.data);

  var results = [];

  $("div.post").each(function(i, element) {

    var title = $(element).text().split("\n")[1];
    var author = $(element).children(".byline").text().split(",")[0]
    var publisher = $(element).children(".byline").text().split(",")[1]
    var link = $(element).children().children().attr("href");

    results.push({
      title: title,
      author: author,
      publisher: publisher,
      link: link
    });
  });

  console.log(results);
});

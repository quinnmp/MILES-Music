const express = require("express");
const ejs = require("ejs");
const app = express();
const reviews = require('./public/reviews/reviews.js');
const bodyParser = require("body-parser");

const testNum = 5;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("index", {
    reviews: reviews,
    query: ""
  });
});

app.get("/search/", function(req, res) {
  res.render("index", {
    reviews: reviews,
    query: ""
  });
});

app.get("/contact", function(req, res) {
  res.render("contact");
})

app.post("/contact", function(req, res) {
  res.redirect(`mailto:quinnpfeifer@icloud.com?subject=${req.body.firstName}` + " " + `${req.body.lastName}` + " - " + `${req.body.subject}&body=${req.body.message}`);
})

app.get("/reviews/:reviewName", function(req, res) {
  const requestedTitle = req.params.reviewName.toLowerCase();

  reviews.forEach(function(review) {
    const reviewTitle = review.title.toLowerCase();

    if (reviewTitle === requestedTitle) {
      res.render("review", {
        title: review.title,
        artist: review.artist,
        image: review.image,
        review: review.review,
        score: review.score,
        tracks: review.tracks,
        fav_tracks: review.fav_tracks,
        least_fav_tracks: review.least_fav_tracks,
        linked_tracks: review.linked_tracks
      });
    }
  });
});

app.get("/search/:query", function(req, res) {
  res.render("index", {
    reviews: reviews,
    query: req.params.query.toLowerCase()
  })
})

app.listen(8008, function() {
  console.log("Server started on port 8008");
});

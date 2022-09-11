require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose")

mongoose.connect(`mongodb+srv://miles:${process.env.DB_PASSWORD}@reviewscluster.pnyfsg6.mongodb.net/reviewsDB`)

const reviewSchema = new mongoose.Schema ({
  title: String,
  artist: String,
  image: String,
  review: String,
  score: String,
  tracks: [String],
  fav_tracks: [Number],
  least_fav_tracks: [Number],
  linked_tracks: [Number],
  date: String,
  release_date: String,
  preview: String,
  playlist: String
});

const Review = mongoose.model("Review", reviewSchema);

reviews = []
Review.find(function(e, reviews){
  if (e) {
    console.log(e)
  } else {
    this.reviews = reviews;
  }
})

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("index", {
    reviews: reviews,
    query: ""
  });
});

app.post("/", function(req, res) {
  console.log(req);
  res.redirect(`/search/${req.body.search}`)
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

app.get("/compose", function(req, res) {
  res.render("compose-auth");
})

app.post("/compose", function(req, res) {
  if(req.body.password == process.env.COMP_PASSWORD) {
    res.redirect("/compose/approved")
  } else {
    res.render("compose-auth");
  }
})

app.get("/compose/approved", function(req, res) {
  res.render("compose");
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
        linked_tracks: review.linked_tracks,
        date: review.date,
        release_date: review.release_date,
        playlist: review.playlist
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

app.listen(process.env.PORT || 8008, function() {
  console.log("Server started.");
});

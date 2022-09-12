require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

let composePassword = "";
let reviews_array = [];

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
Review.find(function(e, reviews){
  if (e) {
    console.log(e)
  } else {
    reviews_array = reviews;
  }
})

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  reviews_array = reviews_array.sort(function(a, b) {
    return dateToDays(b.date)-dateToDays(a.date);
  })
  res.render("index", {
    reviews: reviews_array,
    query: "",
    sort: 1
  });
});

app.post("/", function(req, res) {
  let search = req.body.search;
  if(search === "") {
    search = ":all";
  }
  res.redirect(`/search/${search}/${req.body.sort}`)
});

app.get("/contact", function(req, res) {
  res.render("contact");
})

app.post("/contact", function(req, res) {
  res.redirect(`mailto:quinnpfeifer@icloud.com?subject=${req.body.firstName}` + " " + `${req.body.lastName}` + " - " + `${req.body.subject}&body=${req.body.message}`);
})

app.get("/compose/auth", function(req, res) {
  res.render("compose-auth");
})

app.post("/compose/auth", function(req, res) {
  composePassword = req.body.password;
  res.redirect("/compose")
})

app.get("/compose", function(req, res) {
  if(composePassword == process.env.COMP_PASSWORD) {
    res.render("compose")
  } else {
    res.redirect("/compose/auth")
  }
})

app.post("/compose", function(req, res) {
  const review = new Review ({
    title: req.body.album_title,
    artist: req.body.artist,
    image: req.body.image_url,
    review: req.body.review_text,
    score: req.body.score,
    tracks: JSON.parse(req.body.tracklist_text),
    fav_tracks: JSON.parse("[" + req.body.fav_tracks + "]"),
    least_fav_tracks: JSON.parse("[" + req.body.least_fav_tracks + "]"),
    linked_tracks: JSON.parse("[" + req.body.linked_tracks + "]"),
    date: req.body.review_date,
    release_date: req.body.release_year,
    preview: req.body.preview_text,
    playlist: req.body.playlis_id
  })

  review.save();

  res.redirect("/");
})

app.get("/reviews/:reviewName", function(req, res) {
  const requestedTitle = req.params.reviewName.toLowerCase();

  reviews_array.forEach(function(review) {
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

app.get("/search/:query/:sort", function(req, res) {
  let query = req.params.query.toLowerCase();
  if (query === ":all") {
    query = "";
  }
  switch (parseInt(req.params.sort, 10)) {
    case 1:
      reviews_array = reviews_array.sort(function(a, b) {
        return dateToDays(b.date)-dateToDays(a.date);
      })
      break;
    case 2:
      console.log(2)
      reviews_array = reviews_array.sort(function(a, b) {
        return dateToDays(a.date)-dateToDays(b.date);
      })
      break;
    case 3:
      reviews_array = reviews_array.sort(function(a, b) {
        return b.score-a.score;
      })
      break;
    case 4:
      reviews_array = reviews_array.sort(function(a, b) {
        return a.score-b.score;
      })
      break;
    case 5:
      reviews_array = reviews_array.sort(function(a, b) {
        return b.release_date.substring(0, 4)-a.release_date.substring(0, 4);
      })
      break;
    case 6:
      reviews_array = reviews_array.sort(function(a, b) {
        return a.release_date.substring(0, 4)-b.release_date.substring(0, 4);
      })
      break;
  }
  res.render("index", {
    reviews: reviews_array,
    query: query,
    sort: req.params.sort
  })
})

app.listen(process.env.PORT || 8008, function() {
  console.log("Server started.");
});

function dateToDays(date) {
  let days = 0;
  dateArray = date.split("/");
  days += parseInt(dateArray[0] * 30.4167, 10);
  days += parseInt(dateArray[1], 10);
  days += parseInt(dateArray[2] * 365.25, 10);
  return days;
}

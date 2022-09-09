var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
page = window.location.href.split("/")[3];
let playlist = [];

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '0',
    width: '0',
    playerVars: {
      listType: 'playlist',
      list: 'OLAK5uy_mgw0vYRCIP5uZxtsN8aqOt8AUc_Zsj_3s'
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  playlist = player.getPlaylist();
  console.log(playlist);
}

function onPlayerStateChange(event) {
  // console.log(player.getVideoEmbedCode());
}

if (page !== "") {
  if (window.location.href.split("/")[3] != "reviews") {
    $("." + `${page}`).attr("class", "nav-item " + `${page}` + " active");
  }
} else {
  $(".home").attr("class", "nav-item home active");
}

$(".search-button").click(function() {
  window.location.href = `/search/${$(".search").val()}`;
})

$(".track-wrapper-generation-button").click(function() {
  $(".track-output").val(`<a href="#${$(".track-number-input").val()}" class="review-link">"${$(".track-title-input").val()}"<span class="badge no-underline" id="${$(".track-number-input").val()}-review"\>${$(".track-number-input").val()}</span></a>`)
  player.playVideo();
})

$(".timestamp").click(function() {
  player.loadVideoById({
    videoId:`${playlist[$(this).attr("id") - 1]}`,
    startSeconds:$(this).text(),
    endSeconds:parseInt($(this).text(), 10) + parseInt($(this).attr("class").substring($(this).attr("class").indexOf("timestamp") + 10, $(this).attr("class").length), 10)
  });
  console.log(playlist[$(this).attr("id") - 1])
})

$(".fix-review-button").click(function() {
  let review = $(".review-text").val();
  review = review.replaceAll("\"", "\\\"");
  review = review.replaceAll("\n", "\\n");
  let tracklist = JSON.parse($(".tracklist-text").val())
  for (var i = 0; i < tracklist.length; i++) {
    if (review.includes("\\\"" + tracklist[i].replaceAll("\"", "\\\"") + "\\\"")) {
      review = review.replace(
        "\\\"" + tracklist[i].replaceAll("\"", "\\\"") + "\\\"",
        `<a href=\\"#${i + 1}\\" class=\\"review-link\\">\\"${tracklist[i].replaceAll("\"", "\\\"")}\\"<span class=\\"badge no-underline\\" id=\\"${i + 1}-review\\"\\>${i + 1}</span></a>`
      )
    }
  }
  let timestamp_review_array = review.split("{")
  let track_position = 0;
  let last_track_index = 1;
  console.log(timestamp_review_array)
  for (var i = 1; i < timestamp_review_array.length; i++) {
    last_track_index = 1;
    while (!timestamp_review_array[i - last_track_index].includes("a href=")) {
      last_track_index++;
    }
    track_position = (timestamp_review_array[i - last_track_index].lastIndexOf("a href="));
    track_number = timestamp_review_array[i - last_track_index].charAt(track_position + 10);
    duration = parseInt(timestamp_review_array[i].substring(0, timestamp_review_array[i].indexOf(":")) * 60, 10) + parseInt(timestamp_review_array[i].substring(timestamp_review_array[i].indexOf(":") + 1, timestamp_review_array[i].indexOf("&")), 10)
    review = review.replace("{" + timestamp_review_array[i], `<span id=\"${track_number}\" class=\"timestamp ${timestamp_review_array[i].substring(timestamp_review_array[i].indexOf("&") + 1, timestamp_review_array[i].indexOf("}"))}\">${duration}</span>` + timestamp_review_array[i].substring(timestamp_review_array[i].indexOf("}") + 1, timestamp_review_array[i].length));
  }
  $(".review-text").val(review);
})

$(".fix-tracklist-button").click(function() {
  let tracklist = $(".tracklist-text").val().split(" \"");
  let fixed_tracklist = [];
  for (var i = 0; i < tracklist.length; i++) {
    if (tracklist[i] === "is_playable\": true,\n     ") {
      fixed_tracklist.push(tracklist[i + 2].substring(0, tracklist[i + 2].length - 8))
    }
  }
  for (var i = 0; i < fixed_tracklist.length; i++) {
    fixed_tracklist[i] = fixed_tracklist[i].replaceAll("’", "'");
    fixed_tracklist[i] = fixed_tracklist[i].replaceAll("‘", "'");
    fixed_tracklist[i] = fixed_tracklist[i].replaceAll("”", "\"");
    fixed_tracklist[i] = fixed_tracklist[i].replaceAll("“", "\"");
    fixed_tracklist[i] = fixed_tracklist[i].replaceAll("\\\"", "\"");
  }
  $(".tracklist-text").val(JSON.stringify(fixed_tracklist));
})

if ($(".card").length === 0) {
  $(".end-notification").text("No reviews found.");
}

$(".make-preview-button").click(function() {
  let review = $(".preview-text").val();
  review = review.replaceAll("\"", "\\\"");
  review = review.replaceAll("\n\n", " ");
  review = review.replaceAll("\n", " ");
  review = review.substring(0, 500);
  $(".preview-text").val(review);
})

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
page = window.location.href.split("/")[3];
let playlist = [];
var current_timestamp;

var quill = new Quill("#editor", {
  theme: "snow",
  placeholder: "Enter Unformatted Review"
});

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '1',
    width: '1',
    playerVars: {
      listType: 'playlist',
      list: $(".playlist-code").attr("id")
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  playlist = player.getPlaylist();
}

function onPlayerStateChange(event) {
  if(event.data === 1) {
    $(current_timestamp).children().attr("class", "pause");
    $(".pause-button").css("display", "initial")
  } else if(event.data === 2 || event.data === 0) {
    $(".timestamp").children().attr("class", "play");
    $(".pause-button").css("display", "none")
  }
  $(".play").html("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-play-fill\" viewBox=\"0 0 16 16\"><path d=\"m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z\"/></svg>")
  $(".pause").html("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-pause-fill\" viewBox=\"0 0 16 16\"><path d=\"M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z\"/></svg>")
  console.log(event.data)
}

$("select").val($(".sort-mode").attr("id"));

if (page !== "" && window.location.href.split("/")[3] !== "search") {
  if (window.location.href.split("/")[3] !== "reviews") {
    $("." + `${page}`).attr("class", "nav-item " + `${page}` + " active");
  }
} else {
  $(".home").attr("class", "nav-item home active");
}

$(".play").html("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-play-fill\" viewBox=\"0 0 16 16\"><path d=\"m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z\"/></svg>");

$(".track-wrapper-generation-button").click(function() {
  $(".track-output").val(`<a href="#${$(".track-number-input").val()}" class="review-link">"${$(".track-title-input").val()}"<span class="badge no-underline" id="${$(".track-number-input").val()}-review"\>${$(".track-number-input").val()}</span></a>`)
})

$(".pause-button").click(function() {
  player.pauseVideo();
})

$(".timestamp-length-checkbox").on("input", function() {
  if($(this).is(":checked")){
    $(".timestamp").each(function() {
      $(this).html($(this).html() + ", " + $(this).attr("class").split(" ")[2] + "s")
    })
  } else {
    $(".timestamp").each(function() {
      $(this).html($(this).html().substring(0, $(this).html().indexOf(",")))
    })
  }
})

$(".timestamp").click(function() {
  if($(this).children().attr("class") === "play") {
    let duration = parseInt($(this).text().substring(0, $(this).text().indexOf(":")), 10) * 60 + parseInt($(this).text().substring($(this).text().indexOf(":") + 1, $(this).text().length), 10)
    player.loadVideoById({
      videoId:`${playlist[$(this).attr("id").substring(1, $(this).attr("id").length) - 1]}`,
      startSeconds:duration,
      endSeconds:duration + parseInt($(this).attr("class").substring($(this).attr("class").indexOf("timestamp") + 10, $(this).attr("class").length), 10)
    });
    $(".pause").attr("class", "play")
    current_timestamp = this;
  } else {
    player.pauseVideo();
    $(this).children().attr("class", "play");
  }
})

$(".num-checkbox").on("input", function() {
  if($(this).is(":checked")){
    $("span.no-underline").css("display", "inline-block")
  } else {
    $("span.no-underline").css("display", "none")
  }
})

$(".timestamp-checkbox").on("input", function() {
  if($(this).is(":checked")){
    $("span.timestamp").css("display", "inline-block")
  } else {
    $("span.timestamp").css("display", "none")
  }
})

$(".fix-review-button").click(function() {
  let review = $(".ql-editor").html();
  review = review.replaceAll("<span style=\"background-color: transparent; color: rgb(0, 0, 0);\">", "");
  review = review.replaceAll("<span style=\"background-color: transparent;\">", "");
  review = review.replaceAll("&nbsp;", "");
  review = review.replaceAll("</span>", "");
  review = review.replaceAll("<p>", "");
  review = review.replaceAll("</p>", "\\n");
  review = review.replaceAll("<br>", "");
  review = review.replaceAll("&amp;", "&");
  review = review.replaceAll("<em style=\"background-color: transparent; color: rgb(0, 0, 0);\">", "<em>");
  review = review.replaceAll("<em style=\"background-color: transparent;\">", "<em>");
  review = review.replaceAll("\"", "\\\"");
  review = review.replaceAll("\n", "\\n");
  review = review.substring(0, review.length - 4)
  preview = review.substring(0, 500);
  $(".preview-text").val(preview);
  let tracklist = JSON.parse($(".tracklist-text").val())
  for (var i = 0; i < tracklist.length; i++) {
    if (review.includes("\\\"" + tracklist[i].replaceAll("\"", "\\\"") + "\\\"")) {
      $("input[name='linked_tracks']").val($("input[name='linked_tracks']").val() + (i + 1) + ", ");
      review = review.replace(
        "\\\"" + tracklist[i].replaceAll("\"", "\\\"") + "\\\"",
        `<a href=\\"#${i + 1}\\" class=\\"review-link\\">\\"${tracklist[i].replaceAll("\"", "\\\"")}\\"<span class=\\"badge no-underline\\" id=\\"${i + 1}-review\\"\\>${i + 1}</span></a>`
      )
    }
  }
  $("input[name='linked_tracks']").val($("input[name='linked_tracks']").val().substring(0, $("input[name='linked_tracks']").val().length - 2));
  let timestamp_review_array = review.split("{")
  let track_position = 0;
  let last_track_index = 1;
  for (var i = 1; i < timestamp_review_array.length; i++) {
    last_track_index = 1;
    while (!timestamp_review_array[i - last_track_index].includes("a href=")) {
      last_track_index++;
    }
    track_position = (timestamp_review_array[i - last_track_index].lastIndexOf("a href="));
    track_number = timestamp_review_array[i - last_track_index].substring(track_position + 10, timestamp_review_array[i - last_track_index].indexOf("\\", track_position + 10));
    review = review.replace("{" + timestamp_review_array[i], `<span id=\\"*${track_number}\\" class=\\"badge timestamp ${timestamp_review_array[i].substring(timestamp_review_array[i].indexOf("&") + 1, timestamp_review_array[i].indexOf("}"))}\\"><span class=\\"play\\"></span>${timestamp_review_array[i].substring(0, timestamp_review_array[i].indexOf("&"))}</span>` + timestamp_review_array[i].substring(timestamp_review_array[i].indexOf("}") + 1, timestamp_review_array[i].length));
  }
  $(".review-text").val(review);
})

$(".fix-tracklist-button").click(function() {
  let d = new Date();
  $("input[name='review_date']").val(d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear())

  let tracklist = $(".tracklist-text").val().split(" \"");
  let fixed_tracklist = [];
  for (var i = 0; i < tracklist.length; i++) {
    if(tracklist[i] === "name\":" && $("input[name='artist']").val() === ""){
      $("input[name='artist']").val(tracklist[i + 1].substring(0, tracklist[i + 1].length - 8));
    } else if(tracklist[i] === "name\":" && $("input[name='album_title']").val() === "") {
      $("input[name='album_title']").val(tracklist[i + 1].substring(0, tracklist[i + 1].length - 4));
    }

    if(tracklist[i] === "height\": 640,\n     "){
      $("input[name='image_url']").val(tracklist[i + 2].substring(0, tracklist[i + 2].length - 8));
    }

    if(tracklist[i] === "release_date\":"){
      $("input[name='release_year']").val(tracklist[i + 1].substring(0, 4));
    }

    if (tracklist[i].includes("preview_url\":")) {
      fixed_tracklist.push(tracklist[i - 1].substring(0, tracklist[i - 1].length - 10))
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

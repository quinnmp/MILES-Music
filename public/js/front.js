page = window.location.href.split("/")[3];

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
})

$(".fix-review-button").click(function() {
  let review = $(".review-text").val();
  review = review.replaceAll("\"", "\\\"");
  review = review.replaceAll("\n", "\\n");
  let tracklist = JSON.parse($(".tracklist-text").val())
  console.log(tracklist[25].replaceAll("\"", "\\\""))
  console.log(review.includes(tracklist[25].replaceAll("\"", "\\\"")))
  for (var i = 0; i < tracklist.length; i++) {
    if(review.includes("\\\"" + tracklist[i].replaceAll("\"", "\\\"") + "\\\"")){
      review = review.replace(
        "\\\"" + tracklist[i].replaceAll("\"", "\\\"") + "\\\"",
        `<a href=\\"#${i + 1}\\" class=\\"review-link\\">\\"${tracklist[i].replaceAll("\"", "\\\"")}\\"<span class=\\"badge no-underline\\" id=\\"${i + 1}-review\\"\\>${i + 1}</span></a>`
      )
    }
  }
  $(".review-text").val(review);
})

$(".fix-tracklist-button").click(function() {
  let tracklist = $(".tracklist-text").val().split(" \"");
  let fixed_tracklist = [];
  for (var i = 0; i < tracklist.length; i++) {
    if(tracklist[i] === "is_playable\": true,\n     ") {
      fixed_tracklist.push(tracklist[i + 2].substring(0, tracklist[i + 2].length - 8))
    }
  }
  for (var i = 0; i < fixed_tracklist.length; i++) {
    fixed_tracklist[i] = fixed_tracklist[i].replaceAll("\\\"", "\"");
  }
  $(".tracklist-text").val(JSON.stringify(fixed_tracklist));
})

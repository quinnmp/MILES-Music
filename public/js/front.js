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

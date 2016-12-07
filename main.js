// $(this).attr("textwrap").text
function returnMovieName(data) {
    console.log(data.Title);
}
function getMovieName(query) {
    $.ajax({
        url: 'http://omdbapi.com',
        type: "GET",
        dataType: "JSON",
        data: {
          t: query
        }
    }).done(returnMovieName);
}
$(document).ready(function() {
    $("a-box").on("click", function() {
        getMovieName($(this).attr("id"));
    });
    $("a-cylinder").on("click", function() {
        getMovieName($(this).attr("id"));
    });
    $("#box").on("click", function() {
        console.log($(this).attr("textwrap").text);
        getMovieName($(this).attr("id"));
    });

});

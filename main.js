//
function returnMovieName(data) {

    console.log($("#box").attr("textwrap").text);
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

AFRAME.registerComponent('scale-on-click', {
  schema: {
    to: {default: 'textAlign: center; x: 128; y: 128; text: Hello everyone'}
  },
  init: function () {
    var data = this.data;
    this.el.addEventListener('click', function () {
      this.setAttribute('textwrap', data.to);
    });
  }
});


$(document).ready(function() {
    $("a-box").on("click", function() {
        getMovieName($(this).attr("id"));
    });
    $("a-cylinder").on("click", function() {
        getMovieName($(this).attr("id"));
    });
    $("#box").on("click", function() {
        $("#box").attr("textwrap").text = "bye";
        console.log(getMovieName($(this).attr("id")));
    });

});

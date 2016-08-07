/* *** COURSE CODE ***
$(document).ready(function() {
  $('button').click(function () {
    $("button").removeClass("selected");
    $(this).addClass("selected");
    var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
    var character = $(this).text();
    var flickrOptions = {
      tags: character,
      format: "json"
    };
    function displayPhotos(data) {
      var photoHTML = '<ul class="gallery">';
      $.each( data.items, function (i, photo) {
        photoHTML += '<div class="thumbnail">';
        photoHTML += '<a href="' + photo.link + '">';
        photoHTML += '<img src="' + photo.media.m + '"></div>';
      });
      photoHTML += '</ul>';
      $('.gallery').html(photoHTML);
    }
    $.getJSON(flickerAPI, flickrOptions, displayPhotos);
  });
}); // end ready
*/

var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
var flickrOptions;

function displayPhotos(data) {
  var galleryHTML = '<div class="gallery">';
  $.each(data.items, function (i, photo) {
    galleryHTML += '<div class="thumbnail">';
    galleryHTML += '<a href="">';
    galleryHTML += '<img src="' + photo.media.m + '"></div>';
    
  });
  $('.gallery-container').html(galleryHTML);
}

function sendRequest() {
  $.getJSON(flickerAPI, flickrOptions, displayPhotos);
}

function setOptions() {
  var character = $(this).text();
  flickrOptions = {
      tags: character,
      format: "json"
  };
  sendRequest();
}

$('button').click(setOptions);


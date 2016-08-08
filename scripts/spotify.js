var spotifyAPI = "https://api.spotify.com/v1/artists/"; //put the api url here
var spotifyOptions;

function displayPhotos(data) {
  
   /*
  var galleryHTML = '<div class="gallery">';
  $.each(data.items, function (i, album) {
    console.log(album);
   galleryHTML += '<div class="thumbnail">';
    galleryHTML += '<a href="">';
    galleryHTML += '<img src="' + photo.media.m + '"></div>'; //update with spotify info
    
  });
  $('.gallery-container').html(galleryHTML);
  */
}

function sendRequest() {
  $.getJSON(spotifyAPI, spotifyOptions, displayPhotos);
}

function setOptions() {
  //var band = $(this).text();
  var band = "14UQmxJzeKtmgYzJ1sEJdi";
  spotifyOptions = {
      q: band
  };
  sendRequest();
}

$('button').click(setOptions);

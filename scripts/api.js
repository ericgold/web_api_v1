
// Script for API 

var $gallery = $('.gallery');
var swapi = "http://swapi.co/api/species/";
var $thumbnail = $('.thumbnail');
var galleryHTML;





function displayTiles(data) {
  console.log(data);
	$.each(data.results, function(i, result) {
    galleryHTML += '<div class="thumbnail">';
    galleryHTML += data.results[i].name;
    galleryHTML += '</div>';

  }); //end each

  $('.gallery').html(galleryHTML);
 
};

$.getJSON(swapi, displayTiles);

function showInfo() {
  console.log("test");
  //this refers to gallery here. need to get it to refer to clicked thumbnail
  var $this = this;
  console.log($this.classList);
}

$('.gallery').on('click', $thumbnail, showInfo);


/*
$('form').submit(function(evt) {
  evt.preventDefault();
  var $searchInput = $('#searchInput');
  
  $searchInput.prop("disabled", true);
  //$submitButton.attr("disabled", true).val("searching....");

    // the AJAX part
    var swapi = "http://swapi.co/api/";
    var species = query.val();
    var swOptions = {
      
    };
    function displayTiles(data) {
      
      $.each(data.items, function(i,tile) {
        tileHTML += '<li class="thumbnail">';
        //photoHTML += '<a href="' + photo.link + '" class="image">';
        //photoHTML += '<img src="' + photo.media.m + '"></a></li>';
      }); // end each
      
      $('.gallery').html(tileHTML);
      $searchInput.prop("disabled", false);
      //$submitButton.attr("disabled", false).val("Search");
    }
    $.getJSON(swapi, swOptions, displayTiles);

  }); // end submit
*/


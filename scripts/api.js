
// Script for API 

var $gallery = $('.gallery');
var swapi = "http://swapi.co/api/species/";
var $thumbnail = $('.thumbnail');
var galleryHTML;

var $swapiOverlay = $("<div id='swapiOverlay'></div>");
//var $swapiInnerOverlay = $("<div id='inner-overlay'></div>");
var $swapiCaption = $("<p id='swapiCaption'></p>");

var overlayContents = [];

//constructor function for overlay info objects
function Species(number, name, designation, classification, language) {
  //constructor function for user objects
  this.number = number;
  this.name = name;
  this.designation = designation;
  this.classification = classification;
  this.language = language;
  overlayContents.push(this);
}

/*variables for users
var user1 = new User('Hart', 'Love', 'hlove@emotion.com', '6/3/16');
var user2 = new User('Ashley', 'Pike', 'ashp@saranrae.com', '7/6/16');
var user3 = new User('Dan', 'Mann', 'd.mann@qmail.com', '7/7/16');
var user4 = new User('Alice', 'Inwonderland', 'alice@rabbithole.com', '7/13/16');
*/
var thumbnailIndex = 0;

function addIndex() {
  
  $(this).attr('id', thumbnailIndex);
  thumbnailIndex += 1;
}

function displayTiles(data) {
  //console.log(data);
	$.each(data.results, function(i, result) {
    var index = i;
    galleryHTML += '<div class="thumbnail">';

    galleryHTML += '<p>'
    galleryHTML += data.results[i].name;
    galleryHTML += '</p>';
    galleryHTML += '</div>';

    var species = new Species(i,
                              data.results[i].name, 
                              data.results[i].designation, 
                              data.results[i].language, 
                              data.results[i].average_lifespan);

  }); //end each

  $('.gallery').html(galleryHTML);
  $('.thumbnail').each(addIndex);
 
  //console.log(overlayContents);
};

$.getJSON(swapi, displayTiles);




//NON FUNCTIONAL
function popSwapiOverlay(arg) {
  //this.preventDefault();
  
  var index = $(arg).attr('id');
  console.log(index);
  $swapiCaption.append(overlayContents);
  $swapiOverlay.append($swapiCaption);
  //$("body").append($swapiOverlay);
  console.log($swapiOverlay);
}


$('.gallery').on('click', $thumbnail, popSwapiOverlay);

//$('.gallery .thumbnail').on('click', popSwapiOverlay);

/*
// On image link click
$('.thumbnail').click(function(event){
  // Prevent default click behavior
  event.preventDefault();
  // Set imageLocation as clicked image's href
  var imageLocation = $(this).attr("href");
  // Get child's alt attribute and set caption
  var imageCaption = $(this).children().attr("alt");
  // Update index to current selected image
  $index = $(this).parent().index();
  //call mediaCheck function on clicked thumbnail
  mediaCheck($(this));
  // call updateImage function
  updateImage(imageLocation, imageCaption);
  //show the overlay with that content
  $overlay.slideDown(imageLocation);
});
*/


/*
galleryHTML += '<p>'
galleryHTML += data.results[i].designation;
galleryHTML += '</p>';
galleryHTML += '<p>'
galleryHTML += data.results[i].classification;
galleryHTML += '</p>';
galleryHTML += '<p>'
galleryHTML += data.results[i].language;
galleryHTML += '</p>';
galleryHTML += '<p>'
galleryHTML += data.results[i].average_lifespan;
galleryHTML += '</p>';
*/

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


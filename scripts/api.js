// Script for SWAPI 

var $gallery = $('.gallery');
var swapi = "http://swapi.co/api/species/";
var $thumbnail = $('.thumbnail');
var galleryHTML;

var $swapiOverlay = $("<div id='swapiOverlay'></div>");
//var $swapiInnerOverlay = $("<div id='inner-overlay'></div>");
var $swapiCaption = $("<p id='swapiCaption'></p>");

// array to hold objects containing info for each thumbnail's overlay
var overlayContents = [];

// start index ids of thumbnails at 0
var thumbnailIndex = 0;

//constructor function for overlay info objects
function Species(number, name, designation, language, average_lifespan) {
  //constructor function for user objects
  this.number = number;
  this.name = name;
  this.designation = designation;
  this.language = language;
  this.average_lifespan = average_lifespan;
  overlayContents.push(this);
}

//add an id to each thumbnail that matches the index of that
//thumbnail's info in the overlayContents array
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


function popSwapiOverlay() {
  //this.preventDefault();
  
  var index = $(this).attr('id');
  //console.log(index);
  //console.log(overlayContents[index]);
  var name = overlayContents[index].name;
  var desig = overlayContents[index].designation;
  var lang = overlayContents[index].language;
  var life = overlayContents[index].average_lifespan;
  
  var caption = $swapiCaption.text();
  caption += 'A ' + desig + ' species, the ' + name + ' speak ' + lang +
'. Their lifespan is ' + life + '.'   
  //console.log(caption);
  $(this).append(caption);
  //$swapiCaption.html(overlayContents[index].designation);
  //$swapiCaption.append(overlayContents[index].name);
  //$swapiOverlay.append($swapiCaption);
  //$("body").append($swapiOverlay);
  
}


$('.gallery').on('click', '.thumbnail', popSwapiOverlay);



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


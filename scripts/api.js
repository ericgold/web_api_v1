/*
************************
*** Script for SWAPI ***
************************
*/

// base variables
var speciesSwapi = "http://swapi.co/api/species/";
var $gallery = $('.gallery');
var $thumbnail = $('.thumbnail');
var galleryHTML;

// array to hold objects containing info for each thumbnail's overlay
var overlayContents = [];

// start index ids of thumbnails at 0
// used for adding numerical ids to thumbnails
var thumbnailIndex = 0;


//var $galleryLength = $thumbnail.length;



// constructor function for overlay info objects
function Species(number, name, classification, designation, language, average_lifespan, homeworld) {
  //constructor function for species objects

  this.number = number;
  this.name = name;
  this.classification = classification;
  this.designation = designation;
  this.language = language;
  this.average_lifespan = average_lifespan;
  this.homeworld = homeworld;

  //overlayContents.push(this);
}

// add an id to each thumbnail that matches the index of that
// thumbnail's info in the overlayContents array
function addIndex() {
  $(this).attr('id', thumbnailIndex);
  thumbnailIndex += 1;
}


/*
function displayTiles(data) {
	$.each(data.results, function(i, result) {
    
    galleryHTML += '<div class="thumbnail">';
    galleryHTML += '<p>'
    galleryHTML += data.results[i].name;
    galleryHTML += '</p>';
    galleryHTML += '</div>';



    var planetUrl = data.results[i].homeworld;
    console.log(planetUrl);

   $.getJSON(planetUrl, function(planetData) {
      planetData.name;
    });
    
   

    var species = new Species(i,
                              data.results[i].name, 
                              data.results[i].classification,
                              data.results[i].designation, 
                              data.results[i].language, 
                              data.results[i].average_lifespan,
                              homeworld
                              );

  }); //end each
  //adds generated thumbnails to the gallery
  $('.gallery').html(galleryHTML);
  //adds a numerical id to each thumbnail, starting at 0
  //(this should be changed to use the i from above somehow)
  $('.thumbnail').each(addIndex);
};

*/


function getHomeworld(i, speciesData) {
  var planetUrl = speciesData.homeworld;
  var homeworld;
  

  $.getJSON(planetUrl, function(data) {
    homeworld = data.name;
    
    makeSpecies(i, speciesData, homeworld);
  });
    
  
};

function makeSpecies(i, speciesData, homeworld) {

  var species = new Species (
      i,
      speciesData.name,
      speciesData.classification,
      speciesData.designation,
      speciesData.language,
      speciesData.average_lifespan,
      homeworld
    );
  overlayContents.push(species);
}



function speciesTiles(data) {
  $.each(data.results, function(i, result) {
    var speciesData = data.results[i];
    getHomeworld(i, speciesData);
    

    galleryHTML += '<div class="thumbnail"><p>';
    //galleryHTML += '<p>'
    galleryHTML += speciesData.name;
    galleryHTML += '</p></div>';
    //galleryHTML += '</div>';

  }); 
  //adds generated thumbnails to the gallery
  $('.gallery').html(galleryHTML);
  //adds a numerical id to each thumbnail, starting at 0
  //(this should be changed to use the i from above somehow)
  $('.thumbnail').each(addIndex);


}


$.getJSON(speciesSwapi, speciesTiles);







/*
***************************
****** OVERLAY STUFF ******
***************************
*/

// variables for the lightbox overlay
var $swapiOverlay = $("<div id='swapi-overlay'></div>");
var $swapiInnerOverlay = $("<div id='swapi-inner-overlay'></div>");
var $swapiCaption = $("<p id='swapi-caption'></p>");
var $leftArrow = $("<button class='arrow'>&#10094</button>");
var $rightArrow = $("<button class='arrow'>&#10095</button>");

// Keep track of image index for prev/next navigation
var navIndex;


// *** COPIED FROM OTHER PROJECT. MAY NEED ADAPTATION ***
var $thumbnails = $('.thumbnail');
// Get list of gallery images and track length of list
var $galleryLength = $thumbnails.length;
//*******************************************************


$swapiOverlay.append($swapiInnerOverlay);
//$swapiOverlay.append($swapiCaption);
$('body').append($swapiOverlay);

// insert content into the inner overlay
// along with arrows for overlay navigation
function prepOverlay(thing) {
  $swapiCaption.empty();
  $swapiCaption.append(thing);

  // Add left arrow to inner overlay div
  $swapiInnerOverlay.append($leftArrow);
  // Add media to the overlay
  $swapiInnerOverlay.append($swapiCaption);
  // Add right arrow to overlay
  $swapiInnerOverlay.append($rightArrow);

  $swapiOverlay.slideDown();
}

function setIndex() {
  // overlay contents may be out of order
  // because of asynchronous return of homeworld data
  // sort overlayContents here by overlayContents.number,
  // which correpsonds to the numerical id of the tile

  overlayContents.sort(function(a, b) {
    return a.number - b.number;
  });

  //sets variable equal to the numerical id attr of the thumbnail
  var index = $(this).attr('id');
  //matches navIndex to the numerical id attr of the thumbnail
  navIndex = index;
  makeCaption(navIndex);
}

function setIndexNav() {
  makeCaption(navIndex);
}



//attempt to get homeworld name ********************




function makeCaption(numb) {
  var index = numb;
  //uses numerical argument
  //corresponding data stored in overlayContents array
  var name = overlayContents[index].name;
  var classif = overlayContents[index].classification;
  var desig = overlayContents[index].designation;
  var lang = overlayContents[index].language;
  var life = overlayContents[index].average_lifespan;
  var home = overlayContents[index].homeworld;
  //var homeString = String(home);

  //generates caption from the data in overlayContents
  var caption = 'A ' + desig + ' ' + classif + ' species, ' + name + ' speak ' + lang +
'. Their lifespan is ' + life + ' and they come from the planet ' + home + '.';  

  prepOverlay(caption);
};

// Overlay nav arrow button function
function prevNext(prev) {
  //when prev is false, increase index
  //when prev is true, decrease index
  if (!prev) {
    navIndex++;
  } else {
    navIndex--;
  }

  // enables overlay navigation wraparound
  if (navIndex < 0) {
    navIndex = overlayContents.length - 1 ;
  } else if (navIndex > overlayContents.length - 1) {
    navIndex = 0;
  }
};

//Cycles through images in overlay on arrow clicks
$leftArrow.click(function(event){
  prevNext(true);
  //need to run makeCaption on something: the previous species
  setIndexNav();
});

$rightArrow.click(function(event){
  prevNext();
  //need to run makeCaption on something: the next species
  setIndexNav();
});

//Cycles through images in overlay on keyboard arrow press
$(document).bind('keydown', function(event) {
  if(event.keyCode == 37) {
    prevNext(true);
    setIndexNav();
  } else if(event.keyCode == 39) {
    prevNext();
    setIndexNav();
  }
});


$swapiOverlay.click(function(event) {
  if(event.target.id == "swapi-overlay")
  $(this).slideUp("fast");
});


$('.gallery').on('click', '.thumbnail', setIndex);

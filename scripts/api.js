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

// Variables for search 
var $searchField = $("input.search");

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


function getHomeworld(i, speciesData) {
  var planetUrl = speciesData.homeworld;
  var homeworld;
  
  //sends another request for the homeworld data
  $.getJSON(planetUrl, function(data) {
    homeworld = data.name;

    //can add more homeworld data here and include it in
    //overlay contents via makeSpecies
    
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
    //homeworld is different because it is stored as a url
    //needs another request to get its data
    getHomeworld(i, speciesData);
    

    galleryHTML += '<div class="thumbnail"><p class="species-label">';
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
var $leftArrow = $("<button class='arrow' id='left-arrow'>&#10094</button>");
var $rightArrow = $("<button class='arrow' id='right-arrow'>&#10095</button>");

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

function sortOverlayContents() {
  // overlay contents may be out of order
  // because of asynchronous return of homeworld data
  // or because of search activity?
  // sort overlayContents here by overlayContents.number,
  // which correpsonds to the numerical id of the tile
    overlayContents.sort(function(a, b) {
    return a.number - b.number;
  });
}

function setIndex() {
  

  sortOverlayContents();

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
'. Their lifespan is ' + life + '. They come from the planet ' + home + '.';  

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


var speciesCheckbox = $('#species-checkbox');
var homeworldCheckbox = $('#homeworld-checkbox');
var languageCheckbox = $('#language-checkbox');

function filterTest() {
  //NEED CORRECT CODE TO TEST IF CHECKBOX IS CHECKED
  if (speciesCheckbox.checked) {
    filter();
  } else {
    alert("please choose a search criteria. May the Force be with you.")
  }
}
// filter function for search field
function filter() {
  //return the overlayContents to be in sync with thumbnail ids
  sortOverlayContents();
  //sets searchText as whatever is entered in search field
  var query = $searchField.val();
  
  //for each thumbnail div
  $(".thumbnail").each(function(){
    //sets altText as the alt attribute 
    //of the img child of the anchor child of the thumbnail div
    var thumbId = $(this).attr("id");
    if (speciesCheckbox.checked === true) {
        if (overlayContents[thumbId].name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
        $(this).fadeIn();
      } else {
        $(this).fadeOut("fast");
      }
    }
    


    //if the search term is 'not not present' in the alt text
    //if (altText.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
      //show the thumbnail (including its child a and a's child img)
      //$(this).fadeIn();
    //if the search term is 'not present' in the alt text
    //} else {
      //hide the thumbnail and its contents
      //$(this).fadeOut("fast");
    //}
  });
};

// Triggers filter function on keyup in search field
$searchField.keyup(filterTest);



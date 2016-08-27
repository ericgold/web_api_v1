
/*
***************************
*********** SWAPI *********
***************************
*/

// base variables
var speciesSwapi = "//swapi.co/api/species/";
var omdb = "https://www.omdbapi.com/?";

var $searchField = $("#search-input");

var $gallery = $('.gallery');
//var $thumbnail = $('.thumbnail');
var galleryHTML;

// array to hold objects containing info for each thumbnail's overlay
var overlayContents = [];

// start index ids of thumbnails at 0
// used for adding numerical ids to thumbnails
var thumbnailIndex = 0;

// constructor function for overlay info species objects
function Species(number, name, classification, designation, language, average_lifespan, homeworld) {
  this.number = number;
  this.name = name;
  this.classification = classification;
  this.designation = designation;
  this.language = language;
  this.average_lifespan = average_lifespan;
  this.homeworld = homeworld;
}

// add an id to each thumbnail that matches the index of that
// thumbnail's info in the overlayContents array
function addIndex() {
  $(this).attr('id', thumbnailIndex);
  thumbnailIndex += 1;
}

//sends another request for data from the first
  //film in that species' film array
function getFilmInfo(i, speciesData) {
  var filmUrl = speciesData.films[0];
  var filmInfo = {};

  $.getJSON(filmUrl, function(data) {
    filmInfo.title = data.title;
    //filmInfo.episode = data.episode_id;
    //filmInfo.release_date = data.release_date; 
  });

  getHomeworld(i, speciesData, filmInfo);
}

//sends another request for the homeworld data
function getHomeworld(i, speciesData, filmInfo) {
  var planetUrl = speciesData.homeworld;
  var homeworld = {};
  var filmObj = filmInfo;

  $.getJSON(planetUrl, function(data) {
    homeworld.name = data.name;
    //homeworld.rotationPeriod = data.rotation_period;
    homeworld.climate = data.climate;
    //homeworld.terrain = data.terrain;
    homeworld.population = data.population;
    
    makeSpecies(i, speciesData, homeworld, filmObj);
  }); 
}

// make a species object with the data from the APIs
// and add it to the overlayContents array
function makeSpecies(i, speciesData, homeworld, filmObj) {

  var species = new Species (
      i,
      speciesData.name,
      speciesData.classification,
      speciesData.designation,
      speciesData.language,
      speciesData.average_lifespan,
      homeworld
    );

  species.film = filmObj;
  overlayContents.push(species);
}

// create a tile for each species returned by swapi
// add the tiles to the gallery
function speciesTiles(data) {
  $.each(data.results, function(i, result) {
    var speciesData = data.results[i];
    
    getFilmInfo(i, speciesData); 

    //builds a thumbnail for each species name
    galleryHTML += '<div class="thumbnail"><p class="species-label">';
    galleryHTML += speciesData.name;
    galleryHTML += '</p></div>';    

  }); 
  //removes 'undefined' from the galleryHTML 
  var trimmedGalleryHTML = galleryHTML.substr(9);
  //adds generated thumbnails to the gallery
  $gallery.append(trimmedGalleryHTML);
  //adds a numerical id to each thumbnail, starting at 0
  //(this should be changed to use the i from above somehow)
  $('.thumbnail').each(addIndex);
}

//main request from SWAPI
$.getJSON(speciesSwapi, speciesTiles);

/*
*******************************
*********** OVERLAY  **********
*******************************
*/

// variables for the lightbox overlay
var $swapiOverlay = $("<div id='swapi-overlay'></div>");
var $swapiInnerOverlay = $("<div id='swapi-inner-overlay'></div>");
var $swapiCaption = $("<p id='swapi-caption'></p>");
var $leftArrow = $("<button class='arrow' id='left-arrow'>&#10094</button>");
var $rightArrow = $("<button class='arrow' id='right-arrow'>&#10095</button>");

// keep track of image index for prev/next navigation
var navIndex;

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
  // because of asynchronous return of data
  // sort overlayContents here by overlayContents.number,
  // which correpsonds to the numerical id of the thumbnail
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
  getPlot(navIndex);
}

function setIndexNav() {
    getPlot(navIndex);
}

function getPlot(numb) {
  var index = numb;

  var currentSpeciesData = overlayContents[index];
  var currentSpeciesHomeworld = currentSpeciesData.homeworld;
  var currentSpeciesFilm = currentSpeciesData.film.title;
  var currentSpeciesFilmString = String(currentSpeciesFilm);

  var omdbOptions = {
    t : currentSpeciesFilmString,
    type: "movie"
  };

  // make request to OMDB API to get the plot summary of the film

  $.getJSON(omdb, omdbOptions, function(data) {
      var shortPlot = String(data.Plot);
      if (shortPlot === "N/A") {
        shortPlot = "You'll have to rent it. No plot summary is available.";
      }
      makeCaption(currentSpeciesData, currentSpeciesHomeworld, currentSpeciesFilm, shortPlot);
  }); 
}


function makeCaption(currentSpeciesData, currentSpeciesHomeworld, currentSpeciesFilm, shortPlot) {
 

  var name = currentSpeciesData.name;
  var classif = currentSpeciesData.classification;
  var desig = currentSpeciesData.designation;
  var lang = currentSpeciesData.language;
  var life = currentSpeciesData.average_lifespan;

  var planet = currentSpeciesHomeworld.name;
  //var rotationPeriod = currentSpeciesHomeworld.rotation_period;
  var climate = currentSpeciesHomeworld.climate;
  //var terrain = currentSpeciesHomeworld.terrain;
  var population = currentSpeciesHomeworld.population;

  //generates caption from the data in overlayContents
  var caption = 'A ' + desig + ' ' + classif + ' species, ' + name + ' speak ' + lang +
  '. Their lifespan is ' + life + '. They come from the ' + climate + ' planet ' + planet + 
  ',' + ' a ' + ' world with a population of ' + population + '.' + ' ' + name + 
  ' appeared in ' + currentSpeciesFilm + '. In case you missed it: ' + '<br><br>' + shortPlot; 

  prepOverlay(caption);
}


// OVERLAY NAVIGATION

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
}

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

// CANCEL OVERLAY ON CLICK
$swapiOverlay.click(function(event) {
  if(event.target.id == "swapi-overlay")
  $(this).slideUp("fast");
});


$gallery.on('click', '.thumbnail', setIndex);


/**********************************************
***************** FILTER/SEARCH ***************
***********************************************/


var $speciesRadio = $('#species-radio');
var $homeworldRadio = $('#homeworld-radio');
var $languageRadio = $('#language-radio');


function filterTest() {
  //sortOverlayContents();

  if ($speciesRadio.prop("checked")) {
    filterName();
  } else if ($homeworldRadio.prop("checked")) {
    filterHomeworld();
  } else if ($languageRadio.prop("checked")) {  
    filterLanguage();
  } 
}


// filter function for search field
function filterName() {
  //sets searchText as whatever is entered in search field
  var query = $searchField.val();
  //return the overlayContents to be in sync with thumbnail ids
  sortOverlayContents();
  //for each thumbnail div
  $('.thumbnail').each(function(){
    //sets thumbId equal to the numerical id of the thumbnail
    var thumbId = $(this).attr("id");
    
    if (overlayContents[thumbId].name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
        $(this).fadeIn();
    } else {
        $(this).fadeOut("fast");
    }
  });
}

function filterHomeworld() {
  //sets searchText as whatever is entered in search field
  var query = $searchField.val();
  //return the overlayContents to be in sync with thumbnail ids
  sortOverlayContents();
  //for each thumbnail div
  $('.thumbnail').each(function(){
    //sets thumbId equal to the numerical id of the thumbnail
    var thumbId = $(this).attr("id");
    
    if (overlayContents[thumbId].homeworld.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
        $(this).fadeIn();
    } else {
        $(this).fadeOut("fast");
    }
  });
}

function filterLanguage() {
  //sets searchText as whatever is entered in search field
  var query = $searchField.val();
  //return the overlayContents to be in sync with thumbnail ids
  sortOverlayContents();
  //for each thumbnail div
  $('.thumbnail').each(function(){
    //sets thumbId equal to the numerical id of the thumbnail
    var thumbId = $(this).attr("id");
    
    if (overlayContents[thumbId].language.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
        $(this).fadeIn();
    } else {
        $(this).fadeOut("fast");
    }
  });
}

// Triggers filter function on keyup in search field
$searchField.keyup(filterTest);



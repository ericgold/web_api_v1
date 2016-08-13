/* Create a LIGHTBOX with image container, caption,
left arrow, and right arrow */

var $overlay = $("<div id='overlay'></div>");
var $innerOverlay = $("<div id='inner-overlay'></div>");

//var $image = $("<img>");
var $caption = $("<p id='caption'></p>");
var $leftArrow = $("<button class='arrow'>&#10094</button>");
var $rightArrow = $("<button class='arrow'>&#10095</button>");

//variables for video
//var $youtubeOverlay = $('<iframe id="youtube-canvas" frameborder="0" allowfullscreen></iframe>');

// Variables for search 
var $searchField = $("input.search");

//var $thumbnails = $(".thumbnail img");
//var cache = [];

// Keep track of image index for prev/next navigation
var navIndex = 0;

// Get list of gallery images and track length of list
var $galleryLength = $thumbnails.length;

// Add a div inside the overlay for positioning the img and arrow buttons
$overlay.append($innerOverlay);
// Add caption to overlay
$overlay.append($caption);
// Add overlay to body
$("body").append($overlay);

//function to insert either the image or video into the overlay
//depending on the media selected by click or arrow navigation
var prepOverlay = function(thing) {
	// Add left arrow to inner overlay div
	$innerOverlay.append($leftArrow);
	// Add media to the overlay
	$innerOverlay.append(thing);
	// Add right arrow to overlay
	$innerOverlay.append($rightArrow);
};

//check if this is a video or photo and set mediaType variable
var mediaCheck = function(thing) {
	var $thing = $(thing);
	if ($thing.parent().hasClass("video-thumbnail")) {
		mediaType = "video";
	} else {
		mediaType = "photo";	
	}
};

/* Update image function 
(use for initial overlay and overlay navigation)*/

var updateImage = function(imageLocation, imageCaption) {
	if (mediaType === "photo") {
		//set img source as imageLocation
		$image.attr("src", imageLocation);
		$youtubeOverlay.detach();
		prepOverlay($image);
	} else if (mediaType === "video") {
		//set youtubeOverlay source as imageLocation
		$youtubeOverlay.attr("src", imageLocation);
		$image.detach();
		prepOverlay($youtubeOverlay);
	}
	//set caption as imageCaption
	$caption.text(imageCaption);
};


// On image link click
$(".thumbnail a").click(function(event){
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

// Overlay nav arrow button function
var prevNext = function(prev) {
	//when prev is false, increase index
	//when prev is true, decrease index
	if (!prev) {
		navIndex++;
	} else {
		navIndex--;
	}

	// enables overlay navigation wraparound
	if (navIndex < 0) {
		navIndex = $galleryLength-1;
	} else if (navIndex > $galleryLength-1) {
		navIndex = 0;
	}
};

var postImage = function() {
	//Get element by index and get its link
	var newImgSelected = $(".thumbnail").get(navIndex).getElementsByTagName("a");

	//Get link info
	var imageLocation = $(newImgSelected).attr("href");
	var imageCaption = $(newImgSelected).children("img").attr("alt");

	//media check the thumbnail we're moving to
	var newThumbnail = $(newImgSelected);
	mediaCheck(newThumbnail);
	//Update overlay
	updateImage(imageLocation, imageCaption);
};

//Cycles through images in overlay on arrow clicks
$leftArrow.click(function(event){
	prevNext(true);
	postImage();
});

$rightArrow.click(function(event){
	prevNext();
	postImage();
});

//Cycles through images in overlay on keyboard arrow press
$(document).bind('keydown', function(event) {
	if(event.keyCode == 37) {
		prevNext(true);
		postImage();
	} else if(event.keyCode == 39) {
		prevNext();
		postImage();
	}
});

// On overlay click
$overlay.click(function(event){
	// Hide overlay
	if(event.target.id == "overlay")
	$(this).slideUp("fast");
});


/* Enable SEARCH, dynamically hiding photos whose
captions do not include the inputted string and 
updating for each character entered */

// filter function for search field
var filter = function() {
	//sets searchText as whatever is entered in search field
	var query = $searchField.val();
	//for each thumbnail div
	$(".thumbnail").each(function(){
		//sets altText as the alt attribute 
		//of the img child of the anchor child of the thumbnail div
		var altText = $(this).children().children("img").attr("alt");
		//if the search term is 'not not present' in the alt text
		if (altText.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
			//show the thumbnail (including its child a and a's child img)
			$(this).fadeIn();
		//if the search term is 'not present' in the alt text
		} else {
			//hide the thumbnail and its contents
			$(this).fadeOut("fast");
		}
	});
};

// Triggers filter function on keyup in search field
$searchField.keyup(filter);




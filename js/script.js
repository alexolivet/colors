//clear logs script for every tpe of browser
//this makes it easier to debug
console.API;

if (typeof console._commandLineAPI !== 'undefined') {
    console.API = console._commandLineAPI; //chrome
} else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
    console.API = console._inspectorCommandLineAPI; //Safari
} else if (typeof console.clear !== 'undefined') {
    console.API = console;
}

console.API.clear();


$("#selectedImage").hide(); //hides the nav bar 


$("#colors").hide(); //hides the colors div we do not need it now

//this function sets a random image as background
var myPix = new
Array("images/image1.jpg", "images/image2.jpg", "images/image3.jpg");

function choosePic() {
    var randomNum = Math.floor((Math.random() * myPix.length));
    document.getElementById("bg").style.backgroundImage =
        "url(" + myPix[randomNum] + ")";
}
window.onload = choosePic;




// search the collection using a JSON call
function search(query) {
    return $.getJSON("https://www.rijksmuseum.nl/api/en/collection?q=Q&key=r4nzV2tL&imgonly=True&ps=5&format=jsonp".replace("Q", query));
}

var searchBtn = document.getElementById("search"); //get the search bar
searchBtn.addEventListener("keyup", doSearch); //while user type doSearch function kicks in

var resultD = document.getElementById("result"); //display the result in div
//var searchField = document.getElementById("search");//get the search bar content


//search function starts here
function doSearch() {
    $("#result").show(); // result div to show when getting results from search
    resultD.innerHTML = ""; //at the beginning result div is empty
    var searchString = searchBtn.value; //we use the data from the search bard
    if (searchString !== "") {
        search(searchString).done(function(data) {
            for (var artObj in data.artObjects) { //looping through all the returned onjects
                var principalOrFirstMaker = data.artObjects[artObj].principalOrFirstMaker // get the aritst name
                var objectNumber = data.artObjects[artObj].id // get the object id
                var rImg = document.createElement("img"); // create the image
                rImg.src = data.artObjects[artObj].webImage.url; // the source of the image element is the url from rijks api
                rImg.setAttribute("crossOrigin", "Anonymous"); //needed so I can actually copy the image for later use
                rImg.setAttribute("class", "imageClass responsive-img"); // set image class to allow css
                rImg.setAttribute("alt", data.artObjects[artObj].principalOrFirstMaker); // add artist name in alt tag
                rImg.setAttribute("title", data.artObjects[artObj].objectNumber); // add the object id to title tag
                var link = document.createElement("a"); // create the link
                link.appendChild(rImg); // append image to link
                resultD.appendChild(link); // append link with image to div
                link.setAttribute('href', data.artObjects[artObj].webImage.url); // set link path
                link.setAttribute('class', 'anchor'); // set link class needed for on event which allows you to deal with dynamic data 
                link.setAttribute("title", data.artObjects[artObj].title); // set text attribute of each image in text attribute



                //creating the card dynamically
                //needs revisiting
                var colSize = document.createElement("div");
                colSize.appendChild(link);
                resultD.appendChild(colSize);
                colSize.setAttribute("class", "card-image");

                var card = document.createElement("div");
                card.appendChild(colSize);
                resultD.appendChild(card);
                card.setAttribute("class", "card large");

                var cardImage = document.createElement("div");
                cardImage.appendChild(card);
                resultD.appendChild(cardImage);
                cardImage.setAttribute("class", "col s10");
                var title = data.artObjects[artObj].title;
                $('<div class="card-content"><p>' + title + '</p><p> by ' + principalOrFirstMaker + '</p></div>').insertAfter(colSize);

                $("#result img").each(function(i, image) { //for each image create a different id
                    image.id = "image" + (i + 1);
                });

                $("#result a").each(function(i, anchor) { //for each anchor set the following attributes:
                    //anchor.id = "anchor" + (i + 1);
                    anchor.setAttribute('onclick', 'return false;'); // return false needed so image does not jump when clicked
                    anchor.setAttribute('data-id', +(i + 1)); // set different data-id attribute needed for on event
                });

                setTimeout(function() { //timeout starts
                    $('img').trigger('load', function() {
                        // need to get the image width and height therefore using onload
                        // Specify image dimensions for each image
                        $('img').each(function() {
                            var findImgWidth = $(this).width();
                            var findImgHeight = $(this).height();
                            $(this).attr('width', findImgWidth);
                            $(this).attr('height', findImgHeight);

                        });
                    });
                }, 5000); //timeout ends
                resultD.innerHTML += "<br><p>&nbsp;</p><br><br><p>&nbsp;</p><br>";
            }
        });
    }
} //search function ends here

function rgbToHex(value) { //query to convert rgb to hex format
    a = value
    return "#" + ((1 << 24) + (+a[0] << 16) + (+a[1] << 8) + +a[2]).toString(16).slice(1)
};

$(document).ready(function() { //document ready starts

    //You want to utilize the .on event with jquery which allows you to deal with dynamic data which is basically what you are dealing with.
    //Then when you want to deal with the data from that particular record/image you would call it as such.
    $(document).on('click', '.anchor', 'img', function() {
        $("#colors").show(); // show the color div for color palette
        $("#searchBar").hide();
        $("#selectedImage").show();
        var imageSrc = $(this).attr('href'); //get the href of the painting from the anchor
        document.getElementById("bg").style.backgroundImage = 'url(' + imageSrc + ')'; //image selected is placed as background
        var c = document.getElementById("drawing1"); // this is the canvas
        var ctx = c.getContext("2d"); // canvas rendering
        var anchor_id = $(this).attr('data-id'); //get the value from the data id
        var img = document.getElementById("image" + anchor_id); //this will attach the id for that image here
        c.height = img.height;
        c.width = img.width;
        ctx.drawImage(img, 0, 0, c.width, c.height);

        var objectId = $(this).children("img").attr("title"); //get the object number
        if (objectId == '') { // in case there is no id throw below warning
            $('#colors').html("<h2 >We are sorry! An error occured. Please try refresh the page and try again.</h2>");

        } else {
            $.getJSON("https://www.rijksmuseum.nl/api/en/collection/" + objectId + "?key=r4nzV2tL&format=json", function(json) {
                if (json != "Nothing found.") {//start search
                    console.log(json);
                    var paintColors = json.artObject.colors;
                    console.log(paintColors);
                    var paintTitle = json.artObject.title;
                    var altDescription = json.artObject.label.description; //get the description of the painting from the title atribute
                    var altArtist = json.artObject.label.makerLine; //get the alt of the painting from the anchor
                    $("#result").hide(); // result div is no longer needed - so hide it

                    setTimeout(function() { //timeout starts
                        var colorThief = new ColorThief(); // color thief 
                        var color = colorThief.getPalette(img, 10); // color palette - number of colors returned
                        var newHTML = $.map(color, function(value) { // rgb value returned are then placed in csss inline style
                            //rgbToHex; //get the hex code from value
                            return ('<div class="col s1"><a class="btn-floating"><i class="chips" style="background-color:rgb(' + value.join(', ') + ')"></i></a></div>'); // return the colors in hex format into the grid cell
                        });
                        $(".row").html(newHTML.join('')); // place the color palette into the dedicated place

                        var resultColors = document.getElementById("colors"); //display the result in div
                        resultColors.innerHTML += '<div class="col s10"><div class="card"><div class="card-content"><p>Title: ' + paintTitle + '</p><p>' + altDescription + '</p><p>Artist: ' + altArtist + '</p></div></div></div>'; //place the title of the painting in this element



                    }, 500); //timeout ends

                }//search ends
            });

        }




    });


}); //document ready ends

// this makes the canvas responsive
//may need revisit
//helpfull page > https://mobiforge.com/design-development/html5-mobile-web-canvas
var canvas;
var canvasWidth;
var ctx;

function init() {
    canvas = document.getElementById('drawing1');
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('orientationchange', resizeCanvas, false);
        resizeCanvas();
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
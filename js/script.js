// search the collection using a JSON call
function search(query) {
  return $.getJSON("https://www.rijksmuseum.nl/api/en/collection?q=Q&key=r4nzV2tL&imgonly=True&ps=5&format=json".replace("Q", query));

}

var searchBtn = document.getElementById("search");
searchBtn.addEventListener("click", doSearch);

var resultD = document.getElementById("result");
var searchField = document.getElementById("query");
$("#colors").hide();
//search function starts here
function doSearch() {
    $("#result").show(); // result div to show when making new search
    resultD.innerHTML = "";
    var searchString = searchField.value;
    if (searchString !== "") {
     search(searchString).done(function(data) {
      for (var artObj in data.artObjects) {
      var rImg = document.createElement("img"); // create the image
      rImg.onload = function(){

        // Specify image dimensions for each image
        $('img').each(function() {
          var findImgWidth = $(this).width();
          var findImgHeight = $(this).height();

          $(this).attr('width', findImgWidth);
          $(this).attr('height', findImgHeight);
        });
      }


      rImg.setAttribute("crossOrigin", "Anonymous"); //needed so I can actually copy the image for later use
      rImg.setAttribute("class", "imageClass"); //needed so I can actually copy the image for later use
      var link = document.createElement("a"); // create the link
      link.setAttribute('href', '#'); // set link path
      link.setAttribute('class', 'anchor'); // set link path
      // link.href = "www.example.com"; //can be done this way too
      rImg.src = data.artObjects[artObj].webImage.url; // the source of the image element is the url from rijks api
       link.appendChild(rImg); // append image to link
       resultD.appendChild(link); // append link with image to div
       resultD.innerHTML += data.artObjects[artObj].title; // this is the title from rijks api
      $("#result img").each(function (i, image){ //for each image create a different id
      image.id = "image" + (i + 1);
      });
     $("#result a").each(function (i, anchor){ //for each anchor create a different id
      //anchor.id = "anchor" + (i + 1);
        anchor.setAttribute('onclick', 'return false;'); // set link path
        anchor.setAttribute('data-id', + (i + 1)); // set link path
        //return false needed so to avoid page jump
      });
     resultD.innerHTML += "<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>";
   }   
 });
}
}//search function ends here


$(document).on('click','.anchor', function () {
  $("#colors").show();
    var anchor_id = $(this).attr('data-id');
setTimeout(function() { //timeout for image load to canvas - start
    var c=document.getElementById("drawing1");
    var ctx=c.getContext("2d");
    var img=document.getElementById("image"+anchor_id); //this will attach the id for that image here
    c.height = img.height ;
    c.width = img.width ;
    ctx.drawImage(img,0,0,c.width, c.height);
    $("#result").hide();
    
        var colorThief = new ColorThief();
        var color = colorThief.getPalette(img, 18);
        var newHTML = $.map(color, function(value) {
     return('<div class="col-2-sm" style="background-color:rgb(' + value.join(', ') + ')">&nbsp;</div>');
    });
    $(".row").html(newHTML.join(''));
}, 500); //timeout for image load to canvas - ends
});
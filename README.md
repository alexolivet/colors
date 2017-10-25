Colors like Masters
====================

App integrating the Rijksmuseum API with color thief. Data is fecthed using json and displayed on the page using materializecss frameworks.


CSS
---

[materializecss](http://materializecss.com) has been used for the framework. It is completely responsive. It works perfectly on any platform, from mobile to Ipad to laptops screens. On top of that, it is based out of the material design.


JAVASCRIPT
----------

A json call is send to the API (search function). I am using event listener to get the data sent to the API. I get the data back and start building the card dynamically. I set image attributes. Build div into div ( needed to build the card ). Each image is given a data-id so to allow for an on click function.

Another json call is made to get more detailed data. In this function, another unique card is build dynamically to display the selected work of art.

COLORS
------
 I have used the [color-thief](http://lokeshdhakar.com/projects/color-thief) library to build the color palette of the selected work of art.
 
 
 








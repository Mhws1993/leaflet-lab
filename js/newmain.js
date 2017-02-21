/* Map of test data from test */
//proportional symbol isn't working. Could the order of the new code be the reason?
//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('mapid', {
        center: [20, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};
//this function creates the proportional symbols
function createPropSymbols(data, map){
		//choose a variable for the proportional symbol
	  var attribute = "1995_pop";

    //create marker options
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
//Attempting to place calculate radius
//calculate the radius of each proportional symbol
	function calcPropRadius(attValue) {
		//scale factor to adjust symbol size evenly
		//doubled scale factor as the symbols were too small
		var scaleFactor = 100;
		//area based on attribute value and scale factor
		var area = attValue * scaleFactor;
		//radius calculated based on area
		var radius = Math.sqrt(area/Math.PI);
		//////////////////////////////////////////////////////////////////////////////why does this console.log help
console.log(radius);
    return radius;
	
};


    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            //Step 5: For each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties[attribute]);
	geojsonMarkerOptions.radius = calcPropRadius(attValue);
            //examine the attribute value to check that it is correct
            //previous log version
			//console.log(feature.properties, attValue);
			//new log statement
			  console.log(feature.properties, attValue);
            //create circle markers
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
};


function getData(map){
    //load the data
    $.ajax("data/map.geojson", {
        dataType: "json",
        success: function(response){
            //call function to create proportional symbols
            createPropSymbols(response, map);
        }
    });
};
$(document).ready(createMap);

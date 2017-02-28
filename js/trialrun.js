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
	function calcPropRadius(attValue) {
		//scale factor to adjust symbol size evenly
		//doubled scale factor as the symbols were too small
		var scaleFactor = 150;
		//area based on attribute value and scale factor
		var area = attValue * scaleFactor;
		//radius calculated based on area
		var radius = Math.sqrt(area/Math.PI);
		
    return radius;
	
};
//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
	
	
    //Determine which attribute to visualize with proportional symbols
	//var attribute = "Pop_2015";
	
	var attribute = attributes[0];
    //check
    console.log(attribute);
    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = "<p><b>City:</b> " + feature.properties.City + "</p>";
	/*changed from [1] to [0] as I set up geojson values as year then pop
		rather than pop then year, so I needed the first half of the string instead of the second half*/
	var year = attribute.split("_")[0];
	popupContent += "<p><b>Population in " + year + ":</b> " + feature.properties[attribute] + " million</p>";
    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

function createSequenceControls(map, latlng, attributes){
	
    //create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');
	$('.range-slider').attr({
        max: 6,
        min: 0,
        value: 0,
        step: 1
    });
	////////////////////Change this to another button type  $('#reverse').html('<img src="img/reverse.png">'); where in example
	$('#panel').append('<button class="skip" id="reverse">Reverse</button>');
    $('#panel').append('<button class="skip" id="forward">Skip</button>');
	
	//test button
	$('#panel').append('<button class="skip" id="above" title="above">above</button>');
	
	  //Below Example 3.6 in createSequenceControls()
    //Step 5: click listener for buttons
	$('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 6 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 6 : index;
        };

        //Step 8: update slider
		
        $('.range-slider').val(index);
		updatePropSymbols(map, latlng, attributes[index]);
		
    });
	  $('.range-slider').on('input', function(){
        //Step 6: get the new index value
        var index = $(this).val();
		updatePropSymbols(map, latlng, attributes[index]);
    });
	
	
};
function updatePropSymbols(map, latlng, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //update the layer style and popup
			//access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //add city to popup content string
            var popupContent = "<p><b>City:</b> " + props.City + "</p>";

            //add formatted attribute to panel content string
			//updated split to [0] like in pointToLayer
            var year = attribute.split("_")[0];
            popupContent += "<p><b>Population in " + year + ":</b> " + props[attribute] + " million</p>";

            //replace the layer popup
            layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
            });
        };
    });
	//work with filter here?
	
	
	
/*********************************************************************************
**********************************************************************************
**********************************************************************************
**********************************************************************************
****************Start here********************************************************
**********************************************************************************
**********************************************************************************
**********************************************************************************
*********************************************************************************/
/*	var tempAttempt = layer.feature.properties;
	$('.skip').click(function(){
		
		if ($(this).attr('id') == 'above'){
			console.log("why cats?");
			if (tempAttempt[attribute] < 5){
				console.log("not dogs?");
			};
		};
		
		
		
		
		
	});*/
	
	
	if ($('.skip').click(function(){
		 if ($(this).attr('id') == 'above'){
		console.log("blue?");
	 return L.circleMarker(latlng, {
        radius: 5.0,
        fillColor: '#e1118e',
        color: 'blue',
        weight: 1,
        opacity: 1.0,
        fillOpacity: 1.0
		
        });
		 };//this is for new if statement	
	}));
	
	
	
	
	
	
	
	
	
	
};
//});
//Step 3 lab 5: build an attributes array from the data
////////////////////PUT  PROCESS DATA BACK HERE IF THIS DOESN'T WORK
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("_pop") > -1){
            attributes.push(attribute);
        };
    };

    //check result
    //console.log(attributes);

    return attributes;
};

function getData(map){
    //grabs my lab5_location dataset
    $.ajax("data/lab5_locations.geojson", {
        dataType: "json",
        success: function(response){
			//create an attributes array for leaflet lab
            var attributes = processData(response);
            //call function to create proportional symbols
            createPropSymbols(response, map, attributes);
			//this should create the sequence controls
			createSequenceControls(map, latlng, attributes);
        }
    });
};
$(document).ready(createMap);
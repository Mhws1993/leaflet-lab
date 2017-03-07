/* Map of test data from test */
//proportional symbol isn't working. Could the order of the new code be the reason?
//function to instantiate the Leaflet map
var min;
var max;
var attribute;

function createMap(){
    //create the map
    var map = L.map('mapid', {
       // center: [20, 0],
	   center: [39.475802, -96.120551],
        zoom: 4
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
		var scaleFactor = 500;
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

function createSequenceControls(map, attributes, min, max){
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
	$('#panel').append('<button id="between" title="between">Show Between 1 & 5 Million</button>');
	$('#panel').append('<button id="five" title="Over Five Million">Show Over Five Million</button>');
	$('#panel').append('<button id="one" title="Under One Million">Show Under 1 Million</button>');
	console.log("right before #between");
	
	//Filter Buttons
	var betweenSwitch = false;
	$('#between').click(function(){
		console.log("outside true/false");
		if (betweenSwitch == false){
			console.log("false");
			var max = 5;
			var min = 1;
			console.log("inside of #between");
			
			var index = $('.range-slider').val();
			filter (map, attributes[index], min, max);
			//x = document.GetElementById("between");
			// x.style.color = 'blue';
			$(this).css('color', 'white');
			
			//This will set the other two buttons back to their original colors
			$('#five').css('color', 'black');
			$('#one').css('color', 'black');
			betweenSwitch = true;
			fiveSwitch = false;
			oneSwitch = false;
			console.log('now true');
		} else if (betweenSwitch == true){
			var max = 300;
			var min = -300;
			$(this).css('color', 'black');
			/*have to make each xSwitch = false in each other button to
			reset them*/
			betweenSwitch = false;
			console.log('now false');
			$('#five').css('color', 'black');
			$('#one').css('color', 'black');
			var index = $('.range-slider').val();
			filter (map, attributes[index], min, max);
		};
	

		
			
	});
	//Filter button Five
	var fiveSwitch = false;
	$('#five').click(function(){
		if (fiveSwitch == false){
			console.log("inside of #five");
			console.log("fiveSwitch false");
			var max = Infinity;
			var min = 5;
			var index = $('.range-slider').val();
			filter (map, attributes[index], min, max);
			//x = document.GetElementById("between");
			// x.style.color = 'blue';
			$(this).css('color', 'white');
			//This will set the other two buttons back to their original colors
			$('#between').css('color', 'black');
			$('#one').css('color', 'black');
			betweenSwitch = false;
			oneSwitch = false;
			fiveSwitch = true;

		} else if (fiveSwitch == true){
			var max = 300;
			var min = -300;
			$(this).css('color', 'black');
			/*have to make each xSwitch = false in each other button to
			reset them*/
			fiveSwitch = false;
			console.log('now false');
			$('#between').css('color', 'black');
			$('#one').css('color', 'black');
			var index = $('.range-slider').val();
			filter (map, attributes[index], min, max);
		};
	});
	var oneSwitch = false;	
	$('#one').click(function(){
		if (oneSwitch == false){
			console.log("inside of #one");	
			var max = 1;
			var min = -Infinity;
			var index = $('.range-slider').val();
			filter (map, attributes[index], min, max);
			//x = document.GetElementById("between");
			// x.style.color = 'blue';
			$(this).css('color', 'white');
			//This will set the other two buttons back to their original colors
			$('#between').css('color', 'black');
			$('#five').css('color', 'black');
			betweenSwitch = false;
			fiveSwitch = false;
			oneSwitch = true;
		} else if (oneSwitch == true){
			var max = 300;
			var min = -300;
			$(this).css('color', 'black');
			/*have to make each xSwitch = false in each other button to
			reset them*/
			oneSwitch = false;
			console.log('now false');
			$('#between').css('color', 'black');
			$('#five').css('color', 'black');
			var index = $('.range-slider').val();
			filter (map, attributes[index], min, max);
				
			
		};
	});
	  
	  
    //Step 5: click listener for buttons
	$('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
			//reset text color if forward
			$('#between').css('color', 'black');
			$('#one').css('color', 'black');
			$('#five').css('color', 'black');
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 6 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
			//reset text color if reverse
			$('#between').css('color', 'black');
			$('#one').css('color', 'black');
			$('#five').css('color', 'black');
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 6 : index;
			
        };

        //Step 8: update slider
		
        $('.range-slider').val(index);
		updatePropSymbols(map, attributes[index]);
		
    });
	  $('.range-slider').on('input', function(){
        //Step 6: get the new index value
        var index = $(this).val();
		//reset text color if using slider.
		$('#between').css('color', 'black');
			$('#one').css('color', 'black');
			$('#five').css('color', 'black');
		updatePropSymbols(map, attributes[index]);
    });
	
	
};
function updatePropSymbols(map, attribute){
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
};
//});

function filter (map, attribute, min, max, attValue){
	//var max = 1.5;
	//var min = 1;
	//Save a second radius to reset symbols that were set to zero
	
	  map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //update the layer style and popup
			//access feature properties
			
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
			var savedRadius = radius;
			//in the case the condition isn't met
		if (props[attribute] > max || props[attribute] < min ){
				 //layer.setRadius(0);
					//fillColor: '#ff0000'
				
					 console.log("does props[attribute] still work in min/max?");
					 
					 layer.setRadius(null);
					// return { fillColor: "blue"}				
				
			};
			//uses copied original radius to reset values of the marker radius
		if (props[attribute] < max && props[attribute] > min ){
				 //layer.setRadius(0);
					//fillColor: '#ff0000'
				
					 console.log("min/max?");
					 
					 layer.setRadius(savedRadius);
					// return { fillColor: "blue"};
				 
				 /////////////////////////////////////////////maybe?
				//updatePropSymbols(map, attribute);
				
				
			};
		

     
        };
    });
	
};



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
			createSequenceControls(map, attributes, min, max);
        }
    });
};
$(document).ready(createMap);
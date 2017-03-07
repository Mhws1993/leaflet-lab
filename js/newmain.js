//global variables. Makes sure everything needed is available
var min;
var max;
var attribute;
var betweenSwitch = false;
var fiveSwitch = false;
var oneSwitch = false;
 
function createMap() {
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
    L.TileLayer.google = L.TileLayer.extend({
        getTileUrl: function(coords) {
            var i = Math.ceil(Math.random() * 4);
            return "https://www.google.com/publicdata/directory?hl=en&dl=en#" + i;
        },
        getAttribution: function() {
            return "<a href='https://www.google.com/publicdata/directory?hl=en&dl=en#'>Database Link</a>"
        }
    });

    L.tileLayer.google = function() {
        return new L.TileLayer.google();
    }

    L.tileLayer.google().addTo(map);



    L.TileLayer.art = L.TileLayer.extend({
        getTileUrl: function(coords) {
            var i = Math.ceil(Math.random() * 4);
            return "https://www.google.com/publicdata/directory?hl=en&dl=en#" + i;
        },
        getAttribution: function() {
            return "Map created by Matthew Smith"
        }
    });

    L.tileLayer.art = function() {
        return new L.TileLayer.art();
    }

    L.tileLayer.art().addTo(map);

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
    var radius = Math.sqrt(area / Math.PI);

    return radius;

};
//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes) {


    //Determine which attribute to visualize with proportional symbols
    //var attribute = "Pop_2015";

    var attribute = attributes[0];
    //check
    console.log(attribute);
    //create marker options
    var options = {
        fillColor: "#21f464",
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
function createPropSymbols(data, map, attributes) {
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {

            return pointToLayer(feature, latlng, attributes);

        }
    }).addTo(map);

};




function createSequenceControls(map, attributes, min, max) {
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        onAdd: function(map) {
            // create the control container with a particular class name

            var container = L.DomUtil.create('div', 'sequence-control-container');
            $(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
            $(container).append('<input class="range-slider" type="range">');
            //add skip buttons

            $(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');
            $('.range-slider', container).attr({
                max: 6,
                min: 0,
                value: 0,
                step: 1
            });
            //Buttons for hiding and showing the 5th operator and 5th operator information alert
            $(container).append('<button type="button" id="Hidden" data-toggle="collapse" data-target="#demo">!</button>');
            $(container).append('<button type="button" id="popQuestion" data-toggle="collapse" data-target="#demo">?</button>');
            //Filter Buttons
            $(container).append('<button id="five" title="Show Over Five Million">Show Over 5 Million</button>');
            $(container).append('<button class="skip" id="between" title="Show Between 1 & 5 Million">Show Between 1 & 5 Million</button>');
            $(container).append('<button id="one" title="Show Under One Million">Show Under 1 Million</button>');
            //hide the buttons so they can be shown when hidden is used
            $('#one', container).hide();
            $('#five', container).hide();
            $('#between', container).hide();
            $('#popQuestion', container).hide();
            $('.skip', container).click(function() {
                //get the old index value
                var index = $('.range-slider').val();

                //Step 6: increment or decrement depending on button clicked
                if ($(this).attr('id') == 'forward') {
                    index++;
                    //reset text color if forward
                    $('#between').css('color', 'black');
                    $('#one').css('color', 'black');
                    $('#five').css('color', 'black');
                    betweenSwitch = false;
                    fiveSwitch = false;
                    oneSwitch = false;
                    //Step 7: if past the last attribute, wrap around to first attribute
                    index = index > 6 ? 0 : index;
                } else if ($(this).attr('id') == 'reverse') {
                    index--;
                    //reset text color if reverse
                    $('#between').css('color', 'black');
                    $('#one').css('color', 'black');
                    $('#five').css('color', 'black');
                    betweenSwitch = false;
                    fiveSwitch = false;
                    oneSwitch = false;
                    //Step 7: if past the first attribute, wrap around to last attribute
                    index = index < 0 ? 6 : index;

                };

                //Step 8: update slider

                $('.range-slider').val(index);
                updatePropSymbols(map, attributes[index]);

            });
            $('.range-slider', container).on('input', function() {
                //Step 6: get the new index value
                var index = $(this).val();
                //reset text color if using slider.
                $('#between').css('color', 'black');
                $('#one').css('color', 'black');
                $('#five').css('color', 'black');
                updatePropSymbols(map, attributes[index]);

            });
            //set a switch so it can flip back and forth if it is clicked gaain
            var hiddenSwitch = false;
            $('#Hidden', container).click(function() {
                if (hiddenSwitch == false) {

                    $('#one', container).show();
                    $('#five', container).show();
                    $('#between', container).show();
                    $('#popQuestion', container).show();
                    $(".sequence-control-container").width(900);
                    $(".sequence-control-container").css({
                        'background-color': 'rgba(255,255,255,0.8)'

                    });
                    $(".sequence-control-container").css('border', 'solid gray 1px');
                    hiddenSwitch = true;
                    console.log("hidden switch is now true");

                } else if (hiddenSwitch = true) {
                    $('#one', container).hide();
                    $('#five', container).hide();
                    $('#between', container).hide();
                    $('#popQuestion', container).hide();
                    $(".sequence-control-container").width(390);


                    hiddenSwitch = false;
                }
            });

            //create alert that can give intructions
            $('#popQuestion', container).click(function() {
                alert("You can use these options to filter the data \n Press \"Over 5 Million\" to only show results over five million \n Press \"Show Between 1 & 5 Million\" to show results between 1 and 5 million \n Press  \"Under 1 Million\" to only show results under 1 million. \n You can also press the button next to the map title to minimize the title.\n ");

            });

            //filter buttons
            var betweenSwitch = false;
            $('#between', container).click(function() {
                console.log("outside true/false");
                if (betweenSwitch == false) {
                    console.log("false");
                    var max = 5;
                    var min = 1;
                    console.log("inside of #between");

                    var index = $('.range-slider').val();
                    filter(map, attributes[index], min, max);
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
                } else if (betweenSwitch == true) {
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
                    filter(map, attributes[index], min, max);
                };

            });
            //Filter button Five
            var fiveSwitch = false;
            $('#five', container).click(function() {
                if (fiveSwitch == false) {
                    console.log("inside of #five");
                    console.log("fiveSwitch false");
                    var max = Infinity;
                    var min = 5;
                    var index = $('.range-slider').val();
                    filter(map, attributes[index], min, max);
                    //x = document.GetElementById("between");
                    // x.style.color = 'blue';
                    $(this).css('color', 'white');
                    //This will set the other two buttons back to their original colors
                    $('#between').css('color', 'black');
                    $('#one').css('color', 'black');
                    betweenSwitch = false;
                    oneSwitch = false;
                    fiveSwitch = true;

                } else if (fiveSwitch == true) {
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
                    filter(map, attributes[index], min, max);
                };
            });
            var oneSwitch = false;
            $('#one', container).click(function() {
                if (oneSwitch == false) {
                    console.log("inside of #one");
                    var max = 1;
                    var min = -Infinity;
                    var index = $('.range-slider').val();
                    filter(map, attributes[index], min, max);
                    $(this).css('color', 'white');
                    //This will set the other two buttons back to their original colors
                    $('#between').css('color', 'black');
                    $('#five').css('color', 'black');
                    betweenSwitch = false;
                    fiveSwitch = false;
                    oneSwitch = true;
                } else if (oneSwitch == true) {
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
                    filter(map, attributes[index], min, max);


                };
            });
            $(container).on('mousedown dblclick', function(e) {
                L.DomEvent.stopPropagation(e);
            });


            return container;
        }
    });
    map.addControl(new SequenceControl());
};




//this function greats container for title as well as for hiding/showing
function createTitle(map, attributes) {
    var titleControl = L.Control.extend({
        options: {
            position: 'topright'
        },
        onAdd: function(map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'title-control-container');

            //add temporal legend div to container
            $(container).append('<button id="hiddenTitle" title="Click for details">>\n></button>');
            var mapTitle = "Largest Cities in the United States" + " by Populaton" + "\n" + "1995-2001"

            $(container).append(mapTitle);

            //$(".title-control-container").css('fontSize', '540px');

            var textData = $('#hiddenTitle', container).text();
            console.log(textData);

            var hideSwitch = false;
            $('#hiddenTitle', container).click(function() {
                if (hideSwitch == false) {
                    //this hides the title of the map and collapses the button if pressed
                    $('#hiddenTitle', container).text('<\n<');
                    $(".title-control-container").width(30);
                    //	$(".title-control-container").float('right');
                    $(".title-control-container").css('background-color', 'transparent');
                    $(".title-control-container").css('border', '0px');
                    $(".title-control-container").css('font-size', '0px');

                    hideSwitch = true;
                } else {
                    //if button is pressed againt he container with the title shows back up
                    $('#hiddenTitle', container).text('>\n>');
                    $(".title-control-container").width(500);
                    //$(container).append("Highest Populated Cities in the United States 1995-2001");
                    $(".title-control-container").css('background-color', 'rgba(255,255,255,0.8)');
                    $(".title-control-container").css('border', '1px');
                    $(".title-control-container").css('font-size', '30px');
                    hideSwitch = false;


                };

            });

            $(container).on('mousedown dblclick', function(e) {
                L.DomEvent.stopPropagation(e);
            });

            return container;
        }
    });
    map.addControl(new titleControl());


};




function createLegend(map, attributes) {
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },
        onAdd: function(map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            //add temporal legend div to container
            $(container).append('<div id="temporal-legend">')

            //Step 1: start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="200px" height="80px">';

            //add attribute legend svg to container
            //array of circle names to base loop on
            var circles = {
                max: 20,
                mean: 40,
                min: 60
            };

            //loop to add each circle and text to svg string
            for (var circle in circles) {
                //circle string
                svg += '<circle class="legend-circle" id="' + circle + '" fill="#21f464" fill-opacity="0.8" stroke="#000000" cx="50"/>';

                //text string
                svg += '<text id="' + circle + '-text" x="90" y="' + circles[circle] + '"></text>';
            };


            //close svg string
            svg += "</svg>";

            //add attribute legend svg to container
            $(container).append(svg);

            return container;
        }
    });
    map.addControl(new LegendControl());
    updateLegend(map, attributes[0]);

};

//Calculate the max, mean, and min values for a given attribute
function getCircleValues(map, attribute) {
    //start with min at highest possible and max at lowest possible number
    var min = Infinity,
        max = -Infinity;

    map.eachLayer(function(layer) {
        //get the attribute value
        if (layer.feature) {
            var attributeValue = Number(layer.feature.properties[attribute]);

            //test for min
            if (attributeValue < min) {
                min = attributeValue;
            };

            //test for max
            if (attributeValue > max) {
                max = attributeValue;
            };
        };
    });

    //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min
    };
};


function updateLegend(map, attribute) {
    //create content for legend
    var year = attribute.split("_")[0];
    var content = "Population in " + year;

    //replace legend content
    $('#temporal-legend').html(content);
    var circleValues = getCircleValues(map, attribute);
    for (var key in circleValues) {
        //get the radius
        var radius = calcPropRadius(circleValues[key]);

        //Step 3: assign the cy and r attributes
        $('#' + key).attr({
            cy: 75 - radius,
            r: radius
        });
        $('#' + key + '-text').text(Math.round(circleValues[key] * 100) / 100 + " million");
    };

};




function updatePropSymbols(map, attribute) {
    map.eachLayer(function(layer) {
        if (layer.feature && layer.feature.properties[attribute]) {
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
                offset: new L.Point(0, -radius)
            });
        };
    });
    updateLegend(map, attribute);
};
//});

function filter(map, attribute, min, max, attValue) {
    //var max = 1.5;
    //var min = 1;
    //Save a second radius to reset symbols that were set to zero

    map.eachLayer(function(layer) {
        if (layer.feature && layer.feature.properties[attribute]) {
            //update the layer style and popup
            //access feature properties

            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            var savedRadius = radius;
            //in the case the condition isn't met
            if (props[attribute] > max || props[attribute] < min) {
                //layer.setRadius(0);
                //fillColor: '#ff0000'

                console.log("does props[attribute] still work in min/max?");

                layer.setRadius(null);
                // return { fillColor: "blue"}				

            };
            //uses copied original radius to reset values of the marker radius
            if (props[attribute] < max && props[attribute] > min) {
                console.log("min/max?");
                layer.setRadius(savedRadius);
            };



        };
    });

};

//Step 3 lab 5: build an attributes array from the data
function processData(data) {
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties) {
        //only take attributes with population values
        if (attribute.indexOf("_pop") > -1) {
            attributes.push(attribute);
        };
    };
    return attributes;
};

function getData(map) {
    //grabs my lab5_location dataset
    $.ajax("data/lab5_locations.geojson", {
        dataType: "json",
        success: function(response) {
            //create an attributes array for leaflet lab
            var attributes = processData(response);
            //call function to create proportional symbols
            createPropSymbols(response, map, attributes);
            //this should create the sequence controls
            createSequenceControls(map, attributes, min, max);

            createLegend(map, attributes);
            createTitle(map, attributes);
        }
    });
};

$(document).ready(createMap);
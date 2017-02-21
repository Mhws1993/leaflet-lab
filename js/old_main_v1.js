//initialize functions cities and jQueryAjax
function initialize(){
	cities();
	jQueryAjax();
};

//function to create a table with cities and their populations
function cities(){
	//define two arrays for cities and population
	var cityPop = [
		{ 
			city: 'Madison',
			population: 233209
		},
		{
			city: 'Milwaukee',
			population: 594833
		},
		{
			city: 'Green Bay',
			population: 104057
		},
		{
			city: 'Superior',
			population: 27244
		}
	];

	//append the table element to the div
	$("#mydiv").append("<table>");

	//append a header row to the table
	$("table").append("<tr>");
	
	//add the "City" and "Population" columns to the header row
	$("tr").append("<th>City</th><th>Population</th>");
	
	//loop to add a new row for each city
    for (var i = 0; i < cityPop.length; i++){
        //assign longer html strings to a variable
        var rowHtml = "<tr><td>" + cityPop[i].city + "</td><td>" + cityPop[i].population + "</td></tr>";
        //add the row's html string to the table
        $("table").append(rowHtml);
    };

    addColumns(cityPop);
    addEvents();
	 
};

function addColumns(cityPop){
    
    $('tr').each(function(i){

    	if (i == 0){

    		$(this).append('<th>City Size</th>');
    	} else {
			//find size based on population
    		var citySize;

    		if (cityPop[i-1].population < 100000){
    			citySize = 'Small';
				
    		} else if (cityPop[i-1].population < 500000){
    			citySize = 'Medium';
				
    		} else {
    			citySize = 'Large';
				
    		};
			$(this).append(citySize);
    		/*$(this).append('<td' + citySize + '</td>');*/
    	};
    });
};

function addEvents(){

	$('table').mouseover(function(){
		//creates the color for the text
		var color = "rgb(";

		for (var i=0; i<3; i++){

			var random = Math.round(Math.random() * 255);

			color += random;

			if (i<2){
				color += ",";
			
			} else {
				color += ")";
			};

		$(this).css('color', color);
		};
	});
	$('table').on('click', clickme);
};
function clickme(){

		alert('Hey, you clicked me!');
};

//Module 3 starts
//placed mydata outside and in front of functions for module 3 to get past errors 
var mydata;
function jQueryAjax(){
	//defining data variable
	
	//ajax
	$.ajax("data/MegaCities.geojson", {
		dataType: "json",
		success: function(response){
			mydata = response;
			//the data can be accessed
			console.log("The data can be accessed ", mydata);
		}
	});

	//data cannot be acessed
	console.log("The data cannot be accessed ", mydata);
	debugAjax();
};

//callback
function debugCallback(response){
	//adds data, <br> for line break
	$('#mydiv').append('<br>GeoJSON data:<br> ' + JSON.stringify(mydata));
};

function debugAjax(){
	$.ajax("data/MegaCities.geojson", {
		dataType: "json",
		success: function(response){			
			debugCallback(mydata);
		}
	});

};

//call the initialize function when the document has loaded
$(document).ready(initialize);
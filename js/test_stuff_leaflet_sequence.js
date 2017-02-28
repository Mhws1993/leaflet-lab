var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];

L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(map);

var picnic_parks = L.geoJson(myJson, {filter: picnicFilter}).addTo(map);

function picnicFilter(feature) {
  if (feature.properties.Picnic === "Yes") return true
}


//*So I should turn "var someFeatures" and make it equal to the geoJson array I'm trying to create

if (feature.properties[attribute] > valueA && feature.properties[attribute] < valueB){
    return true;
} else {
    return false;
}
L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(map);

//*I want if the populaton in't over x then they don't appear

/* If population has decreased then turn to color x if population has increased turn color y*/
if (attribute.indexOf("Pop")) > (attribute.indexOf("Pop") > -1){
           var options = {
        fillColor: "blue",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };  
        };
		
		
		document.getElementById("reverse").onclick = function() {
   alert("button was clicked " + (count++) + " times");
};

//basic idea from stackex
<!DOCTYPE html>
<html>
<head>
<script>
function display()
{
var col=document.getElementById("demo");
col.style.color="#FF0000";
}
</script>
</head>
<body>

<h1>My First JavaScript</h1>
<p id="demo">click on the button below.....</p>

<button onclick="display()">Display</button>

</body>
</html>





function addEvents(){
	//when the user mouses over the table, change the text color to a random color
	$('table').mouseover(function(){
		//start of a CSS rgb() value
		var color = "rgb(";
		//loop creates r, g, and b values
		for (var i=0; i<3; i++){
			//random integer between 0 and 255
			var random = Math.round(Math.random() * 255);
			//add the value
			color += random;
			//commas to separate values
			if (i<2){
				color += ",";
			//end of rgb() value
			} else {
				color += ")";
			};
		};
		//assign the text color
		$(this).css('color', color);
	});
	//click listener handler function
	function clickme(){
		//fire an alert when the table is clicked
		alert('Hey, you clicked me!');
	};
	//add click listener to table element
	$('table').on('click', clickme);
};
















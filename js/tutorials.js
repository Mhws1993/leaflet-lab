function initialize(){
	//sets view at coordinates 51.505, -0.09 
	var mymap = L.map('mapid').setView([51.505, -0.09], 13);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
			maxZoom: 18,
			id: 'mapbox.satellite',
			accessToken: 'sk.eyJ1Ijoiam9sbHltYW4iLCJhIjoiY2l6M3I0bmk2MDIwcjMzbW44aDdtM2d1ciJ9._V8dHefd2wYGznzAs4qszA'
	}).addTo(mymap);
	
	//creates a marker at given point
	var marker = L.marker([51.5, -0.09]).addTo(mymap);
	
	//creates a circle at given point with raidus of 500 and color red
	var circle = L.circle([51.508, -0.11], {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5,
		radius: 500
	}).addTo(mymap);
	
	//Creates the polygon on the map
	var polygon = L.polygon([
		[51.509, -0.08],
		[51.503, -0.06],
		[51.51, -0.047]
		]).addTo(mymap);
	
	//creates a popup depending on what is clicked, if you click the cicle the circle text appears, if you click the polygon that text appears
	marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
	circle.bindPopup("I am a circle.");
	polygon.bindPopup("I am a polygon.");
	var popup = L.popup();

	//Creates a popup that tells us the latitude and longitude of a place on the map that we click.
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}
mymap.on('click', onMapClick);	
};



$(document).ready(initialize);
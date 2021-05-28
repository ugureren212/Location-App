var top5Table = document.querySelectorAll("li");

var GeoSearchControl = window.GeoSearch.GeoSearchControl;
var OpenStreetMapProvider = window.GeoSearch.OpenStreetMapProvider;

//creating searched markere (circle marker) so it can be moved when users searches for something
var searchedMarker = L.circle([0,0],
  {
    opacity: 0,
    fillOpacity: 0,
    radius: 3000,
    title: "searchedLocation"
  })
  .addTo(mymap)
  .bindPopup("<b>" + "searchedLocation" + "</b>");

const myCustomMarker = {
  icon: new L.Icon({
    iconUrl: './images/searchedMarker.png',    
    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
  }),
  draggable: false,
}

//sets up search controls and attaches search bar to map
const searchControl = new GeoSearchControl({
  marker : myCustomMarker,
  style: 'bar',
  provider: new OpenStreetMapProvider()
});
mymap.addControl(searchControl);


//moves circle when the event (searching for a location) is triggered
mymap.on('geosearch/showlocation', function (result) {
  searchedMarker.setLatLng( L.latLng(result.location.y, result.location.x))
  searchedMarker.setStyle({opacity: 0.5, fillOpacity: 0.3})
  getAllDistance()
});

function sliderListerner(){
  getAllDistance()
}

//find markers within the radius of circle center. radius is convertered from meters to miles
function getAllDistance(){
  var center = searchedMarker
  var withinDistance = []
  markers.forEach(marker => {
    if (getDistance(center, marker) <= center._mRadius/1000){
      withinDistance.push([marker, getDistance(center, marker)])
    }
  })
  findShortestDistance(withinDistance)
}

//find distance between 2 markers and convers distance from miles to miles
function getDistance(from, to){
  var distance = from._latlng.distanceTo(to._latlng)
  return distance/1000
}

//find closest markers and lists them in top 5 table
function findShortestDistance(withinDistance){
  //sorts distances of markers from shortest to longest
  var result = withinDistance.sort(function(a, b){ return a[1] - b[1] })
  console.log("closest markers are :", result)
  
  for (i = 1; i <= 5; i++){
    if(i <= result.length){
      top5Table[i].innerHTML = result[i-1][0].options.title
    }else{
      top5Table[i].innerHTML = "No gyms found"
    }
  }

}


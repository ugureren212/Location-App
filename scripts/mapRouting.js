document.getElementById("userLocationbtn").addEventListener("click", findUserLocation)
// document.getElementById("addNewGym").addEventListener("click", findNewGymLocation)
document.getElementById("myRoutebtn").addEventListener("click", myRoutebtn)

//check to see if a Routing.Control has already been created
//if it does exist we do not need to create another Routing.Control
//we just set new wave points rather than creating a new route controller
var check = false;

///////////////////////////////////////////////////////////////////////
//Creating interactive map
///////////////////////////////////////////////////////////////////////

//creates map & tiles
var mymap = L.map('mapid').setView([51.7534,0.0874], 12);

//created leafletjs interactive map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidWd1cmVyZW4yMiIsImEiOiJja2s1eXkzZjIxem5qMnZwYzFqZG10bWdxIn0.S4zARwdhc4YcjxAl6BbG3w', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
maxZoom: 18,
id: 'mapbox/streets-v11',
tileSize: 512,
zoomOffset: -1,
accessToken: 'pk.eyJ1IjoidWd1cmVyZW4yMiIsImEiOiJja2s1eXkzZjIxem5qMnZwYzFqZG10bWdxIn0.S4zARwdhc4YcjxAl6BbG3w'
}).addTo(mymap);

//creating empy markers array to store recieved locations and placing them on map
var markers = [];
var currentUserMarker = []

var userIcon = L.icon({
    iconUrl: './images/userMarker.png',    
    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});



///////////////////////////////////////////////////////////////////////
//Methods for finding and creating markers
///////////////////////////////////////////////////////////////////////

//create promise and sends results to createMarker() to avoid returning values from promise errors
function findNewGymLocation(){
    var locationPromise = getLocation();
    locationPromise
        .then((loc) => {createCurrentGymMarker(loc)})
        .catch((err) => {console.log("No location or minor code error"); });
}

function findUserLocation(){
    var locationPromise = getLocation();
    locationPromise
        .then((loc) => {createUserLocMarker(loc)})
        .catch((err) => {console.log("No location or minor code error"); });
}

//find geolocation and creates new marker of current position
function getLocation(callback){
    var promise = new Promise(function(resolve, reject) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve(L.latLng(position.coords.latitude, position.coords.longitude))
                },
                (err) =>{
                    alert("(╯°□°)╯︵ ┻━┻   Location cannot be found. Please accept GEO location tracking.")
                    console.warn(`ERROR(${err.code}): ${err.message}`);
                }
            );
        } else {
            reject("Your browser does not support GEO location tracking");
        }
    })
    return promise;
}

function createCurrentGymMarker(loc){
    var currentMarker = L.marker(loc,
    {
        title: "Current New Gym Location" //change name to new gym
    })
    .addTo(mymap)
    .bindPopup("Current New Gym Location");

    markers.push(currentMarker)
    console.log("current new gym geolocation marker created and added to array of markers")
}  

function createUserLocMarker(loc){
    var currentMarker = L.marker(loc,
    {
        icon : userIcon,
        title: "Current User Location"
    })
    .addTo(mymap)
    .bindPopup("Current User Location");

    if (currentUserMarker.length != 0){
        while(currentMarker.length > 0) {
            currentMarker.pop();
        }
    } else{
        currentUserMarker.push(currentMarker)
    }
    
    // markers.push(currentMarker) --> not going to push in saved markers array
    console.log("current user geolocation marker created and added to array of markers")
}  

///////////////////////////////////////////////////////////////////////
//Marker managment functions
///////////////////////////////////////////////////////////////////////


function getOpenMarker(){
    //finds the open marker from markers array
    for (i = 0; i < markers.length; i++) {
        if (markers[i].isPopupOpen()){
            return markers[i]
        }
    }
}

function getCurrentPosMarker() {
    if (currentUserMarker.length != 0){
        return currentUserMarker[0]
    } else{
        console.log("There is no user location recorded")
    }
}

// function getCurrentPosMarker(){
//     //gets marker/position with the title of "current location" from array of markers
//     if(currentUserMarker.find(marker => marker.options.title === "Current User Location" )){
//         currentMarker = currentUserMarker.find(marker => marker.options.title === "Current User Location");
//         console.log("current potistion found ", currentMarker._latlng.lat, currentMarker._latlng.lng);
//         return currentMarker
//     }else{
//         console.log("current position not found")
//     }
// }

///////////////////////////////////////////////////////////////////////
//Routing functionality
///////////////////////////////////////////////////////////////////////


function myRoutebtn(){
    if (currentUserMarker.length == 0){
        alert("Please find your location by clicking on \"Find My Location\" button.")
    }else{
        var currentDestination = getOpenMarker()
        var getUserPosition = getCurrentPosMarker()

        if(check === false){
        //creates a route from current location to a marker with the pop up open
        markers.forEach(marker => {
            if (marker.isPopupOpen()){
                console.log("Destination has been selected at ", marker._latlng.lat, marker._latlng.lng)
                routeControl = L.Routing.control({
                    createMarker: function() { return null; }, //stops routing machine from adding markers
                    waypoints: [
                    L.latLng(getUserPosition._latlng.lat, getUserPosition._latlng.lng),
                    L.latLng(currentDestination._latlng.lat, currentDestination._latlng.lng)
                    ],
                    vehicle: 'foot'
                }).addTo(mymap);
                }
            })
            check = true;
            }else{ 
                console.log("destination changed to ",currentDestination._latlng.lat, currentDestination._latlng.lng)
                routeControl.getPlan().setWaypoints([
                    L.latLng(getUserPosition._latlng.lat, getUserPosition._latlng.lng),
                    L.latLng(currentDestination._latlng.lat, currentDestination._latlng.lng)
                ])
        }
    }
} 


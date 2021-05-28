
jQuery(document).ready(function () {

    jQuery.ajax({
        url: "http://localhost:3000/gym/get", success: function (result) {

        }
    }).done(function(result) {
        console.log("Loading locations from DB --> ", result);
        result.forEach(loc  => {
            let temp = L.marker(L.latLng(loc.lat, loc.lon), {title: loc.name})
            markers.push(temp)
        })
        markers.forEach(marker => marker
            .addTo(mymap)
            .bindPopup("<b>" + marker.options.title + "</b>"));
        
    });

    // Get Gyms
    jQuery("#getGymBtn").click(function () {
        jQuery.ajax({
            url: "http://localhost:3000/gym/get", success: function (result) {
                // gyms = result;
                console.log("get gym suceffull")
            }
        });
    });

    // Add new gym
    jQuery("#addNewGym").click(function (event) {

        event.preventDefault();

        function firstFunction(callback){
            callback()
        }

        function secondFunction(){
            // let name = jQuery("#name").val();
            // let lat = parseFloat(jQuery("#lat").val());
            // let lon = parseFloat(jQuery("#lat").val());
            // let data = { "name": name, "lat": lat, "lon": lon };

            // console.log("this is the data ", data);

            firstFunction(function(){ 
                var locationPromise = getLocation();
                locationPromise
                    .then((loc) => {
                        createCurrentGymMarker(loc); 
                        let data = {"name" : "Current New Gym Location", "lat": loc.lat, "lon": loc.lng}

                        $.ajax({
                            type: 'POST',
                            url: "http://localhost:3000/gym/add",
                            data: JSON.stringify(data),
                            contentType: 'application/json',
                            success: function (resultData) { console.log(resultData); }
                        });
                    })
                    .catch((err) => {console.log("No location or minor code error"); });
            })
        }

        secondFunction()
   
    });
});




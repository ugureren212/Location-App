var slider = document.getElementById("myRange");
var output = document.getElementById("radius");
output.innerHTML = slider.value;
var sliderRadius =  2 

slider.oninput = function() {
    output.innerHTML = this.value;
    sliderRadius = parseInt(output.innerHTML = this.value);
    searchedMarker.setRadius(sliderRadius*1000)
    console.log("new radius ", searchedMarker)
    sliderListerner()
}

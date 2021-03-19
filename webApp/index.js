// TODO:: for actual request if going there is larger than going back and going back is showing, alert
let map;
let lat = 36.67998425155742;
let lon = -121.66129198121926;
let fromAutocomplete;
let toAutocomplete;
let directionsService;
let directionsRenderer;
let prev_from = "";
let prev_to = "";
let prev_gtd = 0;
let sunMarkers = [];
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: lat, lng: lon},
        zoom: 8,
        mapTypeControl: false
    });
    fromAutocomplete = new google.maps.places.Autocomplete(document.getElementById("from"),
    {
        componentRestrictions: {'country' : ['us']},
        fields: ['geometry', 'name', 'adr_address', 'place_id'],
        types: ['geocode', 'establishment'],
    });
    toAutocomplete = new google.maps.places.Autocomplete(document.getElementById("to"),
    {
        componentRestrictions: {'country' : ['us']},
        fields: ['geometry', 'name', 'adr_address', 'place_id'],
        types: ['geocode', 'establishment'],
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const elevator = new google.maps.ElevationService();
    //const infowindow = new google.maps.InfoWindow({});
    map.addListener("click", (clickEvent) =>{
        latLngJSON = clickEvent.latLng.toJSON();
        lat = latLngJSON.lat;
        lon = latLngJSON.lng;

        elevator.getElevationForLocations(
            {
                locations: [clickEvent.latLng]
            },
            (results, status) => {
                if(status == "OK" && results){
                    let currentDateObj = new Date(Date.now());
                    let date = currentDateObj.getUTCFullYear().toString() + '-' + currentDateObj.getUTCMonth().toString() + '-' + currentDateObj.getUTCDate().toString(); 
                    let time = currentDateObj.getUTCHours().toString() + ':' + currentDateObj.getUTCMinutes().toString() + ':' + currentDateObj.getUTCSeconds().toString();
                    //TODO:: modify call to get sun position instead
                    let spa_url = 'http://localhost:3000/spa/' + date + '/' + time + '/' + lat.toString() + '/' + lon.toString() + '/' + results[0].elevation.toString();
                    console.log('url ' + spa_url );
                    let spaHttp = new XMLHttpRequest();
                    //TODO:: rewrite with promise, third param false for synchronous 
                    spaHttp.open("Get", spa_url);
                    spaHttp.send();
                    //TODO:: Add function for spaHttp readyState = 4 to process results
                    
                    //console.log("response of weather: " + spaHttp.responseText);
                    
                    //url = 'localhost:4000/spa/' + date + '/' + time + '/' + lat + '/' + lon + '/' + results[0].elevation + 
                }
                else if (status == "INVALID_REQUEST"){
                    console.log("Invalid request");
                }
                else{
                    console.log("other issue with request");
                }
            }
            
        );
        
    });
    fromAutocomplete.addListener("place_changed", ()=>{
        let place = fromAutocomplete.getPlace();
        // user did not click on a place
        if(place.geometry){
            document.getElementById("from").innerHTML = place.name;
        }
    });
    toAutocomplete.addListener("place_changed", ()=>{
        let place = toAutocomplete.getPlace();
        // user did not click on a place
        if(place.geometry){
            document.getElementById("to").innerHTML = place.name;
        }
    });
}
function calcRoute(departDate) {
    console.log(departDate);
    let start = document.getElementById('from').value;
    let end = document.getElementById('to').value;
    let nowCheckbox = document.getElementById('current-time-checkbox');
    // Only run route if the data in from or to is changed
    /* UNCOMMENT CODE ONCE DEBUGING IS DONE (with calling calcRoute for different times)
    if((start != "" && end != "") && (start != prev_from || end != prev_to || (nowCheckbox.checked == false && prev_gtd != departDate.getTime()))){
        let request = {
            origin: start,
            destination: end,
            travelMode: 'DRIVING', 
            drivingOptions: {
                departureTime: departDate
            }
        };
        directionsService.route(request, (result, status) => {
            if(status == 'OK'){
                directionsRenderer.setDirections(result);
                // if the status is okay then clear the markers and add new ones to the map
                // TODO:: adjust to multiple routes once implemented
                // doing every other node
                clearMarkers();
                for(let i = 0; i < result.routes[0].overview_path.length - 1; i+=2){
                    let lat = result.routes[0].overview_path[i].lat();
                    let lng = result.routes[0].overview_path[i].lng();
                    sunMarkers.push(new google.maps.Marker({
                        position: {lat: lat, 
                            lng: lng},
                        map, 
                        title: `lat: ${lat} lng: ${lng}`
                    }));
                }
            }
        });        
    }
    prev_from = start;
    prev_to = end;
    prev_gtd = departDate.getTime();
    */
}
function getValueWithZero(value){
    return value < 10 ? '0' + value : value;
}
function setDefaultTime(){
    let now = new Date();
    // set times for "Going There At"
    document.getElementById("hour-going-there").value = getValueWithZero(Math.max(now.getHours(), 1) % 12);
    document.getElementById("minute-going-there").value = getValueWithZero(now.getMinutes());    
    document.getElementById("going-there-am-pm").value = now.getHours() > 12 ? "PM" : "AM";
    document.getElementById("month-going-there").value = getValueWithZero(now.getMonth() + 1); 
    document.getElementById("day-going-there").value = getValueWithZero(now.getDate());
    document.getElementById("year-going-there").value = now.getFullYear();

    now.setMinutes(now.getMinutes() + 60);

    document.getElementById("hour-going-back").value = getValueWithZero(Math.max(now.getHours(), 1) % 12);
    document.getElementById("minute-going-back").value = getValueWithZero(now.getMinutes());    
    document.getElementById("going-back-am-pm").value = now.getHours() > 12 ? "PM" : "AM";
    document.getElementById("month-going-back").value = getValueWithZero(now.getMonth() + 1); 
    document.getElementById("day-going-back").value = getValueWithZero(now.getDate());
    document.getElementById("year-going-back").value = now.getFullYear();
    

}
// Whenever page is loading set the default values
document.addEventListener('readystatechange', (event) => {
    if(event.target.readyState == 'interactive'){
        document.getElementById("current-time-checkbox").checked = true;
        document.getElementById("there-and-back-checkbox").checked = false;
        document.getElementById("going-there-at-wrapper").hidden = true;
        document.getElementById("going-there-at-wrapper").hidden = true;
        setDefaultTime();
    }
});
function flipHoverOn() {
    var verticalLineClass = document.getElementsByClassName('vertical-line');
    var arrowClass = document.getElementsByClassName('arrow');
    for(let i = 0; i < verticalLineClass.length; i++){
        verticalLineClass[i].style.background = '#3770ff';
    }
    for(let i = 0; i < arrowClass.length; i++){
        arrowClass[i].style.border = 'solid #3770ff';
        arrowClass[i].style.borderWidth = '0 2px 2px 0';
    }
}
function flipHoverOff() {
    var verticalLineClass = document.getElementsByClassName('vertical-line');
    var arrowClass = document.getElementsByClassName('arrow');
    for(let i = 0; i < verticalLineClass.length; i++){
        verticalLineClass[i].style.background = 'black';
    }
    for(let i = 0; i < arrowClass.length; i++){
        arrowClass[i].style.border = 'solid black';
        arrowClass[i].style.borderWidth = '0 2px 2px 0';
    }
}

function clearMarkers() {
    for (let i = 0; i < sunMarkers.length; i++){
        sunMarkers[i].setMap(null);
    }
}
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
let elevator;
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

    elevator = new google.maps.ElevationService();

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
    let start = document.getElementById('from').value;
    let end = document.getElementById('to').value;
    let nowCheckbox = document.getElementById('current-time-checkbox');

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
                console.log(result);

                // input data to send in json to backend
                let latLngSend = [];
                let dateSend = [];

                let deltaDuration = 0;
                // if the status is okay then clear the markers and add new ones to the map
                // TODO:: adjust to multiple routes once implemented
                // doing every other node
                clearMarkers();
                // Assuming only best route first (result.routes[0])
                // Loop through each leg 
                for(let i = 0; i < result.routes[0].legs.length; i++){
                    // within each leg loop through all the steps
                    for(let j = 0; j < result.routes[0].legs[i].steps.length; j++){
                        let currStep = result.routes[0].legs[i].steps[j];
                        let incrementInStep = currStep.lat_lngs.length > 10 ? Math.floor(currStep.lat_lngs.length / 10) : 1;
                        deltaDuration += currStep.duration["value"];
                        // will never use more than 10 points in each step 
                        for(let k = 0; k < currStep.lat_lngs.length; k += incrementInStep){
                            let lati = currStep.lat_lngs[k].lat();
                            let lngi = currStep.lat_lngs[k].lng();
                            // confirm this is a number
                            latLngSend.push({lat: lati, lng: lngi});
                            let datePush = new Date(departDate.getTime());
                            datePush.setSeconds(datePush.getSeconds() + deltaDuration);
                            dateSend.push(datePush);
                        }
                    }
                }
                console.log(latLngSend);
                elevator.getElevationForLocations(
                    {
                        locations: latLngSend
                    },
                    (elevResults, status) =>{
                        // use the location from the elevResults for the request
                        // if dateSend.length does not match elevResults.length then use departDate for request
                        if(status == "OK" && elevResults){
                            // if there is a discrepency between the two lengths then use the departDate 
                            if(elevResults.length == dateSend.length){
                                let locAndTimeSend = {locAndTime: []};
                                for(let i = 0; i < elevResults.length; i++){
                                    // converted to utc string that pandas object can be declared
                                    let dt = dateSend[i].getUTCFullYear() + '-' + lessThanTenString(dateSend[i].getUTCMonth())  + 
                                    '-' + lessThanTenString(dateSend[i].getUTCDate()) + ' ' + lessThanTenString(dateSend[i].getUTCHours()) + ':'
                                         + lessThanTenString(dateSend[i].getUTCMinutes()) + ':' + lessThanTenString(dateSend[i].getUTCSeconds());
                                    locAndTimeSend.locAndTime.push({
                                        lat: elevResults[i].location.lat(),
                                        lng: elevResults[i].location.lng(),
                                        elevation: elevResults[i].elevation,
                                        date: dt 
                                    });
                                }
                                let spa_url = "http://localhost:3000/spaDateTime";
                                let spaHttp = new XMLHttpRequest();
                                spaHttp.open("POST", spa_url);
                                spaHttp.setRequestHeader("Content-Type", "application/json");
                                // what to do when request is done

                                spaHttp.onload = ()=>{
                                  setSunMarkers(JSON.parse(spaHttp.responseText), sunMarkers);  
                                };
                                spaHttp.send(JSON.stringify(locAndTimeSend));
                            }
                            // TODO:: send a similar request with the same date
                            else{
                                let dt = departDate.getUTCFullYear() + '-' + lessThanTenString(departDate.getUTCMonth())  + 
                                    '-' + lessThanTenString(departDate.getUTCDate()) + ' ' + lessThanTenString(departDate.getUTCHours()) + ':'
                                         + lessThanTenString(departDate.getUTCMinutes()) + ':' + lessThanTenString(departDate.getUTCSeconds());
                                let locSend = {date: dt, location: []};
                               for(let i = 0; i < elevResults.length; i++){
                                   locSend.location.push({
                                        lat: elevResults[i].location.lat(),
                                        lng: elevResults[i].location.lng(),
                                        elevation: elevResults[i].elevation
                                    });
                               } 
                               let spa_url = "http://localhost:3000/spaSameTime";
                               let spaHttp = new XMLHttpRequest();
                               spaHttp.open("POST", spa_url);
                               spaHttp.setRequestHeader("Content-Type", "application/json");

                                spaHttp.onload = ()=>{
                                    setSunMarkers(JSON.parse(spaHttp.responseText), sunMarkers);  
                                };

                               spaHttp.send(JSON.stringify(locSend));
                            }
                        }
                        else if(status == "INVALID_REQUEST"){
                            console.log("Invalid Elevation request, check coordinates being sent");
                        }
                        else{
                            console.log("other issue with request");
                        }
                    }
                )
                console.log('stop');
            }
        });        
    }
    prev_from = start;
    prev_to = end;
    prev_gtd = departDate.getTime();
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
function lessThanTenString(num){
    return num < 10 ? '0' + num : num.toString();
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
function setSunMarkers(jsonInput, marker){
    for(let i = 0; i < jsonInput.length; i++){
        marker.push(new google.maps.Marker({
           position: {lat: parseFloat(jsonInput[i]['lat']),
                lng: parseFloat(jsonInput[i]['lng'])},
            map,
            title: `Sun Elevation: ${jsonInput[i]['elevation']}, Azimuth: ${jsonInput[i]['azimuth']}, lat: ${jsonInput[i]['lat']}, lng: ${jsonInput[i]['lng']}`}));
    }
}
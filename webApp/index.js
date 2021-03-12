// TODO:: for actual request if going there is larger than going back and going back is showing, alert
let map;
let lat = 36.67998425155742;
let lon = -121.66129198121926;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: lat, lng: lon},
        zoom: 8,
        mapTypeControl: false
    });

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
                    console.log('lat: ' + lat + ' lon: ' + lon + ' elevation: ' + results[0].elevation + 'm');
                    let currentDateObj = new Date(Date.now());
                    let date = currentDateObj.getUTCFullYear().toString() + '-' + currentDateObj.getUTCMonth().toString() + '-' + currentDateObj.getUTCDate().toString(); 
                    let time = currentDateObj.getUTCHours().toString() + ':' + currentDateObj.getUTCMinutes().toString() + ':' + currentDateObj.getUTCSeconds().toString();
                    //TODO:: modify call to get sun position instead
                    let spa_url = 'http://localhost:3000/spa/' + date + '/' + time + '/' + lat.toString() + '/' + lon.toString() + '/' + results[0].elevation.toString();
                    console.log('url ' + spa_url );
                    let spaHttp = new XMLHttpRequest();
                    //TODO:: rewrite with promise
                    spaHttp.open("Get", spa_url, false);
                    spaHttp.send();
                    console.log("response of weather: " + spaHttp.responseText);
                    
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
}
function getValueWithZero(idName, value){
    return value < 10 ? '0' + value : value;
}
function setDefaultTime(){
    let now = new Date();
    // set times for "Going There At"
    document.getElementById("hour-going-there").value = getValueWithZero("hour-going-there", now.getHours() % 12);
    document.getElementById("minute-going-there").value = getValueWithZero("minute-going-there", now.getMinutes());    
    document.getElementById("going-there-am-pm").value = now.getHours() > 12 ? "PM" : "AM";
    document.getElementById("month-going-there").value = getValueWithZero("month-going-there", now.getMonth()); 
    document.getElementById("day-going-there").value = getValueWithZero("day-going-there", now.getDay());
    document.getElementById("year-going-there").value = now.getFullYear();

    now.setMinutes(now.getMinutes() + 60);

    document.getElementById("hour-going-back").value = getValueWithZero("hour-going-back", now.getHours() % 12);
    document.getElementById("minute-going-back").value = getValueWithZero("minute-going-back", now.getMinutes());    
    document.getElementById("going-back-am-pm").value = now.getHours() > 12 ? "PM" : "AM";
    document.getElementById("month-going-back").value = getValueWithZero("month-going-back", now.getMonth()); 
    document.getElementById("day-going-back").value = getValueWithZero("day-going-back", now.getDay());
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
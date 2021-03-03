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
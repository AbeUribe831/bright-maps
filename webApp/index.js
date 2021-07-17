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

const listOfTimeZones = [
    {
        "label":"Pacific/Midway (GMT-11:00)",
		"tzCode":"Pacific/Midway",
		"name":"(GMT-11:00) SST",
		"utc":"-11:00"
    },
    {
		"label":"Pacific/Honolulu (GMT-10:00)",
		"tzCode":"Pacific/Honolulu",
		"name":"(GMT-10:00) HST",
		"utc":"-10:00"
	},
    {
		"label":"Pacific/Marquesas (GMT-09:30)",
		"tzCode":"Pacific/Marquesas",
		"name":"(GMT-09:30) Taiohae",
		"utc":"-09:30"
	},
    {
		"label":"America/Adak (GMT-09:00)",
		"tzCode":"America/Adak",
		"name":"(GMT-09:00) HDT",
		"utc":"-09:00"
	},
    {
		"label":"America/Anchorage (GMT-08:00)",
		"tzCode":"America/Anchorage",
		"name":"(GMT-08:00) AKDT",
		"utc":"-08:00"
	},
    {
		"label":"America/Los Angeles (GMT-07:00)",
		"tzCode":"America/Los_Angeles",
		"name":"(GMT-07:00) PDT",
		"utc":"-07:00"
	},
    {
		"label":"America/Denver (GMT-06:00)",
		"tzCode":"America/Denver",
		"name":"(GMT-06:00) MDT",
		"utc":"-06:00"
	},
    {
		"label":"America/Atikokan (GMT-05:00)",
		"tzCode":"America/Atikokan",
		"name":"(GMT-05:00) CDT",
		"utc":"-05:00"
	},
    {
		"label":"America/AnguillaSandy Hill (GMT-04:00)",
		"tzCode":"America/AnguillaSandy Hill",
		"name":"(GMT-04:00) EDT",
		"utc":"-04:00"
	},
    {
		"label":"America/St_Johns (GMT-03:30)",
		"tzCode":"America/St_Johns",
		"name":"(GMT-03:30) St. John's",
		"utc":"-03:30"
	},
    {
		"label":"America/Araguaina (GMT-03:00)",
		"tzCode":"America/Araguaina",
		"name":"(GMT-03:00) ADT",
		"utc":"-03:00"
	},
    {
		"label":"America/Noronha (GMT-02:00)",
		"tzCode":"America/Noronha",
		"name":"(GMT-02:00) WGST",
		"utc":"-02:00"
	},
    {
		"label":"America/Scoresbysund (GMT-01:00)",
		"tzCode":"America/Scoresbysund",
		"name":"(GMT-01:00) CVT",
		"utc":"-01:00"
	},
    {
		"label":"Europe/London (GMT+00:00)",
		"tzCode":"Europe/London",
		"name":"(GMT+00:00) GMT",
		"utc":"+00:00"
	},
    {
		"label":"Europe/Berlin (GMT+01:00)",
		"tzCode":"Europe/Berlin",
		"name":"(GMT+01:00) BST",
		"utc":"+01:00"
	},
    {
		"label":"Europe/Helsinki (GMT+02:00)",
		"tzCode":"Europe/Helsinki",
		"name":"(GMT+02:00) CAT",
		"utc":"+02:00"
	},
    {
		"label":"Europe/Moscow (GMT+03:00)",
		"tzCode":"Europe/Moscow",
		"name":"(GMT+03:00) EAT",
		"utc":"+03:00"
	},
    {
		"label":"Asia/Tehran (GMT+03:30)",
		"tzCode":"Asia/Tehran",
		"name":"(GMT+03:30) Tehran",
		"utc":"+03:30"
	},
    {
		"label":"Asia/Dubai (GMT+04:00)",
		"tzCode":"Asia/Dubai",
		"name":"(GMT+04:00) GST",
		"utc":"+04:00"
	},
    {
		"label":"Asia/Kabul (GMT+04:30)",
		"tzCode":"Asia/Kabul",
		"name":"(GMT+04:30) Kabul",
		"utc":"+04:30"
	},
    {
		"label":"Asia/Aqtau (GMT+05:00)",
		"tzCode":"Asia/Aqtau",
		"name":"(GMT+05:00) YEKT",
		"utc":"+05:00"
	},
    {
		"label":"Asia/Colombo (GMT+05:30)",
		"tzCode":"Asia/Colombo",
		"name":"(GMT+05:30) Colombo",
		"utc":"+05:30"
	},
    {
		"label":"Asia/Kathmandu (GMT+05:45)",
		"tzCode":"Asia/Kathmandu",
		"name":"(GMT+05:45) Kathmandu",
		"utc":"+05:45"
	},
    {
		"label":"Asia/Almaty (GMT+06:00)",
		"tzCode":"Asia/Almaty",
		"name":"(GMT+06:00) KGT",
		"utc":"+06:00"
	},
    {
		"label":"Asia/Yangon (GMT+06:30)",
		"tzCode":"Asia/Yangon",
		"name":"(GMT+06:30) Yangon",
		"utc":"+06:30"
	},
    {
		"label":"Asia/Bangkok (GMT+07:00)",
		"tzCode":"Asia/Bangkok",
		"name":"(GMT+07:00) KRAT",
		"utc":"+07:00"
	},
    {
		"label":"Asia/Brunei (GMT+08:00)",
		"tzCode":"Asia/Brunei",
		"name":"(GMT+08:00) CST",
		"utc":"+08:00"
	},
    {
		"label":"Australia/Eucla (GMT+08:45)",
		"tzCode":"Australia/Eucla",
		"name":"(GMT+08:45) Eucla",
		"utc":"+08:45"
	},
    {
		"label":"Asia/Tokyo (GMT+09:00)",
		"tzCode":"Asia/Tokyo",
		"name":"(GMT+09:00) YAKT",
		"utc":"+09:00"
	},
    {
		"label":"Australia/Adelaide (GMT+09:30)",
		"tzCode":"Australia/Adelaide",
		"name":"(GMT+09:30) Adelaide",
		"utc":"+09:30"
	},
    {
		"label":"Australia/Melbourne (GMT+10:00)",
		"tzCode":"Australia/Melbourne",
		"name":"(GMT+10:00) AEST",
		"utc":"+10:00"
	},
    {
		"label":"Australia/Lord_Howe (GMT+10:30)",
		"tzCode":"Australia/Lord_Howe",
		"name":"(GMT+10:30) Lord Howe",
		"utc":"+10:30"
	},
    {
		"label":"Pacific/Bougainville (GMT+11:00)",
		"tzCode":"Pacific/Bougainville",
		"name":"(GMT+11:00) SRET",
		"utc":"+11:00"
	},
    {
		"label":"Pacific/Fiji (GMT+12:00)",
		"tzCode":"Pacific/Fiji",
		"name":"(GMT+12:00) NZST",
		"utc":"+12:00"
	},
    {
		"label":"Pacific/Chatham (GMT+12:45)",
		"tzCode":"Pacific/Chatham",
		"name":"(GMT+12:45) Waitangi",
		"utc":"+12:45"
	},
    {
		"label":"Pacific/Enderbury (GMT+13:00)",
		"tzCode":"Pacific/Enderbury",
		"name":"(GMT+13:00) Enderbury",
		"utc":"+13:00"
	},
    {
		"label":"Pacific/Kiritimati (GMT+14:00)",
		"tzCode":"Pacific/Kiritimati",
		"name":"(GMT+14:00) Kiritimati",
		"utc":"+14:00"
	}
];
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: lat, lng: lon},
        zoom: 8,
        mapTypeControl: false
    });
        //componentRestrictions: {'country' : ['us']},
    fromAutocomplete = new google.maps.places.Autocomplete(document.getElementById("from"),
    {
        fields: ['geometry', 'name', 'adr_address', 'place_id'],
        types: ['geocode', 'establishment'],
    });
        //componentRestrictions: {'country' : ['us']},
    toAutocomplete = new google.maps.places.Autocomplete(document.getElementById("to"),
    {
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
    if((start != "" && end != "") && (start != prev_from || end != prev_to || (nowCheckbox.checked == false && prev_gtd != departDate))){
        var currentDate = new Date()
        let request = {
            origin: start,
            destination: end,
            travelMode: 'DRIVING', 
            drivingOptions: {
                departureTime: departDate
            }
        }
        directionsService.route(request, (result, status) => {
            if(status == 'OK'){
                directionsRenderer.setDirections(result);

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
                        let interval;
                        // 3218 is number of meters in two miles
                        if(currStep.distance.value < 3218){
                            interval = currStep.lat_lngs.length - 1;
                        }
                         // interval in a per mile basis
                         else{
                            interval = Math.floor(((currStep.lat_lngs.length * 1609) / currStep.distance.value) - 1);
                        }
                        deltaDuration += currStep.duration["value"];
                        // TODO:: adjust the time for every mile based on speed limit
                        for(let k = 0; k < currStep.lat_lngs.length; k += interval){
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
                // Send packet in intervals of 500 latlng points
                // TODO:: deal with long distances like Salinas, CA to Austin, this will exceed to query limit
                while(latLngSend.length != 0){
                    let splicedLatLngSend = latLngSend.splice(0, 500);
                    let splicedDateSend = dateSend.splice(0, 500);
                    elevator.getElevationForLocations(
                        {
                            locations: splicedLatLngSend
                        },
                        (elevResults, status) => {
                            // use the location from the elevResults for the request
                            // if splicedDateSend.length does not match elvResults.length then use departDate for request
                            if(status == "OK" && elevResults) {
                                // if there is a discrepency between the two lengths then use the departDate
                                if(elevResults.length == splicedDateSend.length) {
                                    //
                                    let locAndTimeSend = {
                                        loc_and_time: [],
                                        utc_offset: new Date().toString().match(/(GMT){1}[+-]{1}\d{4}/g)[0].substring(3)
                                    };
                                    for(let i = 0; i < splicedDateSend.length; i++){
                                        let month = Math.min(splicedDateSend[i].getMonth() + 1, 12);
                                        // pass local date and time to server
                                        locAndTimeSend.loc_and_time.push({
                                            lat: splicedLatLngSend[i].lat,
                                            lng: splicedLatLngSend[i].lng,
                                            elevation: elevResults[i].elevation,
                                            date: {
                                                year: splicedDateSend[i].getFullYear(),
                                                month: lessThanTenString(month),
                                                day: lessThanTenString(splicedDateSend[i].getDate()),
                                                hour: lessThanTenString(splicedDateSend[i].getHours()),
                                                minute: lessThanTenString(splicedDateSend[i].getMinutes()),
                                                second: lessThanTenString(splicedDateSend[i].getSeconds())
                                            }
                                        });
                                    }   
                                    let spa_url = "http://ec2-18-144-44-178.us-west-1.compute.amazonaws.com/demoSunriseSunset";
                                    let spaHttp = new XMLHttpRequest();
                                    spaHttp.open("POST", spa_url);
                                    spaHttp.setRequestHeader("Content-Type", "application/json");
                                    // what to do when request is done
                                    spaHttp.onload = ()=>{
                                        setSunMarkers(JSON.parse(spaHttp.responseText), sunMarkers);  
                                    };
                                    spaHttp.send(JSON.stringify(locAndTimeSend));          
                                }
                                    // TODO:: what to do when elevation is not equal
                                    else {
                                        console.log("elevation results does not match");
                                    }
                                }
                                else if(status == "INVALID_REQUEST") {
                                    console.log("Invalid Elevation request, check coordinates being sent");
                                }
                                else {
                                    console.log("other issue with request");
                                }
                        }
                    )

                }
            }
            else if(status == "INVALID_REQUEST") {
                alert('problem with request, make sure date and time is not in the past');
            }
            else if(status == "ZERO_RESULTS") {
                alert('no results occur, this app is only for driving routes, other types of routes not avaible now');
            }
        });        
    }
    prev_from = start;
    prev_to = end;
    prev_gtd = departDate;
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

}
function lessThanTenString(num){
    return num < 10 ? '0' + num : num.toString();
}
// Whenever page is loading set the default values
document.addEventListener('readystatechange', (event) => {
    if(event.target.readyState == 'interactive'){
        document.getElementById("current-time-checkbox").checked = true;
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
        sunsetBoolean = jsonInput[i]['glareAtSunset'] === "true";
        sunriseBoolean = jsonInput[i]['glareAtSunrise'] === "true";
        let message;
        if(sunsetBoolean === true) {
            message = "Glare caused by sunset";
        }
        else if(sunriseBoolean === true) {
            message = "Glare caused by sunrise";
        }
        else {
            message = "No glare at this point"; 
        }
        color = (sunsetBoolean  || sunriseBoolean) ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png" : "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
        let timestamp = new Date(jsonInput[i]['local_time']);
        marker.push(new google.maps.Marker({
           position: {lat: parseFloat(jsonInput[i]['lat']),
                lng: parseFloat(jsonInput[i]['lng'])},
            icon: {
                url: color
            },
            map,
            title: `lat: ${parseFloat(jsonInput[i]['lat']).toFixed(2)}, lng: ${parseFloat(jsonInput[i]['lng']).toFixed(2)}\n${message} around ${timestamp.getHours().toString().length == 1 ? '0' + timestamp.getHours() : timestamp.getHours()}:${timestamp.getMinutes().toString().length == 1 ? '0' + timestamp.getMinutes() : timestamp.getMinutes()}`
        }));
    }
}
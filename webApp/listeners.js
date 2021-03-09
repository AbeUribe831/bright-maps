// function that contains the logic for keeping time fields (hour/minute) in range
function _relevantTime(timeEl, max){
    // Case when input is a number
    if(!isNaN(timeEl.valueAsNumber)){
        curr = parseInt(timeEl.value);
        curr = curr < 1 ? 1 : curr;
        curr = curr > max ? max : curr;
        document.getElementById(timeEl.id).value = curr < 10 ? '0' + curr : curr;
    }
    // Default to 01 when not a number 
    else{
        document.getElementById(timeEl.id).value = "01";
    }
}


// callback function for keyboard events to keep hour in range (01-12)
// TODO:: adjust the max for either 12 or 24 our time
function relevantHourEvent(tEvent){
    timeEl = tEvent.target;
    if(tEvent.type.includes("focusout") || tEvent.key.includes("Enter")){
        _relevantTime(timeEl, 12);
    }
}

// callback function for keyboard events to keep minute in range (01-59)
function relevantMinEvent(tEvent){
    timeEl = tEvent.target;
    if(tEvent.type.includes("focusout") || tEvent.key.includes("Enter")){
        _relevantTime(timeEl, 59);
    }
}

// hour and minute listeners for focus out and clicking enter
// keeps input within range and defaults invalid times to 01 min or hour
document.getElementById("hour-going-there").addEventListener("keyup", relevantHourEvent);
document.getElementById("hour-going-there").addEventListener("focusout", relevantHourEvent);
document.getElementById("hour-going-back").addEventListener("keyup", relevantHourEvent);
document.getElementById("hour-going-back").addEventListener("focusout", relevantHourEvent);

document.getElementById("minute-going-there").addEventListener("keyup", relevantMinEvent);
document.getElementById("minute-going-there").addEventListener("focusout", relevantMinEvent);
document.getElementById("minute-going-back").addEventListener("keyup", relevantMinEvent);
document.getElementById("minute-going-back").addEventListener("focusout", relevantMinEvent);
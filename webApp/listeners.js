// function that contains the logic for keeping time fields (hour/minute) in range
function _relevantTime(timeEl, max){
    // Case when input is a number
    if(!isNaN(timeEl.valueAsNumber)){
        let elValue = timeEl.valueAsNumber;
        elValue = elValue < 1 ? 1 : elValue;
        elValue = elValue > max ? max : elValue;
        document.getElementById(timeEl.id).value = elValue < 10 ? '0' + elValue : elValue;
    }
    // Default to 01 when not a number 
    else{
        document.getElementById(timeEl.id).value = "01";
    }
}


// callback function for keyboard events to keep hour in range (01-12)
// TODO:: adjust the max for either 12 or 24 our time
function relevantHourEvent(tEvent){
    let timeEl = tEvent.target;
    if(tEvent.type.includes("focusout") || tEvent.key.includes("Enter")){
        _relevantTime(timeEl, 12);
    }
}

// callback function for keyboard events to keep minute in range (01-59)
function relevantMinEvent(tEvent){
    let timeEl = tEvent.target;
    if(tEvent.type.includes("focusout") || tEvent.key.includes("Enter")){
        _relevantTime(timeEl, 59);
    }
}

function relevantYearEvent(tEvent){
    if(tEvent.type.includes("focusout") || tEvent.key.includes("Enter")){
        let timeEl = tEvent.target;
        // checks that year is valid before writing
        if(!isNaN(timeEl.valueAsNumber) && (-2000 <= timeEl.valueAsNumber && timeEl.valueAsNumber <= 6000)){
            let elValueString = timeEl.value;
            if(timeEl.valueAsNumber >= 0)
                while(elValueString.length < 4)
                    elValueString = '0' + elValueString;
            else
                while(elValueString.length < 5)
                    elValueString = elValueString[0] + '0' + elValueString.substring(1, elValueString.length);
            document.getElementById(timeEl.id).value = elValueString;
        }
        // default current year of not valid
        else{
            document.getElementById(timeEl.id).valueAsNumber = new Date().getFullYear();
        }
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

document.getElementById("year-going-there").addEventListener("keyup", relevantYearEvent);
document.getElementById("year-going-there").addEventListener("focusout", relevantYearEvent);

document.getElementById("year-going-back").addEventListener("keyup", relevantYearEvent);
document.getElementById("year-going-back").addEventListener("focusout", relevantYearEvent);
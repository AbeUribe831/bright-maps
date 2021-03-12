// Februaru (2) is not included because of leap year
let monthMaxDays = {
    1: 31,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
};
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
    if(tEvent.type.includes("focusout") || tEvent.key.includes("Enter")){
        _relevantTime(tEvent.target, 12);
    }
}

// callback function for keyboard events to keep minute in range (01-59)
function relevantMinEvent(tEvent){
    if(tEvent.type.includes("focusout") || tEvent.key.includes("Enter")){
        _relevantTime(tEvent.target, 59);
    }
}
// TODO:: Consider making default month 01 or current
function relevantMonthEvent(tEvent){
    if(tEvent.type.includes("focusout") || tEvent.key.includes("Enter")){
        _relevantTime(tEvent.target, 12);
    }
}
// TODO:: Consider making default day 01 or current
function relevantDayEvent(tEvent) {
    if(tEvent.type.includes("focusout") || tEvent.key.includes("Enter")){
        let dayEl = tEvent.target;
        console.log(dayEl);
        // day is in range of [1, 31] without considering the particular month
        if(!isNaN(dayEl.valueAsNumber) && 1 <= dayEl.valueAsNumber){
            // get the cooresponding month value relative the to dayEl
            if(dayEl.attributes.id.value.includes("there"))
                var monthVal = parseInt(document.getElementById('month-going-there').value);
            else
                var monthVal = parseInt(document.getElementById("month-going-back").value);
            // case for month not being February
            // override day value if greater than it's month's max day or add a '0' in front when day < 10
            if(monthVal != 2){
                if(dayEl.valueAsNumber > monthMaxDays[monthVal]){
                    document.getElementById(dayEl.id).value = monthMaxDays[monthVal]
                } 
                else if(dayEl.valueAsNumber < 10){
                    document.getElementById(dayEl.id).value = dayEl.valueAsNumber < 10 ? '0' + dayEl.valueAsNumber : dayEl.valueAsNumber;
                }
            }
            // February get cooresponding year element to find correct max day
            else{
                if(dayEl.attributes.id.value.includes("there"))
                    var yearVal = document.getElementById("year-going-there").value;
                else{
                    var yearVal = document.getElementById("year-going-back").value;
                }
                let maxDay = parseInt(yearVal) % 4 == 0 ? 29 : 28;
                if(dayEl.valueAsNumber > maxDay)
                    document.getElementById(dayEl.id).value = maxDay;
                else
                    document.getElementById(dayEl.id).value = dayEl.valueAsNumber < 10 ? '0' + dayEl.valueAsNumber : dayEl.valueAsNumber;
            }
        }
        // Default day
        else{
            document.getElementById(dayEl.id).value = '01';
        }
    }
}
function relevantYearEvent(tEvent){
    if(tEvent.type.includes("focusout") || tEvent.key.includes("Enter")){
        let timeEl = tEvent.target;
        console.log(timeEl);
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

document.getElementById("month-going-there").addEventListener("keyup", relevantMonthEvent);
document.getElementById("month-going-there").addEventListener("focusout", relevantMonthEvent);
document.getElementById("month-going-back").addEventListener("keyup", relevantMonthEvent);
document.getElementById("month-going-back").addEventListener("focusout", relevantMonthEvent);

document.getElementById("day-going-there").addEventListener("keyup", relevantDayEvent);
document.getElementById("day-going-there").addEventListener("focusout", relevantDayEvent);
document.getElementById("day-going-back").addEventListener("keyup", relevantDayEvent);
document.getElementById("day-going-back").addEventListener("focusout", relevantDayEvent);

document.getElementById("current-time-checkbox").addEventListener("click", (tEvent)=>{
    document.getElementById("going-there-at-wrapper").hidden = !document.getElementById("going-there-at-wrapper").hidden;
});

document.getElementById("there-and-back-checkbox").addEventListener("click", (tEvent)=>{
    document.getElementById("going-back-at-wrapper").hidden = !document.getElementById("going-back-at-wrapper").hidden;
});
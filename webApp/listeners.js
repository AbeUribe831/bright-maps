class PrevTime {
    constructor(pYear=0, pMonth=0, pDay=0, pHour=0, pMin=0){
        this.pYear = pYear;
        this.pMonth = pMonth;
        this.pDay = pDay;
        this.pHour = pHour;
        this.pMin = pMin
    }
    setTime(year, month, day, hour, min){
        this.pYear = year;
        this.pMonth = month;
        this.pDay = day;
        this.pHour = hour;
        this.pMin = min;
    }
}
let pGoingThere = new PrevTime();
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
function _relevantTime(timeEl, min, max){
    // Case when input is a number
    if(!isNaN(timeEl.valueAsNumber)){
        let elValue = timeEl.valueAsNumber;
        elValue = elValue < min ? min : elValue;
        elValue = elValue > max ? max : elValue;
        //document.getElementById(timeEl.id).value = elValue < 10 ? '0' + elValue : elValue;
        timeEl.value =  elValue < 10 ? '0' + elValue : elValue;
    }
    // Default to 01 when not a number 
    else{
        //document.getElementById(timeEl.id).value = "01";
        timeEl.value = min < 10 ? '0' + min : min;
    }
}


// callback function for keyboard events to keep hour in range (01-12)
// TODO:: adjust the max for either 12 or 24 our time
function relevantHourEvent(tEvent){
    if(tEvent.type.includes("focusout") || tEvent.key.includes("Enter")){
        _relevantTime(tEvent.target, 1, 12);
        if(pGoingThere.pHour != tEvent.target.valueAsNumber){
            pGoingThere.pHour = tEvent.target.valueAsNumber;
            getRoute();
        }
    }
}

// callback function for keyboard events to keep minute in range (00-59)
function relevantMinEvent(tEvent){
    if(tEvent.type.includes("focusout") || tEvent.key.includes("Enter")){
        _relevantTime(tEvent.target, 0, 59);
        if(pGoingThere.pMin != tEvent.target.valueAsNumber){
            pGoingThere.pMin = tEvent.target.valueAsNumber;
            getRoute();
        }
    }
}
// TODO:: Consider making default month 01 or current
function relevantMonthEvent(tEvent){
    if(tEvent.type.includes("focusout") || tEvent.key.includes("Enter")){
        _relevantTime(tEvent.target, 1, 12);
        if(pGoingThere.pMonth != tEvent.target.valueAsNumber){
            pGoingThere.pMonth = tEvent.target.valueAsNumber;
            getRoute();
        }
    }
}
// TODO:: Consider making default day 01 or current
function relevantDayEvent(tEvent) {
    if(tEvent.type.includes("focusout") || tEvent.key.includes("Enter")){
        let dayEl = tEvent.target;
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
                    // document.getElementById(dayEl.id).value = monthMaxDays[monthVal]
                    dayEl.value = monthMaxDays[monthVal];
                } 
                else if(dayEl.valueAsNumber < 10){
                    // document.getElementById(dayEl.id).value = dayEl.valueAsNumber < 10 ? '0' + dayEl.valueAsNumber : dayEl.valueAsNumber;
                    dayEl.value = dayEl.valueAsNumber < 10 ? '0' + dayEl.valueAsNumber : dayEl.valueAsNumber;
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
                    // document.getElementById(dayEl.id).value = maxDay;
                    dayEl.value = maxDay;
                else
                    // document.getElementById(dayEl.id).value = dayEl.valueAsNumber < 10 ? '0' + dayEl.valueAsNumber : dayEl.valueAsNumber;
                    dayEl.value = dayEl.valueAsNumber < 10 ? '0' + dayEl.valueAsNumber : dayEl.valueAsNumber;
            }
        }
        // Default day
        else{
            // document.getElementById(dayEl.id).value = '01';
            dayEl.value = '01';
        }
        if(pGoingThere.pDay != tEvent.target.valueAsNumber){
            pGoingThere.pDay = tEvent.target.valueAsNumber;
            getRoute();
        }
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
            // document.getElementById(timeEl.id).value = elValueString;
            timeEl.value = elValueString;
        }
        // default current year of not valid
        else{
            // document.getElementById(timeEl.id).valueAsNumber = new Date().getFullYear();
            timeEl.valueAsNumber = new Date().getFullYear();
        }
        if(pGoingThere.pYear != tEvent.target.valueAsNumber){
            pGoingThere.pYear = tEvent.target.valueAsNumber;
            getRoute();
        }
    }
}
function getRoute(){
    // if checked then use current time
    if(document.getElementById("current-time-checkbox").checked == true){
        calcRoute(new Date());
    }
    // use time in checkbox
    else {
        let year = parseInt(document.getElementById("year-going-there").value);
        let month = parseInt(document.getElementById("month-going-there").value);
        let day = parseInt(document.getElementById("day-going-there").value);
        let hour = parseInt(document.getElementById("hour-going-there").value) % 12;
        let minute = parseInt(document.getElementById("minute-going-there").value);
        // AM or PM string
        let am_pm = document.getElementById("going-there-am-pm").value;
        if(am_pm.includes("PM")){
            hour += 12;
            hour = Math.min(23, hour);
        }
        calcRoute(new Date(year=year, month=month, day=day, hours=hour, minutes=minute));
    }
}
function getRouteEvent(tEvent){
    if(tEvent.type.includes("focusout") || tEvent.key.includes("Enter")){
        getRoute();
        pGoingThere.setTime(
            document.getElementById("year-going-there").valueAsNumber,
            document.getElementById("month-going-there").valueAsNumber,
            document.getElementById("day-going-there").valueAsNumber,
            document.getElementById("hour-going-there").valueAsNumber,
            document.getElementById("minute-going-there").valueAsNumber
        );
    }
}

document.getElementById("flip").addEventListener("click", (event) => {
    let temp = document.getElementById("to").value;
    document.getElementById("to").value = document.getElementById("from").value;
    document.getElementById("from").value = temp;
    getRoute();
})
// hour and minute listeners for focus out and clicking enter
// keeps input within range and defaults invalid times to 01 min or hour
// TODO:: call getRoute() whenever date or time is changed
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

document.getElementById("from").addEventListener("keyup", getRouteEvent);
document.getElementById("from").addEventListener("focusout", getRouteEvent);


document.getElementById("to").addEventListener("keyup", getRouteEvent);
document.getElementById("to").addEventListener("focusout", getRouteEvent);

document.getElementById("current-time-checkbox").addEventListener("click", (tEvent)=>{
    document.getElementById("going-there-at-wrapper").hidden = !document.getElementById("going-there-at-wrapper").hidden;
});

document.getElementById("there-and-back-checkbox").addEventListener("click", (tEvent)=>{
    document.getElementById("going-back-at-wrapper").hidden = !document.getElementById("going-back-at-wrapper").hidden;
});

document.getElementById("going-there-am-pm").addEventListener("change", (event) =>{
    getRoute();
});


// validation for hours input => values accepted (0 - 24)
function limitToTwoDigitsAndTillTwentyFour(input) {
    input.value = input.value.replace(/\D/g, '').slice(0, 2);
    var numValue = parseInt(input.value, 10);
    if (isNaN(numValue) || numValue > 24) {
        input.value = '';
    }
}

// validation for minutes and seconds input => values accepted (0 - 60)
function limitToTwoDigitsAndTillSixty(input) {
    input.value = input.value.replace(/\D/g, '').slice(0, 2);
    var numValue = parseInt(input.value, 10);
    if (isNaN(numValue) || numValue > 60) {
        input.value = '';
    }
}

// adding leading '0' automatically if user provides single digit input
function addLeadingZero(input) {
    if (input.value.length === 1){
        input.value = '0' + input.value;
    }   
}

// removing any leading '0' that is added automatically, when the user tries to edit input
function removeLeadingZero(input) {
    if (input.value.length === 2 && input.value.charAt(0) === "0"){
        input.value = input.value.substring(1);
    }
}


let count = 0;

let timerObjs = {};

const currentTimeWrapper = document.getElementById('current-time-wrapper');

const setTimeButton = document.getElementById('set-time-button');
setTimeButton.addEventListener("click", addTimer);


// function to add a new timer, when set button is clicked
function addTimer(e) {

    var hours = document.getElementById('hours');
    var minutes = document.getElementById('minutes');
    var seconds = document.getElementById('seconds');

    if (hours.value === "" || minutes.value === "" || seconds.value === ""){
        alert("All Fields Required!");
        hours.value = "";
        minutes.value = "";
        seconds.value = "";
        return;
    }

    if (Number(hours.value) === 24 && (Number(minutes.value) !== 0 || Number(seconds.value) !== 0)){
        alert("Maximum value allowed is 24:00:00. Please enter value within bounds.");
        hours.value = "";
        minutes.value = "";
        seconds.value = "";
        return;
    }

    var currentTimeCaption = document.getElementById('current-time-caption');

    if (!currentTimeCaption.classList.contains('deactivate')){
        currentTimeCaption.classList.add('deactivate');
    }

    count++;

    timerObjs[`obj-${count}`] = count;

    showTimer(hours.value, minutes.value, seconds.value, count);
}

// function to display the timer created on DOM to the user
function showTimer(hours, minutes, seconds, count) {

    var timer = document.createElement('div');

    timer.setAttribute('class', 'set-time-wrapper');
    timer.setAttribute('id', `timer-${count}`);

    timer.innerHTML = `<div class="set-time-caption">Time Left :</div>
    <div class="set-time-period">
        <div class="current-time" id="hours-${count}">${hours}</div>
        <div class="colon">:</div>
        <div class="current-time" id="minutes-${count}">${minutes}</div>
        <div class="colon">:</div>
        <div class="current-time" id="seconds-${count}">${seconds}</div>
    </div>
    <button type="button" class="btn" id="delete-time-button-${count}">Delete</button>`

    currentTimeWrapper.appendChild(timer);

    var intervalId = setInterval(() => {
        coundown(intervalId, count);
    }, 1000);

    // add event-listener to delete button
    var deleteButton = document.getElementById(`delete-time-button-${count}`);
    deleteButton.addEventListener("click", () => {
        removeTimer(count);
    });
}

// function to calculate the cowndown
function coundown(intervalId, count) {

    // 0 0 0
    // 0 0 n
    // 0 n 0
    // 0 n n
    // n 0 0
    // n 0 n
    // n n 0
    // n n n

    var hours = document.getElementById(`hours-${count}`);
    var minutes = document.getElementById(`minutes-${count}`);
    var seconds = document.getElementById(`seconds-${count}`);

    if (hours === null || minutes === null || seconds === null){
        clearInterval(intervalId);
        return;
    }

    var hoursNum = Number(hours.innerText);
    var minutesNum = Number(minutes.innerText);
    var secondsNum = Number(seconds.innerText);

    if (hoursNum === 0 && minutesNum === 0 && secondsNum !== 0){
        secondsNum--;
    }
    else if (hoursNum === 0 && minutesNum !== 0 && secondsNum === 0){
        minutesNum--;
        secondsNum = 59;
    }
    else if (hoursNum === 0 && minutesNum !== 0 && secondsNum !== 0){
        secondsNum--;
    }
    else if (hoursNum !== 0 && minutesNum === 0 && secondsNum === 0){
        hoursNum--;
        minutesNum = 59;
        secondsNum = 59;
    }
    else if (hoursNum !== 0 && minutesNum === 0 && secondsNum !== 0){
        secondsNum--;
    }
    else if (hoursNum !== 0 && minutesNum !== 0 && secondsNum === 0){
        minutesNum--;
        secondsNum = 59;
    }
    else if (hoursNum !== 0 && minutesNum !== 0 && secondsNum !== 0){
        secondsNum--;
    }

    // change time values to string before updating
    var hoursStr, minutesStr, secondsStr;

    if (String(hoursNum).length === 1){
        hoursStr = '0' + String(hoursNum);
    }
    else{
        hoursStr = String(hoursNum);
    }

    if (String(minutesNum).length === 1){
        minutesStr = '0' + String(minutesNum);
    }
    else{
        minutesStr = String(minutesNum);
    }

    if (String(secondsNum).length === 1){
        secondsStr = '0' + String(secondsNum);
    }
    else{
        secondsStr = String(secondsNum);
    }

    updateTimer(hoursStr, minutesStr, secondsStr, count, intervalId);

}

// function to update the DOM timing values, dynamically and display to user
function updateTimer(hours, minutes, seconds, count, intervalId) {

    var currentHours = document.getElementById(`hours-${count}`);
    var currentMinutes = document.getElementById(`minutes-${count}`);
    var currentSeconds = document.getElementById(`seconds-${count}`);

    currentHours.innerText = `${hours}`;
    currentMinutes.innerText = `${minutes}`;
    currentSeconds.innerText = `${seconds}`;

    if (Number(hours) === 0 && Number(minutes) === 0 && Number(seconds) === 0){
        timeIsUp(count, intervalId);
    }
}

// function to show a "Timer Is Up!" on DOM and alert the user that time is up
function timeIsUp(count, intervalId) {
    
    var timer = document.getElementById(`timer-${count}`);
    timer.classList.add('finished');
    timer.innerHTML = `<div class="set-time-caption" style="visibility: hidden;">Time Left :</div>
    <div class="set-time-period">
        <div class="timer-is-up">Timer Is Up!</div>
    </div>
    <button type="button" class="btn stop-button" id="delete-time-button-${count}">Stop</button>`

    clearInterval(intervalId);

    var stopButton = document.getElementById(`delete-time-button-${count}`);
    stopButton.addEventListener("click", () => {
        removeTimer(count);
    });
}

// function to remove an existing timer on click of stop or delete button
function removeTimer(count) {
    var timer = document.getElementById(`timer-${count}`);
    timer.remove();

    delete timerObjs[`obj-${count}`];

    if (Object.keys(timerObjs).length === 0){
        let currentTimeCaption = document.getElementById('current-time-caption');
        currentTimeCaption.classList.remove('deactivate');
    }
}

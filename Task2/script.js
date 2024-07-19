let startTime, elapsedTime = 0, intervalId;
const display = document.getElementById('display');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');
const lapsContainer = document.getElementById('laps');

function updateTime() {
    elapsedTime = Date.now() - startTime;
    display.textContent = formatTime(elapsedTime);
}

function formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}

startButton.addEventListener('click', () => {
    if (!intervalId) {
        startTime = Date.now() - elapsedTime;
        intervalId = setInterval(updateTime, 1000);
    }
});

pauseButton.addEventListener('click', () => {
    clearInterval(intervalId);
    intervalId = null;
});

resetButton.addEventListener('click', () => {
    clearInterval(intervalId);
    intervalId = null;
    elapsedTime = 0;
    display.textContent = '00:00:00';
    lapsContainer.innerHTML = '';
});

lapButton.addEventListener('click', () => {
    if (intervalId) {
        const lapTime = document.createElement('div');
        lapTime.textContent = formatTime(elapsedTime);
        lapsContainer.appendChild(lapTime);
    }
});

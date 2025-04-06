let timerDisplay = document.getElementById("timer");
let startButton = document.getElementById("start");
let pauseButton = document.getElementById("pause");
let resetButton = document.getElementById("restart");
let timerArea = document.getElementById("timer-area");
let durationSelection = document.getElementById("duration-selection");
let counterDisplay = document.getElementById("counter");

let pomodoroCount = Number(localStorage.getItem("pomodoroCount") || 0);
let currentMode = null; // 'work' or 'rest'
let timerInterval = null;
let remainingTime = 0;

updateCounter();

// Define durations
const durations = {
  work: [15, 30, 45, 60],
  rest: [5, 15],
};

// Create Audio objects for button press sound and alarm sound
const buttonSound = new Audio('assets/button-press.mp3');
const alarmSound = new Audio('assets/alarm.mp3'); // New alarm sound

// Ensure the sounds are preloaded
buttonSound.preload = 'auto';
alarmSound.preload = 'auto';

// Function to play the button press sound starting from 0.5 seconds and stopping after 1 second
function playButtonSound() {
  buttonSound.currentTime = 0.5;  // Start the sound from 0.5 seconds into the track
  buttonSound.play();             // Play the sound

  setTimeout(() => {
    buttonSound.pause();
  }, 300); // 300 milliseconds = 0.3 seconds
}

// Function to play the alarm sound when the timer hits 0
function playAlarmSound() {
  alarmSound.currentTime = 0;  // Start the alarm from the beginning
  alarmSound.play();           // Play the alarm sound

  // Stop the alarm sound after 5 seconds
  setTimeout(() => {
    alarmSound.pause();
    alarmSound.currentTime = 0;  // Reset to the beginning to allow it to replay if triggered again
  }, 5000); // 5000 milliseconds = 5 seconds
}

// Show mode options
window.selectMode = function (mode) {
  playButtonSound(); // Play sound when mode is selected
  pauseTimer();
  currentMode = mode;
  durationSelection.innerHTML = '';
  durations[mode].forEach(min => {
    const btn = document.createElement("button");
    btn.textContent = `${min} min`;
    btn.onclick = () => selectDuration(min);
    durationSelection.appendChild(btn);
  });
  durationSelection.style.display = "block";
  timerArea.style.display = "none";
};

// Select a time and show controls
function selectDuration(minutes) {
  playButtonSound(); // Play sound when duration is selected
  remainingTime = minutes * 60;
  updateDisplay(remainingTime);
  durationSelection.style.display = "none";
  timerArea.style.display = "block";
}

// Timer controls
function updateDisplay(seconds) {
  const min = Math.floor(seconds / 60).toString().padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${min}:${sec}`;
}

function startTimer() {
  playButtonSound(); // Play sound when starting the timer
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateDisplay(remainingTime);
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      playAlarmSound(); // Play alarm sound when time's up

      if (currentMode === 'work') {
        pomodoroCount++;
        localStorage.setItem("pomodoroCount", pomodoroCount);
        updateCounter();
      }
    }
  }, 1000);
}

function pauseTimer() {
  playButtonSound(); // Play sound when pausing the timer
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  console.log("Restart button clicked"); // Debugging line
  playButtonSound(); // Play sound when resetting the Pomodoro count
  pauseTimer();
  pomodoroCount = 0;
  localStorage.setItem("pomodoroCount", pomodoroCount);
  updateCounter();
}

function updateCounter() {
  counterDisplay.textContent = `Completed Pomodoros: ${pomodoroCount}`;
}

// Add event listeners to buttons
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const startBtn = document.querySelector('[data-start]');
startBtn.disabled = true;

const clockFaceDays = document.querySelector('[data-days]');
const clockFaceHours = document.querySelector('[data-hours]');
const clockFaceMinutes = document.querySelector('[data-minutes]');
const clockFaceSeconds = document.querySelector('[data-seconds]');

let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    console.log(selectedDates[0]);

    if (selectedDates[0] < options.defaultDate) {
      Notiflix.Notify.failure('Please choose a date in the future');
      startBtn.disabled = true;
    } else startBtn.disabled = false;
  },
};

const calendar = flatpickr('input[id=datetime-picker]', options);

startBtn.addEventListener('click', onTimerStart);

function onTimerStart() {
  const targetTime = new Date(calendar.selectedDates[0]).getTime();

  timerId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = targetTime - currentTime;
    if (deltaTime <= 0) {
      clearInterval(timerId);
      Notiflix.Notify.info('Timer is stopped now!');
    } else {
      const { days, hours, minutes, seconds } = convertMs(deltaTime);
      console.log(`${days}:${hours}:${minutes}:${seconds}`);
      updateClockFace({ days, hours, minutes, seconds });
    }
  }, 1000);
}

function updateClockFace({ days, hours, minutes, seconds }) {
  clockFaceDays.textContent = `${days}`;
  clockFaceHours.textContent = `${hours}`;
  clockFaceMinutes.textContent = `${minutes}`;
  clockFaceSeconds.textContent = `${seconds}`;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

// console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}n

function addLeadingZero(value) {
  return String(value).padStart(2, 0);
}

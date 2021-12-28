import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Report } from 'notiflix/build/notiflix-report-aio';

let timerSetValue = null;
let intervalId = null;

const refs = {
  datetimePicker: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('[data-start]'),
  daysField: document.querySelector('[data-days]'),
  hoursField: document.querySelector('[data-hours]'),
  minutesField: document.querySelector('[data-minutes]'),
  secondsField: document.querySelector('[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: onFlatpickrClose,
};

flatpickr(refs.datetimePicker, options);

refs.btnStart.addEventListener('click', onBtnStartClick);

function checkTimerValue(timerValue) {
  const currentTime = Date.now();
  return timerValue - currentTime > 0 ? true : false;
}

function createWarning() {
  Report.warning('Warning', 'Please choose a date in the future', 'Ok');
}

function onBtnStartClick() {
  let currentTimerValue = null;

  intervalId = setInterval(() => {
    currentTimerValue = timerSetValue - Date.now();
    if (currentTimerValue < 0) {
      finishTimer();
      return;
    }
    const convertTimerValues = convertMs(currentTimerValue);
    updateTimerFace(convertTimerValues);
  }, 1000);
}

function finishTimer() {
  clearInterval(intervalId);
  intervalId = null;
}

function updateTimerFace({ days, hours, minutes, seconds }) {
  refs.daysField.textContent = days;
  refs.hoursField.textContent = hours;
  refs.minutesField.textContent = minutes;
  refs.secondsField.textContent = seconds;
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = pad(Math.floor(ms / day));
  const hours = pad(Math.floor((ms % day) / hour));
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function pad(value) {
  return String(value).padStart(2, 0);
}

function onFlatpickrClose(selectedDates) {
  const selectedDate = selectedDates[0].getTime();
  const isValidTimerValue = checkTimerValue(selectedDate);

  if (!isValidTimerValue) {
    createWarning();
    refs.btnStart.setAttribute('disabled', 'disabled');
    return;
  }

  timerSetValue = selectedDate;

  refs.btnStart.removeAttribute('disabled');
}

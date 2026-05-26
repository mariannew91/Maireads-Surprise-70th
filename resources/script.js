function countdown(targetDate, onTick, onEnd) {
  const target = new Date(targetDate).getTime();

  const timer = setInterval(() => {
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      clearInterval(timer);
      if (onEnd) onEnd();
      return;
    }
    const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((difference / (1000 * 60 * 60 * 24)) % 30);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const seconds = Math.floor((difference / 1000) % 60);

    onTick({ months, days, hours, seconds });
  }, 1000);

  return timer;
}


// 👇 connect JS to HTML elements
const monthsEL = document.getElementById("month-num");
const daysEl = document.getElementById("day-num");
const hoursEl = document.getElementById("hour-num");
const secondsEl = document.getElementById("second-num");

countdown(
  "2026-09-19T16:30:00",
  (time) => {
    monthsEL.textContent = time.months;
    daysEl.textContent = time.days;
    hoursEl.textContent = time.hours;
    secondsEl.textContent = time.seconds;
  },
  () => {
    document.getElementById("countdown").textContent = "Time's up!";
  }
);

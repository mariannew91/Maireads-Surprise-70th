// 1. Centralized helper to switch UI or hide everything post-party
function handlePartyEndState() {
  const cardContainer = document.getElementById("countdown-cards");
  const rsvpNav = document.getElementById("rsvp-nav");
  const reminder = document.getElementById("reminder");

  if (rsvpNav) {
    rsvpNav.innerHTML = '<a href="photos.html">📸 Photos</a>';
  }

  if (reminder) {
    reminder.innerHTML = '<a href="photos.html">Check out the photos from the night</a>';
  }
  
  if (!cardContainer) return;

  const now = new Date().getTime();
  
  // 💥 THE EXPIRATION DEADLINE: 00:01 AM on September 20th, 2026
  const vanishDeadline = new Date("2026-09-20T00:00:01").getTime();

  // THE VANISHING ACT: If past 00:01 on the 20th, hide ONLY the cards box (photo stays!)
  if (now >= vanishDeadline) {
    cardContainer.style.display = "none";
    return; 
  }

  // Otherwise, if it's still the party day, build the "Party Time!" master card
  cardContainer.innerHTML = ""; 
  cardContainer.style.padding = "0";
  cardContainer.style.margin = "0";
  cardContainer.style.height = "100%";
  cardContainer.style.border = "none"; 
  cardContainer.style.boxShadow = "none";

  const timesUpCard = document.createElement("div");
  timesUpCard.classList.add("times-up-card"); 
  
  const message = document.createElement("h2");
  message.textContent = "Party Time!"; 
  
  timesUpCard.appendChild(message);
  cardContainer.appendChild(timesUpCard);
}

// 2. The Core Countdown Engine
function countdown(targetDate, onTick, onEnd) {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();

  // Instant safety check: If loaded past the target time, jump straight to the end state logic
  if (target - now <= 0) {
    if (onEnd) onEnd();
    return;
  }

  const timer = setInterval(() => {
    const currentNow = new Date().getTime();
    const difference = target - currentNow;

    if (difference <= 0) {
      clearInterval(timer);
      if (onEnd) onEnd();
      return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60); 
    const seconds = Math.floor((difference / 1000) % 60);

    onTick({ days, hours, minutes, seconds });
  }, 1000);

  return timer;
}


// 3. 👇 Connect and Initialize
const daysEl = document.getElementById("day-num");
const hoursEl = document.getElementById("hour-num");
const minutesEl = document.getElementById("minute-num"); 
const secondsEl = document.getElementById("second-num");

// Countdown target date (The party start time)
const partyDate = "2026-09-19T16:30:00";

countdown(
  partyDate,
  (time) => {
    // Update the live numbers
    if (daysEl) daysEl.textContent = time.days;
    if (hoursEl) hoursEl.textContent = time.hours;
    if (minutesEl) minutesEl.textContent = time.minutes;
    if (secondsEl) secondsEl.textContent = time.seconds;

    const cards = [
      document.getElementById('day-card'),
      document.getElementById('hour-card'),
      document.getElementById('minute-card'),
      document.getElementById('second-card')
    ];
    
    // Clear dynamic layout tag classes safely
    cards.forEach(card => {
      if (card) card.classList.remove('first-visible', 'last-visible');
    });

    // Hide cards sequentially as they drop to 0
    if (cards[0]) cards[0].style.display = time.days <= 0 ? 'none' : 'flex';
    if (cards[1]) cards[1].style.display = (time.days <= 0 && time.hours <= 0) ? 'none' : 'flex';
    if (cards[2]) cards[2].style.display = (time.days <= 0 && time.hours <= 0 && time.minutes <= 0) ? 'none' : 'flex';
    if (cards[3]) cards[3].style.display = (time.days <= 0 && time.hours <= 0 && time.minutes <= 0 && time.seconds <= 0) ? 'none' : 'flex';

    // Find visible survivor cards and smooth out outer layout corner borders
    const visibleCards = cards.filter(card => card && card.style.display !== 'none');
    
    if (visibleCards.length > 0) {
      visibleCards[0].classList.add('first-visible'); 
      visibleCards[visibleCards.length - 1].classList.add('last-visible'); 
    }
  },
  () => {
    // Runs to show "Party Time!" or completely vanish the component at midnight
    handlePartyEndState();
  }
);
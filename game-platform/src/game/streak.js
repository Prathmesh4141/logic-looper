function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function updateStreak() {
  const today = todayISO();
  const yesterday = yesterdayISO();

  const lastPlayed = localStorage.getItem("lastPlayed");
  let streak = Number(localStorage.getItem("streak") || 0);

  if (!lastPlayed) {
    streak = 1;
  }
  else if (lastPlayed === today) {
    return streak;
  }
  else if (lastPlayed === yesterday) {
    streak += 1;
  }
  else {
    streak = 1;
  }

  localStorage.setItem("lastPlayed", today);
  localStorage.setItem("streak", streak);

  return streak;
}

export function getStreak() {
  return Number(localStorage.getItem("streak") || 0);
}

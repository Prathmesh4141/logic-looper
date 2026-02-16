function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function updateStreak(userId) {
  if (!userId) return 0;

  const today = todayISO();
  const yesterday = yesterdayISO();

  const lastPlayedKey = `lastPlayed_${userId}`;
  const streakKey = `streak_${userId}`;

  const lastPlayed = localStorage.getItem(lastPlayedKey);
  let streak = Number(localStorage.getItem(streakKey) || 0);

  if (!lastPlayed) {
    streak = 1;
  } else if (lastPlayed === today) {
    return streak;
  } else if (lastPlayed === yesterday) {
    streak += 1;
  } else {
    streak = 1;
  }

  localStorage.setItem(lastPlayedKey, today);
  localStorage.setItem(streakKey, streak);

  return streak;
}

export function getStreak(userId) {
  if (!userId) return 0;
  return Number(localStorage.getItem(`streak_${userId}`) || 0);
}

export function calculateAdaptiveDifficulty({
    currentDifficulty,
    correctStreak,
    wrongAttempts,
    timeLeft,
    hintsUsed,
  }) {
    let difficulty = currentDifficulty;
  
    if (correctStreak >= 3 && timeLeft > 10) {
      difficulty += 1;
    }
  
    if (timeLeft > 20 && correctStreak >= 2) {
      difficulty += 1;
    }
  
    if (wrongAttempts >= 2) {
      difficulty -= 1;
    }
  
    if (hintsUsed >= 2) {
      difficulty -= 1;
    }
  
    if (difficulty < 1) difficulty = 1;
    if (difficulty > 10) difficulty = 10;
  
    return difficulty;
  }
  
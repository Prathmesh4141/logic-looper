export function calculateScore({
    difficulty,
    timeLeft,
    hintsUsed,
    streak,
    correct,
  }) {
    const BASE = 10;
  
    // 🎯 Difficulty multiplier
    const difficultyMultiplier = 1 + difficulty * 0.25;
  
    // ⚡ Speed multiplier (faster = better)
    const speedMultiplier = 1 + timeLeft / 30;
  
    // 💡 Hint penalty
    const hintPenalty = hintsUsed * 3;
  
    // 🔥 Streak bonus
    const streakBonus = streak >= 3 ? streak * 0.5 : 0;
  
    // 🎯 Accuracy bonus
    const accuracyBonus = correct ? 5 : 0;
  
    let score =
      BASE * difficultyMultiplier * speedMultiplier +
      accuracyBonus +
      streakBonus -
      hintPenalty;
  
    return Math.max(Math.round(score), 1);
  }
  
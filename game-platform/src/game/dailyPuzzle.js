import { seededRandom } from "./seededRandom";


function dateToSeed(date) {
  return date.split("-").reduce((acc, val) => acc + Number(val), 0);
}

export function generateDailyPuzzle(date, questionIndex = 0, difficulty = 1) {
  const baseSeed = dateToSeed(date);
  const seed = baseSeed + questionIndex * 7 + difficulty * 13;

  const puzzleType = seed % 3;

  if (puzzleType === 0) return generateMathPuzzle(seed, difficulty);
  if (puzzleType === 1) return generateSequencePuzzle(seed, difficulty);
  return generatePatternPuzzle(seed, difficulty);
}


function generateMathPuzzle(seed, difficulty) {
  const max = 10 + difficulty * 5;
  const a = Math.floor(seededRandom(seed) * max);
  const b = Math.floor(seededRandom(seed + 1) * max);

  return {
    question: `${a} + ${b}`,
    answer: a + b,
  };
}


function generateSequencePuzzle(seed, difficulty) {
  const start = Math.floor(seededRandom(seed) * 5);
  const step = Math.floor(seededRandom(seed + 1) * (difficulty + 2)) + 1;
  const length = 3 + difficulty;

  const sequence = Array.from({ length }, (_, i) => start + i * step);

  return {
    question: sequence.slice(0, -1).join(", ") + ", ?",
    answer: sequence[sequence.length - 1],
  };
}

function generatePatternPuzzle(seed, difficulty) {
  const shapes = ["🔺", "🔵", "⬛", "⭐", "🟣"];
  const idx = Math.floor(seededRandom(seed) * (2 + difficulty));

  return {
    question: `${shapes[idx]} ${shapes[idx]} ${difficulty > 2 ? shapes[idx] : ""} ?`,
    answer: shapes[idx],
  };
}

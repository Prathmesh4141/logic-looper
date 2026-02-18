import { seededRandom } from "./seededRandom";

/* -------------------------------------------------- */
/* SEED GENERATOR */
/* -------------------------------------------------- */

function dateToSeed(date) {
  return date.split("-").reduce((acc, val) => acc + Number(val), 0);
}

/* -------------------------------------------------- */
/* MAIN PUZZLE GENERATOR */
/* -------------------------------------------------- */

export function generateDailyPuzzle(date, questionIndex = 0, difficulty = 1) {
  const baseSeed = dateToSeed(date);
  const seed = baseSeed + questionIndex * 7 + difficulty * 13;

  // total puzzle types
  const puzzleType = seed % 8;

  if (puzzleType === 0) return generateMathPuzzle(seed, difficulty);
  if (puzzleType === 1) return generateSequencePuzzle(seed, difficulty);
  if (puzzleType === 2) return generatePatternPuzzle(seed, difficulty);
  if (puzzleType === 3) return generateOddOneOut(seed, difficulty);
  if (puzzleType === 4) return generateMirrorPuzzle(seed);
  if (puzzleType === 5) return generateMissingOperator(seed, difficulty);
  if (puzzleType === 6) return generateQuickLogic(seed, difficulty);
  return generateWordNumberPuzzle(seed);
}

/* -------------------------------------------------- */
/* 1️⃣ MATH PUZZLE */
/* -------------------------------------------------- */

function generateMathPuzzle(seed, difficulty) {
  const max = 10 + difficulty * 5;
  const a = Math.floor(seededRandom(seed) * max);
  const b = Math.floor(seededRandom(seed + 1) * max);

  return {
    question: `${a} + ${b}`,
    answer: a + b,
  };
}

/* -------------------------------------------------- */
/* 2️⃣ SEQUENCE PUZZLE */
/* -------------------------------------------------- */

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

/* -------------------------------------------------- */
/* 3️⃣ PATTERN PUZZLE */
/* -------------------------------------------------- */

function generatePatternPuzzle(seed, difficulty) {
  const shapes = ["🔺", "🔵", "⬛", "⭐", "🟣"];
  const idx = Math.floor(seededRandom(seed) * shapes.length);

  return {
    question: `${shapes[idx]} ${shapes[idx]} ${difficulty > 2 ? shapes[idx] : ""} ?`,
    answer: shapes[idx],
  };
}

/* -------------------------------------------------- */
/* 4️⃣ ODD ONE OUT */
/* -------------------------------------------------- */

function generateOddOneOut(seed, difficulty) {
  const base = Math.floor(seededRandom(seed) * 5) + 2;
  const odd = base * 2 + difficulty;

  const arr = [base * 2, base * 2, odd, base * 2];

  const shuffled = arr.sort(() => seededRandom(seed + 1) - 0.5);

  return {
    question: `Odd one out:\n${shuffled.join(", ")}`,
    answer: odd,
  };
}

/* -------------------------------------------------- */
/* 5️⃣ MIRROR NUMBER */
/* -------------------------------------------------- */

function generateMirrorPuzzle(seed) {
  const num = Math.floor(seededRandom(seed) * 90) + 10;
  const reversed = Number(String(num).split("").reverse().join(""));

  return {
    question: `Mirror of ${num}?`,
    answer: reversed,
  };
}

/* -------------------------------------------------- */
/* 6️⃣ MISSING OPERATOR */
/* -------------------------------------------------- */

function generateMissingOperator(seed, difficulty) {
  const a = Math.floor(seededRandom(seed) * (10 + difficulty)) + 2;
  const b = Math.floor(seededRandom(seed + 1) * (5 + difficulty)) + 2;

  const ops = [
    { symbol: "+", result: a + b },
    { symbol: "-", result: a - b },
    { symbol: "*", result: a * b },
  ];

  const pick = ops[Math.floor(seededRandom(seed + 2) * ops.length)];

  return {
    question: `${a} ? ${b} = ${pick.result}`,
    answer: pick.symbol,
    options: ["+", "-", "*"], // ready for UI buttons
  };
}

/* -------------------------------------------------- */
/* 7️⃣ QUICK LOGIC */
/* -------------------------------------------------- */

function generateQuickLogic(seed, difficulty) {
  const a = Math.floor(seededRandom(seed) * 10) + 5;
  const b = a + difficulty + 2;

  return {
    question: `If A = ${a} and B is ${b - a} more,\nwhat is B?`,
    answer: b,
  };
}

/* -------------------------------------------------- */
/* 8️⃣ WORD → NUMBER */
/* -------------------------------------------------- */

function generateWordNumberPuzzle(seed) {
  const words = ["ONE", "TWO", "THREE", "FOUR", "FIVE"];
  const numbers = [1, 2, 3, 4, 5];

  const i = Math.floor(seededRandom(seed) * words.length);

  return {
    question: `${words[i]} = ?`,
    answer: numbers[i],
  };
}

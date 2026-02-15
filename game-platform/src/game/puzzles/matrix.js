import { seededRandom } from "../seededRandom";

export function generateMatrixPuzzle(seed, difficulty) {
  const base = Math.floor(seededRandom(seed) * 5) + 1;
  const step = difficulty + 1;

  const grid = [
    [base, base + step],
    [base + 2 * step, "?"]
  ];

  const answer = base + 3 * step;

  return {
    type: "matrix",
    question: `
Fill the missing number:

${grid[0][0]}  ${grid[0][1]}
${grid[1][0]}  ?

Pattern increases consistently.
    `,
    answer
  };
}

import { seededRandom } from "../seededRandom";

export function generateChain(seed) {
  const start = Math.floor(seededRandom(seed) * 10) + 2;

  const result = ((start + 3) * 2) - 4;

  return {
    type: "chain",
    question: `
Start with ${start}.
Add 3 → Multiply by 2 → Subtract 4.

What is the result?
    `,
    answer: result
  };
}

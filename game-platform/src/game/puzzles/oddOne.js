import { seededRandom } from "../seededRandom";

export function generateOddOne(seed) {
  const set = ["12", "18", "24", "31"];
  return {
    type: "odd",
    question: `
Find the odd one out:

12, 18, 24, 31
(Answer with the number)
    `,
    answer: "31",
  };
}

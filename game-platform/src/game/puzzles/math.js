export function generateMath() {
    const a = Math.floor(Math.random() * 20);
    const b = Math.floor(Math.random() * 20);
    const ops = ["+", "-", "*"];
    const op = ops[Math.floor(Math.random() * ops.length)];
  
    let answer;
    if (op === "+") answer = a + b;
    if (op === "-") answer = a - b;
    if (op === "*") answer = a * b;
  
    return {
      question: `${a} ${op} ${b}`,
      answer,
    };
  }
  
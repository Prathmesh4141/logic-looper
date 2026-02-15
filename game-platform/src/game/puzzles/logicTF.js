export function generateLogicTF() {
    return {
      type: "logicTF",
      question: `
  All roses are flowers.
  Some flowers fade quickly.
  
  Can we say all roses fade quickly?
  (True / False)
      `,
      answer: "False"
    };
  }
  
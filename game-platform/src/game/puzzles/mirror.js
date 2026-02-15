export function generateMirror() {
    return {
      type: "mirror",
      question: `
  Find the mirror pair:
  
  AB  →  BA
  DOG → ?
  
  (Write mirrored word)
      `,
      answer: "GOD"
    };
  }
  
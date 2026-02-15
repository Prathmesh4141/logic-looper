export function getDailySeed() {
    const today = new Date().toDateString();
    return today.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  }
  
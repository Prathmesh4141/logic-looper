export function getTodaySeed() {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  
    let seed = 0;
    for (let i = 0; i < dateString.length; i++) {
      seed += dateString.charCodeAt(i);
    }
  
    return seed;
  }
  
export function generateLast30Days() {
    const days = [];
    const today = new Date();
  
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
  
    return days;
  }
  
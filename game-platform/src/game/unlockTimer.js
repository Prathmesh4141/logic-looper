export function getTimeUntilMidnight() {
    const now = new Date();
  
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // next midnight
  
    const diff = midnight - now;
  
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
  
    return { hours, minutes };
  }
  
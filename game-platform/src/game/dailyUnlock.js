function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }
  
  export function getCompletedDays() {
    return JSON.parse(localStorage.getItem("completedDays") || "[]");
  }
  
  export function markTodayCompleted() {
    const today = todayISO();
    const completed = getCompletedDays();
  
    if (!completed.includes(today)) {
      completed.push(today);
      localStorage.setItem("completedDays", JSON.stringify(completed));
    }
  }
  
  export function isDayUnlocked(date) {
    const today = todayISO();
    const completed = getCompletedDays();
  
    if (date === today) return true;
  
    if (completed.includes(date)) return true;
  
    return false;
  }
  
  export function isCompleted(date) {
    return getCompletedDays().includes(date);
  }
  
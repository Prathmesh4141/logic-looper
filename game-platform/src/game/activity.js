export function markTodayPlayed() {
    const today = new Date().toISOString().split("T")[0];
    const activity = JSON.parse(localStorage.getItem("activity") || "{}");
  
    activity[today] = true;
    localStorage.setItem("activity", JSON.stringify(activity));
  }
  
  export function getActivityData() {
    return JSON.parse(localStorage.getItem("activity") || "{}");
  }
  
export function saveProgress(data) {
    localStorage.setItem("gameProgress", JSON.stringify(data));
  }
  
  export function loadProgress() {
    return JSON.parse(localStorage.getItem("gameProgress"));
  }
  
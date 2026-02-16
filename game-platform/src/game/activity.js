import { auth } from "../services/firebase";

export function markTodayPlayed() {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const today = new Date().toISOString().split("T")[0];

  const key = `activity_${userId}`;
  const data = JSON.parse(localStorage.getItem(key)) || {};

  data[today] = true;

  localStorage.setItem(key, JSON.stringify(data));
}

export function getActivityData() {
  const userId = auth.currentUser?.uid;
  if (!userId) return {};

  const key = `activity_${userId}`;
  return JSON.parse(localStorage.getItem(key)) || {};
}

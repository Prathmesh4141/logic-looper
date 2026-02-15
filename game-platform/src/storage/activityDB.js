import { openDB } from "idb";

const DB_NAME = "logicLooper";
const STORE = "dailyActivity";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE, { keyPath: "date" });
    },
  });
}

export async function saveActivity(entry) {
  const db = await getDB();
  await db.put(STORE, entry);
}

export async function getAllActivity() {
  const db = await getDB();
  return db.getAll(STORE);
}

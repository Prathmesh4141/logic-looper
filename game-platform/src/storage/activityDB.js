import { openDB } from "idb";

const DB_NAME = "logicLooper";
const STORE = "dailyActivity";

async function getDB() {
  return openDB(DB_NAME, 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, {
          keyPath: "id",
        });

        // index for filtering by user
        store.createIndex("userId", "userId");
      }
    },
  });
}

// save activity
export async function saveActivity(entry) {
  const db = await getDB();

  const id = `${entry.userId}_${entry.date}`;

  await db.put(STORE, {
    ...entry,
    id,
  });
}

// get activity for specific user
export async function getUserActivity(userId) {
  const db = await getDB();

  const tx = db.transaction(STORE);
  const store = tx.objectStore(STORE);
  const index = store.index("userId");

  return index.getAll(userId);
}
